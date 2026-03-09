
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import Merchant from "../../../models/Merchant";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const merchantId = req.query.merchantId || "MERCHANT_ID_HERE"; // Replace with session

  try {
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) return res.status(404).json({ error: "Merchant not found" });

    res.status(200).json({
      username: merchant.username,
      email: merchant.email,
      phoneNo: merchant.phoneNo,
      institute: merchant.institute,
      commissionBalance: merchant.commissionBalance,
      settlementFrequency: merchant.settlementFrequency,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}