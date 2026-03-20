

// app/api/admin/settlements/batch/route.ts
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/app/lib/adminAuth";
import { runBatchSettlement } from "@/app/lib/settlement";

export async function POST() {
  const isAdmin = await verifyAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runBatchSettlement();
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[batch-settlement]", err);
    return NextResponse.json(
      { error: err.message ?? "Batch settlement failed." },
      { status: 500 }
    );
  }
}