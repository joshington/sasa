
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect";
import Parent from "../../../models/Parent";
import { hashPin } from "../../../utils/hashPin";

export default async function GET(req: NextRequest) {
  if (req.method !== "POST") return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  await dbConnect();

  const { parentId, pin } = await req.json();
  try {
    const parent = await Parent.findById(parentId);
    if (!parent) return NextResponse.json({ error: "Parent not found" }, { status: 404 });

    parent.pin = await hashPin(pin);
    await parent.save();

    return NextResponse.json({ message: "PIN set successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}