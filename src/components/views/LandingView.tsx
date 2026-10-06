"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, Search, UserPlus, Wallet } from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { Hero } from "@/components/vride/Hero";
import { FareCalculator } from "@/components/vride/FareCalculator";
import { RouteVisualization } from "@/components/vride/RouteVisualization";
import { Badge } from "@/components/vride/Badge";
import { formatINR } from "@/lib/format";
import {
  fadeUp,
  motionPresets,
  staggerContainer,
  viewportOnce,
} from "@/lib/motion";

export function LandingView({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <div>
      <Hero navigate={navigate} />

      <section className="border-y border-ink-200/70 bg-white">
        <div className="container-page py-6">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            {[
              { label: "Students matched", value: "120+" },
              { label: "Avg. fare saved", value: "40%" },
              { label: "Verified rides", value: "100%" },
              { label: "Avg rating", value: "4.9" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-ink-900">{s.value}</div>
                <div className="text-[11px] uppercase tracking-wider text-ink-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProblemSection />
      <HowItWorks navigate={navigate} />
      <RoutePreview navigate={navigate} />
      <SavingsCalculator navigate={navigate} />
      <TrustSafety navigate={navigate} />
      <SocialProof />
      <FinalCTA navigate={navigate} />
    </div>
  );
}

function ProblemSection() {
  const problems = [
    {
      title: "High Demand",
      desc: "Peak times can make fares expensive. A 6 AM auto from Vijayawada costs a lot more than a 9 AM one.",
      icon: Clock,
      tone: "amber",
    },
    {
      title: "Same Destination",
      desc: "Many students from your area are heading to VIT-AP around the exact same time as you.",
      icon: MapPin,
      tone: "blue",
    },
    {
      title: "Empty Seats",
      desc: "Three separate rides mean three empty seats, three bills, and three times the carbon footprint.",
      icon: Wallet,
      tone: "coral",
    },
  ];

  const tones: Record<string, string> = {
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    blue: "bg-brand-50 text-brand-600 ring-brand-100",
    coral: "bg-coral/10 text-coral ring-coral/30",
  };

  return (
    <section className="section">
      <div className="container-page">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div variants={fadeUp()} className="eyebrow justify-center">
            The problem
          </motion.div>
          <motion.h2 variants={fadeUp(0.05)} className="mt-3 h-section text-balance">
            Why pay the full fare alone?
          </motion.h2>
          <motion.p variants={fadeUp(0.1)} className="mt-3 lead">
            Three students, three autos, three full bills. Same destination, same time,
            three times the cost.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 grid gap-5 sm:grid-cols-3"
        >
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                variants={motionPresets.card}
                className="vride-card vride-card-hover p-6"
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${tones[p.tone]}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink-900">{p.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          <div className="grid items-stretch gap-4 rounded-3xl border border-ink-200 bg-white p-5 shadow-lg sm:p-8 md:grid-cols-2">
            <div className="rounded-3xl border border-ink-200 bg-ink-50 p-6 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Traditional
              </div>
              <div className="mt-2 text-5xl font-extrabold text-ink-900">
                {formatINR(250)}
              </div>
              <div className="mt-1 text-xs text-ink-500">per student, paying alone</div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-xs text-ink-400">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-white p-2 text-center ring-1 ring-ink-200"
                  >
                    Student {i}
                    <div className="mt-1 font-bold text-ink-900">{formatINR(250)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-ink-900 p-2 text-sm font-semibold text-white">
                Total: {formatINR(750)}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-center text-white shadow-lg">
              <div className="absolute inset-0 grid-bg-dark opacity-40" />
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-lime">
                  <Badge tone="lime">V-Ride</Badge>
                </div>
                <div className="mt-2 text-5xl font-extrabold">{formatINR(150)}</div>
                <div className="mt-1 text-xs text-brand-100">
                  per student, sharing a ride
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-xs text-brand-100">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-white/10 p-2 text-center ring-1 ring-white/15 backdrop-blur"
                    >
                      Student {i}
                      <div className="mt-1 font-bold text-white">{formatINR(150)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-white/10 p-2 text-sm font-semibold ring-1 ring-white/15">
                  Total: {formatINR(450)} • Save {formatINR(100)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks({ navigate }: { navigate: (r: Route) => void }) {
  const steps = [
    {
      no: "01",
      title: "Enter your route",
      desc: "Pick your starting location and destination — Vijayawada, Benz Circle, Guntur, anywhere around VIT-AP.",
      icon: MapPin,
    },
    {
      no: "02",
      title: "Find students nearby",
      desc: "See verified VIT-AP students travelling around the same time. Filter by price, seats, and pickup point.",
      icon: Search,
    },
    {
      no: "03",
      title: "Split the fare",
      desc: "Join the ride and divide the cost fairly. Pay your share, save money, and travel together.",
      icon: Wallet,
    },
  ];

  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow justify-center">How it works</div>
          <h2 className="mt-3 h-section">From signup to shared ride in 3 steps.</h2>
          <p className="mt-3 lead">
            No middlemen. No surge fees. Just students helping each other reach campus on
            time, on budget.
          </p>
        </div>

        <div className="relative mt-12 grid gap-5 md:grid-cols-3">
          <div className="pointer-events-none absolute inset-x-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent md:block" />

          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.no}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="vride-card vride-card-hover h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-900 text-lime shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-3xl font-extrabold text-ink-100">{s.no}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-ink-900">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button onClick={() => navigate({ name: "how" })} className="vride-btn-ghost text-sm h-10">
            See full guide
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function RoutePreview({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <section className="section">
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="eyebrow">Live route preview</div>
            <h2 className="mt-3 h-section">
              One ride. Three students.{" "}
              <span className="gradient-text">One third the cost.</span>
            </h2>
            <p className="mt-3 lead">
              V-Ride matches students heading in the same direction around the same time,
              and draws the route for you to preview before you commit. No surprises at
              pickup.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Verified VIT-AP student profiles only",
                "Transparent fare shown upfront",
                "Pickup and drop points clearly mapped",
                "Smart route match scoring",
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-ink-700">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => navigate({ name: "find" })} className="vride-btn-brand text-sm h-10">
                Browse live rides
              </button>
              <button onClick={() => navigate({ name: "offer" })} className="vride-btn-ghost text-sm h-10">
                Offer your ride
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <RouteVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SavingsCalculator({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow justify-center">Try it</div>
          <h2 className="mt-3 h-section">Drag, see, save.</h2>
          <p className="mt-3 lead">
            Move the sliders to find out how much you could save by sharing a V-Ride.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-4xl">
          <FareCalculator navigate={navigate} />
        </div>
      </div>
    </section>
  );
}

function TrustSafety({ navigate }: { navigate: (r: Route) => void }) {
  const items = [
    {
      title: "Student Verification",
      desc: "Only verified VIT-AP student profiles can participate in a ride.",
      tone: "blue",
    },
    {
      title: "Transparent Fare",
      desc: "See estimated cost per person before you tap Join Ride — no surprises.",
      tone: "green",
    },
    {
      title: "Group Visibility",
      desc: "Know exactly who is joining your ride. Names, ratings, branches, photos.",
      tone: "amber",
    },
    {
      title: "Report & Block",
      desc: "Flag suspicious behaviour. Block a student. We act on reports fast.",
      tone: "coral",
    },
  ];
  const tones: Record<string, string> = {
    blue: "bg-brand-50 text-brand-600 ring-brand-100",
    green: "bg-emerald-50 text-brand-600 ring-emerald-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    coral: "bg-coral/10 text-coral ring-coral/30",
  };

  return (
    <section className="section">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow justify-center">Trust & safety</div>
          <h2 className="mt-3 h-section">Safer by design, because it’s students only.</h2>
          <p className="mt-3 lead">
            Trust is the foundation of ride-sharing. We bake it into every step of the
            V-Ride flow.
          </p>
        </div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={motionPresets.card}
              className="vride-card vride-card-hover p-6"
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl text-base font-bold ring-1 ${tones[item.tone]}`}
              >
                ✓
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <button onClick={() => navigate({ name: "safety" })} className="vride-btn-ghost text-sm h-10">
            Read the safety promise
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const reviews = [
    {
      name: "Sneha Reddy",
      branch: "ECE, 2nd Year",
      avatar: "https://i.pravatar.cc/96?img=47",
      text: "Split ₹450 three ways for a Vijayawada → VIT-AP ride. I usually pay ₹250 alone. V-Ride saved my weekly travel budget.",
    },
    {
      name: "Arjun Naidu",
      branch: "Mech, 4th Year",
      avatar: "https://i.pravatar.cc/96?img=14",
      text: "Matched with two seniors going my route. The route map showed me the pickup point exactly. Feels like a small campus carpool family.",
    },
    {
      name: "Ananya Rao",
      branch: "IT, 2nd Year",
      avatar: "https://i.pravatar.cc/96?img=32",
      text: "I trust the verified badge. Knowing everyone is from VIT-AP makes sharing a ride feel completely safe.",
    },
  ];

  return (
    <section className="section bg-ink-950 relative overflow-hidden text-white">
      <div className="absolute inset-0 grid-bg-dark opacity-40" />
      <div className="absolute -top-32 left-1/2 h-96 w-[60%] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="container-page relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-lime ring-1 ring-white/10">
            From the VIT-AP community
          </div>
          <h2 className="mt-3 h-section text-white">
            Students are already saving money.
          </h2>
        </div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 grid gap-5 sm:grid-cols-3"
        >
          {reviews.map((r) => (
            <motion.div
              key={r.name}
              variants={motionPresets.card}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-200">“{r.text}”</p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="h-10 w-10 rounded-xl object-cover ring-2 ring-white/10"
                />
                <div>
                  <div className="text-sm font-semibold text-white">{r.name}</div>
                  <div className="text-xs text-ink-300">{r.branch}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTA({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <section className="section">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-900 to-brand-700 p-8 text-white shadow-lg sm:p-12"
        >
          <div className="absolute inset-0 grid-bg-dark opacity-30" />
          <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-lime/20 blur-3xl" />
          <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium ring-1 ring-white/15">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
                </span>
                Same route. Same destination. Share the ride. Split the cost.
              </div>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl text-balance">
                Ready to ride smarter and pay less?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-200 sm:text-base">
                Join V-Ride today and turn your next ride to VIT-AP into a cheaper, friendlier,
                greener one.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => navigate({ name: "find" })} className="vride-btn-accent text-base h-12 px-6">
                  Find a Ride
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => navigate({ name: "offer" })} className="vride-btn-ghost-dark text-base h-12 px-6">
                  Offer a Ride
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
                <div className="rounded-3xl bg-white/5 p-5 text-center ring-1 ring-white/10 backdrop-blur">
                  <div className="text-3xl font-extrabold">120+</div>
                  <div className="text-xs text-ink-300">Students matched this week</div>
                </div>
                <div className="rounded-3xl bg-white/5 p-5 text-center ring-1 ring-white/10 backdrop-blur">
                  <div className="text-3xl font-extrabold">40%</div>
                  <div className="text-xs text-ink-300">Avg fare saved</div>
                </div>
                <div className="rounded-3xl bg-lime/15 p-5 text-center ring-1 ring-lime/30 backdrop-blur">
                  <div className="text-3xl font-extrabold text-lime">4.9</div>
                  <div className="text-xs text-ink-300">Avg student rating</div>
                </div>
                <div className="rounded-3xl bg-white/5 p-5 text-center ring-1 ring-white/10 backdrop-blur">
                  <div className="text-3xl font-extrabold">100%</div>
                  <div className="text-xs text-ink-300">Verified VIT-AP students</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
