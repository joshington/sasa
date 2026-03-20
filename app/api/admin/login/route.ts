
import {NextRequest, NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import {SignJWT}  from "jose";
import dbConnect from "@/app/utils/dbConnect";
import Admin from "@/app/models/Admin";


const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

export async function POST(req: NextRequest) {
    const {email, password} = await req.json();

    if(!email || !password) {
        return NextResponse.json({ error: "Email and password required." },{ status: 400 });
    }
    await dbConnect();
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if(!admin){
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    // Create a JWT manually — same secret as NextAuth uses
    const token = await new SignJWT({
        id: admin._id.toString(),
        email: admin.email,
        role: "admin",
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
    // Set it as an httpOnly cookie
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
    return response;

}