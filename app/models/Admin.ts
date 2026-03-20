

import mongoose, { Schema, Document } from "mongoose";

export interface AdminDoc extends Document {
  email: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<AdminDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Admin ||
  mongoose.model<AdminDoc>("Admin", AdminSchema);