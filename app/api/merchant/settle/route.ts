

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect";
import Merchant from "../../../models/Merchant";

export default async function GET(req: NextRequest) {
  if (req.method !== "POST") return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  await dbConnect();

  const { merchantId, frequency } = await req.json();
  try {
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) return NextResponse.json({ error: "Merchant not found" }, { status: 404 });

    // For MVP, just acknowledge settlement (wallet transfer logic can be added later)
    merchant.settlementFrequency = frequency;
    await merchant.save();

    return NextResponse.json({ message: `Settlement frequency set to ${frequency}` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}