"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CarFront,
  Leaf,
  Navigation,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { useVRideStore } from "@/lib/store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatINR } from "@/lib/format";
import { StatCard, MiniStatCard } from "@/components/vride/StatCard";
import { Badge } from "@/components/vride/Badge";
import { StatusBadge } from "@/components/vride/StatusBadge";
import { RideHistoryCard } from "@/components/vride/RideHistoryCard";
import { staggerContainer, motionPresets } from "@/lib/motion";

export function DashboardView({ navigate }: { navigate: (r: Route) => void }) {
  const joinedIds = useVRideStore((s) => s.joinedIds);
  const offered = useVRideStore((s) => s.offered);
  const pool = useVRideStore((s) => s.pool);
  const history = useVRideStore((s) => s.history);
  const rideStatus = useVRideStore((s) => s.rideStatus);
  const { user } = useCurrentUser();

  // Find rides the user has joined that are still "live" (not completed)
  const allRides = [...offered, ...pool];
  const joinedRides = joinedIds
    .map((id) => allRides.find((r) => r.id === id))
    .filter(Boolean) as typeof pool;

  const liveRide = joinedRides.find((r) => {
    const st = rideStatus[r.id];
    return st === "started" || st === "on_the_way" || st === "arriving_soon" || st === "arriving";
  });

  const upcomingRide = joinedRides.find((r) => {
    const st = rideStatus[r.id] ?? "confirmed";
    return st === "confirmed" || st === "upcoming";
  }) ?? allRides.find((r) => r.id === "ride-101");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "Student";
  const displayPicture = user?.picture ?? "https://i.pravatar.cc/120?img=33";
  const isVitAp = user?.isVitApStudent ?? true;
  const userRating = user?.rating ?? 4.9;
  const totalRides = user?.totalRides ?? 18;
  const moneySaved = user?.moneySaved ?? 1240;
  const co2SavedKg = user?.co2SavedKg ?? 24.8;

  return (
    <div className="container-page py-10 sm:py-12 pb-24 md:pb-12">
      {/* Header */}
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="show"
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-4">
          <img
            src={displayPicture}
            alt={displayName}
            className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-sm sm:h-16 sm:w-16"
          />
          <div>
            <motion.div variants={motionPresets.fadeUp} className="text-xs font-medium uppercase tracking-wider text-brand-600">
              {user?.email ?? "VIT-AP University"}
            </motion.div>
            <motion.h1 variants={motionPresets.fadeUp} className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
              {greeting}, {displayName.split(" ")[0]} 👋
            </motion.h1>
            <motion.div variants={motionPresets.fadeUp} className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-500">
              {isVitAp && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-brand-700 ring-1 ring-emerald-100">
                  <ShieldCheck className="h-3 w-3" /> Verified VIT-AP student
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {userRating}
              </span>
              <span>•</span>
              <span>{totalRides} rides</span>
            </motion.div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate({ name: "offer" })} className="vride-btn-ghost text-xs h-9">
            <Plus className="h-3.5 w-3.5" /> Offer a Ride
          </button>
          <button onClick={() => navigate({ name: "find" })} className="vride-btn-brand text-xs h-9">
            Find a Ride
          </button>
        </div>
      </motion.div>

      {/* Smart personalization banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex items-center gap-3 rounded-2xl bg-ink-950 p-4 text-white"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime/20 text-lime">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="flex-1 text-xs text-ink-200">
          <span className="font-semibold text-white">Your usual route:</span> Vijayawada → VIT-AP •{" "}
          <span className="font-bold text-lime">3 rides available</span> around your usual time
        </div>
        <button onClick={() => navigate({ name: "find" })} className="chip bg-white/10 text-white ring-1 ring-white/15">
          See matches <ArrowRight className="h-3 w-3" />
        </button>
      </motion.div>

      {/* Live ride banner */}
      {liveRide && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate({ name: "live", id: liveRide.id })}
          className="mt-4 w-full text-left overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white shadow-lg"
        >
          <div className="flex items-center gap-4">
            <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
              </span>
              <Navigation className="h-5 w-5 text-lime" />
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Live Ride in progress</h3>
                <StatusBadge status={rideStatus[liveRide.id]} pulse />
              </div>
              <div className="text-xs text-brand-50">
                {liveRide.from} → {liveRide.to} • {liveRide.distanceKm} km • {liveRide.durationMin} min
              </div>
            </div>
            <ArrowRight className="h-5 w-5" />
          </div>
        </motion.button>
      )}

      {/* Stats grid */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Upcoming Ride"
          value={upcomingRide.time}
          sub={`${upcomingRide.from} → ${upcomingRide.to}`}
          icon={CarFront}
          tone="brand"
        />
        <StatCard
          label="Money Saved"
          value={formatINR(moneySaved)}
          sub="across all your shared rides"
          icon={Wallet}
          tone="green"
        />
        <StatCard
          label="Rides Shared"
          value={`${totalRides}`}
          sub={`${(user?.completedRides ?? 16)} completed`}
          icon={Users}
          tone="ink"
        />
        <StatCard
          label="CO₂ Saved"
          value={`${co2SavedKg} kg`}
          sub="≈ a tree absorbing it for a month"
          icon={Leaf}
          tone="lime"
        />
      </div>

      {/* Upcoming ride detail */}
      {upcomingRide && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 overflow-hidden vride-card p-5 sm:p-7 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Your upcoming ride
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-ink-900">
                {upcomingRide.from} → {upcomingRide.to}
              </h2>
            </div>
            <StatusBadge status={rideStatus[upcomingRide.id] ?? "confirmed"} pulse />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <svg viewBox="0 0 360 110" className="w-full" role="img" aria-label="upcoming ride route">
                <defs>
                  <linearGradient id="dash-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#c4f042" />
                  </linearGradient>
                </defs>
                <path d="M30 80 C 100 80, 130 20, 200 20 S 320 80, 330 20" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" fill="none" />
                <motion.path
                  d="M30 80 C 100 80, 130 20, 200 20 S 320 80, 330 20"
                  stroke="url(#dash-grad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="6 8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <circle cx="30" cy="80" r="9" fill="#fff" stroke="#10b981" strokeWidth="3" />
                <circle cx="30" cy="80" r="3.5" fill="#10b981" />
                <circle cx="200" cy="20" r="9" fill="#fff" stroke="#f59e0b" strokeWidth="3" />
                <circle cx="200" cy="20" r="3.5" fill="#f59e0b" />
                <circle cx="330" cy="20" r="9" fill="#fff" stroke="#10b981" strokeWidth="3" />
                <circle cx="330" cy="20" r="3.5" fill="#10b981" />
                <text x="30" y="100" textAnchor="start" className="fill-ink-500 text-[10px]">{upcomingRide.from.split(" ")[0]}</text>
                <text x="200" y="13" textAnchor="middle" className="fill-ink-500 text-[10px]">{upcomingRide.pickup}</text>
                <text x="330" y="13" textAnchor="end" className="fill-ink-500 text-[10px]">{upcomingRide.to.split(" ").slice(-1)[0]}</text>
              </svg>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                <MiniStatCard label="Departure" value={upcomingRide.time} icon={CarFront} />
                <MiniStatCard label="Pickup" value={upcomingRide.pickup} icon={ArrowRight} />
                <MiniStatCard label="Your share" value={formatINR(upcomingRide.perHead)} icon={Wallet} />
                <MiniStatCard label="Seats" value={`${upcomingRide.seatsTaken}/${upcomingRide.seatsTotal}`} icon={Users} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => navigate({ name: "ride", id: upcomingRide.id })} className="vride-btn-ghost text-xs h-9">
                  View ride
                </button>
                <button onClick={() => navigate({ name: "chat", id: upcomingRide.id })} className="vride-btn-brand text-xs h-9">
                  Open chat
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent rides — synced with store */}
      <div className="mt-6 grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="vride-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink-900">Recent rides</h2>
              <button
                onClick={() => navigate({ name: "history" })}
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                View all
              </button>
            </div>
            <ul className="mt-4 space-y-3">
              {history.slice(0, 3).map((h) => (
                <button
                  key={h.id}
                  onClick={() => navigate({ name: "ride", id: h.rideId })}
                  className="w-full text-left"
                >
                  <RideHistoryCard entry={h} />
                </button>
              ))}
              {history.length === 0 && (
                <li className="rounded-2xl border border-dashed border-ink-300 bg-ink-50/50 p-4 text-center text-sm text-ink-500">
                  No rides yet — find one and tap Join to see it appear here.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Mini profile card */}
        <div className="lg:col-span-5">
          <button
            onClick={() => navigate({ name: "profile" })}
            className="block w-full text-left"
          >
            <div className="vride-card overflow-hidden shadow-lg">
              <div className="relative h-20 bg-gradient-to-br from-brand-600 to-brand-700">
                <div className="absolute inset-0 grid-bg-dark opacity-40" />
              </div>
              <div className="relative px-5 pb-5 sm:px-6">
                <div className="-mt-9 flex items-end justify-between">
                  <img
                    src={displayPicture}
                    alt={displayName}
                    className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white shadow-sm"
                  />
                  <Badge tone="green">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </Badge>
                </div>
                <h3 className="mt-2 text-lg font-bold text-ink-900">{displayName}</h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-ink-500">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {userRating} • {totalRides} rides
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-ink-50 p-2 text-center">
                    <div className="text-sm font-bold text-ink-900">{formatINR(moneySaved)}</div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">Saved</div>
                  </div>
                  <div className="rounded-xl bg-ink-50 p-2 text-center">
                    <div className="text-sm font-bold text-ink-900">{co2SavedKg}kg</div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">CO₂</div>
                  </div>
                  <div className="rounded-xl bg-ink-50 p-2 text-center">
                    <div className="text-sm font-bold text-ink-900">{Math.round(co2SavedKg * 20)}</div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">Green km</div>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
