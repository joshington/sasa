
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import Parent from "../../../models/Parent";
import { hashPin } from "../../../utils/hashPin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");
  await dbConnect();

  const { parentId, pin } = req.body;

  try {
    const parent = await Parent.findById(parentId);
    if (!parent) return res.status(404).json({ error: "Parent not found" });

    parent.pin = await hashPin(pin);
    await parent.save();

    res.status(200).json({ message: "PIN set successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}