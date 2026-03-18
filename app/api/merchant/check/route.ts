
// app/api/merchant/check/route.ts
// Called by /merchant/signin after Google OAuth to decide:
//   exists: true  → go straight to dashboard (returning merchant)
//   exists: false → show registration form (new user)

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/utils/dbConnect";
import Merchant from "@/app/models/Merchant";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const merchant = await Merchant.findOne({ email: session.user.email });

    return NextResponse.json({ exists: !!merchant });
  } catch (error) {
    console.error("merchant/check error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}