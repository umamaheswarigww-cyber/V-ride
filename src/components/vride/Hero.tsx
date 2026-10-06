"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Users } from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { formatINR } from "@/lib/format";
import { Badge } from "./Badge";
import { LiveMatchIndicator } from "./LiveMatchIndicator";
import { motionPresets } from "@/lib/motion";

export function Hero({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg-light opacity-60" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-lime/20 blur-3xl" />

      <div className="container-page relative pt-12 sm:pt-16 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div variants={motionPresets.fadeUp} initial="hidden" animate="show">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="lime">
                  <Sparkles className="h-3 w-3" /> Built for VIT-AP students
                </Badge>
                <Badge tone="green">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Prototype live
                </Badge>
              </div>

              <h1 className="mt-5 text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-ink-900 text-balance sm:text-6xl lg:text-7xl">
                Your route. Their route.{" "}
                <span className="gradient-text">One cheaper ride.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
                Connect with VIT-AP students travelling from Vijayawada and nearby
                locations. Share a ride, split the fare, and travel together.
              </p>

              <div className="mt-6 inline-flex">
                <LiveMatchIndicator count={3} route="VIT-AP" />
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => navigate({ name: "find" })} className="vride-btn-brand text-base h-12 px-6">
                  Find a Ride
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => navigate({ name: "offer" })} className="vride-btn-ghost text-base h-12 px-6">
                  Offer a Ride
                </button>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2 text-xs text-ink-500">
                  <span className="inline-flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </span>
                  <span>
                    <strong className="text-ink-900">4.9</strong> from verified students
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-500">
                  <Users className="h-3.5 w-3.5 text-brand-500" />
                  <span>
                    <strong className="text-ink-900">120+</strong> students matched this week
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="relative"
            >
              <HeroMockup navigate={navigate} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMockup({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/10 via-transparent to-lime/15 blur-2xl" />

      <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-4xl border border-ink-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-ink-100 bg-ink-950 px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10">
              <Users className="h-4 w-4 text-lime" />
            </span>
            <div>
              <div className="text-[11px] leading-none text-ink-300">Live match</div>
              <div className="text-xs font-semibold leading-tight">
                Vijayawada → VIT-AP
              </div>
            </div>
          </div>
          <div className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/20">
            92% match
          </div>
        </div>

        <div className="space-y-3 p-5">
          <RouteRow from="Vijayawada" to="VIT-AP University" time="8:00 AM" pickup="Benz Circle" />

          <div className="rounded-2xl border border-ink-200 bg-ink-50/60 p-3">
            <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-ink-500">
              <span>3 students joining</span>
              <span>Auto</span>
            </div>
            <div className="flex -space-x-2">
              {["https://i.pravatar.cc/64?img=12", "https://i.pravatar.cc/64?img=47", "https://i.pravatar.cc/64?img=15"].map(
                (src, i) => (
                  <motion.img
                    key={i}
                    src={src}
                    alt="student"
                    className="h-9 w-9 rounded-full ring-2 ring-white"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.12, duration: 0.35 }}
                  />
                ),
              )}
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-[10px] font-bold text-white ring-2 ring-white">
                +0
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-200 bg-gradient-to-br from-brand-50 to-emerald-50 p-3 ring-1 ring-brand-100">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-ink-500">
              <span>Ride total</span>
              <span>Split by 3</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-2xl font-bold text-ink-900 line-through decoration-coral/60 decoration-2">
                {formatINR(450)}
              </div>
              <ArrowRight className="h-5 w-5 text-ink-400" />
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-brand-600">
                  You pay
                </div>
                <div className="text-2xl font-extrabold text-brand-700">
                  {formatINR(150)}
                </div>
              </div>
            </div>
            <div className="mt-1.5 text-right text-[11px] font-medium text-emerald-600">
              You save {formatINR(300)}
            </div>
          </div>

          <button
            onClick={() => navigate({ name: "find" })}
            className="vride-btn-primary h-10 w-full text-sm"
          >
            Join this ride
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12, x: -8 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -left-4 top-20 hidden animate-float rounded-2xl border border-ink-200 bg-white/90 p-3 shadow-lg backdrop-blur sm:flex"
      >
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-brand-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
          </span>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-400">
              Money saved
            </div>
            <div className="text-sm font-bold text-ink-900">{formatINR(420)}</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -12, x: 8 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -right-4 bottom-20 hidden animate-float rounded-2xl border border-ink-200 bg-white/90 p-3 shadow-lg backdrop-blur sm:flex"
        style={{ animationDelay: "1.4s" }}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-400">
              CO₂ saved
            </div>
            <div className="text-sm font-bold text-ink-900">12.4 kg</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function RouteRow({
  from,
  to,
  time,
  pickup,
}: {
  from: string;
  to: string;
  time: string;
  pickup: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 p-3">
      <div className="flex items-center gap-3">
        <div className="grid grid-rows-2 gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          <span className="h-2 w-2 rounded-full bg-ink-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm font-semibold text-ink-900">
            <span>{from}</span>
            <span className="text-xs text-ink-400">{time}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-ink-500">
            <span>{to}</span>
            <span>{pickup}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
