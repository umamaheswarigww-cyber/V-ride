"use client";

import { motion } from "framer-motion";
import { Bike, Car, Users, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { VEHICLES } from "@/lib/mock";
import { formatINR } from "@/lib/format";
import type { Vehicle, VehicleType } from "@/lib/types";

const ICONS: Record<Vehicle["icon"], React.ComponentType<{ className?: string }>> = {
  bike: Bike,
  car: Car,
  auto: Car,
};

export function VehicleSelector({
  selected,
  onSelect,
  distanceKm = 28,
}: {
  selected: VehicleType | null;
  onSelect: (v: VehicleType) => void;
  distanceKm?: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {VEHICLES.map((v) => {
        const Icon = ICONS[v.icon];
        const isActive = selected === v.type;
        const estimatedFare = Math.round(
          (v.baseFare + v.ratePerKm * distanceKm + v.baseFare * 0.15) /
            Math.max(2, Math.min(v.capacity, 4)),
        );
        const etaMin = Math.round((distanceKm / v.speedKmH) * 60);

        return (
          <motion.button
            key={v.type}
            type="button"
            onClick={() => onSelect(v.type)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative overflow-hidden rounded-3xl border p-5 text-left transition-all",
              isActive
                ? "border-brand-400 bg-brand-50/60 ring-2 ring-brand-200"
                : "border-ink-200 bg-white hover:border-ink-300",
            )}
          >
            {v.recommended && !isActive && (
              <span className="absolute right-3 top-3 chip bg-lime/20 text-ink-800 ring-1 ring-lime/40">
                Recommended
              </span>
            )}
            {isActive && (
              <motion.span
                layoutId="vehicle-active-dot"
                className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-brand-500 text-white"
              >
                ✓
              </motion.span>
            )}
            <span
              className={cn(
                "grid h-12 w-12 place-items-center rounded-2xl",
                isActive ? "bg-brand-500 text-white" : "bg-ink-100 text-ink-700",
              )}
            >
              <Icon className="h-6 w-6" />
            </span>
            <h4 className="mt-3 text-base font-bold text-ink-900">{v.label}</h4>
            <p className="text-[11px] uppercase tracking-wider text-ink-500">
              Up to {v.capacity} students
            </p>
            <div className="mt-3 space-y-1.5 text-xs text-ink-600">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3 text-ink-400" /> Per person
                </span>
                <span className="font-bold text-brand-700">
                  {formatINR(estimatedFare)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3 text-ink-400" /> ETA
                </span>
                <span className="font-semibold text-ink-900">~{etaMin} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-ink-400" /> Distance
                </span>
                <span className="font-semibold text-ink-900">{distanceKm} km</span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
