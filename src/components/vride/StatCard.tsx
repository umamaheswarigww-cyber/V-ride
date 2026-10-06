"use client";

import { motion } from "framer-motion";
import { TrendingDown, Users } from "lucide-react";
import { formatINR } from "@/lib/format";
import { Badge } from "./Badge";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "ink",
  sub,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "ink" | "brand" | "green" | "amber" | "lime" | "white";
  sub?: string;
}) {
  const tones: Record<string, string> = {
    ink: "bg-ink-900 text-white",
    brand: "bg-brand-500 text-white",
    green: "bg-emerald-500 text-white",
    amber: "bg-amber-500 text-white",
    lime: "bg-lime text-ink-900",
    white: "bg-white text-ink-900 ring-1 ring-ink-200",
  };
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-3xl p-5 ${tones[tone]}`}
      style={{ boxShadow: "0 4px 24px -8px rgba(12, 19, 34, 0.20)" }}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider opacity-70">
            {label}
          </div>
          <div className="mt-1 text-3xl font-bold tracking-tight">{value}</div>
          {sub && <div className="mt-1 text-xs opacity-80">{sub}</div>}
        </div>
        {Icon && (
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15">
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function MiniStatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-3.5">
      {Icon && (
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div>
        <div className="text-[11px] uppercase tracking-wider text-ink-400">{label}</div>
        <div className="text-base font-bold text-ink-900">{value}</div>
        {hint && <div className="text-[11px] text-ink-500">{hint}</div>}
      </div>
    </div>
  );
}

export function FareSplitVisual({
  total = 450,
  students = 3,
  perHead = 150,
}: {
  total?: number;
  students?: number;
  perHead?: number;
}) {
  return (
    <div className="rounded-3xl border border-ink-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-ink-400">
        <span>Ride Total</span>
        <Users className="h-3.5 w-3.5" />
      </div>
      <div className="mt-1 text-4xl font-bold tracking-tight text-ink-900">
        {formatINR(total)}
      </div>

      <div className="my-4 flex items-center gap-2 text-xs text-ink-500">
        <span>Split by</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">
          {students} students
        </span>
        <span>↓</span>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 p-4 text-center ring-1 ring-brand-100">
        <div className="text-[11px] uppercase tracking-wider text-brand-700">You pay</div>
        <div className="text-3xl font-bold tracking-tight text-brand-700">
          {formatINR(perHead)}
        </div>
        <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
          <TrendingDown className="h-3.5 w-3.5" />
          Save {formatINR(total - perHead)}
        </div>
      </div>
      <div className="mt-3 text-center">
        <Badge tone="green">Smart Split</Badge>
      </div>
    </div>
  );
}
