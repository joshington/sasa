

import { NextResponse } from "next/server";
//import { getServerSession } from "next-auth";
import { verifyAdminRequest } from "@/app/lib/adminAuth";
//import { authOptions } from "@/app/api/admin/auth/[...nextauth]/route";
import dbConnect from "@/app/utils/dbConnect";
import Transaction from "@/app/models/Transaction";
import Merchant from "@/app/models/Merchant";
import Parent from "@/app/models/Parent";
import Dependant from "@/app/models/Dependant";

export async function GET() {
  //const session = await getServerSession(authOptions);
  //if (!session || session.user.role !== "admin") {
  //  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //}
  const isAdmin = await verifyAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();

  const [
    totalParents,
    totalDependants,
    totalMerchants,
    activeMerchants,
    txAgg,
    recentTransactions,
    monthlyRevenue,
  ] = await Promise.all([
    Parent.countDocuments(),
    Dependant.countDocuments(),
    Merchant.countDocuments(),
    Merchant.countDocuments({ status: "active" }),

    // Total revenue & profit from completed withdrawals
    Transaction.aggregate([
      { $match: { type: "withdraw", status: "completed" } },
      {
        $group: {
          _id: null,
          totalVolume: { $sum: "$amount" },
          totalFees: { $sum: "$fee" },           // 3% = your gross revenue
          totalCount: { $sum: 1 },
          totalMerchantCommission: {             // 0.5% = merchant share
            $sum: { $multiply: ["$amount", 0.005] },
          },
        },
      },
    ]),

    // Last 7 transactions
    Transaction.find({ status: "completed" })
      .sort({ timestamp: -1 })
      .limit(7)
      .populate("parentId", "username email")
      .populate("merchantId", "username institute")
      .lean(),

    // Last 6 months revenue grouped by month
    Transaction.aggregate([
      {
        $match: {
          type: "withdraw",
          status: "completed",
          timestamp: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$timestamp" } },
          revenue: { $sum: "$fee" },
          volume: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const agg = txAgg[0] ?? {
    totalVolume: 0,
    totalFees: 0,
    totalCount: 0,
    totalMerchantCommission: 0,
  };

  return NextResponse.json({
    stats: {
      totalParents,
      totalDependants,
      totalMerchants,
      activeMerchants,
      totalTransactions: agg.totalCount,
      totalVolume: agg.totalVolume,
      grossRevenue: agg.totalFees,                                          // 3%
      merchantCommissions: agg.totalMerchantCommission,                    // 0.5%
      netProfit: agg.totalFees - agg.totalMerchantCommission,              // 2.5%
    },
    recentTransactions,
    monthlyRevenue,
  });
}