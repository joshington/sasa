

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect";
import Dependant from "../../../models/Dependant";
import Parent from "../../../models/Parent";
import Transaction from "../../../models/Transaction";
import { verifyPin } from "../../../utils/hashPin";

export async function GET(req: NextRequest) {
  if (req.method !== "POST") return NextResponse.json({ error: "Method not allowed" }, { status: 405 });

  await dbConnect();

  const { smartCardId, amount, pin, merchantId } = await req.json();

  try {
    const dependant = await Dependant.findOne({ smartCardId });
    if (!dependant) return NextResponse.json({ error: "Dependant not found" }, { status: 404 });

    const isPinValid = await verifyPin(pin, dependant.pin);
    if (!isPinValid) return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });

    const dailyLimit = dependant.spendLimit.daily || Infinity;
    if (amount > dependant.balance) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    if (amount > dailyLimit) return NextResponse.json({ error: "Amount exceeds daily spend limit" }, { status: 400 });
    const fee = amount * 0.03;

    // Deduct from dependant & parent
    dependant.balance -= amount;
    await dependant.save();

    const parent = await Parent.findById(dependant.parentId);
    if (parent) {
      parent.balance -= fee; // parent pays the fee
      await parent.save();
    }

    // Save transaction
    await Transaction.create({
      type: "withdraw",
      amount,
      parentId: dependant.parentId,
      dependantId: dependant._id,
      merchantId,
      fee,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: "Withdraw successful", balance: dependant.balance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}