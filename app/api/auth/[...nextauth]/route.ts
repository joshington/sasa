

// app/api/auth/[...nextauth]/route.ts
// Keep this file thin — just wire NextAuth to the handler.
// authOptions lives in app/lib/authOptions.ts to avoid circular imports.

import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Re-export authOptions so any existing imports of
// "@/app/api/auth/[...nextauth]/route" still work during migration
export { authOptions };