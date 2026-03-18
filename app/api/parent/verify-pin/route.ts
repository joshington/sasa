

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/utils/dbConnect";
import Parent from "@/app/models/Parent";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Simple in-memory rate limiter (per email, resets on server restart)
// For production: replace with Redis + sliding window
const attempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000; // 15 minutes

function isLockedOut(email: string): boolean {
  const record = attempts.get(email);
  if (!record) return false;

  const elapsed = Date.now() - record.lastAttempt;

  // Reset after lockout period
  if (elapsed > LOCKOUT_MS) {
    attempts.delete(email);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordAttempt(email: string, success: boolean) {
  if (success) {
    attempts.delete(email); // clear on success
    return;
  }
  const record = attempts.get(email) ?? { count: 0, lastAttempt: 0 };
  attempts.set(email, { count: record.count + 1, lastAttempt: Date.now() });
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;

    // ── Rate limit check ──────────────────────────────────────────────────────
    if (isLockedOut(email)) {
      return NextResponse.json(
        { error: "Too many failed attempts. Try again in 15 minutes." },
        { status: 429 }
      );
    }

    const { pin } = await req.json();
    if (!pin) {
      return NextResponse.json({ error: "PIN is required" }, { status: 400 });
    }

    // ── Fetch parent with PIN ─────────────────────────────────────────────────
    const parent = await Parent.findOne({ email }).select("+pin");
    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    if (!parent.pin) {
      return NextResponse.json(
        { error: "No PIN set. Please set a PIN first." },
        { status: 400 }
      );
    }

    // ── Compare ───────────────────────────────────────────────────────────────
    const isValid = await bcrypt.compare(pin, parent.pin);

    if (!isValid) {
      recordAttempt(email, false);
      const record = attempts.get(email);
      const remaining = MAX_ATTEMPTS - (record?.count ?? 0);
      return NextResponse.json(
        { error: `Incorrect PIN. ${remaining} attempt(s) remaining.` },
        { status: 401 }
      );
    }

    recordAttempt(email, true);
    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("verify-pin error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}