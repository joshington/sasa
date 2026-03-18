import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/app/utils/dbConnect";
import Merchant from "@/app/models/Merchant";
import { sendPasswordResetEmail } from "@/app/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await dbConnect();

    const merchant = await Merchant.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration attacks
    if (!merchant) {
      return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(40).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    merchant.resetToken = resetToken;
    merchant.resetTokenExpiry = resetTokenExpiry;
    await merchant.save();

    await sendPasswordResetEmail(merchant.email, resetToken);

    return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("[merchant/forgot-password]", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
