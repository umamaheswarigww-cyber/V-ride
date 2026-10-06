import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/me
 * Returns the currently authenticated user's profile (or 401 if logged out).
 *
 * Safe to call from client — only exposes non-sensitive fields.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // For admin session, return admin-only object
  if ((session.user as any).isAdmin) {
    return NextResponse.json({
      user: {
        id: "admin",
        name: "V-Ride Admin",
        email: "admin@v-ride.local",
        picture: null,
        role: "admin",
        isAdmin: true,
        isVitApStudent: false,
        emailVerified: true,
      },
    });
  }

  // For Google users, look up the latest DB record for fresh stats
  const userId = (session.user as any).id;
  let dbUser: Awaited<ReturnType<typeof db.user.findUnique>> = null;
  if (userId) {
    try {
      dbUser = await db.user.findUnique({ where: { id: userId } });
    } catch {
      // ignore DB errors — fall back to session data
    }
  }

  return NextResponse.json({
    user: {
      id: dbUser?.id ?? userId,
      name: dbUser?.name ?? session.user.name,
      email: dbUser?.email ?? session.user.email,
      picture: dbUser?.picture ?? session.user.image,
      role: dbUser?.role ?? (session.user as any).role,
      isAdmin: false,
      isVitApStudent: dbUser?.isVitApStudent ?? (session.user as any).isVitApStudent,
      emailVerified: dbUser?.emailVerified ?? (session.user as any).emailVerified,
      rating: dbUser?.rating ?? 4.9,
      totalRides: dbUser?.totalRides ?? 0,
      completedRides: dbUser?.completedRides ?? 0,
      cancelledRides: dbUser?.cancelledRides ?? 0,
      moneySaved: dbUser?.moneySaved ?? 0,
      co2SavedKg: dbUser?.co2SavedKg ?? 0,
      loginCount: dbUser?.loginCount ?? 1,
      lastLoginAt: dbUser?.lastLoginAt ?? null,
      firstLoginAt: dbUser?.firstLoginAt ?? null,
    },
  });
}
