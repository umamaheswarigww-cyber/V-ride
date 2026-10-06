import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-token";

/**
 * GET /api/admin/customer/[id]
 * Returns full customer details.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const customer = await db.user.findUnique({ where: { id } });
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }
  return NextResponse.json({
    id: customer.id,
    googleId: customer.googleId,
    email: customer.email,
    name: customer.name,
    picture: customer.picture,
    isVitApStudent: customer.isVitApStudent,
    emailVerified: customer.emailVerified,
    role: customer.role,
    firstLoginAt: customer.firstLoginAt,
    lastLoginAt: customer.lastLoginAt,
    loginCount: customer.loginCount,
    totalRides: customer.totalRides,
    completedRides: customer.completedRides,
    cancelledRides: customer.cancelledRides,
    moneySaved: customer.moneySaved,
    co2SavedKg: customer.co2SavedKg,
    rating: customer.rating,
    ridesJoined: customer.ridesJoined,
    ridesOffered: customer.ridesOffered,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
  });
}
