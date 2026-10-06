"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CarFront,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { RouteVisualization } from "@/components/vride/RouteVisualization";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/vride/Badge";
import { staggerContainer, motionPresets, viewportOnce } from "@/lib/motion";

const STEPS = [
  {
    no: "01",
    icon: MapPin,
    title: "Enter your route",
    body: "Choose your starting location (Vijayawada, Benz Circle, Guntur, anywhere around) and your destination — usually VIT-AP University. V-Ride remembers your last route to speed things up.",
    points: [
      "Vijayawada, Guntur, Mangalagiri, Gannavaram supported",
      "Date and approximate time window",
      "Pickup point reference (e.g. near Benz Circle)",
    ],
  },
  {
    no: "02",
    icon: Search,
    title: "Find students nearby",
    body: "V-Ride shows you verified VIT-AP students heading in the same direction around the same time. Filter by price, seats, and pickup point. Tap a card to see the route preview and the group joining.",
    points: [
      "Smart route match scoring (we surface highest matches first)",
      "Filter by time window, price, available seats",
      "View organizer rating and student reviews",
    ],
  },
  {
    no: "03",
    icon: Wallet,
    title: "Split the fare",
    body: "Join a ride and V-Ride divides the total cost fairly across students. You see your share before confirming. After the ride, the saving is credited to your profile and the CO₂ saved is added to your green stats.",
    points: [
      "Transparent fare per head before joining",
      "No surge pricing — students set the fares",
      "Auto-update to your money saved and CO₂ saved",
    ],
  },
];

export function HowItWorksView({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink-200/70">
        <div className="absolute inset-0 grid-bg-light opacity-60" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="container-page relative py-14 sm:py-20">
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={motionPresets.fadeUp} className="eyebrow justify-center">
              How it works
            </motion.div>
            <motion.h1
              variants={motionPresets.fadeUp}
              className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl text-balance"
            >
              From tap to ride in under 3 minutes.
            </motion.h1>
            <motion.p variants={motionPresets.fadeUp} className="mt-3 lead">
              V-Ride is designed for students by students. Three steps. One shared ride.
              A real difference to your weekly travel budget.
            </motion.p>
            <motion.div
              variants={motionPresets.fadeUp}
              className="mt-6 flex flex-wrap justify-center gap-3"
            >
              <button
                onClick={() => navigate({ name: "find" })}
                className="vride-btn-brand text-base h-12 px-6"
              >
                Find a ride
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate({ name: "offer" })}
                className="vride-btn-ghost text-base h-12 px-6"
              >
                Offer a ride
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container-page space-y-10">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.no}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12"
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-900 text-lime shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-4xl font-extrabold text-ink-100">{step.no}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-ink-500">{step.body}</p>
                  <ul className="mt-4 space-y-2">
                    {step.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-ink-700">
                        <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                          ✓
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <StepVisual step={step.no} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow justify-center">Route preview</div>
            <h2 className="mt-3 h-section">See your full route before you commit.</h2>
            <p className="mt-3 lead">
              Every ride on V-Ride ships with a clear pickup → drop map. Tap View Ride on
              any card to see it in detail.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-4xl">
            <RouteVisualization />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="grid gap-4 rounded-3xl bg-ink-950 p-6 text-white sm:p-8 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Verified only", desc: "Every rider is a VIT-AP student." },
              { icon: Star, title: "4.9 rating", desc: "Average across 120+ rides this week." },
              { icon: Users, title: "120+ matches", desc: "Students matched this week." },
              { icon: CarFront, title: "40% saved", desc: "Average fare saved per ride." },
            ].map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur"
                >
                  <Icon className="h-5 w-5 text-lime" />
                  <div className="mt-2 text-sm font-semibold">{t.title}</div>
                  <div className="text-xs text-ink-300">{t.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page text-center">
          <h2 className="h-section">Ready to ride smarter?</h2>
          <p className="mt-3 lead mx-auto max-w-xl">
            Join V-Ride, share your next ride to VIT-AP, and split the fare with fellow
            students.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate({ name: "find" })} className="vride-btn-brand text-base h-12 px-6">
              Find a ride
            </button>
            <button onClick={() => navigate({ name: "offer" })} className="vride-btn-ghost text-base h-12 px-6">
              Offer a ride
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepVisual({ step }: { step: string }) {
  return (
    <div className="vride-card p-5 sm:p-6 shadow-lg">
      {step === "01" && (
        <div className="grid gap-3">
          <Field label="From" value="Vijayawada" />
          <Field label="To" value="VIT-AP University" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" value="Today" />
            <Field label="Time" value="8:00 AM" />
          </div>
          <div className="rounded-2xl bg-ink-900 p-3 text-center text-sm font-semibold text-white">
            Find rides
          </div>
        </div>
      )}
      {step === "02" && (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-ink-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-ink-900">
                  Vijayawada → VIT-AP
                </div>
                <Badge tone="green">{92 - i * 4}% match</Badge>
              </div>
              <div className="mt-1 text-xs text-ink-500">8:0{i} AM • 2/{4 - i} seats</div>
            </div>
          ))}
        </div>
      )}
      {step === "03" && (
        <div className="grid gap-3">
          <div className="rounded-2xl border border-ink-200 bg-gradient-to-br from-brand-50 to-emerald-50 p-4 ring-1 ring-brand-100">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-brand-700">
              <span>Ride total</span>
              <span>Split by 3</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-3xl font-bold text-ink-900 line-through decoration-coral/60 decoration-2">
                {formatINR(450)}
              </div>
              <ArrowRight className="h-5 w-5 text-ink-400" />
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-brand-600">
                  You pay
                </div>
                <div className="text-3xl font-extrabold text-brand-700">
                  {formatINR(150)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-3">
      <div className="text-[10px] uppercase tracking-wider text-ink-400">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-ink-900">{value}</div>
    </div>
  );
}
