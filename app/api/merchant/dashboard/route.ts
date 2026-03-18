

// app/api/merchant/dashboard/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import { getMerchantSession } from "@/app/utils/merchantAuth";
import Transaction from "@/app/models/Transaction";
import "@/app/models/Dependant"; // ensure schema registers for populate

const COMMISSION_RATE = 0.005; // 0.5% — what merchant earns per withdrawal
const UGX_TO_USDC    = 1 / 3700;

export async function GET() {
  try {
    await dbConnect();

    // getMerchantSession() returns the full Merchant document or null
    const merchant = await getMerchantSession();
    if (!merchant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const merchantId = merchant._id;

    // ── Aggregate total stats ─────────────────────────────────────────────────
    const totalStats = await Transaction.aggregate([
      { $match: { merchantId, status: "completed" } },
      {
        $group: {
          _id:              null,
          totalVolume:      { $sum: "$amount" },
          totalFees:        { $sum: "$fee" },
          transactionCount: { $sum: 1 },
        },
      },
    ]);

    const totalVolumeProcessed  = totalStats[0]?.totalVolume      ?? 0;
    const totalTransactionCount = totalStats[0]?.transactionCount ?? 0;

    // Commission = 0.5% of each withdrawal amount (not the fee field)
    // The fee field stores the 3% platform fee — merchant earns separately
    const totalCommissionUGX = Math.round(totalVolumeProcessed * COMMISSION_RATE);

    // Pending unsettled commission stored on merchant document
    const pendingCommissionUGX = merchant.commissionBalance ?? 0;

    // ── Weekly settlement window ──────────────────────────────────────────────
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyVolume = await Transaction.aggregate([
      {
        $match: {
          merchantId,
          status:    "completed",
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id:   { $dayOfWeek: "$timestamp" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // ── Recent 10 transactions ────────────────────────────────────────────────
    const recentTransactions = await Transaction.find({ merchantId })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate("dependantId", "name smartCardId")
      .lean();

    // ── USDC conversion ───────────────────────────────────────────────────────
    const pendingCommissionUSDC = +(pendingCommissionUGX * UGX_TO_USDC).toFixed(4);
    const totalCommissionUSDC   = +(totalCommissionUGX   * UGX_TO_USDC).toFixed(4);

    return NextResponse.json({
      merchant: {
        id:                  merchant._id,
        username:            merchant.username,
        email:               merchant.email,
        institute:           merchant.institute,
        status:              merchant.status,
        settlementFrequency: merchant.settlementFrequency,
        lastSettlementDate:  merchant.lastSettlementDate,
      },
      stats: {
        totalVolumeUGX:        totalVolumeProcessed,
        totalTransactionCount,
        totalCommissionUGX,
        totalCommissionUSDC,
        pendingCommissionUGX,
        pendingCommissionUSDC,
        conversionRate:        3700,
      },
      weeklyVolume,
      recentTransactions,
    });
  } catch (error) {
    console.error("merchant/dashboard error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}