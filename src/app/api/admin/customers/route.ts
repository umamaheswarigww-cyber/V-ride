import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-token";

/**
 * GET /api/admin/customers
 * Returns list of customers with search + filter + sort.
 *
 * Query params:
 *   q         — search by name/email
 *   filter    — all | vitap | non_vitap | recent | most_rides
 *   sort      — last_login | oldest_login | most_rides | name
 *   page      — 1-indexed page (default 1)
 *   pageSize  — items per page (default 50, max 200)
 */
export async function GET(req: NextRequest) {
  if (!(await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const filter = url.searchParams.get("filter") ?? "all";
  const sort = url.searchParams.get("sort") ?? "last_login";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const pageSize = Math.min(200, Math.max(1, Number(url.searchParams.get("pageSize") ?? 50)));

  // Build where clause
  const where: any = {};
  if (q) {
    where.OR = [
      { email: { contains: q } },
      { name: { contains: q } },
    ];
  }
  switch (filter) {
    case "vitap":
      where.isVitApStudent = true;
      break;
    case "non_vitap":
      where.isVitApStudent = false;
      break;
    case "recent":
      // Active in last 24h
      where.lastLoginAt = { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };
      break;
    case "most_rides":
      // Filter handled in sort
      break;
  }

  // Build sort
  let orderBy: any = { lastLoginAt: "desc" };
  switch (sort) {
    case "oldest_login":
      orderBy = { lastLoginAt: "asc" };
      break;
    case "most_rides":
      orderBy = { totalRides: "desc" };
      break;
    case "name":
      orderBy = { name: "asc" };
      break;
  }

  const [customers, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.user.count({ where }),
  ]);

  return NextResponse.json({
    customers: customers.map((c) => ({
      id: c.id,
      googleId: c.googleId,
      email: c.email,
      name: c.name,
      picture: c.picture,
      isVitApStudent: c.isVitApStudent,
      emailVerified: c.emailVerified,
      role: c.role,
      firstLoginAt: c.firstLoginAt,
      lastLoginAt: c.lastLoginAt,
      loginCount: c.loginCount,
      totalRides: c.totalRides,
      completedRides: c.completedRides,
      cancelledRides: c.cancelledRides,
      moneySaved: c.moneySaved,
      co2SavedKg: c.co2SavedKg,
      rating: c.rating,
      ridesJoined: c.ridesJoined,
      ridesOffered: c.ridesOffered,
    })),
    total,
    page,
    pageSize,
  });
}
