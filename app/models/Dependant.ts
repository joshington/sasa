

import mongoose, { Schema, Document } from "mongoose";

export interface DependantDoc extends Document {
  parentId: mongoose.Types.ObjectId;
  name: string;
  pin: string; // hashed
  smartCardId: {type: String, required:true, unique: true};
  institute: string;
  spendLimit: {
    daily: {type: Number, default: 0};
    weekly: {type: Number, default: 0};
    monthly:{type: Number, default: 0};
  };
  balance: number;
}

const DependantSchema = new Schema<DependantDoc>({
  parentId: { type: Schema.Types.ObjectId, ref: "Parent", required: true },
  name: { type: String, required: true },
  pin: { type: String, required: true },
  smartCardId: { type: String, required: true },
  institute: { type: String, required: true },
  spendLimit: { type: Object, default: {} },
  balance: { type: Number, default: 0 },
});

export default mongoose.models.Dependant || mongoose.model("Dependant", DependantSchema);