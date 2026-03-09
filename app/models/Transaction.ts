
import mongoose, { Schema, Document } from "mongoose";

export interface TransactionDoc extends Document {
  type: "withdraw" | "deposit";
  amount: number;
  parentId: mongoose.Types.ObjectId;
  dependantId: mongoose.Types.ObjectId;
  merchantId?: mongoose.Types.ObjectId;
  fee: number;
  timestamp: Date;
}

const TransactionSchema = new Schema<TransactionDoc>({
  type: { type: String, enum: ["withdraw", "deposit"], required: true },
  amount: { type: Number, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: "Parent" },
  dependantId: { type: Schema.Types.ObjectId, ref: "Dependant" },
  merchantId: { type: Schema.Types.ObjectId, ref: "Merchant" },
  fee: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);