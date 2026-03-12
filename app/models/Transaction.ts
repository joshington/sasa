
import mongoose, { Schema, Document } from "mongoose";

export interface TransactionDoc extends Document {
  reference: string;
  status: "pendng" | "completed" | "failed";
  type: "withdraw" | "deposit";
  amount: number;
  parentId: mongoose.Types.ObjectId;
  dependantId: mongoose.Types.ObjectId;
  merchantId?: mongoose.Types.ObjectId;
  fee: number;
  timestamp: Date;
}

const TransactionSchema = new Schema<TransactionDoc>({
  reference: {type: String, required: true, unique: true,},
  status: { type: String, enum: ["pending", "completed", "failed"], required: true},
  type: { type: String, enum: ["withdraw", "deposit"], required: true },
  amount: { type: Number, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: "Parent" },
  dependantId: { type: Schema.Types.ObjectId, ref: "Dependant" },
  merchantId: { type: Schema.Types.ObjectId, ref: "Merchant" },
  fee: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);


//i added some change, because if achild withdraws from a merchant, we need a way to track;
// == the withdrawal
// == the merchant commission
// == the settlement batch
// == potential refund
//== so thats why i added a reference field in the Transaction model
//so this becomes the unique payment ID