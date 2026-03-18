

// app/api/merchant/withdraw/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dbConnect from "@/app/utils/dbConnect";
import { getMerchantSession } from "@/app/utils/merchantAuth";
import Dependant from "@/app/models/Dependant";
import Transaction from "@/app/models/Transaction";
import { generateReference } from "@/app/utils/generateReference";

const PLATFORM_FEE_RATE   = 0.03;   // 3%  — deducted from dependant balance
const MERCHANT_COMMISSION = 0.005;  // 0.5% — credited to merchant
const MIN_WITHDRAW        = 1000;   // UGX

export async function POST(req: Request) {
  const dbSession = await mongoose.startSession();
  try {
    await dbConnect();

    // ── Auth: getMerchantSession returns full Merchant doc or null ────────────
    const merchant = await getMerchantSession();
    if (!merchant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (merchant.status === "suspended") {
      return NextResponse.json(
        { error: "Your merchant account is suspended. Contact support." },
        { status: 403 }
      );
    }

    // ── Parse body ────────────────────────────────────────────────────────────
    const { dependantName, pin, amount } = await req.json();

    if (!dependantName || !pin || !amount) {
      return NextResponse.json(
        { error: "Dependant name, PIN and amount are required" },
        { status: 400 }
      );
    }

    const withdrawAmount = Number(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < MIN_WITHDRAW) {
      return NextResponse.json(
        { error: `Minimum withdrawal amount is UGX ${MIN_WITHDRAW.toLocaleString()}` },
        { status: 400 }
      );
    }

    // ── Find dependant by name — must be at the merchant's institution ────────
    const dependant = await Dependant.findOne({
      name:      { $regex: new RegExp(`^${dependantName.trim()}$`, "i") },
      institute: merchant.institute,  // ← institution scoping
    });

    if (!dependant) {
      return NextResponse.json(
        {
          error:
            "No dependant found with that name at your institution. " +
            "Check the spelling or ask them to confirm their registered name.",
        },
        { status: 404 }
      );
    }

    // ── Verify dependant PIN ──────────────────────────────────────────────────
    const isPinValid = await bcrypt.compare(String(pin), dependant.pin);
    if (!isPinValid) {
      return NextResponse.json(
        { error: "Incorrect PIN. Please ask the dependant to re-enter." },
        { status: 401 }
      );
    }

    // ── Daily spend limit check ───────────────────────────────────────────────
    if (dependant.dailySpendLimit > 0) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todaySpend = await Transaction.aggregate([
        {
          $match: {
            dependantId: dependant._id,
            type:        "withdraw",
            status:      "completed",
            timestamp:   { $gte: startOfDay },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const spentToday = todaySpend[0]?.total ?? 0;
      if (spentToday + withdrawAmount > dependant.dailySpendLimit) {
        const remaining = Math.max(0, dependant.dailySpendLimit - spentToday);
        return NextResponse.json(
          {
            error: `Daily spend limit reached. Remaining today: UGX ${remaining.toLocaleString()}`,
            remainingLimit: remaining,
          },
          { status: 400 }
        );
      }
    }

    // ── Fee calculation ───────────────────────────────────────────────────────
    const platformFee        = Math.round(withdrawAmount * PLATFORM_FEE_RATE);
    const merchantCommission = Math.round(withdrawAmount * MERCHANT_COMMISSION);
    const totalDeducted      = withdrawAmount + platformFee;

    // ── Balance check (must cover amount + fee) ───────────────────────────────
    if (dependant.balance < totalDeducted) {
      return NextResponse.json(
        {
          error:
            `Insufficient balance. ` +
            `Available: UGX ${dependant.balance.toLocaleString()}, ` +
            `Required (incl. 3% fee): UGX ${totalDeducted.toLocaleString()}`,
          availableBalance: dependant.balance,
        },
        { status: 400 }
      );
    }

    // ── Atomic DB transaction ─────────────────────────────────────────────────
    dbSession.startTransaction();

    // 1. Deduct from dependant (withdrawal + platform fee)
    dependant.balance -= totalDeducted;
    await dependant.save({ session: dbSession });

    // 2. Credit commission to merchant
    await (await import("@/app/models/Merchant")).default.findByIdAndUpdate(
      merchant._id,
      { $inc: { commissionBalance: merchantCommission } },
      { session: dbSession }
    );

    // 3. Record the transaction
    const reference = generateReference();
    await Transaction.create(
      [
        {
          reference,
          parentId:    dependant.parentId,
          dependantId: dependant._id,
          merchantId:  merchant._id,
          amount:      withdrawAmount,
          fee:         platformFee,
          type:        "withdraw",
          status:      "completed",
          timestamp:   new Date(),
        },
      ],
      { session: dbSession }
    );

    await dbSession.commitTransaction();
    dbSession.endSession();

    return NextResponse.json({
      message:          "Withdrawal processed successfully",
      reference,
      amount:           withdrawAmount,
      fee:              platformFee,
      commissionEarned: merchantCommission,
      dependantBalance: dependant.balance,
      dependant: {
        name:    dependant.name,
        balance: dependant.balance,
      },
    });
  } catch (error) {
    await dbSession.abortTransaction();
    dbSession.endSession();
    console.error("merchant/withdraw error:", error);
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
  }
}