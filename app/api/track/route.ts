import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import PageVisit from "@/app/models/PageVisit";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { page, referrer } = await req.json();

    await PageVisit.create({
      page:      page || "/",
      referrer:  referrer || "",
      userAgent: req.headers.get("user-agent") || "",
      timestamp: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Silently fail — never break the user experience for analytics
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
