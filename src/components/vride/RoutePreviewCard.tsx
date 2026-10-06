"use client";

import { ArrowRight, Clock, MapPin, Navigation, Timer } from "lucide-react";
import { formatINR } from "@/lib/format";
import { Badge } from "./Badge";
import type { Ride } from "@/lib/types";

export function RoutePreviewCard({ ride }: { ride: Ride }) {
  const arrivalTime = computeArrival(ride.time, ride.durationMin);

  return (
    <div className="vride-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/40 px-5 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          <Navigation className="h-3.5 w-3.5 text-brand-600" />
          Route preview
        </div>
        <Badge tone="green">Demo map</Badge>
      </div>
      <div className="p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-400">From</div>
            <div className="text-sm font-semibold text-ink-900">{ride.from}</div>
          </div>
          <div className="flex items-center gap-2 text-brand-500">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            <span className="h-px w-12 bg-gradient-to-r from-brand-500 to-ink-300" />
            <ArrowRight className="h-4 w-4 text-brand-500" />
          </div>
          <div className="sm:text-right">
            <div className="text-[10px] uppercase tracking-wider text-ink-400">To</div>
            <div className="text-sm font-semibold text-ink-900">{ride.to}</div>
          </div>
        </div>

        <svg viewBox="0 0 360 80" className="mt-4 w-full" role="img" aria-label="route preview">
          <defs>
            <linearGradient id="rp-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#c4f042" />
            </linearGradient>
          </defs>
          <path d="M20 60 C 100 60, 120 20, 180 20 S 320 60, 340 20" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path
            d="M20 60 C 100 60, 120 20, 180 20 S 320 60, 340 20"
            stroke="url(#rp-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="6 8"
            style={{ strokeDashoffset: 0 }}
          />
          <circle cx="20" cy="60" r="9" fill="#fff" stroke="#10b981" strokeWidth="3" />
          <circle cx="20" cy="60" r="3.5" fill="#10b981" />
          <circle cx="340" cy="20" r="9" fill="#fff" stroke="#c4f042" strokeWidth="3" />
          <circle cx="340" cy="20" r="3.5" fill="#c4f042" />
          <text x="20" y="78" textAnchor="start" className="fill-ink-500 text-[10px]">{ride.pickup}</text>
          <text x="340" y="13" textAnchor="end" className="fill-ink-500 text-[10px]">{ride.to}</text>
        </svg>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={MapPin} label="Distance" value={`${ride.distanceKm} km`} />
          <Stat icon={Timer} label="Travel" value={`${ride.durationMin} min`} />
          <Stat icon={Clock} label="Departure" value={ride.time} />
          <Stat icon={Navigation} label="ETA" value={arrivalTime} />
        </div>
      </div>
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

function computeArrival(departure: string, durationMin: number): string {
  const m = departure.match(/(\d+):(\d+)\s*(AM|PM)/);
  if (!m) return departure;
  let hr = parseInt(m[1]);
  const min = parseInt(m[2]);
  const mer = m[3];
  if (mer === "PM" && hr !== 12) hr += 12;
  if (mer === "AM" && hr === 12) hr = 0;
  const totalMin = hr * 60 + min + durationMin;
  const arriveHr = Math.floor(totalMin / 60) % 24;
  const arriveMin = totalMin % 60;
  const arriveMer = arriveHr < 12 ? "AM" : "PM";
  const displayHr = arriveHr === 0 ? 12 : arriveHr > 12 ? arriveHr - 12 : arriveHr;
  return `${displayHr}:${String(arriveMin).padStart(2, "0")} ${arriveMer}`;
}
