import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-token";

/**
 * V-Ride middleware — protects authenticated + admin routes.
 *
 * Public paths: /, /login, /api/auth/*, /api/admin/login (POST/DELETE)
 * Admin-required: /admin/*, /api/admin/*
 * Auth-required (SPA views): client-side gate via useCurrentUser hook
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin route protection ────────────────────────────────────────────
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // Allow /api/admin/login POST (login) and DELETE (logout)
    if (pathname === "/api/admin/login" && (req.method === "POST" || req.method === "DELETE")) {
      return NextResponse.next();
    }
    // Allow /admin/login page itself (no auth required to view it)
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    // All other admin routes require a valid admin cookie
    const adminCookie = req.cookies.get(ADMIN_COOKIE)?.value;
    const ok = await verifyAdminToken(adminCookie);
    if (!ok) {
      // API routes → 401 JSON; pages → redirect to /admin/login
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // ── Auth-required API routes ─────────────────────────────────────────
  // /api/me is handled by the route itself (returns 401 if no session).
  // /api/auth/* is public (NextAuth needs to be reachable).
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
