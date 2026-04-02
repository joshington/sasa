

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "../../../utils/dbConnect";
import Parent from "../../../models/Parent";
import Transaction from "../../../models/Transaction";
import { randomBytes } from "crypto";

const RELWORX_API_KEY  = process.env.RELWORX_API_KEY!;
const RELWORX_ACCOUNT  = process.env.RELWORX_ACCOUNT_NO!;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { amount, msisdn } = await req.json();

  // ── Validate ──────────────────────────────────────────────────────────────
  if (!amount || typeof amount !== "number" || amount < 5000) {
    return NextResponse.json({ error: "Minimum deposit is UGX 5,000" }, { status: 400 });
  }
  if (!msisdn || !/^\+256\d{9}$/.test(msisdn)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  // ── Find parent ───────────────────────────────────────────────────────────
  const parent = await Parent.findOne({ email: session.user.email });
  if (!parent) {
    return NextResponse.json({ error: "Parent not found" }, { status: 404 });
  }

  // ── Generate unique reference ─────────────────────────────────────────────
  const reference = randomBytes(16).toString("hex"); // 32 chars, within 8-36 limit

  // ── Create pending transaction ────────────────────────────────────────────
  await Transaction.create({
    reference,
    status: "pending",
    type: "deposit",
    amount,
    parentId: parent._id,
    dependantId: null,
    fee: 0,
    timestamp: new Date(),
  });

  // ── Call Relworx ──────────────────────────────────────────────────────────
  try {
    const relworxRes = await fetch("https://payments.relworx.com/api/mobile-money/request-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.relworx.v2",
        "Authorization": `Bearer ${RELWORX_API_KEY}`,
      },
      body: JSON.stringify({
        account_no:  RELWORX_ACCOUNT,
        reference,
        msisdn,
        currency:    "UGX",
        amount,
        description: `Pesasa wallet deposit for ${parent.email}`,
      }),
    });

    const relworxData = await relworxRes.json();

    if (!relworxRes.ok || !relworxData.success) {
      // Mark transaction as failed
      await Transaction.findOneAndUpdate({ reference }, { status: "failed" });
      return NextResponse.json(
        { error: relworxData.message || "Payment initiation failed. Please try again." },
        { status: 502 }
      );
    }

    // Return reference so frontend can poll for status
    return NextResponse.json({
      success: true,
      reference,
      message: "Payment request sent. Awaiting approval.",
    });

  } catch (err) {
    console.error("Relworx error:", err);
    await Transaction.findOneAndUpdate({ reference }, { status: "failed" });
    return NextResponse.json({ error: "Payment service unavailable. Please try again." }, { status: 502 });
  }
}