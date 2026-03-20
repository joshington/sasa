


// app/lib/adminAuth.ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

export async function verifyAdminRequest(): Promise<boolean> {
  try {
    const cookieStore = await  cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) return false;

    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}