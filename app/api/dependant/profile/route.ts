

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import Dependant from "../../../models/Dependant";
import Parent from "../../../models/Parent";
import QRCode from "qrcode";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const dependantId = req.query.dependantId || "DEPENDANT_ID_HERE"; // Replace with session

  try {
    const dependant = await Dependant.findById(dependantId);
    if (!dependant) return res.status(404).json({ error: "Dependant not found" });

    const parent = await Parent.findById(dependant.parentId);

    const qrDataURL = await QRCode.toDataURL(dependant.smartCardId);

    res.status(200).json({
      name: dependant.name,
      institute: dependant.institute,
      parentName: parent?.username || "",
      balance: dependant.balance,
      spendLimit: dependant.spendLimit,
      smartCardId: dependant.smartCardId,
      qrDataURL,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}