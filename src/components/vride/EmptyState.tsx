"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actions,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-dashed border-ink-300 bg-white p-12 text-center"
    >
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-ink-100 text-ink-400">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-ink-900">{title}</h3>
      {description && (
        <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-500">{description}</p>
      )}
      {actions && <div className="mt-5 flex flex-wrap justify-center gap-3">{actions}</div>}
    </motion.div>
  );
}

export function LoadingSkeleton({
  label = "Loading…",
  rows = 3,
}: {
  label?: string;
  rows?: number;
}) {
  return (
    <div className="rounded-3xl border border-ink-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-brand-700">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
        </span>
        {label}
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-ink-50/40 p-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-ink-200/60 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 rounded bg-ink-200/60 animate-pulse" />
              <div className="h-2 w-3/4 rounded bg-ink-100 animate-pulse" />
            </div>
            <div className="h-7 w-16 rounded-lg bg-ink-200/60 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
