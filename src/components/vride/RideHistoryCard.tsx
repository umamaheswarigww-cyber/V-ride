"use client";

import { motion } from "framer-motion";
import { Bike, Car } from "lucide-react";
import { formatINR } from "@/lib/format";
import { StatusBadge, PaymentBadge } from "./StatusBadge";
import type { RideHistoryEntry, VehicleType } from "@/lib/types";

const VEH_ICON: Record<VehicleType, React.ComponentType<{ className?: string }>> = {
  bike: Bike,
  auto: Car,
  car: Car,
};

export function RideHistoryCard({
  entry,
}: {
  entry: RideHistoryEntry;
}) {
  const Icon = VEH_ICON[entry.vehicleType];
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink-200 bg-white p-3"
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-ink-900">
          {entry.from} → {entry.to}
        </div>
        <div className="text-xs text-ink-500">
          {entry.date} • {entry.vehicleType} • {entry.distanceKm} km • {entry.durationMin} min • {entry.passengers} passengers
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-ink-900">{formatINR(entry.totalFare)}</span>
          <span className="text-[10px] uppercase tracking-wider text-ink-400">total</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-500">You: {formatINR(entry.perHead)}</span>
          <StatusBadge status={entry.status} />
        </div>
        <PaymentBadge status={entry.paymentStatus} />
      </div>
    </motion.li>
  );
}
