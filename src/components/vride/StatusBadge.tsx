"use client";

import { cn } from "@/lib/utils";
import type { RideStatus, PaymentStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  RideStatus,
  { label: string; dot: string; bg: string; text: string; ring: string }
> = {
  upcoming: {
    label: "Upcoming",
    dot: "bg-ink-400",
    bg: "bg-ink-100",
    text: "text-ink-700",
    ring: "ring-ink-200",
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },
  arriving: {
    label: "Arriving",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },
  started: {
    label: "Started",
    dot: "bg-brand-500",
    bg: "bg-brand-50",
    text: "text-brand-700",
    ring: "ring-brand-200",
  },
  on_the_way: {
    label: "On the way",
    dot: "bg-brand-500",
    bg: "bg-brand-50",
    text: "text-brand-700",
    ring: "ring-brand-200",
  },
  arriving_soon: {
    label: "Arriving soon",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },
  completed: {
    label: "Completed",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-coral",
    bg: "bg-coral/10",
    text: "text-coral",
    ring: "ring-coral/30",
  },
};

export function StatusBadge({
  status,
  pulse = false,
  className,
}: {
  status: RideStatus;
  pulse?: boolean;
  className?: string;
}) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "chip",
        cfg.bg,
        cfg.text,
        `ring-1 ${cfg.ring}`,
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              cfg.dot,
            )}
          />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", cfg.dot)} />
      </span>
      {cfg.label}
    </span>
  );
}

export function PaymentBadge({
  status,
  className,
}: {
  status: PaymentStatus;
  className?: string;
}) {
  if (status === "paid") {
    return (
      <span
        className={cn(
          "chip bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
          className,
        )}
      >
        Paid ✓
      </span>
    );
  }
  return (
    <span
      className={cn(
        "chip bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        className,
      )}
    >
      Pending
    </span>
  );
}
