
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import dbConnect from "@/app/utils/dbConnect";
import Merchant from "@/app/models/Merchant";
import { MerchantDoc } from "@/app/models/Merchant";

/**
 * Returns the full Merchant document for the currently signed-in merchant,
 * or null if not authenticated / not a merchant account.
 *
 * Usage in any merchant API route:
 *   const merchant = await getMerchantSession();
 *   if (!merchant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 */
export async function getMerchantSession(): Promise<MerchantDoc | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  await dbConnect();
  const merchant = await Merchant.findOne({ email: session.user.email });
  return merchant ?? null;
}