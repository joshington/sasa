

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dbConnect from "@/app/utils/dbConnect";
import Merchant from "@/app/models/Merchant";
import { sendActivationEmail } from "@/app/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email, password, confirmPassword, phoneNo, institute } =
      await req.json();

    // ── Validation ──────────────────────────────────────────────────────────
    if (!email || !password || !confirmPassword || !phoneNo || !institute) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // ── DB ───────────────────────────────────────────────────────────────────
    await dbConnect();

    const existing = await Merchant.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const existingPhone = await Merchant.findOne({ phoneNo });
    if (existingPhone) {
      return NextResponse.json(
        { error: "An account with this phone number already exists." },
        { status: 409 }
      );
    }

    // ── Hash password & generate activation token ────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);
    const activationToken = crypto.randomBytes(32).toString("hex");
    const activationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h

    // ── Create merchant ──────────────────────────────────────────────────────
    await Merchant.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNo,
      institute,
      status: "pending",
      activationToken,
      activationTokenExpiry,
    });

    // ── Send activation email ────────────────────────────────────────────────
    await sendActivationEmail(email, activationToken);

    return NextResponse.json(
      { message: "Account created. Please check your email to activate." },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[merchant/signup]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}