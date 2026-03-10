
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect";
import Merchant from "../../../models/Merchant";

export default async function GET(req: NextRequest) {
  await dbConnect();

  const merchantId = req.nextUrl.searchParams.get("merchantId") || "MERCHANT_ID_HERE"; // Replace with session

  try {
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    return NextResponse.json({
      username: merchant.username,
      email: merchant.email,
      phoneNo: merchant.phoneNo,
      institute: merchant.institute,
      commissionBalance: merchant.commissionBalance,
      settlementFrequency: merchant.settlementFrequency,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}