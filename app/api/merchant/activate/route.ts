


import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import Merchant from "@/app/models/Merchant";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/merchant/activate?error=missing_token", req.url)
      );
    }

    await dbConnect();

    const merchant = await Merchant.findOne({
      activationToken: token,
      activationTokenExpiry: { $gt: new Date() }, // not expired
    });

    if (!merchant) {
      return NextResponse.redirect(
        new URL("/merchant/activate?error=invalid_or_expired", req.url)
      );
    }

    // ── Activate ─────────────────────────────────────────────────────────────
    merchant.status = "active";
    merchant.activationToken = undefined;
    merchant.activationTokenExpiry = undefined;
    await merchant.save();

    return NextResponse.redirect(
      new URL("/merchant/signin?activated=true", req.url)
    );
  } catch (err) {
    console.error("[merchant/activate]", err);
    return NextResponse.redirect(
      new URL("/merchant/activate?error=server_error", req.url)
    );
  }
}