

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/utils/dbConnect";
import Parent from "@/app/models/Parent";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Reuse the same weak PIN blocklist from set-pin
const WEAK_PINS = [
  "0000","1111","2222","3333","4444",
  "5555","6666","7777","8888","9999",
  "1234","4321","1122","1212",
];

// Simple in-memory rate limiter — same pattern as verify-pin
const attempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000; // 15 minutes

function isLockedOut(email: string): boolean {
  const record = attempts.get(email);
  if (!record) return false;
  if (Date.now() - record.lastAttempt > LOCKOUT_MS) {
    attempts.delete(email);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailure(email: string) {
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

    // ── Rate limit ────────────────────────────────────────────────────────────
    if (isLockedOut(email)) {
      return NextResponse.json(
        { error: "Too many failed attempts. Try again in 15 minutes." },
        { status: 429 }
      );
    }

    const { currentPin, newPin, confirmNewPin } = await req.json();

    // ── Input validation ──────────────────────────────────────────────────────
    if (!currentPin || !newPin || !confirmNewPin) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(newPin)) {
      return NextResponse.json(
        { error: "New PIN must be exactly 4 digits" },
        { status: 400 }
      );
    }

    if (newPin !== confirmNewPin) {
      return NextResponse.json(
        { error: "New PINs do not match" },
        { status: 400 }
      );
    }

    if (WEAK_PINS.includes(newPin)) {
      return NextResponse.json(
        { error: "PIN is too simple. Choose a stronger PIN." },
        { status: 400 }
      );
    }

    // ── Fetch parent ──────────────────────────────────────────────────────────
    const parent = await Parent.findOne({ email }).select("+pin");
    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    if (!parent.pin) {
      return NextResponse.json(
        { error: "No PIN set yet. Please set a PIN first." },
        { status: 400 }
      );
    }

    // ── Verify current PIN ────────────────────────────────────────────────────
    const isCurrentValid = await bcrypt.compare(currentPin, parent.pin);
    if (!isCurrentValid) {
      recordFailure(email);
      const record    = attempts.get(email);
      const remaining = MAX_ATTEMPTS - (record?.count ?? 0);
      return NextResponse.json(
        { error: `Current PIN is incorrect. ${remaining} attempt(s) remaining.` },
        { status: 401 }
      );
    }

    // ── Block reuse of same PIN ───────────────────────────────────────────────
    const isSamePin = await bcrypt.compare(newPin, parent.pin);
    if (isSamePin) {
      return NextResponse.json(
        { error: "New PIN must be different from your current PIN." },
        { status: 400 }
      );
    }

    // ── Hash and save new PIN ─────────────────────────────────────────────────
    const hashedPin = await bcrypt.hash(newPin, 12);
    await Parent.findOneAndUpdate({ email }, { pin: hashedPin });

    // Clear any failed attempts on success
    attempts.delete(email);

    return NextResponse.json({ message: "PIN changed successfully" });
  } catch (error) {
    console.error("change-pin error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}