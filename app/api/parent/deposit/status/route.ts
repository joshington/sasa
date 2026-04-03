
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import dbConnect from "../../../../utils/dbConnect";
import Transaction from "../../../../models/Transaction";
import Parent from "../../../../models/Parent";

const MARZ_API_KEY  = process.env.MARZ_API_KEY!;
const MARZ_BASE_URL = "https://wallet.wearemarz.com/api/v1";

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

  const tx = await Transaction.findOne({ reference });
  if (!tx) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  // Security: ensure transaction belongs to logged-in parent
  const parent = await Parent.findOne({ email: session.user.email });
  if (!parent || String(tx.parentId) !== String(parent._id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── If still pending, ask MarzPay directly for latest status ─────────────
  // This is a fallback in case the webhook hasn't fired yet
  if (tx.status === "pending" && tx.marzUuid) {
    try {
      const marzRes = await fetch(
        `${MARZ_BASE_URL}/transactions/${tx.marzUuid}`,
        {
          headers: {
            Authorization: `Basic ${MARZ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (marzRes.ok) {
        const marzData = await marzRes.json();
        const marzStatus = marzData?.transaction?.status; // "completed" | "failed" | "pending" etc.

        console.log("[MarzPay status check]", reference, marzStatus);

        if (marzStatus === "completed") {
          const amount = marzData?.transaction?.amount?.raw ?? tx.amount;
          parent.balance = (parent.balance || 0) + amount;
          await parent.save();
          await Transaction.findOneAndUpdate({ reference }, { status: "completed" });

          return NextResponse.json({ status: "completed", amount: tx.amount, reference });
        }

        if (marzStatus === "failed" || marzStatus === "cancelled") {
          await Transaction.findOneAndUpdate({ reference }, { status: "failed" });
          return NextResponse.json({ status: "failed", amount: tx.amount, reference });
        }
      }
    } catch (err) {
      console.error("[MarzPay status check] error:", err);
      // Fall through and return DB status
    }
  }

  return NextResponse.json({
    status:    tx.status,
    amount:    tx.amount,
    reference,
  });
}