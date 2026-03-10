

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import Dependant from "@/app/models/Dependant";
import Parent from "@/app/models/Parent";
import QRCode from "qrcode";

export  async function GET(req: NextRequest) {
  await dbConnect();

  const dependantId = req.nextUrl.searchParams.get("dependantId") || "DEPENDANT_ID_HERE"; // Replace with session

  try {
    const dependant = await Dependant.findById(dependantId);
    if (!dependant) {
      return NextResponse.json({ error: "Dependant not found" }, { status: 404 });
    }
    const parent = await Parent.findById(dependant.parentId);

    const qrDataURL = await QRCode.toDataURL(dependant.smartCardId);

    return NextResponse.json({
      name: dependant.name,
      institute: dependant.institute,
      parentName: parent?.username || "",
      balance: dependant.balance,
      spendLimit: dependant.spendLimit,
      smartCardId: dependant.smartCardId,
      qrDataURL,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}