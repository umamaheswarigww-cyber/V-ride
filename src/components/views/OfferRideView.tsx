"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CarFront,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { useToast } from "@/hooks/use-toast";
import { useVRideStore } from "@/lib/store";
import { LOCATIONS, type Ride } from "@/lib/mock";
import { formatINR } from "@/lib/format";
import { motionPresets } from "@/lib/motion";
import { Badge } from "@/components/vride/Badge";

type FormState = {
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  fare: number;
  pickup: string;
};

export function OfferRideView({ navigate }: { navigate: (r: Route) => void }) {
  const { toast } = useToast();
  const offerRide = useVRideStore((s) => s.offerRide);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<Ride | null>(null);
  const [form, setForm] = useState<FormState>({
    from: "Vijayawada",
    to: "VIT-AP University",
    date: "Today",
    time: "8:00 AM",
    seats: 3,
    fare: 450,
    pickup: "Benz Circle",
  });

  const update = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const perHeadPreview = Math.max(
    1,
    Math.round(Number(form.fare || 0) / Math.max(1, Number(form.seats) + 1)),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      const newRide: Ride = {
        id: `user-${Date.now()}`,
        from: form.from,
        to: form.to,
        date: form.date,
        time: form.time,
        pickup: form.pickup,
        seatsTotal: Number(form.seats) + 1,
        seatsTaken: 1,
        totalFare: Number(form.fare),
        perHead: Math.round(Number(form.fare) / (Number(form.seats) + 1)),
        vehicleType: "Cab",
        note: "Created by you — VIT-AP student organizer.",
        matchScore: 100,
        members: ["stu-6"],
        organizer: "You",
        organizerId: "stu-6",
        timeValue: 8,
      };
      offerRide(newRide);
      setCreated(newRide);
      setSubmitting(false);
      toast({
        title: "Ride created successfully",
        description: "Students can now request to join.",
      });
    }, 1100);
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <div className="eyebrow justify-center">
          <CarFront className="h-3.5 w-3.5" /> Offer a ride
        </div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl text-balance">
          Turn your commute into a shared ride.
        </h1>
        <p className="mt-3 lead">
          Enter your route and let verified VIT-AP students request to join. You control
          who rides with you.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {created ? (
              <ConfirmationCard
                key="confirm"
                ride={created}
                onViewDashboard={() => navigate({ name: "dashboard" })}
              />
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                onSubmit={handleSubmit}
                className="rounded-3xl border border-ink-200 bg-white p-5 shadow-lg sm:p-7"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="From" icon={MapPin}>
                    <select
                      value={form.from}
                      onChange={(e) => update("from", e.target.value)}
                      className="input-base"
                    >
                      {LOCATIONS.map((l) => (
                        <option key={l.id} value={l.label}>{l.label}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="To" icon={MapPin}>
                    <select
                      value={form.to}
                      onChange={(e) => update("to", e.target.value)}
                      className="input-base"
                    >
                      {LOCATIONS.map((l) => (
                        <option key={l.id} value={l.label}>{l.label}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Date" icon={Calendar}>
                    <select
                      value={form.date}
                      onChange={(e) => update("date", e.target.value)}
                      className="input-base"
                    >
                      <option>Today</option>
                      <option>Tomorrow</option>
                      <option>This Weekend</option>
                      <option>Next Monday</option>
                    </select>
                  </Field>
                  <Field label="Time" icon={Clock}>
                    <select
                      value={form.time}
                      onChange={(e) => update("time", e.target.value)}
                      className="input-base"
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
                  <Field label="Available Seats" icon={Users}>
                    <select
                      value={form.seats}
                      onChange={(e) => update("seats", Number(e.target.value))}
                      className="input-base"
                    >
                      {[1, 2, 3, 4, 5].map((s) => (
                        <option key={s} value={s}>
                          {s} seats
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Estimated Total Fare" icon={Wallet}>
                    <input
                      type="number"
                      min={50}
                      step={10}
                      value={form.fare}
                      onChange={(e) => update("fare", Number(e.target.value))}
                      className="input-base"
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Pickup Point" icon={MapPin}>
                      <input
                        type="text"
                        value={form.pickup}
                        onChange={(e) => update("pickup", e.target.value)}
                        placeholder="e.g. Benz Circle, near Hanuman statue"
                        className="input-base"
                      />
                    </Field>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-ink-200 bg-gradient-to-br from-brand-50 to-emerald-50 p-5 ring-1 ring-brand-100">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-brand-700">
                    <span>Live preview</span>
                    <span>Auto-calculated</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-ink-500">
                        Total fare
                      </div>
                      <div className="text-2xl font-bold text-ink-900">
                        {formatINR(form.fare)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-ink-500">
                        Sharing
                      </div>
                      <div className="text-2xl font-bold text-ink-900">
                        {Number(form.seats) + 1}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-brand-600">
                        Per head
                      </div>
                      <div className="text-2xl font-bold text-brand-700">
                        {formatINR(perHeadPreview)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-ink-500">
                    Only verified VIT-AP students will see your ride.
                  </p>
                  <button
                    type="submit"
                    className="vride-btn-brand text-sm h-11 px-6"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating ride…
                      </>
                    ) : (
                      <>
                        Create Ride
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-5">
          <div className="space-y-4">
            <div className="vride-card p-5">
              <h3 className="text-base font-semibold text-ink-900">
                Why students offer rides
              </h3>
              <ul className="mt-3 space-y-3">
                {[
                  ["Save up to 60%", "Recover part of your commute cost from co-riders."],
                  ["Build trust", "Verified student reviews grow your ride score."],
                  ["Reduce CO₂", "Fewer autos on the road — cleaner air around campus."],
                ].map(([title, desc]) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                      ✓
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-ink-900">{title}</div>
                      <div className="text-xs text-ink-500">{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-ink-950 p-5 text-white">
              <div className="text-xs font-medium uppercase tracking-wider text-lime">
                Tip
              </div>
              <h3 className="mt-1 text-base font-semibold">Set realistic fares.</h3>
              <p className="mt-1.5 text-xs text-ink-200">
                Use what an auto or cab to VIT-AP would actually cost you. V-Ride suggests a
                per-head split based on it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
        {Icon && <Icon className="h-3 w-3 text-ink-400" />}
        {label}
      </label>
      {children}
    </div>
  );
}

function ConfirmationCard({
  ride,
  onViewDashboard,
}: {
  ride: Ride;
  onViewDashboard: () => void;
}) {
  return (
    <motion.div
      variants={motionPresets.scaleIn}
      initial="hidden"
      animate="show"
      className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-7 text-center shadow-lg"
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 14 }}
        className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white shadow-lg ring-4 ring-emerald-100"
      >
        <CheckCircle2 className="h-8 w-8" />
      </motion.span>
      <h3 className="mt-5 text-2xl font-bold text-ink-900">
        Ride created successfully
      </h3>
      <p className="mt-1.5 text-sm text-ink-500">
        Students travelling your route can now request to join.
      </p>

      <div className="mx-auto mt-6 max-w-md rounded-3xl border border-ink-200 bg-white p-5">
        <div className="flex items-center justify-between text-sm font-semibold text-ink-900">
          <span>{ride.from}</span>
          <ArrowRight className="h-4 w-4 text-ink-400" />
          <span>{ride.to}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <Mini label="Pickup" value={ride.pickup} />
          <Mini label="Time" value={`${ride.date} ${ride.time}`} />
          <Mini label="Per head" value={formatINR(ride.perHead)} tone="brand" />
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          <Badge tone="blue">Your ride is live</Badge>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={onViewDashboard} className="vride-btn-brand text-sm h-11 px-6">
          View on Dashboard
        </button>
      </div>
    </motion.div>
  );
}

function Mini({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "brand";
}) {
  const tones = { ink: "text-ink-900", brand: "text-brand-700" };
  return (
    <div className="rounded-2xl bg-ink-50 p-3 ring-1 ring-ink-200/70">
      <div className="text-[10px] uppercase tracking-wider text-ink-400">{label}</div>
      <div className={`text-sm font-bold ${tones[tone]}`}>{value}</div>
    </div>
  );
}
