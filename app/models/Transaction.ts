
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
  parentId: { type: Schema.Types.ObjectId, ref: "Parent", required: true, index: true },
  dependantId: { type: Schema.Types.ObjectId, ref: "Dependant", index: true },
  merchantId: { type: Schema.Types.ObjectId, ref: "Merchant" },
  fee: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

//to make querying faster, am adding a compound index
TransactionSchema.index({ parentId: 1, createdAt: -1 });

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);


//i added some change, because if achild withdraws from a merchant, we need a way to track;
// == the withdrawal
// == the merchant commission
// == the settlement batch
// == potential refund
//== so thats why i added a reference field in the Transaction model
//so this becomes the unique payment ID