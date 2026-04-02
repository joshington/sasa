

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import Parent from "@/app/models/Parent";
import Transaction from "@/app/models/Transaction";
//import dbConnect from "../../../../utils/dbConnect";
//import Parent from "../../../../models/Parent";
//import Transaction from "../../../../models/Transaction";

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();

  const {
    status,
    customer_reference, // this is our reference
    amount,
    charge,
  } = body;

  const reference = customer_reference;

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const transaction = await Transaction.findOne({ reference });
  if (!transaction) {
    // Acknowledge anyway so Relworx stops retrying
    return NextResponse.json({ received: true });
  }

  // Ignore if already processed
  if (transaction.status !== "pending") {
    return NextResponse.json({ received: true });
  }

  if (status === "success") {
    // ── Credit the parent's balance ─────────────────────────────────────────
    const parent = await Parent.findById(transaction.parentId);
    if (parent) {
      parent.balance = (parent.balance || 0) + amount;
      await parent.save();
    }

    // ── Update transaction ──────────────────────────────────────────────────
    await Transaction.findOneAndUpdate(
      { reference },
      {
        status: "completed",
        fee: charge || 0,
      }
    );
  } else if (status === "failed") {
    await Transaction.findOneAndUpdate({ reference }, { status: "failed" });
  }

  // Always respond 200 to acknowledge receipt
  return NextResponse.json({ received: true }, { status: 200 });
}