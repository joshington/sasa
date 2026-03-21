


// app/lib/authOptions.ts
// authOptions lives here — NOT in the route file.
// This breaks the circular import chain:
//   merchantAuth → [...nextauth]/route → merchantAuth (CIRCULAR)
// Now:
//   merchantAuth → lib/authOptions (SAFE)
//   [...nextauth]/route → lib/authOptions (SAFE)

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/utils/dbConnect";
import Parent from "@/app/models/Parent";
import Merchant from "@/app/models/Merchant";
import Wallet from "@/app/models/Wallet";

export const authOptions: NextAuthOptions = {
  providers: [
    // ── Parents: Google OAuth ─────────────────────────────────────────────────
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Merchants: Email + Password ───────────────────────────────────────────
    CredentialsProvider({
      id:   "merchant-credentials",
      name: "Merchant",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[merchant-credentials] authorize called", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        await dbConnect();
        console.log("[merchant-credentials] db connected");

        const merchant = await Merchant.findOne({
          email: credentials.email.toLowerCase(),
        });
        console.log("[merchant-credentials] merchant found:", merchant?.status);

        if (!merchant) {
          throw new Error("No account found with this email.");
        }

        if (merchant.status === "pending") {
          throw new Error(
            "Account not activated. Please check your email for the activation link."
          );
        }

        if (merchant.status === "suspended") {
          throw new Error("Your account has been suspended. Contact support.");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          merchant.password
        );

        if (!passwordMatch) {
          throw new Error("Incorrect password.");
        }

        return {
          id:    merchant._id.toString(),
          email: merchant.email,
          name:  merchant.institute,
          role:  "merchant",
        };
      },
    }),
  ],

  callbacks: {
    // ── JWT ───────────────────────────────────────────────────────────────────
    async jwt({ token, account, user }) {
      // Google sign-in — preserve your original providerAccountId logic
      if (account) token.sub = account.providerAccountId;

      // Merchant credentials sign-in — tag the token with role + id
      if (user && (user as { role?: string }).role === "merchant") {
        token.role = "merchant";
        token.merchantId = user.id;
      }

      return token;
    },

    // ── Session ───────────────────────────────────────────────────────────────
    async session({ session, token }) {
      // Your original logic
      if (session.user && token.sub) {
        session.user.id = token.sub as string;
      }

      // Expose merchant role to the session so the UI can route correctly
      if (token.role === "merchant") {
        (session.user as { role?: string; id?: string }).role = "merchant";
        (session.user as { role?: string; id?: string }).id =
          token.merchantId as string;
      }

      return session;
    },

    // ── signIn ────────────────────────────────────────────────────────────────
    async signIn({ user, account }) {
      // Merchant credentials flow is fully handled in authorize() above.
      // Nothing extra needed here for merchants.
      if (account?.provider === "merchant-credentials") return true;

      // ── Google (parent) flow — your original logic, unchanged ────────────
      await dbConnect();
      if (!user.email) return false;

      const googleId = account?.providerAccountId;
      if (!googleId) {
        console.error("[signIn] Missing providerAccountId");
        return false;
      }
      
      //no merchant check - same email can be both for merchant and parent

      // New or returning parent — your original logic
      //looking by email rather than googleId is the right approach because email is the
      //stable identifier - Google's providerAccountId can theoretically chnage
      //if you recreate your OAuth app, but the email stays the same
      const existingParent = await Parent.findOne({ email: user.email });
      //==case for exisiting parent
      if (existingParent) {
        //always update googleId in case it changed - never try to recreate
        if (existingParent.googleId !== googleId) {
          await Parent.findByIdAndUpdate(existingParent._id, { googleId });
        }
        return true;
      }
      if (!existingParent) {
        try {
          const parent = await Parent.create({
            googleId,
            username: user.name || "Parent",
            email:    user.email,
          });
          await Wallet.create({ parentId: parent._id, balance: 0 });
        } catch (err: any) {
          if (err.code === 11000) return true; // race condition, already exists
          console.error("[signIn] Parent creation failed:", err);
          return false;
        }
        
      }

      return true;
    },

    // ── Redirect — your original logic, unchanged ─────────────────────────────
    async redirect({ url, baseUrl }) {
      if (url.includes("/merchant")) return `${baseUrl}/merchant/dashboard`;
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/parent/dashboard`;
    },
  },

  pages: {
    signIn: "/auth/signin",   // your original parent sign-in page
  },

  session: {
    strategy: "jwt",
  },
};