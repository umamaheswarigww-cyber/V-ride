"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Loader2, MapPin, Search } from "lucide-react";
import { LOCATIONS } from "@/lib/mock";

export type SearchQuery = {
  from: string;
  to: string;
  date: string;
  time: string;
};

export function SearchForm({
  onSearch,
  defaults = {},
}: {
  onSearch: (q: SearchQuery) => void;
  defaults?: Partial<SearchQuery>;
}) {
  const [from, setFrom] = useState(defaults.from ?? "Vijayawada");
  const [to, setTo] = useState(defaults.to ?? "VIT-AP University");
  const [date, setDate] = useState(defaults.date ?? "Today");
  const [time, setTime] = useState(defaults.time ?? "8:00 AM");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onSearch({ from, to, date, time });
    }, 850);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-ink-200 bg-white p-5 sm:p-6 shadow-lg"
    >
      <div className="grid gap-3 md:grid-cols-12 md:items-end">
        <Field label="From" icon={MapPin} className="md:col-span-4">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="input-base pr-9"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.label}>{loc.label}</option>
            ))}
          </select>
        </Field>
        <Field label="To" icon={MapPin} className="md:col-span-4">
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="input-base pr-9"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.label}>{loc.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Date" icon={Calendar} className="md:col-span-2">
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-base pr-9"
          >
            <option>Today</option>
            <option>Tomorrow</option>
            <option>This Weekend</option>
            <option>Next Monday</option>
          </select>
        </Field>
        <Field label="Time" icon={Clock} className="md:col-span-2">
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input-base pr-9"
          >
            {[
              "6:00 AM",
              "7:00 AM",
              "7:30 AM",
              "8:00 AM",
              "8:30 AM",
              "9:00 AM",
              "9:30 AM",
              "10:00 AM",
              "10:15 AM",
              "11:00 AM",
              "12:00 PM",
              "4:00 PM",
              "6:00 PM",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-500">
          We never show real names outside verified VIT-AP students.
        </p>
        <button
          type="submit"
          className="vride-btn-brand h-11 sm:w-auto"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Finding students…
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Find Rides
            </>
          )}
        </button>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-3 text-sm text-brand-700"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          Finding students travelling your route…
        </motion.div>
      )}
    </form>
  );
}

function Field({
  label,
  icon: Icon,
  className,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
        {Icon && <Icon className="h-3 w-3 text-ink-400" />}
        {label}
      </label>
      <div className="relative">{children}</div>
    </div>
  );
}
