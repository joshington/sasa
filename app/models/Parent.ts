

import mongoose, { Schema, Document } from "mongoose";

export interface ParentDoc extends Document {
  googleId: string;
  username: string;
  email: string;
  phoneNo: string;
  pin: string; // hashed
  balance: number;
  dependants: mongoose.Types.ObjectId[];
}

const ParentSchema = new Schema<ParentDoc>(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique:true, index:true },
    phoneNo: { type: String, required: false },
    pin: { type: String, required: false },

    dependants: [{ type: Schema.Types.ObjectId, ref: "Dependant" }],
  },
  {timestamps: true}
);

export default mongoose.models.Parent || mongoose.model("Parent", ParentSchema);