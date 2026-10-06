"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Flag,
  HeartHandshake,
  Lock,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { staggerContainer, motionPresets, viewportOnce } from "@/lib/motion";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Student Verification",
    desc: "Only verified VIT-AP student profiles can participate in a ride. We check student email, ID, and branch before allowing a student to offer or join a ride.",
  },
  {
    icon: Wallet,
    title: "Transparent Fare",
    desc: "See the estimated cost per person before you tap Join Ride. The total fare and per-head split is shown on every ride card and on the details page.",
  },
  {
    icon: Users,
    title: "Group Visibility",
    desc: "Know exactly who is joining your ride. Full name, branch, year, rating, and recent reviews are visible for every co-rider before you commit.",
  },
  {
    icon: Flag,
    title: "Report & Block",
    desc: "Flag suspicious behaviour, no-shows, or rule breaks. Block a student. Reports feed into a community trust score that is visible on every profile.",
  },
];

const FAQS = [
  {
    q: "How does V-Ride verify students?",
    a: "In the prototype, all demo users carry the “Verified VIT-AP student” badge. In the real product, we would verify student email domains, then cross-check ID during onboarding. Verification is required before joining or offering a ride.",
  },
  {
    q: "What happens if my ride gets cancelled?",
    a: "You can switch to another matched ride in the same time window. Your saved amount and the ride history update automatically on your dashboard.",
  },
  {
    q: "Is payment handled by V-Ride?",
    a: "In this prototype, no payments are processed. In the real product, V-Ride would collect fares upfront and split the cost transparently so organizers do not have to chase riders.",
  },
  {
    q: "How is the route match score calculated?",
    a: "We score each candidate ride on starting location, destination, time window overlap, and pickup point proximity. A 92% match means three of four factors overlap strongly with your query.",
  },
];

export function SafetyView({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink-200/70">
        <div className="absolute inset-0 grid-bg-light opacity-60" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="container-page relative py-14 sm:py-20">
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={motionPresets.fadeUp} className="eyebrow justify-center">
              Trust & Safety
            </motion.div>
            <motion.h1
              variants={motionPresets.fadeUp}
              className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl text-balance"
            >
              Safer by design, because it’s students only.
            </motion.h1>
            <motion.p variants={motionPresets.fadeUp} className="mt-3 lead">
              V-Ride is built around trust. Every part of the flow — from sign up to the
              moment you step into the auto — is designed to make shared travel feel safe
              and predictable for VIT-AP students.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="vride-card vride-card-hover p-6"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-ink-900">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-ink-950 text-white">
        <div className="container-page py-10">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Lock, title: "Privacy first", desc: "Phone numbers stay hidden until you confirm a ride." },
              { icon: HeartHandshake, title: "Community moderated", desc: "Students review students. Ratings keep the network healthy." },
              { icon: CheckCircle2, title: "Cancel anytime", desc: "Plans change. No lock-in fees, no penalties in the prototype." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur"
                >
                  <Icon className="h-5 w-5 text-lime" />
                  <div className="mt-2 text-sm font-semibold">{item.title}</div>
                  <div className="text-xs text-ink-300">{item.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow justify-center">FAQ</div>
            <h2 className="mt-3 h-section">Questions students ask us.</h2>
          </div>

          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {FAQS.map((f, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group vride-card p-5 shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 list-none">
                  <span className="text-sm font-semibold text-ink-900">{f.q}</span>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-100 text-ink-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{f.a}</p>
              </motion.details>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-700">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="text-sm leading-relaxed">
                <strong>This is a pitch prototype.</strong> No real verification, no real
                payments, no real ride booking. All names, prices, and routes shown are
                illustrative demo data for the V-Ride concept.
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate({ name: "find" })}
              className="vride-btn-brand text-base h-12 px-6"
            >
              Find a safe ride
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
