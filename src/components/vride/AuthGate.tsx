"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { useCurrentUser, type CurrentUser } from "@/hooks/use-current-user";

// Routes that require authentication. All others (home, how, safety, about,
// and the static informational views) remain public per the user's spec.
const PROTECTED: Route["name"][] = [
  "dashboard",
  "find", // joining a ride requires auth
  "offer",
  "history",
  "profile",
  "chat",
  "live",
  "confirm",
];

export type AuthGateProps = {
  route: Route;
  navigate: (r: Route) => void;
  children: (user: CurrentUser | null) => React.ReactNode;
};

/**
 * Wraps view rendering. If the route is protected and the user is logged
 * out, redirects to /login?callbackUrl=<current-hash>. Otherwise renders
 * the children with the current user (may be null for public views).
 */
export function AuthGate({ route, navigate, children }: AuthGateProps) {
  const { user, loading } = useCurrentUser();
  const redirectedRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;
    const isProtected = PROTECTED.includes(route.name);
    if (isProtected && !user) {
      // Avoid redirect loops — only redirect once per route+user-state combo.
      const key = `${route.name}:${user?.id ?? "anon"}`;
      if (redirectedRef.current === key) return;
      redirectedRef.current = key;
      const callbackUrl = window.location.href.replace(window.location.origin, "");
      window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    }
    if (user) {
      redirectedRef.current = null;
    }
  }, [route, user, loading]);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 text-ink-500"
        >
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-xs">Loading your session…</span>
        </motion.div>
      </div>
    );
  }

  return <>{children(user)}</>;
}

/**
 * Logout button — calls NextAuth signOut then redirects to /login.
 */
export function LogoutButton({
  className,
  label = "Logout",
}: {
  className?: string;
  label?: string;
}) {
  const handleLogout = async () => {
    // NextAuth v4 client: POST to /api/auth/signout with csrf token
    try {
      const csrfResp = await fetch("/api/auth/csrf");
      const { csrfToken } = await csrfResp.json();
      const body = new URLSearchParams();
      body.set("csrfToken", csrfToken);
      body.set("callbackUrl", "/login");
      await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
    } catch {
      // ignore
    }
    window.location.href = "/login";
  };

  return (
    <button onClick={handleLogout} className={className}>
      <Lock className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
