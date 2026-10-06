"use client";

import { useEffect, useState, useCallback } from "react";

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string;
  picture: string | null;
  role: string; // "student" | "driver" | "admin"
  isAdmin: boolean;
  isVitApStudent: boolean;
  emailVerified: boolean;
  rating: number;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  moneySaved: number;
  co2SavedKg: number;
  loginCount: number;
  lastLoginAt: string | null;
  firstLoginAt: string | null;
};

/**
 * Client hook to read the currently authenticated user.
 * Calls /api/me (server-side session check, no secrets exposed).
 *
 * Returns { user: null, loading: true } during SSR / initial mount.
 * Re-fetches on window focus so logout in another tab is picked up.
 */
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const resp = await fetch("/api/me", { cache: "no-store" });
      if (!resp.ok) {
        setUser(null);
        return;
      }
      const data = await resp.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const doFetch = async () => {
      try {
        const resp = await fetch("/api/me", { cache: "no-store" });
        if (cancelled) return;
        if (!resp.ok) {
          setUser(null);
          return;
        }
        const data = await resp.json();
        if (cancelled) return;
        setUser(data.user ?? null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    doFetch();
    const onFocus = () => doFetch();
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return { user, loading, refresh };
}
