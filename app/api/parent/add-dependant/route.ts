

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect";
import Parent from "../../../models/Parent";
import Dependant from "../../../models/Dependant";
import { hashPin } from "../../../utils/hashPin";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  if (req.method !== "POST") return NextResponse.json({ error: "Method not allowed" }, { status: 405 });

  await dbConnect();

  const { parentId, name, pin, institute, spendLimit } = await req.json();

  try {
    const parent = await Parent.findById(parentId);
    if (!parent) return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    const hashedPin = await hashPin(pin);

    // Generate QR code ID (simple random for MVP)
    const smartCardId = `${parentId}-${Date.now()}`;
    const qrDataURL = await QRCode.toDataURL(smartCardId);

    const dependant = await Dependant.create({
      parentId,
      name,
      pin: hashedPin,
      smartCardId,
      institute,
      spendLimit,
      balance: 0,
    });

    parent.dependants.push(dependant._id);
    await parent.save();

    return NextResponse.json({ dependant, qrDataURL });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}