
import mongoose from "mongoose";

import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";

import Parent from "@/app/models/Parent";
import Dependant from "@/app/models/Dependant";
import Wallet from "@/app/models/Wallet";
import Transaction from "@/app/models/Transaction";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {generateReference} from "@/app/utils/generateReference";

export async function POST(req: Request) {
    const sessionDb = await mongoose.startSession();
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if(!session?.user?.email) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }
        const {dependantId, amount} = await req.json();
        if (!dependantId || !amount) {
            return NextResponse.json(
                {error: "Missing fields"},
                {status: 400}
            );
        }

        const parent = await Parent.findOne({
            email: session.user.email
        });
        if (!parent) {
            return NextResponse.json(
                {error: "Parent not found"},
                {status: 404}
            );
        }

        const wallet = await Wallet.findOne({
            parentId: parent._id
        });
        if (!wallet) {
            return NextResponse.json(
                {error: "Wallet not found"},
                {status: 404}
            );
        }
        const child = await Dependant.findById(dependantId);
        if(!child) {
            return NextResponse.json(
                {error: "Child not found"},
                {status: 404}
            );
        }
        //ensure child belongs to parent
        if (child.parentId.toString() !== parent._id.toString()) {
            return NextResponse.json(
                {error: "Unauthorized transfer"},
                {status: 403}
            );
        }
        const transferAmount = Number(amount);
        //enforce 10% reserve rule
        const minimumReserve = wallet.balance * 0.1;
        if (wallet.balance - transferAmount < minimumReserve){
            return NextResponse.json(
                {
                    error: "10% balance after Transfer is required",
                    minimumReserve
                },
                {status: 400}
            );
        }

        sessionDb.startTransaction();
        //update balances
        wallet.balance -= transferAmount
        child.balance += transferAmount;

        await wallet.save({ session: sessionDb });
        await child.save({ session: sessionDb });

        //record transaction
        
        await Transaction.create(
            [
                {
                    reference: generateReference(), //calling the func
                    parentId: parent._id,
                    dependantId: child._id,
                    amount: transferAmount,
                    type: "deposit",
                    status: "completed",
                    merchant: "Parent Transfer",
                    fee:0,
                }
            ],
            {session: sessionDb}
        );
        await sessionDb.commitTransaction();
        sessionDb.endSession();

        return NextResponse.json({
            message: "Transfer successful"
        });
    } catch(error) {
        await sessionDb.abortTransaction();
        sessionDb.endSession();

        console.error(error);
        return NextResponse.json(
            {error: "Transfer failed"},
            {status: 500}
        );
    }
}

