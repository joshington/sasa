

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import Parent from "../../../models/Parent";
import Transaction from "../../../models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");
  await dbConnect();

  const { parentId, amount } = req.body;

  try {
    const parent = await Parent.findById(parentId);
    if (!parent) return res.status(404).json({ error: "Parent not found" });

    parent.balance += amount;
    await parent.save();

    await Transaction.create({
      type: "deposit",
      amount,
      parentId,
      dependantId: null,
      fee: 0,
      timestamp: new Date(),
    });

    res.status(200).json({ message: `Deposit successful. New balance: ${parent.balance}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}