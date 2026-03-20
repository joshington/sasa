

import { NextRequest, NextResponse } from "next/server";
//import { getServerSession } from "next-auth";
//import { authOptions } from "@/app/api/admin/auth/[...nextauth]/route";
import { verifyAdminRequest } from "@/app/lib/adminAuth";
import dbConnect from "@/app/utils/dbConnect";
import Parent from "@/app/models/Parent";
import Dependant from "@/app/models/Dependant";

export async function GET(req: NextRequest) {
  //const session = await getServerSession(authOptions);
  //if (!session || session.user.role !== "admin") {
  //  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //}
  const isAdmin = await verifyAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;

  await dbConnect();

  const [parents, total, totalDependants] = await Promise.all([
    Parent.find()
      .select("-pin")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("dependants", "name institute balance dailySpendLimit")
      .lean(),
    Parent.countDocuments(),
    Dependant.countDocuments(),
  ]);

  return NextResponse.json({ parents, total, totalDependants, page, pages: Math.ceil(total / limit) });
}