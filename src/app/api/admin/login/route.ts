import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createAdminToken,
  ADMIN_COOKIE,
  ADMIN_COOKIE_TTL,
} from "@/lib/admin-token";

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD ?? null;
}

/**
 * POST /api/admin/login
 * Body: { password: string }
 * Sets an HttpOnly admin session cookie on success.
 */
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { password } = body;
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    return NextResponse.json(
      {
        error:
          "Admin login is not configured. Set ADMIN_PASSWORD environment variable.",
      },
      { status: 503 },
    );
  }

  // Constant-time-ish comparison
  const a = password;
  const b = adminPassword;
  if (a.length !== b.length || a !== b) {
    return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
  }

  const token = await createAdminToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_TTL / 1000,
  });

  return NextResponse.json({ ok: true, message: "Admin login successful" });
}

/**
 * DELETE /api/admin/login — clears the admin cookie.
 */
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}

/**
 * Server-side helper for server components to check admin status.
 */
export async function isServerAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const { verifyAdminToken } = await import("@/lib/admin-token");
  return verifyAdminToken(token);
}
