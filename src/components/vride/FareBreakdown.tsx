"use client";

import { formatINR } from "@/lib/format";
import type { Ride } from "@/lib/types";

export function FareBreakdown({ ride }: { ride: Ride }) {
  const fb = ride.fareBreakdown;
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
        Fare breakdown
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <Row label="Base fare" value={formatINR(fb.base)} />
        <Row
          label={`Distance charge (${ride.distanceKm} km)`}
          value={formatINR(fb.distanceCharge)}
        />
        <Row
          label="Service charge (demo)"
          value={formatINR(fb.serviceCharge)}
          subtle
        />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-ink-200 pt-3">
        <span className="text-sm font-semibold text-ink-900">Estimated total</span>
        <span className="text-2xl font-extrabold text-brand-700">
          {formatINR(fb.total)}
        </span>
      </div>
      <p className="mt-2 text-[11px] text-ink-400">
        Split across {ride.seatsTaken + 1} students → {formatINR(ride.perHead)}/person
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  subtle = false,
}: {
  label: string;
  value: string;
  subtle?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-xs ${subtle ? "text-ink-400" : "text-ink-600"}`}>
        {label}
      </span>
      <span className="text-sm font-semibold text-ink-900">{value}</span>
    </div>
  );
}
