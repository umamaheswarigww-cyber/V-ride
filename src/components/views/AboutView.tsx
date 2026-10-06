"use client";

import { motion } from "framer-motion";
import { CarFront, Heart, Target, Users } from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { staggerContainer, motionPresets, viewportOnce } from "@/lib/motion";

const TEAM = [
  {
    name: "Lokesh K.",
    role: "Product & Design",
    avatar: "https://i.pravatar.cc/96?img=33",
    branch: "CSE, VIT-AP",
  },
  {
    name: "Rahul V.",
    role: "Engineering",
    avatar: "https://i.pravatar.cc/96?img=12",
    branch: "CSE, VIT-AP",
  },
  {
    name: "Sneha R.",
    role: "Community",
    avatar: "https://i.pravatar.cc/96?img=47",
    branch: "ECE, VIT-AP",
  },
  {
    name: "Arjun N.",
    role: "Operations",
    avatar: "https://i.pravatar.cc/96?img=14",
    branch: "Mech, VIT-AP",
  },
];

export function AboutView({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink-200/70">
        <div className="absolute inset-0 grid-bg-light opacity-60" />
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="container-page relative py-14 sm:py-20">
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={motionPresets.fadeUp} className="eyebrow justify-center">
              About V-Ride
            </motion.div>
            <motion.h1
              variants={motionPresets.fadeUp}
              className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl text-balance"
            >
              A student-led movement for cheaper, friendlier commutes.
            </motion.h1>
            <motion.p variants={motionPresets.fadeUp} className="mt-3 lead">
              V-Ride was born in a Vijayawada auto stand at 8 AM on a Monday — three of us
              were heading to VIT-AP, each in our own auto, each paying the full fare for
              the same trip. We thought: <em>why?</em>
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Built by VIT-AP students",
                desc: "Every product decision is filtered through what works for our campus.",
              },
              {
                icon: Target,
                title: "Mission: cheaper travel",
                desc: "Cut weekly commute cost by 30–60% for students across Vijayawada and Guntur.",
              },
              {
                icon: Heart,
                title: "Community first",
                desc: "Reviews, ratings, and trust scores keep V-Ride a healthy student network.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="vride-card vride-card-hover p-6"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-ink-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow justify-center">The team</div>
            <h2 className="mt-3 h-section">The students behind V-Ride.</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="vride-card vride-card-hover p-6 text-center"
              >
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="mx-auto h-16 w-16 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                />
                <div className="mt-3 text-sm font-semibold text-ink-900">{m.name}</div>
                <div className="text-xs text-brand-600">{m.role}</div>
                <div className="text-[11px] text-ink-500">{m.branch}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 to-brand-700 p-8 text-white shadow-lg sm:p-12"
          >
            <div className="absolute inset-0 grid-bg-dark opacity-30" />
            <div className="relative grid items-center gap-6 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium ring-1 ring-white/15">
                  <CarFront className="h-3 w-3 text-lime" /> Ride together. Pay less.
                </div>
                <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl text-balance">
                  Join the V-Ride community today.
                </h2>
                <p className="mt-3 text-sm text-ink-200">
                  Share a ride to VIT-AP. Save money. Make campus a friendlier place.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate({ name: "find" })}
                    className="vride-btn-accent text-base h-12 px-6"
                  >
                    Find a ride
                  </button>
                  <button
                    onClick={() => navigate({ name: "offer" })}
                    className="vride-btn-ghost-dark text-base h-12 px-6"
                  >
                    Offer a ride
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  ["120+", "matched this week"],
                  ["40%", "avg saved"],
                  ["4.9", "avg rating"],
                ].map(([v, l]) => (
                  <div
                    key={l}
                    className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur"
                  >
                    <div className="text-2xl font-extrabold">{v}</div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-300">
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
