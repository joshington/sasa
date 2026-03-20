

import { NextRequest, NextResponse } from "next/server";
//import { getServerSession } from "next-auth";
//import { authOptions } from "@/app/api/admin/auth/[...nextauth]/route";
import { verifyAdminRequest } from "@/app/lib/adminAuth";
import dbConnect from "@/app/utils/dbConnect";
import Transaction from "@/app/models/Transaction";

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
  const type = searchParams.get("type");     // withdraw | deposit
  const status = searchParams.get("status"); // completed | failed | pending

  const filter: Record<string, unknown> = {};
  if (type) filter.type = type;
  if (status) filter.status = status;

  await dbConnect();

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("parentId", "username email")
      .populate("dependantId", "name institute")
      .populate("merchantId", "username institute")
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  return NextResponse.json({ transactions, total, page, pages: Math.ceil(total / limit) });
}