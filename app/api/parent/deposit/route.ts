

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "../../../utils/dbConnect";
import Parent from "../../../models/Parent";
import Transaction from "../../../models/Transaction";
import { randomUUID } from "crypto";

const MARZ_API_KEY  = process.env.MARZ_API_KEY!; // Base64 encoded Basic auth credentials
const MARZ_BASE_URL = "https://wallet.wearemarz.com/api/v1";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { amount, msisdn } = await req.json();

  // ── Validate ──────────────────────────────────────────────────────────────
  if (!amount || typeof amount !== "number" || amount < 500) {
    return NextResponse.json({ error: "Minimum deposit is UGX 500" }, { status: 400 });
  }
  if (!msisdn || !/^\+256\d{9}$/.test(msisdn)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  // ── Find parent ───────────────────────────────────────────────────────────
  const parent = await Parent.findOne({ email: session.user.email });
  if (!parent) {
    return NextResponse.json({ error: "Parent not found" }, { status: 404 });
  }

  // ── Generate UUID reference (MarzPay REQUIRES UUID v4 format) ─────────────
  const reference = randomUUID();

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

  // ── Call MarzPay ──────────────────────────────────────────────────────────
  try {
    // MarzPay uses multipart/form-data
    const formData = new FormData();
    formData.append("phone_number", msisdn);
    formData.append("amount",       String(amount));
    formData.append("country",      "UG");
    formData.append("reference",    reference);
    formData.append("description",  `Pesasa wallet deposit`);
    formData.append("callback_url", `${process.env.NEXTAUTH_URL}/api/webhooks/marzpay`);

    const marzRes = await fetch(`${MARZ_BASE_URL}/collect-money`, {
      method:  "POST",
      headers: { Authorization: `Basic ${MARZ_API_KEY}` },
      body:    formData,
    });

    const marzData = await marzRes.json();
    console.log("[MarzPay collect]", JSON.stringify(marzData));

    if (!marzRes.ok || marzData.status !== "success") {
      await Transaction.findOneAndUpdate({ reference }, { status: "failed" });
      return NextResponse.json(
        { error: marzData.message || "Payment initiation failed. Please try again." },
        { status: 502 }
      );
    }

    // Store MarzPay's UUID so we can look up status directly if needed
    const marzUuid = marzData?.data?.transaction?.uuid;
    if (marzUuid) {
      await Transaction.findOneAndUpdate({ reference }, { $set: { marzUuid } });
    }

    return NextResponse.json({
      success:   true,
      reference,
      message:   "Payment request sent. Awaiting approval.",
    });

  } catch (err) {
    console.error("[MarzPay] error:", err);
    await Transaction.findOneAndUpdate({ reference }, { status: "failed" });
    return NextResponse.json(
      { error: "Payment service unavailable. Please try again." },
      { status: 502 }
    );
  }
}