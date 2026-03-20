

import mongoose, { Schema, Document } from "mongoose";

export interface SettlementDoc extends Document {
  merchantId: mongoose.Types.ObjectId;
  amount: number;         // total commission earned in this period
  periodStart: Date;
  periodEnd: Date;
  status: "unpaid" | "paid";
  paidAt?: Date;
  transactionCount: number;
  txHash: string; //generated after settlement
  createdAt: Date;
  updatedAt: Date;
}

const SettlementSchema = new Schema<SettlementDoc>(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    paidAt: { type: Date },
    transactionCount: { type: Number, default: 0 },
    txHash: {type: String},
  },
  { timestamps: true }
);

SettlementSchema.index({ merchantId: 1, status: 1 });
SettlementSchema.index({ periodStart: -1 });

export default mongoose.models.Settlement ||
  mongoose.model<SettlementDoc>("Settlement", SettlementSchema);