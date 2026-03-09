

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import Merchant from "../../../models/Merchant";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");
  await dbConnect();

  const { merchantId, frequency } = req.body;

  try {
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) return res.status(404).json({ error: "Merchant not found" });

    // For MVP, just acknowledge settlement (wallet transfer logic can be added later)
    merchant.settlementFrequency = frequency;
    await merchant.save();

    res.status(200).json({ message: `Settlement frequency set to ${frequency}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}