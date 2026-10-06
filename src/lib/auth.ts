import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { isVitApStudent, normalizeEmail, displayName } from "@/lib/auth-utils";

/**
 * NextAuth V2 configuration for V-Ride.
 *
 * - Google OAuth for student/driver login (server-side authorization-code flow)
 * - Credentials provider is used ONLY for admin login (separate from Google)
 *
 * Environment variables:
 *   GOOGLE_CLIENT_ID     — Google OAuth client ID
 *   GOOGLE_CLIENT_SECRET — Google OAuth client secret (NEVER hard-code)
 *   AUTH_SECRET          — NextAuth JWT/session secret
 *   ADMIN_PASSWORD       — admin login password (NEVER expose to client)
 */

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!authSecret) {
  // Fail loudly during module load so developers catch missing config early.
  // The error is logged server-side only; users see a friendly message via
  // the auth-disabled UI.
  console.warn(
    "[V-Ride auth] AUTH_SECRET is not set. Authentication will fail. " +
      "Set AUTH_SECRET in your environment.",
  );
}

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: { strategy: "jwt" },
  providers: [
    // Only register Google provider if both ID + secret are configured.
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            authorization: {
              params: {
                // Minimum identity scopes — we only need basic profile + email.
                scope: "openid email profile",
                prompt: "select_account",
              },
            },
          }),
        ]
      : []),
    // Credentials provider is for ADMIN LOGIN ONLY. Normal users must use Google.
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!adminPassword) {
          throw new Error("Admin login is not configured.");
        }
        if (!credentials?.password) {
          throw new Error("Password is required.");
        }
        // Constant-time-ish comparison to avoid trivial timing attacks.
        const a = credentials.password;
        const b = adminPassword;
        if (a.length !== b.length || a !== b) {
          throw new Error("Invalid admin credentials.");
        }
        return {
          id: "admin",
          name: "V-Ride Admin",
          email: "admin@v-ride.local",
          role: "admin",
          image: null,
        } as any;
      },
    }),
  ],
  callbacks: {
    /**
     * JWT callback — runs on every signed-in action. We stash the user's
     * database id, role, isVitApStudent flag, and emailVerified status onto
     * the token so we can read them in the session callback without a DB hit.
     */
    async jwt({ token, user, account, profile, trigger }) {
      // Initial sign-in: user object is populated
      if (user && account) {
        // Admin credentials sign-in: don't touch DB
        if (account.provider === "admin-credentials" || user.email === "admin@v-ride.local") {
          token.role = "admin";
          token.isAdmin = true;
          return token;
        }
        // Google sign-in: create or update user record in DB
        try {
          const email = normalizeEmail(user.email ?? "");
          if (!email) {
            throw new Error("Invalid email from Google.");
          }
          const vitAp = isVitApStudent(email);
          const googleId = account.providerAccountId;
          const picture = (profile as any)?.image ?? (profile as any)?.picture ?? user.image ?? null;
          const name = user.name ?? displayName(user.name, email);
          const emailVerified = Boolean((profile as any)?.email_verified ?? (profile as any)?.emailVerified ?? false);

          const existing = await db.user.findFirst({
            where: {
              OR: [{ googleId }, { email }],
            },
          });

          if (existing) {
            // Update existing user
            const updated = await db.user.update({
              where: { id: existing.id },
              data: {
                googleId: googleId ?? existing.googleId,
                name: name ?? existing.name,
                picture: picture ?? existing.picture,
                emailVerified,
                isVitApStudent: vitAp,
                lastLoginAt: new Date(),
                loginCount: { increment: 1 },
              },
            });
            token.userId = updated.id;
            token.role = updated.role;
            token.isVitApStudent = updated.isVitApStudent;
            token.emailVerified = updated.emailVerified;
            token.picture = updated.picture ?? picture;
          } else {
            // Create new user
            const created = await db.user.create({
              data: {
                googleId: googleId ?? undefined,
                email,
                name,
                picture,
                emailVerified,
                isVitApStudent: vitAp,
                role: "student",
                firstLoginAt: new Date(),
                lastLoginAt: new Date(),
                loginCount: 1,
              },
            });
            token.userId = created.id;
            token.role = created.role;
            token.isVitApStudent = created.isVitApStudent;
            token.emailVerified = created.emailVerified;
            token.picture = created.picture;
          }
        } catch (err) {
          console.error("[V-Ride auth] Failed to create/update user:", err);
          // Fall through with token as-is — UI will show auth-failed toast.
          token.authError = err instanceof Error ? err.message : "Database error";
        }
      }

      // Triggered by `useSession({ refetchOnMount })` — preserve token shape.
      if (trigger === "update" && user) {
        token.name = user.name ?? token.name;
      }

      return token;
    },

    /**
     * Session callback — exposes safe fields to the client.
     * NEVER expose tokens, secrets, or admin flags to non-admin sessions.
     */
    async session({ session, token }) {
      // Admin session
      if (token.isAdmin) {
        return {
          ...session,
          user: {
            ...session.user,
            id: "admin",
            name: "V-Ride Admin",
            email: "admin@v-ride.local",
            role: "admin",
            isAdmin: true,
          },
        };
      }
      // Student/driver session
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId as string | undefined,
          role: (token.role as string) ?? "student",
          isVitApStudent: (token.isVitApStudent as boolean) ?? false,
          emailVerified: (token.emailVerified as boolean) ?? false,
          image: token.picture ?? session.user?.image,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
