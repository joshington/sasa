

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import Parent from "@/app/models/Parent";
import Transaction from "@/app/models/Transaction";
import Wallet from "@/app/models/Wallet";

export async function POST(req: NextRequest) {
  await dbConnect();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log("[MarzPay webhook]", JSON.stringify(body));

  const { event_type, transaction } = body;

  if (!event_type || !transaction) {
    return NextResponse.json({ received: true }); // Acknowledge unknown events
  }

  const reference = transaction.reference;
  if (!reference) {
    return NextResponse.json({ received: true });
  }

  // Find our transaction by reference
  const tx = await Transaction.findOne({ reference });
  if (!tx) {
    // Not our transaction — acknowledge anyway
    return NextResponse.json({ received: true });
  }

  // Ignore if already processed (idempotency)
  if (tx.status !== "pending") {
    return NextResponse.json({ received: true });
  }

  // ── Handle collection.completed ───────────────────────────────────────────
  if (event_type === "collection.completed" && transaction.status === "completed") {
    const amount = transaction.amount?.raw ?? tx.amount;

    // ✅ Update Wallet balance (NOT Parent.balance)
    await Wallet.findOneAndUpdate(
      { parentId: tx.parentId },
      { $inc: { balance: amount } },
      { upsert: true }
    );

    await Transaction.findOneAndUpdate(
      { reference },
      {
        status: "completed",
        fee: 0, // MarzPay doesn't expose charge in collection callbacks
      }
    );

  // ── Handle collection.failed / collection.cancelled ───────────────────────
  } else if (
    event_type === "collection.failed" ||
    event_type === "collection.cancelled" ||
    transaction.status === "failed" ||
    transaction.status === "cancelled"
  ) {
    await Transaction.findOneAndUpdate({ reference }, { status: "failed" });
  }

  // Always respond 200 so MarzPay stops retrying
  return NextResponse.json({ received: true }, { status: 200 });
}