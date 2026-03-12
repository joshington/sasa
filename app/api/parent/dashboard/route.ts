

import Parent from "@/app/models/Parent";
import "@/app/models/Dependant"; //ensure schema registers


import Transaction from "@/app/models/Transaction";
import Wallet from "@/app/models/Wallet";

import dbConnect from "@/app/utils/dbConnect";

import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
      });
    }
    //get transactions 
    const transactions = await Transaction.find({
      parentId: parent._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);
      
    //then get spending in the last 7 days
    const spending = await Transaction.aggregate([
      {
        $match: {
          parentId: parent._id,
          type: "withdraw",
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          total: { $sum: "$amount" },
        },
      },
    ])

    //we want to get the balance from the wallet instead
    const wallet = await Wallet.findOne({
      parentId: parent._id
    });
    
    return NextResponse.json({
      balance: wallet?.balance || 0,
      dependants: parent.dependants || [],
      transactions,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {error: "Server error"},
      {status: 500}
    );
  }
}
