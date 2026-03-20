

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

const isDev = process.env.NODE_ENV === "development";

function isAdminHost(req: NextRequest): boolean {
  const host = req.headers.get("host") ?? "";

  if (!isDev) {
    // Production: only admin.pesasa.xyz is the admin host
    return host === "admin.pesasa.xyz";
  }

  // Development: treat localhost:3000 as admin if path starts with /admin
  // OR if using admin.localhost:3000 (if you set up /etc/hosts)
  return (
    host.startsWith("admin.localhost") ||
    host === "admin.localhost:3000"
  );
}

export async function middleware(req: NextRequest) {
  //const host = req.headers.get("host") ?? "";
  const pathname = req.nextUrl.pathname;
  const adminHost = isAdminHost(req);

   // ── Static assets — always skip ──────────────────────────────────────────
  const staticPaths = ["/_next", "/favicon.ico", "/pesasa-logo.png", "/public"];
  if (staticPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN HOST (admin.pesasa.xyz in prod / admin.localhost:3000 in dev)
  // ═══════════════════════════════════════════════════════════════════════════
  if (adminHost) {
    // In production: if path doesn't start with /admin, block it
    // Prevents admin.pesasa.xyz/merchant/signin etc.
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
      return NextResponse.rewrite(new URL("/not-found", req.url));
    }
    // Public admin routes — no auth needed
    const publicAdminPaths = [
      "/admin/signin",
      "/admin/signup",
      "/api/admin/login",
      "/api/admin/logout",
    ];
    if (publicAdminPaths.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }
    // API routes handle their own auth via cookie/session check
    if (pathname.startsWith("/api/admin")) return NextResponse.next();

     // All other /admin/* routes — require admin JWT cookie
    const adminToken = req.cookies.get("admin-token")?.value;

    if (!adminToken) {
      const signInUrl = new URL("/admin/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    try {
      const { payload } = await jwtVerify(adminToken, secret);
      if (payload.role !== "admin") throw new Error("Not admin");
      return NextResponse.next();
    } catch {
      // Token invalid or expired
      const signInUrl = new URL("/admin/signin", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN HOST (pesasa.xyz in prod / localhost:3000 in dev)
  // 

  // In dev, localhost:3000/admin/* still needs to work since we
  // don't have admin.localhost set up by default — allow it through
  if (isDev && pathname.startsWith("/admin")) {
    // Same auth logic as admin host above
    const publicAdminPaths = [
      "/admin/signin",
      "/admin/signup",
      "/api/admin/login",
      "/api/admin/logout",
    ];
    if (publicAdminPaths.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }
    if (pathname.startsWith("/api/admin")) return NextResponse.next();
    const adminToken = req.cookies.get("admin-token")?.value;
    if (!adminToken) {
      const signInUrl = new URL("/admin/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    try {
      const { payload } = await jwtVerify(adminToken, secret);
      if (payload.role !== "admin") throw new Error("Not admin");
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/signin", req.url));
    }
  }

  // Block /admin/* on main domain in production
  if (!isDev && (pathname.startsWith("/admin") || pathname.startsWith("/api/admin"))) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }
  return NextResponse.next();

  // ── Subdomain detection ──────────────────────────────────────────────────
  // In production: admin.pesasa.xyz → rewrite to /admin/*
  // In dev: use ?subdomain=admin or localhost:3000/admin directly
  //const isAdminSubdomain =
    //host.startsWith("admin.") ||
  //  host === "admin.pesasa.xyz" ||
  //  (process.env.NODE_ENV === "development" && pathname.startsWith("/admin"));

  //if (!isAdminSubdomain) return NextResponse.next();
  //if (isAdminSubdomain) {
   // if(!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
  //    return NextResponse.rewrite(new URL("/not-found", req.url));
  //  }

    // ── Public admin routes (no auth needed) ────────────────────────────────
  //  const publicPaths = ["/admin/signin", "/admin/signup", "/api/admin/login"];
  //  if (publicPaths.some((p) => pathname.startsWith(p))) {
  //    return NextResponse.next();
  //  }
    
    // API routes: let them self-authenticate via getServerSession
   /// if (pathname.startsWith("/api/admin")) return NextResponse.next();
    // ✅ Check our custom admin cookie instead of NextAuth token
   // const adminToken = req.cookies.get("admin-token")?.value;
  //  if (!adminToken) {
  //    return NextResponse.redirect(new URL("/admin/signin", req.url));
  //  }
   // try {
  //    const { payload } = await jwtVerify(adminToken, secret);
   //   if (payload.role !== "admin") throw new Error("Not admin");
  //    return NextResponse.next();
   // } catch {
   //   return NextResponse.redirect(new URL("/admin/signin", req.url));
   // }
  //}
  
  // Block admin routes on main domain
  //if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
  //  return NextResponse.rewrite(new URL("/not-found", req.url));
  //}
  //return NextResponse.next();

  

  // ── Require admin session for all other /admin/* routes ─────────────────
  //const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  //if (!token || token.role !== "admin") {
   // const signInUrl = new URL("/admin/signin", req.url);
  //  signInUrl.searchParams.set("callbackUrl", pathname);
  //  return NextResponse.redirect(signInUrl);
  //}

  //return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|pesasa-logo.png).*)"],
};