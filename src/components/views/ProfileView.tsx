"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Leaf,
  LogOut,
  MapPin,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { SAVED_LOCATIONS, VEHICLES } from "@/lib/mock";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/vride/Badge";
import { EmptyState } from "@/components/vride/EmptyState";
import { LoadingSkeleton } from "@/components/vride/EmptyState";
import { staggerContainer, motionPresets } from "@/lib/motion";

export function ProfileView({ navigate }: { navigate: (r: Route) => void }) {
  const { user, loading, refresh } = useCurrentUser();
  const { toast } = useToast();

  const handleLogout = async () => {
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
    toast({ title: "Logged out successfully", description: "See you soon!" });
    await refresh();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="container-page py-10 sm:py-12 max-w-4xl">
        <LoadingSkeleton label="Loading your profile…" rows={4} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={ShieldCheck}
          title="Please sign in"
          description="You need to be logged in to view your V-Ride profile."
          actions={
            <a href="/login" className="vride-btn-brand text-xs h-9 inline-flex">
              Go to login
            </a>
          }
        />
      </div>
    );
  }

  // For admin viewing their own "profile" — admins don't have ride stats
  if (user.isAdmin) {
    return (
      <div className="container-page py-20 max-w-2xl text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-brand-600" />
        <h1 className="mt-4 text-2xl font-bold text-ink-900">V-Ride Admin</h1>
        <p className="mt-2 text-sm text-ink-500">
          You are signed in as an administrator. Visit the admin dashboard to manage customers.
        </p>
        <a href="/admin" className="vride-btn-brand mt-5 inline-flex text-sm h-11 px-6">
          Open admin dashboard
        </a>
        <button onClick={handleLogout} className="vride-btn-ghost ml-2 text-sm h-11 px-6 inline-flex">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    );
  }

  const displayName = user.name ?? user.email.split("@")[0];
  const totalRides = user.totalRides ?? 0;
  const completedRides = user.completedRides ?? 0;
  const cancelledRides = user.cancelledRides ?? 0;
  const moneySaved = user.moneySaved ?? 0;
  const co2SavedKg = user.co2SavedKg ?? 0;
  const greenKms = Math.round(co2SavedKg * 20); // rough demo conversion

  return (
    <div className="container-page py-10 sm:py-12 max-w-4xl pb-24 md:pb-12">
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="show"
        className="text-center"
      >
        <motion.div variants={motionPresets.fadeUp} className="eyebrow justify-center">
          <ShieldCheck className="h-3.5 w-3.5" /> Your profile
        </motion.div>
        <motion.h1
          variants={motionPresets.fadeUp}
          className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl text-balance"
        >
          The student behind the rides.
        </motion.h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 overflow-hidden vride-card shadow-lg"
      >
        <div className="relative h-28 bg-gradient-to-br from-brand-600 to-brand-700">
          <div className="absolute inset-0 grid-bg-dark opacity-40" />
          <div className="absolute -bottom-2 right-4 chip bg-white/10 text-white ring-1 ring-white/20">
            {user.emailVerified ? "Google verified" : "Unverified"}
          </div>
        </div>

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex items-end justify-between">
            {user.picture ? (
              <img
                src={user.picture}
                alt={displayName}
                className="h-24 w-24 rounded-3xl object-cover ring-4 ring-white shadow-lg"
              />
            ) : (
              <span className="grid h-24 w-24 place-items-center rounded-3xl bg-ink-900 text-2xl font-bold text-lime ring-4 ring-white">
                {displayName.slice(0, 2).toUpperCase()}
              </span>
            )}
            {user.isVitApStudent ? (
              <Badge tone="green">
                <ShieldCheck className="h-3 w-3" /> VIT-AP Student
              </Badge>
            ) : (
              <Badge tone="gray">Non-VIT-AP</Badge>
            )}
          </div>

          <h2 className="mt-4 text-2xl font-extrabold text-ink-900">{displayName}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-500">
            <span>{user.email}</span>
            <span>•</span>
            <span>{user.role === "driver" ? "Driver" : "Student Customer"}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {user.rating}
            </span>
          </div>

          {/* Stats grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile icon={Wallet} label="Total rides" value={`${totalRides}`} tone="ink" />
            <StatTile icon={ShieldCheck} label="Completed" value={`${completedRides}`} tone="green" />
            <StatTile icon={Heart} label="Cancelled" value={`${cancelledRides}`} tone="amber" />
            <StatTile icon={Leaf} label="CO₂ saved" value={`${co2SavedKg}kg`} tone="lime" />
          </div>

          {/* Savings + logins */}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
              <div className="text-[11px] uppercase tracking-wider text-brand-50">
                Estimated savings
              </div>
              <div className="mt-1 text-3xl font-extrabold">{formatINR(moneySaved)}</div>
              <div className="mt-1 text-xs text-brand-50">vs. travelling alone every time</div>
            </div>
            <div className="rounded-2xl bg-ink-950 p-5 text-white">
              <div className="text-[11px] uppercase tracking-wider text-lime">Login count</div>
              <div className="mt-1 text-3xl font-extrabold">{user.loginCount}</div>
              {user.firstLoginAt && (
                <div className="mt-1 text-xs text-ink-300">
                  First login: {new Date(user.firstLoginAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Saved locations */}
          <div className="mt-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Saved locations
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {SAVED_LOCATIONS.concat([
                { id: "loc-vitap", label: "VIT-AP University", area: "Amaravati" },
                { id: "loc-vij-rs", label: "Vijayawada Railway Station", area: "Vijayawada" },
              ]).map((l) => (
                <li
                  key={l.id}
                  className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50/40 p-3"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-ink-900">{l.label}</div>
                    <div className="text-[11px] text-ink-500">{l.area}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle preferences */}
          <div className="mt-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Vehicle preferences
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {VEHICLES.map((v) => (
                <div
                  key={v.type}
                  className="rounded-2xl border border-ink-200 bg-white p-3 text-center"
                >
                  <div className="text-sm font-bold capitalize text-ink-900">{v.label}</div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-400">
                    Up to {v.capacity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate({ name: "history" })}
              className="vride-btn-brand text-sm h-11 px-6"
            >
              View ride history
            </button>
            <button
              onClick={() => navigate({ name: "dashboard" })}
              className="vride-btn-ghost text-sm h-11 px-6"
            >
              Back to dashboard
            </button>
            <button onClick={handleLogout} className="vride-btn-ghost text-sm h-11 px-6">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "ink" | "green" | "amber" | "lime";
}) {
  const tones = {
    ink: "bg-ink-900 text-white",
    green: "bg-emerald-500 text-white",
    amber: "bg-amber-500 text-white",
    lime: "bg-lime text-ink-900",
  };
  return (
    <div className={`rounded-2xl p-4 ${tones[tone]} relative overflow-hidden`}>
      <Icon className="absolute right-2 top-2 h-4 w-4 opacity-30" />
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}
