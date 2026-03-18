import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/utils/dbConnect";
import Merchant from "@/app/models/Merchant";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    await dbConnect();

    const merchant = await Merchant.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!merchant) {
      return NextResponse.json({ error: "Reset link is invalid or has expired." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    merchant.password = hashed;
    merchant.resetToken = undefined;
    merchant.resetTokenExpiry = undefined;
    await merchant.save();

    return NextResponse.json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("[merchant/reset-password]", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
