"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight,
  Filter,
  Inbox,
  MapPin,
  Search,
  SlidersHorizontal,
  Target,
  X,
  Clock,
  Crosshair,
} from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { SearchForm, type SearchQuery } from "@/components/vride/SearchForm";
import { RideCard } from "@/components/vride/RideCard";
import { LiveMatchIndicator } from "@/components/vride/LiveMatchIndicator";
import { VehicleSelector } from "@/components/vride/VehicleSelector";
import { EmptyState, LoadingSkeleton } from "@/components/vride/EmptyState";
import { motionPresets, staggerContainer } from "@/lib/motion";
import { useVRideStore } from "@/lib/store";
import type { VehicleType } from "@/lib/types";
import { LOCATIONS, RECENT_LOCATIONS, SAVED_LOCATIONS } from "@/lib/mock";

export function FindRideView({ navigate }: { navigate: (r: Route) => void }) {
  const pool = useVRideStore((s) => s.pool);
  const offered = useVRideStore((s) => s.offered);
  
  

  const [vehicle, setVehicle] = useState<VehicleType | null>("auto");
  const [from, setFrom] = useState("Vijayawada Railway Station");
  const [to, setTo] = useState("VIT-AP University");
  const [date, setDate] = useState("Today");
  const [time, setTime] = useState("8:00 AM");
  const [query, setQuery] = useState<SearchQuery | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    time: "any",
    price: "any",
    seats: "any",
    from: "any",
  });

  const allRides = useMemo(() => [...offered, ...pool], [offered, pool]);

  const filtered = useMemo(() => {
    if (!query) {
      // Default: show all rides, possibly filtered by vehicle
      return allRides.filter((r) => (vehicle ? r.vehicleType === vehicle : true));
    }
    let list = allRides.filter(
      (r) => r.from === query.from && r.to === query.to,
    );
    if (vehicle) list = list.filter((r) => r.vehicleType === vehicle);
    if (filters.time !== "any") {
      const ranges: Record<string, [number, number]> = {
        morning: [0, 9],
        lateMorning: [9, 11],
        afternoon: [11, 24],
      };
      const [min, max] = ranges[filters.time];
      list = list.filter((r) => r.timeValue >= min && r.timeValue < max);
    }
    if (filters.price !== "any") {
      const ranges: Record<string, [number, number]> = {
        low: [0, 120],
        mid: [120, 150],
        high: [150, 9999],
      };
      const [min, max] = ranges[filters.price];
      list = list.filter((r) => r.perHead >= min && r.perHead < max);
    }
    if (filters.seats !== "any") {
      const seatsNeeded = Number(filters.seats);
      list = list.filter((r) => r.seatsTotal - r.seatsTaken >= seatsNeeded);
    }
    if (filters.from !== "any") {
      list = list.filter((r) => r.from === filters.from);
    }
    return list;
  }, [query, filters, vehicle, allRides]);

  const handleSearch = (q: SearchQuery) => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setQuery(q);
    }, 1100);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const useCurrentLocation = () => {
    setFrom("Vijayawada Railway Station"); // mock current location
  };

  const clearFilters = () => {
    setFilters({ time: "any", price: "any", seats: "any", from: "any" });
  };

  const hasFilters =
    filters.time !== "any" ||
    filters.price !== "any" ||
    filters.seats !== "any" ||
    filters.from !== "any";

  const nearbyHeadingToVIT = 3 + (Math.floor(Date.now() / 1000) % 3);

  return (
    <div className="container-page py-10 sm:py-14 pb-24 md:pb-14">
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-3xl text-center"
      >
        <motion.div variants={motionPresets.fadeUp} className="eyebrow justify-center">
          <Search className="h-3.5 w-3.5" /> Find a ride
        </motion.div>
        <motion.h1
          variants={motionPresets.fadeUp}
          className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl text-balance"
        >
          Find a shared ride to campus.
        </motion.h1>
        <motion.p variants={motionPresets.fadeUp} className="mt-3 lead">
          Pick a vehicle, enter your route, see verified VIT-AP students heading the same way, and split the fare fairly.
        </motion.p>
      </motion.div>

      {/* Step 1: Vehicle selection */}
      <div className="mt-8">
        <StepLabel num="01" label="Choose your vehicle" />
        <div className="mt-3">
          <VehicleSelector selected={vehicle} onSelect={setVehicle} distanceKm={28} />
        </div>
      </div>

      {/* Step 2: Route input (custom, with swap + recent + current) */}
      <div className="mt-8">
        <StepLabel num="02" label="Enter your route" icon={MapPin} />
        <div className="mt-3 vride-card p-5 sm:p-6 shadow-lg">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                <MapPin className="h-3 w-3 text-ink-400" /> Pickup Location
              </label>
              <div className="relative">
                <select value={from} onChange={(e) => setFrom(e.target.value)} className="input-base pr-9">
                  {LOCATIONS.map((l) => (
                    <option key={l.id} value={l.label}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex sm:flex-col sm:items-center sm:gap-1">
              <button
                onClick={swap}
                type="button"
                className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 text-white shadow-sm hover:bg-ink-800 mx-auto"
                aria-label="Swap pickup and destination"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                <Target className="h-3 w-3 text-ink-400" /> Destination
              </label>
              <div className="relative">
                <select value={to} onChange={(e) => setTo(e.target.value)} className="input-base pr-9">
                  {LOCATIONS.map((l) => (
                    <option key={l.id} value={l.label}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={useCurrentLocation}
              type="button"
              className="chip bg-brand-50 text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100"
            >
              <Crosshair className="h-3 w-3" /> Use my current location (demo)
            </button>
          </div>

          {/* Recent + saved locations */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                Recent locations
              </div>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {RECENT_LOCATIONS.map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => setFrom(l.label)}
                      className="chip bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50"
                    >
                      <Clock className="h-3 w-3 text-ink-400" /> {l.label.split(",")[0]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                Saved locations
              </div>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {SAVED_LOCATIONS.map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => setTo(l.label)}
                      className="chip bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50"
                    >
                      <MapPin className="h-3 w-3 text-ink-400" /> {l.label.split("(")[0]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Hidden search form to trigger the loading + match flow */}
          <div className="mt-5">
            <SearchForm
              onSearch={handleSearch}
              defaults={{ from, to, date, time }}
            />
            {/* Override the form's defaults when our local state changes */}
            <input type="hidden" value={from} onChange={(e) => setFrom(e.target.value)} />
            <input type="hidden" value={to} onChange={(e) => setTo(e.target.value)} />
            <input type="hidden" value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="hidden" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {query ? (
          <LiveMatchIndicator count={nearbyHeadingToVIT} route={query.to} />
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-ink-100 px-3 py-1.5 text-xs font-medium text-ink-600">
            <Filter className="h-3.5 w-3.5" /> Showing all {vehicle ?? "any"} rides
          </span>
        )}
        <span className="text-xs text-ink-500">
          <strong className="text-ink-900">{filtered.length}</strong> ride{filtered.length !== 1 ? "s" : ""} match your filters
        </span>
      </div>

      {/* Filters */}
      <div className="mt-5 grid gap-3 rounded-3xl border border-ink-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <FilterSelect
          label="Time"
          value={filters.time}
          onChange={(v) => setFilters((f) => ({ ...f, time: v }))}
          options={[
            ["any", "Any time"],
            ["morning", "Before 9 AM"],
            ["lateMorning", "9 AM – 11 AM"],
            ["afternoon", "After 11 AM"],
          ]}
        />
        <FilterSelect
          label="Price"
          value={filters.price}
          onChange={(v) => setFilters((f) => ({ ...f, price: v }))}
          options={[
            ["any", "Any price"],
            ["low", "Under ₹120"],
            ["mid", "₹120 – ₹150"],
            ["high", "Above ₹150"],
          ]}
        />
        <FilterSelect
          label="Min seats"
          value={filters.seats}
          onChange={(v) => setFilters((f) => ({ ...f, seats: v }))}
          options={[
            ["any", "Any seats"],
            ["1", "1+ seat"],
            ["2", "2+ seats"],
            ["3", "3+ seats"],
          ]}
        />
        <FilterSelect
          label="From"
          value={filters.from}
          onChange={(v) => setFilters((f) => ({ ...f, from: v }))}
          options={[["any", "All locations"], ...LOCATIONS.map((l) => [l.label, l.label] as [string, string])]}
        />
        <button
          onClick={clearFilters}
          disabled={!hasFilters}
          className={`vride-btn h-10 text-xs ${hasFilters ? "vride-btn-ghost" : "vride-btn-ghost opacity-50"}`}
        >
          <X className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      {/* Results */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingSkeleton label="Finding students travelling your route…" rows={4} />
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <EmptyState
                icon={Inbox}
                title="No rides match your filters."
                description="Try widening your time range, picking a different vehicle, or be the first to offer a ride on this route."
                actions={
                  <>
                    <button onClick={clearFilters} className="vride-btn-ghost text-xs h-9">
                      Reset filters
                    </button>
                    <button onClick={() => navigate({ name: "offer" })} className="vride-btn-brand text-xs h-9">
                      Offer a ride
                    </button>
                  </>
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="show"
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((ride) => (
                <RideCard key={ride.id} ride={ride} navigate={navigate} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Offer ride CTA */}
      <div className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 to-brand-700 p-6 text-white sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-lime">
              Can&apos;t find your ride?
            </div>
            <h3 className="mt-1 text-2xl font-bold">Offer your own.</h3>
            <p className="mt-1 text-sm text-ink-200">
              Other students travelling your route will request to join.
            </p>
          </div>
          <button onClick={() => navigate({ name: "offer" })} className="vride-btn-accent text-sm h-11 px-6">
            Offer a Ride
          </button>
        </div>
      </div>
    </div>
  );
}

function StepLabel({
  num,
  label,
  icon: Icon,
}: {
  num: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-900 text-[10px] font-bold text-lime">
        {num}
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900">
        {Icon && <Icon className="h-3.5 w-3.5 text-ink-500" />}
        {label}
      </span>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-base appearance-none pr-9"
        >
          {options.map(([val, lbl]) => (
            <option key={String(val)} value={val}>
              {lbl}
            </option>
          ))}
        </select>
        <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      </div>
    </div>
  );
}
