

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import dbConnect from "../../../../utils/dbConnect";
import Transaction from "../../../../models/Transaction";
import Parent from "../../../../models/Parent";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reference = req.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  await dbConnect();

  const transaction = await Transaction.findOne({ reference });
  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  // Security: ensure this transaction belongs to the logged-in parent
  const parent = await Parent.findOne({ email: session.user.email });
  if (!parent || String(transaction.parentId) !== String(parent._id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    status: transaction.status,   // "pending" | "completed" | "failed"
    amount: transaction.amount,
    reference,
  });
}