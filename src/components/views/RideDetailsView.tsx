"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  CarFront,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Sparkles,
  MessageSquare,
  Navigation,
} from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { useVRideStore } from "@/lib/store";
import { getStudentById } from "@/lib/mock";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/vride/Badge";
import { StatusBadge, PaymentBadge } from "@/components/vride/StatusBadge";
import { RoutePreviewCard } from "@/components/vride/RoutePreviewCard";
import { FareBreakdown } from "@/components/vride/FareBreakdown";
import { CostSplitTable } from "@/components/vride/CostSplitTable";

const VEH_LABEL: Record<string, string> = {
  bike: "Bike",
  auto: "Auto",
  car: "Car",
};

export function RideDetailsView({
  id,
  navigate,
}: {
  id: string;
  navigate: (r: Route) => void;
}) {
  const ride = useVRideStore((s) => [...s.offered, ...s.pool].find((r) => r.id === id));
  const joined = useVRideStore((s) => s.joinedIds.includes(id));
  const status = useVRideStore((s) => s.rideStatus[id] ?? "upcoming");
  const payments = useVRideStore((s) => s.payments[id] ?? {});
  const markPaid = useVRideStore((s) => s.markPaid);

  if (!ride) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Ride not found</h1>
        <button onClick={() => navigate({ name: "find" })} className="vride-btn-brand mt-4">
          Back to Find Ride
        </button>
      </div>
    );
  }

  const organizer = getStudentById(ride.organizerId)!;
  const members = ride.members.map(getStudentById).filter(Boolean);
  const seatsLeft = ride.seatsTotal - ride.seatsTaken;

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} pulse={status !== "completed" && status !== "cancelled"} />
          <Badge tone="green">{ride.matchScore}% match</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: route + organizer + members + payment split */}
        <div className="lg:col-span-7 space-y-5">
          {/* Route header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="vride-card p-5 sm:p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
              <CarFront className="h-3.5 w-3.5" /> Shared ride
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              <span>{ride.from}</span>
              <ArrowRight className="h-6 w-6 text-brand-500" />
              <span>{ride.to}</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <DetailRow icon={Calendar} label="Date" value={ride.date} />
              <DetailRow icon={Clock} label="Departure" value={ride.time} />
              <DetailRow icon={MapPin} label="Pickup point" value={ride.pickup} />
              <DetailRow icon={Users} label="Seats" value={`${ride.seatsTaken}/${ride.seatsTotal} taken`} />
              <DetailRow icon={CarFront} label="Vehicle" value={`${VEH_LABEL[ride.vehicleType]} • ${ride.vehicleNumber}`} />
              <DetailRow icon={Navigation} label="Distance / Travel" value={`${ride.distanceKm} km • ${ride.durationMin} min`} />
            </div>

            {ride.note && (
              <div className="mt-4 rounded-2xl border border-ink-200 bg-ink-50/60 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                  Note from organizer
                </div>
                <p className="mt-1 text-sm text-ink-700">“{ride.note}”</p>
              </div>
            )}
          </motion.div>

          <RoutePreviewCard ride={ride} />

          {/* Students joining */}
          <div className="vride-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-ink-900">Students joining</h3>
                <p className="text-xs text-ink-500">
                  {members.length + (joined ? 1 : 0)} verified VIT-AP students
                </p>
              </div>
              <Badge tone="blue">
                <ShieldCheck className="h-3 w-3" /> Verified group
              </Badge>
            </div>
            <ul className="mt-4 space-y-3">
              {joined && (
                <li className="flex items-center gap-3 rounded-2xl border-2 border-brand-300 bg-brand-50/60 p-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 text-white text-[10px] font-bold">
                    YOU
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                      Lokesh Kumar <Badge tone="blue">Verified</Badge>
                    </div>
                    <div className="text-xs text-ink-500">CSE • 2nd Year • Seat {members.length + 1}</div>
                  </div>
                  <PaymentBadge status={payments["stu-6"] ?? "pending"} />
                </li>
              )}
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50/60 p-3"
                >
                  <img src={m.avatar} alt={m.name} className="h-10 w-10 rounded-xl object-cover ring-2 ring-white" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                      <span className="truncate">{m.name}</span>
                      {m.verified && <Badge tone="blue">Verified</Badge>}
                    </div>
                    <div className="text-xs text-ink-500">{m.branch} • {m.year}</div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 text-xs text-ink-600">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {m.rating}
                    </div>
                    <div className="text-[10px] text-ink-400">{m.rides} rides</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment split (only when joined) */}
          {joined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="vride-card p-5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-ink-900">Payment split</h3>
                <Badge tone="green">Demo</Badge>
              </div>
              <p className="mt-1 text-xs text-ink-500">
                See who has paid their share. You can mark your own payment as paid.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center justify-between rounded-2xl border border-ink-200 bg-ink-50/40 p-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-white text-[10px]">YOU</span>
                    <div>
                      <div className="text-sm font-semibold text-ink-900">Lokesh Kumar</div>
                      <div className="text-[11px] text-ink-500">Your share</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-ink-900">{formatINR(ride.perHead)}</span>
                    <PaymentBadge status={payments["stu-6"] ?? "pending"} />
                    {(payments["stu-6"] ?? "pending") === "pending" && (
                      <button
                        onClick={() => markPaid(ride.id, "stu-6")}
                        className="vride-btn-brand text-[11px] h-7 px-3"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </div>
                </li>
                {members.map((m) => {
                  const status = payments[m.id] ?? "paid";
                  return (
                    <li
                      key={m.id}
                      className="flex items-center justify-between rounded-2xl border border-ink-200 bg-white p-3"
                    >
                      <div className="flex items-center gap-3">
                        <img src={m.avatar} alt={m.name} className="h-8 w-8 rounded-lg object-cover" />
                        <div>
                          <div className="text-sm font-semibold text-ink-900">{m.name}</div>
                          <div className="text-[11px] text-ink-500">Shared share</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-ink-900">{formatINR(ride.perHead)}</span>
                        <PaymentBadge status={status} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Right: sticky CTA */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="vride-card p-5 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-500">
                    Per head
                  </div>
                  <div className="text-4xl font-extrabold text-brand-700">
                    {formatINR(ride.perHead)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider text-ink-500">
                    You save
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatINR(Math.max(0, ride.totalFare - ride.perHead))}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center gap-3 rounded-2xl bg-ink-50 p-3 ring-1 ring-ink-200/70">
                  <img
                    src={organizer.avatar}
                    alt={organizer.name}
                    className="h-11 w-11 rounded-xl object-cover ring-2 ring-white"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-ink-900">
                      Organizer: {organizer.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ink-500">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {organizer.rating} • {organizer.rides} rides
                    </div>
                  </div>
                  {organizer.verified && <Badge tone="blue">Verified</Badge>}
                </div>
              </div>

              <FareBreakdown ride={ride} />

              <div className="mt-4">
                <CostSplitTable total={ride.totalFare} selectedStudents={ride.seatsTaken + 1} />
              </div>

              <AnimatePresence mode="wait">
                {joined ? (
                  <motion.div
                    key="joined"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-5 space-y-2"
                  >
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                      <div className="mt-1 text-sm font-semibold text-ink-900">
                        You're in! See you on the ride.
                      </div>
                      <div className="text-xs text-ink-500">
                        Status: <StatusBadge status={status} />
                      </div>
                    </div>
                    <button
                      onClick={() => navigate({ name: "chat", id: ride.id })}
                      className="vride-btn-ghost w-full text-sm h-11"
                    >
                      <MessageSquare className="h-4 w-4" /> Open chat
                    </button>
                    <button
                      onClick={() => navigate({ name: "live", id: ride.id })}
                      className="vride-btn-accent w-full text-sm h-11"
                    >
                      <Navigation className="h-4 w-4" /> Start demo live ride
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="join"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-5"
                  >
                    <button
                      onClick={() => navigate({ name: "confirm", id: ride.id })}
                      className="vride-btn-brand w-full text-base h-12"
                      disabled={seatsLeft <= 0}
                    >
                      {seatsLeft > 0 ? "Join this Ride" : "Ride Full"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <p className="mt-2 text-center text-[11px] text-ink-500">
                      You won't be charged in this prototype.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="rounded-3xl bg-ink-950 p-5 text-white">
              <div className="flex items-center gap-2 text-lime">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  What you get
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-ink-200">
                <li>• Transparent fare split before joining</li>
                <li>• Verified VIT-AP student co-riders</li>
                <li>• Pickup, route, and live ETA preview</li>
                <li>• Group chat with co-riders</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  small = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl ${
        small ? "bg-ink-50/60 p-2.5 ring-1 ring-ink-200/70" : "border border-ink-200 bg-white p-3.5"
      }`}
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-ink-400">{label}</div>
        <div className="text-sm font-semibold text-ink-900">{value}</div>
      </div>
    </div>
  );
}

// Helper hook to avoid clutter — just a controlled modal state.
// Reserved for future confirm modal in this view.
