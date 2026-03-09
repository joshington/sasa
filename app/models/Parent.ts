

import mongoose, { Schema, Document } from "mongoose";

export interface ParentDoc extends Document {
  username: string;
  email: string;
  phoneNo: string;
  pin: string; // hashed
  balance: number;
  dependants: mongoose.Types.ObjectId[];
}

const ParentSchema = new Schema<ParentDoc>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String, required: false },
    pin: { type: String, required: false },
    balance: { type: Number, default: 0 },
    dependants: [{ type: Schema.Types.ObjectId, ref: "Dependant" }],
  },
  {timestamps: true}
);

export default mongoose.models.Parent || mongoose.model("Parent", ParentSchema);