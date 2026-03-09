

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import Parent from "../../../models/Parent";
import Dependant from "../../../models/Dependant";
import { hashPin } from "../../../utils/hashPin";
import QRCode from "qrcode";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  await dbConnect();

  const { parentId, name, pin, institute, spendLimit } = req.body;

  try {
    const parent = await Parent.findById(parentId);
    if (!parent) return res.status(404).json({ error: "Parent not found" });

    const hashedPin = await hashPin(pin);

    // Generate QR code ID (simple random for MVP)
    const smartCardId = `${parentId}-${Date.now()}`;
    const qrDataURL = await QRCode.toDataURL(smartCardId);

    const dependant = await Dependant.create({
      parentId,
      name,
      pin: hashedPin,
      smartCardId,
      institute,
      spendLimit,
      balance: 0,
    });

    parent.dependants.push(dependant._id);
    await parent.save();

    res.status(200).json({ dependant, qrDataURL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}