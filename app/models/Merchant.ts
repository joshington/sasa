


import mongoose, { Schema, Document } from "mongoose";

export interface MerchantDoc extends Document {
  username: string;
  email: string;
  phoneNo: string;
  institute: string;
  password: string; // hashed
  pin?: string; // hashed, set later

  commissionBalance: number;

  starknetAddress: string;  //every merchant must have a wallet address

  settlementFrequency: "daily" | "weekly" | "monthly";
  lastSettlementDate?: Date;

  status: "pending" | "active" | "suspended";

  activationToken?: string;
  activationTokenExpiry?: Date;

  resetToken: string;
  resetTokenExpiry: Date;

  createdAt: Date;
  updatedAt: Date;
}

const MerchantSchema = new Schema<MerchantDoc>(
  {
    username: {
      type: String,
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

    password: {
      type: String,
      required: true,
    },

    pin: {
      type: String,
    },

    commissionBalance: {
      type: Number,
      default: 0,
    },

    starknetAddress: {
      type: String,
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
      enum: ["pending", "active", "suspended"],
      default: "pending",
    },

    activationToken: {
      type: String,
    },

    activationTokenExpiry: {
      type: Date,
    },
    resetToken: { type: String, },
    resetTokenExpiry: { type: Date, },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Merchant ||
  mongoose.model<MerchantDoc>("Merchant", MerchantSchema);
