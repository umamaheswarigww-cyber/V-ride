"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CarFront, Eye, EyeOff, Lock, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const resp = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error ?? "Login failed");
        setBusy(false);
        return;
      }
      toast({
        title: "Admin login successful",
        description: "Welcome to the V-Ride admin dashboard.",
      });
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute inset-0 grid-bg-dark opacity-40" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-lime/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 py-10">
        <button
          onClick={() => router.push("/")}
          className="absolute left-5 top-5 inline-flex items-center gap-2 text-xs font-medium text-ink-300 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to V-Ride
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-lime ring-1 ring-white/15">
            <CarFront className="h-4 w-4" /> V-Ride Admin
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl text-balance">
            Admin <span className="gradient-text-dark">Console</span>
          </h1>
          <p className="mt-2 text-sm text-ink-300">
            Restricted area. Enter the administrator password to continue.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-8 w-full rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur sm:p-7"
        >
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-300">
            <Lock className="h-3 w-3" /> Admin password
          </label>
          <div className="relative mt-2">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              required
              className="w-full rounded-2xl border border-white/10 bg-ink-950 px-4 py-3 pr-12 text-sm text-white placeholder:text-ink-500 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-lg text-ink-400 hover:bg-white/10 hover:text-white"
              aria-label="Toggle password visibility"
            >
              {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>

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

          <button
            type="submit"
            disabled={busy || !password}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-lime px-5 py-3 text-sm font-bold text-ink-900 transition-all hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Authenticating…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Enter admin dashboard
              </>
            )}
          </button>
        </motion.form>

        <p className="mt-6 text-center text-[11px] text-ink-400">
          Admin authentication is server-side. Access is logged.
        </p>
      </div>
    </main>
  );
}
