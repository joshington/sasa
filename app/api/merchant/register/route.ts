
// app/api/merchant/register/route.ts
// Called after Google OAuth completes on the merchant sign-in page.
// Creates the Merchant record if it doesn't exist yet.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/utils/dbConnect";
import Merchant from "@/app/models/Merchant";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { phoneNo, institute, pin } = await req.json();

    if (!phoneNo || !institute || !pin) {
      return NextResponse.json(
        { error: "Phone number, institution and PIN are required" },
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: "PIN must be exactly 4 digits" },
        { status: 400 }
      );
    }

    // Idempotent — if merchant already exists just return success
    const existing = await Merchant.findOne({ email: session.user.email });
    if (existing) {
      return NextResponse.json({ message: "Merchant already registered" });
    }

    const hashedPin = await bcrypt.hash(pin, 12);

    await Merchant.create({
      username:  session.user.name  || "Merchant",
      email:     session.user.email,
      phoneNo,
      institute,
      pin:       hashedPin,
      status:    "active",
      commissionBalance: 0,
    });

    return NextResponse.json({ message: "Merchant registered successfully" });
  } catch (error: any) {
    // Duplicate phone
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 400 }
      );
    }
    console.error("merchant/register error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}