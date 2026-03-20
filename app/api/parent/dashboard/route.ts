

import Parent from "@/app/models/Parent";
import "@/app/models/Dependant"; //ensure schema registers


import Transaction from "@/app/models/Transaction";
import Wallet from "@/app/models/Wallet";

import dbConnect from "@/app/utils/dbConnect";

import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //have to find the googleId of the parent instead
    const googleId = session.user?.id;

    //find parent
    const parent = await Parent.findOne({
       email:session.user.email 
    }).populate("dependants");
    if (!parent) {
      return NextResponse.json({
        balance: 0,
        dependants: [],
        transactions: [],
        hasPinSet: false,
        chartData: DAY_LABELS.map((day) => ({ day, amount: 0 })),
      });
    }
    //get last 5 transactions 
    const rawTransactions = await Transaction.find({
      parentId: parent._id,
    })
      .sort({ timestamp: -1 })
      .limit(5)
      .populate("dependantId", "name")
      .populate("merchantId", "username institute")
      .lean();
      
    // Flatten to match what the dashboard UI expects
    const transactions = rawTransactions.map((tx: any) => ({
      _id:           tx._id.toString(),
      dependantName: tx.dependantId?.name ?? "Transfer",
      merchant:      tx.merchantId?.username ?? tx.merchantId?.institute ?? "—",
      amount:        tx.amount,
      type:          tx.type,
      status:        tx.status,
      timestamp:     tx.timestamp,
    }));

    // ── Last 7 days spending grouped by day ──────────────────────────────
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const spendingAgg = await Transaction.aggregate([
      {
        $match: {
          parentId: parent._id,
          type: "withdraw",
          status: "completed",
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$timestamp" },  // 1=Sun … 7=Sat
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Build a full 7-day array — fill missing days with 0
    // Rotate so today is last
    const today = new Date().getDay(); // 0=Sun … 6=Sat
    const spendingMap: Record<number, number> = {};
    spendingAgg.forEach((s: any) => {
      // MongoDB $dayOfWeek: 1=Sun, JS getDay: 0=Sun — normalise to 0-based
      spendingMap[s._id - 1] = s.total;
    });

    // Last 7 days in order ending today
    const chartData = Array.from({ length: 7 }, (_, i) => {
      const dayIndex = (today - 6 + i + 7) % 7;
      return {
        day:    DAY_LABELS[dayIndex],
        amount: spendingMap[dayIndex] ?? 0,
      };
    });

    // ── Wallet balance ────────────────────────────────────────────────────
    const wallet = await Wallet.findOne({ parentId: parent._id });


    
    return NextResponse.json({
      balance: wallet?.balance ?? 0,
      dependants: parent.dependants ?? [],
      transactions,
      hasPinSet: !!parent.pin,
      chartData, //real data frm DB
    });
  } catch (error) {
    console.error("[parent/dashboard]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
