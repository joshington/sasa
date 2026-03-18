import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/utils/dbConnect";
import Parent from "@/app/models/Parent";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pin, confirmPin } = await req.json();

    // ── Validation ────────────────────────────────────────────────────────────
    if (!pin || !confirmPin) {
      return NextResponse.json(
        { error: "PIN and confirmation are required" },
        { status: 400 }
      );
    }

    if (pin !== confirmPin) {
      return NextResponse.json(
        { error: "PINs do not match" },
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: "PIN must be exactly 4 digits" },
        { status: 400 }
      );
    }

    // Block trivially weak PINs
    const weakPins = ["0000", "1111", "2222", "3333", "4444",
                      "5555", "6666", "7777", "8888", "9999", "1234", "4321"];
    if (weakPins.includes(pin)) {
      return NextResponse.json(
        { error: "PIN is too simple. Choose a stronger PIN." },
        { status: 400 }
      );
    }

    // ── Hash and save ─────────────────────────────────────────────────────────
    const hashedPin = await bcrypt.hash(pin, 12);

    const parent = await Parent.findOneAndUpdate(
      { email: session.user.email },
      { pin: hashedPin },
      { new: true }
    );

    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "PIN set successfully" });
  } catch (error) {
    console.error("set-pin error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}