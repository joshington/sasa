

import mongoose, {Schema, Document} from "mongoose";


export interface WalletDoc extends Document {
    parentId: mongoose.Types.ObjectId;
    balance: number;
}

const WalletSchema = new Schema<WalletDoc>(
    {
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "Parent",
            required: true,
            unique: true,
            index: true
        },
        balance: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

export default mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);