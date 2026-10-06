"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { History, Search } from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { useVRideStore } from "@/lib/store";
import { RideHistoryCard } from "@/components/vride/RideHistoryCard";
import { EmptyState } from "@/components/vride/EmptyState";
import type { RideStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: RideStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function RideHistoryView({ navigate }: { navigate: (r: Route) => void }) {
  const history = useVRideStore((s) => s.history);
  const [filter, setFilter] = useState<RideStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = history.filter((h) => {
    if (filter !== "all" && h.status !== filter) return false;
    if (query && !`${h.from} ${h.to}`.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="container-page py-10 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <div className="eyebrow">
            <History className="h-3.5 w-3.5" /> Ride history
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Your travel log
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            All your past and upcoming V-Ride journeys in one place.
          </p>
        </div>
        <button onClick={() => navigate({ name: "find" })} className="vride-btn-brand text-xs h-9">
          Find a new ride
        </button>
      </motion.div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "chip shrink-0 ring-1 transition-colors",
                filter === f.value
                  ? "bg-ink-900 text-white ring-ink-900"
                  : "bg-white text-ink-700 ring-ink-200 hover:bg-ink-100",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search route…"
            className="input-base pl-9 h-10 text-sm"
          />
        </div>
      </div>

      {/* List */}
      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            title="No rides match your filter"
            description="Try a different filter, search for a route, or find a new ride to share."
            actions={
              <>
                <button
                  onClick={() => { setFilter("all"); setQuery(""); }}
                  className="vride-btn-ghost text-xs h-9"
                >
                  Reset filters
                </button>
                <button
                  onClick={() => navigate({ name: "find" })}
                  className="vride-btn-brand text-xs h-9"
                >
                  Find a ride
                </button>
              </>
            }
          />
        ) : (
          <ul className="space-y-3">
            {filtered.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <button
                  onClick={() => navigate({ name: "ride", id: h.rideId })}
                  className="w-full text-left"
                >
                  <RideHistoryCard entry={h} />
                </button>
              </motion.div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
