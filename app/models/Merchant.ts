

import mongoose, { Schema, Document } from "mongoose";

export interface MerchantDoc extends Document {
  username: string;
  email: string;
  phoneNo: string;
  institute: string;
  pin: string; // hashed

  commissionBalance: number;

  settlementFrequency: "daily" | "weekly" | "monthly";
  lastSettlementDate?: Date;

  status: "active" | "suspended";

  createdAt: Date;
  updatedAt: Date;
}

const MerchantSchema = new Schema<MerchantDoc>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNo: {
      type: String,
      required: true,
      unique: true,
    },

    institute: {
      type: String,
      required: true,
    },

    pin: {
      type: String,
      required: true,
    },

    commissionBalance: {
      type: Number,
      default: 0,
    },

    settlementFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "weekly",
    },

    lastSettlementDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Merchant ||
  mongoose.model<MerchantDoc>("Merchant", MerchantSchema);