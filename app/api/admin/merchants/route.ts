

import { NextRequest, NextResponse } from "next/server";
//import { getServerSession } from "next-auth";
//import { authOptions } from "@/app/api/admin/auth/[...nextauth]/route";
import { verifyAdminRequest } from "@/app/lib/adminAuth";
import dbConnect from "@/app/utils/dbConnect";
import Merchant from "@/app/models/Merchant";
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
  const status = searchParams.get("status");

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  await dbConnect();

  const [merchants, total] = await Promise.all([
    Merchant.find(filter)
      .select("-password -pin -activationToken -resetToken")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Merchant.countDocuments(filter),
  ]);

  // Enrich each merchant with their total earned (all-time) and transaction count
  const enriched = await Promise.all(
    merchants.map(async (m) => {
      const agg = await Transaction.aggregate([
        {
          $match: {
            merchantId: m._id,
            type: "withdraw",
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            totalVolume: { $sum: "$amount" },
            totalEarned: { $sum: { $multiply: ["$amount", 0.005] } },
            count: { $sum: 1 },
          },
        },
      ]);
      const data = agg[0] ?? { totalVolume: 0, totalEarned: 0, count: 0 };
      return { ...m, totalVolume: data.totalVolume, totalEarned: data.totalEarned, txCount: data.count };
    })
  );

  return NextResponse.json({ merchants: enriched, total, page, pages: Math.ceil(total / limit) });
}

// PATCH: suspend or activate a merchant
export async function PATCH(req: NextRequest) {
  //const session = await getServerSession(authOptions);
  //if (!session || session.user.role !== "admin") {
  //  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //}
  const isAdmin = await verifyAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { merchantId, status } = await req.json();
  if (!merchantId || !["active", "suspended"].includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  await dbConnect();
  await Merchant.findByIdAndUpdate(merchantId, { status });
  return NextResponse.json({ message: "Merchant updated." });
}