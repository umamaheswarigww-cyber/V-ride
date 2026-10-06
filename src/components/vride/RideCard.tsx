"use client";

import { motion } from "framer-motion";
import { CarFront, Star, Users } from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import type { Ride } from "@/lib/mock";
import { getStudentById } from "@/lib/mock";
import { formatINR } from "@/lib/format";
import { Badge } from "./Badge";
import { motionPresets } from "@/lib/motion";

export function RideCard({
  ride,
  navigate,
}: {
  ride: Ride;
  navigate: (r: Route) => void;
}) {
  const organizer = getStudentById(ride.organizerId);
  const seatsLeft = ride.seatsTotal - ride.seatsTaken;

  return (
    <motion.div
      variants={motionPresets.card}
      initial="hidden"
      animate="show"
      className="group vride-card vride-card-hover overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
            <CarFront className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <span>{ride.from}</span>
              <span className="text-ink-400">→</span>
              <span>{ride.to}</span>
            </div>
            <div className="text-xs text-ink-500">
              {ride.date} • {ride.time} • {ride.vehicleType}
            </div>
          </div>
        </div>
        <Badge tone="green">{ride.matchScore}% match</Badge>
      </div>

      <div className="mx-5 mb-4 sm:mx-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50/60 px-4 py-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-ink-400">Pickup</div>
          <div className="truncate text-sm font-medium text-ink-900">{ride.pickup}</div>
        </div>
        <div className="flex items-center text-ink-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          <span className="h-px w-8 bg-gradient-to-r from-brand-500 to-ink-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink-400" />
        </div>
        <div className="min-w-0 text-right">
          <div className="text-[10px] uppercase tracking-wider text-ink-400">Drop</div>
          <div className="truncate text-sm font-medium text-ink-900">{ride.to}</div>
        </div>
      </div>

      <div className="mx-5 mb-4 sm:mx-6 grid grid-cols-3 gap-3 text-center sm:mb-5">
        <Stat label="Per person" value={formatINR(ride.perHead)} tone="brand" />
        <Stat
          label="Seats left"
          value={`${seatsLeft}/${ride.seatsTotal}`}
          tone={seatsLeft > 1 ? "green" : "amber"}
        />
        <Stat label="Total ride" value={formatINR(ride.totalFare)} tone="ink" />
      </div>

      {organizer && (
        <div className="mx-5 mb-5 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-ink-50 to-white p-3 ring-1 ring-ink-200/70 sm:mx-6">
          <img
            src={organizer.avatar}
            alt={organizer.name}
            className="h-10 w-10 rounded-xl object-cover ring-2 ring-white"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
              <span className="truncate">{organizer.name}</span>
              {organizer.verified && <Badge tone="blue">Verified</Badge>}
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-500">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {organizer.rating}
              </span>
              <span>•</span>
              <span>{organizer.branch}</span>
            </div>
          </div>
          <Users className="h-4 w-4 text-ink-300" />
        </div>
      )}

      {ride.note && (
        <p className="mx-5 mb-5 line-clamp-2 text-xs text-ink-500 sm:mx-6">
          “{ride.note}”
        </p>
      )}

      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <button
          onClick={() => navigate({ name: "ride", id: ride.id })}
          className="vride-btn-primary w-full"
        >
          View Ride
        </button>
      </div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "brand" | "green" | "amber";
}) {
  const tones = {
    brand: "text-brand-600",
    green: "text-emerald-600",
    amber: "text-amber-600",
    ink: "text-ink-900",
  };
  return (
    <div className="rounded-2xl bg-white px-3 py-2.5 ring-1 ring-ink-200/70">
      <div className="text-[10px] uppercase tracking-wider text-ink-400">{label}</div>
      <div className={`text-base font-bold ${tones[tone]}`}>{value}</div>
    </div>
  );
}
