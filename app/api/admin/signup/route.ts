

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/utils/dbConnect";
import Admin from "@/app/models/Admin";

export async function POST(req: NextRequest) {
  try {
    const { email, password, secret } = await req.json();

    // Guard: only allow creation with a setup secret to prevent public signups
    if (secret !== process.env.ADMIN_SETUP_SECRET) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    await dbConnect();

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Admin account already exists." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await Admin.create({ email: email.toLowerCase(), password: hashed });

    return NextResponse.json({ message: "Admin account created." }, { status: 201 });
  } catch (err) {
    console.error("[admin/signup]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}