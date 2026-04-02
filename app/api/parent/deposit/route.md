

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect";
import Parent from "../../../models/Parent";
import Transaction from "../../../models/Transaction";

export  async function GET(req: NextRequest) {
  if (req.method !== "POST") return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  await dbConnect();

  const { parentId, amount } = await req.json();
  try {
    const parent = await Parent.findById(parentId);
    if (!parent) return NextResponse.json({ error: "Parent not found" }, { status: 404 });

    parent.balance += amount;
    await parent.save();

    await Transaction.create({
      type: "deposit",
      amount,
      parentId,
      dependantId: null,
      fee: 0,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: `Deposit successful. New balance: ${parent.balance}` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}