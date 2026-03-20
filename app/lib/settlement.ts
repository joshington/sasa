

import {
  StarkZap,
  StarkSigner,
  OnboardStrategy,
  Amount,
  fromAddress,
  mainnetTokens,
} from "starkzap";
import dbConnect from "@/app/utils/dbConnect";
import Settlement from "@/app/models/Settlement";
import Merchant from "@/app/models/Merchant";

const USDC = mainnetTokens.USDC;
// Minimum commission in UGX before a merchant is eligible for settlement
const MIN_COMMISSION_UGX = 10000;

// Minimum days between settlements
const SETTLEMENT_INTERVAL_DAYS = 7;

function hasWeekPassed(lastSettlementDate: Date | null | undefined): boolean {
    if(!lastSettlementDate) return true; //never settled before
    const now = Date.now();
    const last = new Date(lastSettlementDate).getTime();
    const daysPassed = (now - last) / (1000 * 60 * 60 * 24);
    return daysPassed >= SETTLEMENT_INTERVAL_DAYS;

}

export async function runBatchSettlement() {
    await dbConnect();

    // 1. Fetch all unpaid settlements with merchant details
    const unpaid = await Settlement.find({ status: "unpaid" })
        .populate("merchantId", "username email starknetAddress commissionBalance lastSettlementDate")
        .lean();

    if (unpaid.length === 0) {
        return { message: "No unpaid settlements.", count: 0 };
    }

    // 2. Apply eligibility filters
    const eligible:   typeof unpaid = [];
    const noWallet:   typeof unpaid = [];
    const tooSoon:    typeof unpaid = [];
    const belowMin:   typeof unpaid = [];

    for (const s of unpaid) {
        const merchant = s.merchantId as any;

        //filter 1 - must have a starknet wallet address
        if (!merchant?.starknetAddress) {
            noWallet.push(s);
            continue;
        }

        // Filter 2 — at least one week must have passed since last settlement
        if (!hasWeekPassed(merchant?.lastSettlementDate)) {
            tooSoon.push(s);
            continue;
        }

        // Filter 3 — commission balance must be at least 10,000 UGX
        if ((merchant?.commissionBalance ?? 0) < MIN_COMMISSION_UGX) {
            belowMin.push(s);
            continue;
        }
        eligible.push(s);
    }

    // Nothing to pay after filters
    if (eligible.length === 0) {
        return {
            message: "No merchants eligible for settlement right now.",
            reasons: {
                noWallet:  noWallet.length,
                tooSoon:   tooSoon.length,
                belowMin:  belowMin.length,
            },
        };
    }

    // 3. Connect platform wallet via StarkZap
    const sdk = new StarkZap({ network: "mainnet" });
    const { wallet } = await sdk.onboard({
        strategy: OnboardStrategy.Signer,
        account: {
        signer: new StarkSigner(process.env.PLATFORM_STARKNET_PRIVATE_KEY!),
        },
        deploy: "if_needed",
    });

    // 4. Chunk into batches of 100 (Starknet multicall limit)
    function chunk<T>(arr: T[], size: number): T[][] {
        return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
            arr.slice(i * size, i * size + size)
        );
    }

    // 4. Chunk into batches of 90 (leaving 10 buffer below Starknet's 100 multicall limit)
    const BATCH_SIZE = 90;
    const batches = chunk(eligible, BATCH_SIZE);
    const txHashes: string[] = [];
    let totalPaid = 0;

    for (const batch of batches) {
        // safety guard — should never exceed 90 but double-check before sending
        if (batch.length > BATCH_SIZE) {
            throw new Error(`Batch size ${batch.length} exceeds safe limit of ${BATCH_SIZE}.`);
        }
        // 5. Build recipients list for this batch
        const recipients = batch.map((s: any) => ({
            to: fromAddress(s.merchantId.starknetAddress),
            amount: Amount.parse(s.amount.toFixed(6), USDC),
        }));

        // 6. Send multicall transaction for this batch
        const tx = await wallet
            .tx()
            .transfer(USDC, recipients)
            .send({ feeMode: "user_pays" });

        await tx.wait();
        txHashes.push(tx.hash);

        // 7. Mark this batch as paid in MongoDB
        const batchIds = batch.map((s: any) => s._id);
        await Settlement.updateMany(
            { _id: { $in: batchIds } },
            {
                status: "paid",
                paidAt: new Date(),
                txHash: tx.hash,
            }
        );

        // 8. Update each merchant — reset commissionBalance and set lastSettlementDate
        const batchMerchantIds = batch.map((s: any) => s.merchantId._id);
        await Merchant.updateMany(
            { _id: { $in: batchMerchantIds } },
            {
                commissionBalance: 0,
                lastSettlementDate: new Date(),
            }
        );

        totalPaid += batch.length;
    }
    return {
        message: `Settled ${totalPaid} merchant(s) across ${txHashes.length} transaction(s).`,
        txHashes,
        paid: totalPaid,
        skipped: {
            noWallet:  noWallet.length,   // no Starknet address added
            tooSoon:   tooSoon.length,    // week hasn't passed yet
            belowMin:  belowMin.length,   // commission below 10,000 UGX
        },
    };
}

{/*
    The key changes from the original:

**Three eligibility gates** are checked before any payment goes out — a merchant must pass all three:

    ✅ Has a Starknet wallet address
    ✅ At least 7 days since last settlement (or never settled)
    ✅ commissionBalance >= 10,000 UGX
*/}





