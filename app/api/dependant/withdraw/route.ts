

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import Dependant from "../../../models/Dependant";
import Parent from "../../../models/Parent";
import Transaction from "../../../models/Transaction";
import { verifyPin } from "../../../utils/hashPin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  await dbConnect();

  const { smartCardId, amount, pin, merchantId } = req.body;

  try {
    const dependant = await Dependant.findOne({ smartCardId });
    if (!dependant) return res.status(404).json({ error: "Dependant not found" });

    const isPinValid = await verifyPin(pin, dependant.pin);
    if (!isPinValid) return res.status(401).json({ error: "Invalid PIN" });

    const dailyLimit = dependant.spendLimit.daily || Infinity;
    if (amount > dependant.balance) return res.status(400).json({ error: "Insufficient balance" });
    if (amount > dailyLimit) return res.status(400).json({ error: "Amount exceeds daily spend limit" });

    const fee = amount * 0.03;

    // Deduct from dependant & parent
    dependant.balance -= amount;
    await dependant.save();

    const parent = await Parent.findById(dependant.parentId);
    if (parent) {
      parent.balance -= fee; // parent pays the fee
      await parent.save();
    }

    // Save transaction
    await Transaction.create({
      type: "withdraw",
      amount,
      parentId: dependant.parentId,
      dependantId: dependant._id,
      merchantId,
      fee,
      timestamp: new Date(),
    });

    res.status(200).json({ message: "Withdraw successful", balance: dependant.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}