"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, MapPin, Clock, Car } from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { useVRideStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/vride/Badge";
import { CostSplitTable } from "@/components/vride/CostSplitTable";

export function ConfirmRideView({
  rideId,
  navigate,
}: {
  rideId: string;
  navigate: (r: Route) => void;
}) {
  const ride = useVRideStore((s) => [...s.offered, ...s.pool].find((r) => r.id === rideId));
  const joinRide = useVRideStore((s) => s.joinRide);
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!ride) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Ride not found</h1>
      </div>
    );
  }

  const handleConfirm = () => {
    setConfirming(true);
    window.setTimeout(() => {
      setConfirming(false);
      setConfirmed(true);
      joinRide(ride.id);
      toast({
        title: "Ride confirmed!",
        description: "You're now part of this shared ride.",
      });
    }, 1100);
  };

  return (
    <div className="container-page py-8 sm:py-10 max-w-3xl">
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => navigate({ name: "ride", id: rideId })}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <AnimatePresence mode="wait">
        {confirmed ? (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="vride-card overflow-hidden"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-center text-white">
              <div className="absolute inset-0 grid-bg-dark opacity-30" />
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 14 }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-brand-600 ring-4 ring-white/30"
              >
                <CheckCircle2 className="h-9 w-9" />
              </motion.span>
              <h2 className="mt-4 text-2xl font-extrabold">You're in! ✅</h2>
              <p className="mt-1 text-sm text-brand-50">Your ride is confirmed.</p>
            </div>
            <div className="p-6">
              <div className="rounded-2xl border border-ink-200 bg-ink-50/60 p-4">
                <div className="text-[11px] uppercase tracking-wider text-ink-500">People travelling</div>
                <ul className="mt-3 space-y-2 text-sm text-ink-900">
                  <li className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500 text-white text-[10px]">You</span>
                    <span>Lokesh Kumar</span>
                    <span className="ml-auto text-[11px] text-ink-500">Pickup: {ride.pickup}</span>
                  </li>
                  {ride.members.slice(0, 3).map((id, i) => (
                    <li key={id} className="flex items-center gap-2 text-xs text-ink-700">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-ink-200 text-ink-700 text-[10px]">{i + 2}</span>
                      <span>Student {id}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate({ name: "chat", id: rideId })}
                  className="vride-btn-brand text-sm h-11 px-6"
                >
                  Open chat
                </button>
                <button
                  onClick={() => navigate({ name: "live", id: rideId })}
                  className="vride-btn-accent text-sm h-11 px-6"
                >
                  Start demo ride
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate({ name: "dashboard" })}
                  className="vride-btn-ghost text-sm h-11 px-6"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="vride-card overflow-hidden"
          >
            <div className="border-b border-ink-100 bg-ink-950 px-5 py-4 text-white">
              <h2 className="text-xl font-bold">Confirm Your Ride</h2>
              <p className="text-xs text-ink-300 mt-0.5">
                Review the summary and confirm to join.
              </p>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <Row label="From" value={ride.from} icon={MapPin} />
              <Row label="To" value={ride.to} icon={MapPin} />
              <Row label="Vehicle" value={`${vehicleLabel(ride.vehicleType)} • ${ride.vehicleNumber}`} icon={Car} />
              <Row label="Departure" value={`${ride.date} • ${ride.time}`} icon={Clock} />
              <Row label="Distance / Travel" value={`${ride.distanceKm} km • ${ride.durationMin} min`} icon={MapPin} />

              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-ink-200 bg-ink-50/40 p-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-500">Estimated total</div>
                  <div className="text-2xl font-extrabold text-ink-900">{formatINR(ride.totalFare)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-brand-700">Your share</div>
                  <div className="text-2xl font-extrabold text-brand-700">{formatINR(ride.perHead)}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-ink-200 bg-white p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-600">Available seats</span>
                  <Badge tone="blue">{ride.seatsTotal - ride.seatsTaken} seats left</Badge>
                </div>
              </div>

              <CostSplitTable total={ride.totalFare} selectedStudents={ride.seatsTaken + 1} />

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-2">
                <button
                  onClick={() => navigate({ name: "ride", id: rideId })}
                  className="vride-btn-ghost text-sm h-11"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="vride-btn-brand text-sm h-11 px-6"
                >
                  {confirming ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Confirming…
                    </>
                  ) : (
                    <>Confirm Ride</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-3">
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

function vehicleLabel(t: string) {
  return t === "bike" ? "Bike" : t === "auto" ? "Auto" : "Car";
}
