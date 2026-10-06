"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flag, Navigation, Clock } from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { useVRideStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

const STATUSES = [
  "started",
  "on_the_way",
  "arriving_soon",
  "completed",
] as const;

export function LiveRideTracker({
  rideId,
  navigate,
}: {
  rideId: string;
  navigate: (r: Route) => void;
}) {
  const ride = useVRideStore((s) => [...s.offered, ...s.pool].find((r) => r.id === rideId));
  const status = useVRideStore((s) => s.rideStatus[rideId] ?? "confirmed");
  const setStatus = useVRideStore((s) => s.setRideStatus);
  const completeActiveRide = useVRideStore((s) => s.completeActiveRide);
  const [progress, setProgress] = useState(0);

  // Advance the ride status through the demo lifecycle
  useEffect(() => {
    if (!ride) return;
    if (status === "completed" || status === "cancelled") return;
    if (status === "confirmed") {
      const t1 = window.setTimeout(() => setStatus(rideId, "arriving"), 1800);
      return () => window.clearTimeout(t1);
    }
    if (status === "arriving") {
      const t2 = window.setTimeout(() => setStatus(rideId, "started"), 2400);
      return () => window.clearTimeout(t2);
    }
  }, [ride, rideId, status, setStatus]);

  // Animate progress when started/on_the_way/arriving_soon
  useEffect(() => {
    if (!ride) return;
    if (status === "started" || status === "on_the_way" || status === "arriving_soon") {
      const interval = window.setInterval(() => {
        setProgress((p) => {
          const next = Math.min(100, p + 2);
          if (next >= 35 && status === "started") {
            setStatus(rideId, "on_the_way");
          }
          if (next >= 80 && (status === "on_the_way" || status === "started")) {
            setStatus(rideId, "arriving_soon");
          }
          if (next >= 100) {
            window.clearInterval(interval);
          }
          return next;
        });
      }, 250);
      return () => window.clearInterval(interval);
    }
  }, [ride, rideId, status, setStatus]);

  if (!ride) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Live ride not found</h1>
      </div>
    );
  }

  const remainingKm = Math.max(0, Math.round((ride.distanceKm * (100 - progress)) / 100));
  const remainingMin = Math.max(0, Math.round((ride.durationMin * (100 - progress)) / 100));
  const progressOffset = 240 - (240 * progress) / 100;

  const handleComplete = () => {
    completeActiveRide();
    navigate({ name: "ride", id: rideId });
  };

  return (
    <div className="container-page py-6 sm:py-10 max-w-5xl">
      {/* Status header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            Live Ride
          </h1>
          <StatusBadge status={status} pulse={status !== "completed" && status !== "cancelled"} />
        </div>
        <button
          onClick={() => navigate({ name: "ride", id: rideId })}
          className="vride-btn-ghost text-xs h-9"
        >
          ← Ride details
        </button>
      </div>

      {/* Live map */}
      <div className="vride-card overflow-hidden">
        <div className="relative bg-ink-950 h-72 sm:h-80">
          <div className="absolute inset-0 grid-bg-dark opacity-40" />
          <div className="absolute -top-20 left-1/4 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 h-40 w-40 rounded-full bg-lime/15 blur-3xl" />

          <svg viewBox="0 0 360 200" className="absolute inset-0 h-full w-full" role="img" aria-label="live ride map">
            <defs>
              <linearGradient id="live-route-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#c4f042" />
              </linearGradient>
            </defs>
            {/* Base path */}
            <path
              d="M30 160 C 100 160, 130 50, 200 50 S 320 160, 330 50"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Progress path */}
            <path
              d="M30 160 C 100 160, 130 50, 200 50 S 320 160, 330 50"
              stroke="url(#live-route-grad)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="240"
              strokeDashoffset={progressOffset}
            />
            {/* Pickup marker */}
            <circle cx="30" cy="160" r="11" fill="#10b981" />
            <circle cx="30" cy="160" r="5" fill="#fff" />
            <text x="30" y="180" textAnchor="middle" className="fill-white/70 text-[10px]">{ride.from.split(" ")[0]}</text>
            {/* Destination marker */}
            <circle cx="330" cy="50" r="11" fill="#c4f042" />
            <circle cx="330" cy="50" r="5" fill="#0c1322" />
            <text x="330" y="40" textAnchor="end" className="fill-white/70 text-[10px]">{ride.to.split(" ").slice(-1)[0]}</text>

            {/* Moving vehicle marker */}
            <motion.g
              animate={{ offsetDistance: [`0%`, `${progress}%`] }}
              transition={{ duration: 0.3, ease: "linear" }}
              style={{
                offsetPath: `path('M30 160 C 100 160, 130 50, 200 50 S 320 160, 330 50')`,
              }}
            >
              <circle r="14" fill="#0c1322" />
              <circle r="14" fill="#0c1322">
                <animate attributeName="r" values="14;18;14" dur="1.4s" repeatCount="indefinite" />
              </circle>
              <circle r="6" fill="#c4f042" />
            </motion.g>
          </svg>

          {/* HUD top-left */}
          <div className="absolute left-3 top-3 rounded-2xl bg-ink-950/80 px-3 py-2 text-white ring-1 ring-white/10">
            <div className="text-[10px] uppercase tracking-wider text-ink-300">Status</div>
            <div className="text-sm font-bold capitalize">{status.replace("_", " ")}</div>
          </div>

          {/* HUD top-right progress */}
          <div className="absolute right-3 top-3 rounded-2xl bg-ink-950/80 px-3 py-2 text-white ring-1 ring-white/10 text-right">
            <div className="text-[10px] uppercase tracking-wider text-ink-300">Progress</div>
            <div className="text-sm font-bold">{progress}%</div>
          </div>
        </div>

        {/* Stats below map */}
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
          <Stat icon={Navigation} label="Remaining" value={`${remainingKm} km`} />
          <Stat icon={Clock} label="ETA" value={`${remainingMin} min`} />
          <Stat icon={Flag} label="Destination" value={ride.to.split(" ").slice(-2).join(" ")} />
          <Stat icon={Navigation} label="Your share" value={formatINR(ride.perHead)} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {(status === "completed" || progress >= 100) && (
          <button onClick={handleComplete} className="vride-btn-brand text-sm h-11 px-6">
            View ride summary & complete
          </button>
        )}
        {status !== "completed" && progress < 100 && (
          <button
            onClick={() => {
              setProgress(100);
              setStatus(rideId, "completed");
            }}
            className="vride-btn-ghost text-xs h-9"
          >
            Demo: skip to arrival
          </button>
        )}
        <button
          onClick={() => navigate({ name: "chat", id: rideId })}
          className="vride-btn-ghost text-xs h-9"
        >
          Open chat
        </button>
      </div>

      {/* Hidden dev note: status cycle hint */}
      <p className="mt-4 text-center text-[11px] text-ink-400">
        Demo ride progresses automatically: confirmed → arriving → started → on the way → arriving soon → completed.
      </p>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50/40 p-3">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-ink-400">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-0.5 text-sm font-bold text-ink-900">{value}</div>
    </div>
  );
}
