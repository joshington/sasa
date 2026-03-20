

import { NextRequest, NextResponse } from "next/server";
//import { getServerSession } from "next-auth";
//import { authOptions } from "@/app/api/admin/auth/[...nextauth]/route";
import { verifyAdminRequest } from "@/app/lib/adminAuth";
import dbConnect from "@/app/utils/dbConnect";
import Settlement from "@/app/models/Settlement";
import Transaction from "@/app/models/Transaction";
import Merchant from "@/app/models/Merchant";

// GET: list all settlements, optionally filter by status
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
  const status = searchParams.get("status"); // paid | unpaid
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  await dbConnect();

  const [settlements, total] = await Promise.all([
    Settlement.find(filter)
      .populate("merchantId", "username email institute phoneNo")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Settlement.countDocuments(filter),
  ]);

  return NextResponse.json({ settlements, total, page, pages: Math.ceil(total / limit) });
}

// POST: generate weekly settlements for all merchants with unsettled commissions
export async function POST(req: NextRequest) {
  //const session = await getServerSession(authOptions);
  //if (!session || session.user.role !== "admin") {
   // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //}
  const isAdmin = await verifyAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Find all active merchants
  const merchants = await Merchant.find({ status: "active" }).lean();

  const created: string[] = [];

  for (const merchant of merchants) {
    // Sum unsettled completed withdrawals since last settlement
    const lastSettlement = merchant.lastSettlementDate ?? new Date(0);

    const agg = await Transaction.aggregate([
      {
        $match: {
          merchantId: merchant._id,
          type: "withdraw",
          status: "completed",
          timestamp: { $gt: lastSettlement, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          totalEarned: { $sum: { $multiply: ["$amount", 0.005] } },
          count: { $sum: 1 },
        },
      },
    ]);

    const data = agg[0];
    if (!data || data.totalEarned <= 0) continue;

    await Settlement.create({
      merchantId: merchant._id,
      amount: data.totalEarned,
      periodStart: lastSettlement,
      periodEnd: now,
      transactionCount: data.count,
      status: "unpaid",
    });

    await Merchant.findByIdAndUpdate(merchant._id, { lastSettlementDate: now });
    created.push(merchant._id.toString());
  }

  return NextResponse.json({
    message: `Generated ${created.length} settlement(s).`,
    created,
  });
}

// PATCH: mark a settlement as paid
export async function PATCH(req: NextRequest) {
  //const session = await getServerSession(authOptions);
  //if (!session || session.user.role !== "admin") {
  //  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //}
  const isAdmin = await verifyAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { settlementId } = await req.json();
  if (!settlementId) {
    return NextResponse.json({ error: "settlementId required." }, { status: 400 });
  }

  await dbConnect();

  const settlement = await Settlement.findByIdAndUpdate(
    settlementId,
    { status: "paid", paidAt: new Date() },
    { new: true }
  );

  if (!settlement) {
    return NextResponse.json({ error: "Settlement not found." }, { status: 404 });
  }

  // Zero out the merchant's commissionBalance for the settled amount
  await Merchant.findByIdAndUpdate(settlement.merchantId, {
    $inc: { commissionBalance: -settlement.amount },
  });

  return NextResponse.json({ message: "Settlement marked as paid.", settlement });
}