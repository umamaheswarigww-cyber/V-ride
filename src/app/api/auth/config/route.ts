import { NextResponse } from "next/server";

/**
 * GET /api/auth/config
 * Returns whether Google OAuth is configured + the Google client ID.
 * Safe to expose — these are non-secret values shown on the login page.
 */
export async function GET() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  return NextResponse.json({
    googleConfigured: Boolean(googleClientId && googleClientSecret),
    googleClientId: googleClientId ?? null,
    authSecretConfigured: Boolean(authSecret),
    adminConfigured: Boolean(process.env.ADMIN_PASSWORD),
  });
}
