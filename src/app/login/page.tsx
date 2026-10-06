"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CarFront,
  ShieldCheck,
  Lock,
  Loader2,
  Users,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <LoginInner />
    </Suspense>
  );
}

function LoadingShell() {
  return (
    <div className="min-h-screen grid place-items-center bg-ink-50">
      <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
    </div>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const [role, setRole] = useState<"student" | "driver">("student");
  const [busy, setBusy] = useState(false);
  const [authConfigured, setAuthConfigured] = useState<boolean | null>(null);
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      // Check if Google OAuth is configured server-side
      const cfgResp = await fetch("/api/auth/config", { cache: "no-store" });
      const cfg = await cfgResp.json();
      setAuthConfigured(Boolean(cfg.googleConfigured));
      if (!cfg.googleConfigured) {
        setError(
          "Google authentication is not fully configured. Set GOOGLE_CLIENT_SECRET and AUTH_SECRET environment variables to enable Google login. Use Admin login to test the dashboard.",
        );
        setBusy(false);
        return;
      }
      // Store the selected role in a cookie so the JWT callback can read it
      document.cookie = `vride_signup_role=${role}; path=/; max-age=600; SameSite=Lax`;
      // Redirect to NextAuth Google sign-in
      const signInUrl = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      window.location.href = signInUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-50">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 grid-bg-light opacity-60" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-lime/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 py-10">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-2xl bg-ink-900 px-3 py-1.5 text-xs font-semibold text-lime shadow-sm">
            <CarFront className="h-4 w-4" /> V-Ride
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl text-balance">
            Welcome to <span className="gradient-text">V-Ride</span>
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Ride together. Pay less. Sign in with your VIT-AP account to start sharing rides.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 w-full vride-card p-6 sm:p-7 shadow-lg"
        >
          {/* Role selection */}
          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              I am signing up as a
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <RoleOption
                active={role === "student"}
                onClick={() => setRole("student")}
                icon={Users}
                label="Student Customer"
                description="Find rides"
              />
              <RoleOption
                active={role === "driver"}
                onClick={() => setRole("driver")}
                icon={CarFront}
                label="Driver"
                description="Offer rides"
              />
            </div>
          </div>

          {/* Google login button */}
          <button
            onClick={handleGoogleLogin}
            disabled={busy} 
            className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 shadow-sm ring-1 ring-ink-200 transition-all hover:ring-ink-300 hover:bg-ink-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>{busy ? "Connecting…" : "Continue with Google"}</span>
          </button>

          {/* VIT-AP badge hint */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-500">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
            <span>
              VIT-AP badge unlocks for <code className="rounded bg-ink-100 px-1 py-0.5 text-ink-700">@vitapstudent.ac.in</code> emails
            </span>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 flex items-start gap-2 rounded-2xl border border-coral/30 bg-coral/10 p-3 text-xs text-coral"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-ink-400">
            <span className="h-px flex-1 bg-ink-200" />
            <span>or</span>
            <span className="h-px flex-1 bg-ink-200" />
          </div>

          {/* Admin link */}
          <button
            onClick={() => router.push("/admin/login")}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-ink-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-ink-800"
          >
            <Lock className="h-3.5 w-3.5" />
            Admin login
          </button>

          {/* Demo fallback */}
          {authConfigured === false && (
            <div className="mt-4 rounded-2xl border border-dashed border-ink-300 bg-ink-50/60 p-3 text-center text-[11px] text-ink-500">
              <strong className="text-ink-700">Demo mode:</strong> Google login requires
              <code className="mx-1 rounded bg-ink-100 px-1 py-0.5">GOOGLE_CLIENT_SECRET</code> to be set. Use Admin login to test the dashboard.
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-ink-400">
          By signing in you agree to V-Ride&apos;s community guidelines.
          <br />
          This is a pitch prototype — no real payments are processed.
        </p>
      </div>
    </main>
  );
}

function RoleOption({
  active,
  onClick,
  icon: Icon,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`relative rounded-2xl border p-3 text-left transition-all ${
        active
          ? "border-brand-400 bg-brand-50/60 ring-2 ring-brand-200"
          : "border-ink-200 bg-white hover:border-ink-300"
      }`}
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-xl ${
          active ? "bg-brand-500 text-white" : "bg-ink-100 text-ink-700"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="mt-1.5 text-xs font-bold text-ink-900">{label}</div>
      <div className="text-[10px] text-ink-500">{description}</div>
    </motion.button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
