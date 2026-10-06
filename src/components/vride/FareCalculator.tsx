"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { ArrowRight, Sparkles, TrendingDown, Users, Wallet } from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { formatINR } from "@/lib/format";

export function FareCalculator({ navigate }: { navigate: (r: Route) => void }) {
  const [fare, setFare] = useState(450);
  const [students, setStudents] = useState(3);
  const perHead = Math.max(1, Math.round(fare / Math.max(1, students)));
  const savings = Math.max(0, fare - perHead);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-ink-200 bg-white p-6 sm:p-8 shadow-lg">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-lime/20 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-medium text-brand-700 ring-1 ring-brand-100">
            <Sparkles className="h-3 w-3" /> Savings calculator
          </div>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink-900">
            See how much you could save.
          </h3>
          <p className="mt-1.5 text-sm text-ink-500">
            Slide a couple of numbers and watch the fare collapse in real time.
          </p>

          <div className="mt-6 space-y-5">
            <SliderField
              label="Your regular fare"
              value={fare}
              min={100}
              max={2000}
              step={10}
              onChange={setFare}
              format={formatINR}
              icon={Wallet}
            />
            <SliderField
              label="Students sharing"
              value={students}
              min={2}
              max={6}
              step={1}
              onChange={setStudents}
              format={(v) => `${v} students`}
              icon={Users}
            />
          </div>
        </div>

        <div className="relative">
          <div className="flex h-full flex-col justify-between rounded-3xl bg-ink-950 p-6 text-white shadow-lg">
            <div className="absolute inset-0 grid-bg-dark opacity-40 rounded-3xl" />
            <div className="relative">
              <div className="text-xs font-medium uppercase tracking-wider text-ink-300">
                You pay
              </div>
              <AnimatedNumber
                value={perHead}
                className="mt-1 text-5xl font-extrabold tracking-tight"
              />
              <div className="mt-1 text-xs text-ink-400">per student</div>
            </div>

            <div className="relative mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <div className="text-[10px] uppercase tracking-wider text-ink-400">
                  Original
                </div>
                <div className="mt-0.5 text-lg font-bold">{formatINR(fare)}</div>
              </div>
              <div className="rounded-2xl bg-emerald-500/15 p-3 ring-1 ring-emerald-400/20">
                <div className="text-[10px] uppercase tracking-wider text-emerald-300">
                  You save
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-lg font-bold text-emerald-300">
                  <TrendingDown className="h-4 w-4" />
                  <AnimatedNumber value={savings} format={formatINR} />
                </div>
              </div>
            </div>

            <div className="relative mt-6 flex items-center gap-3 rounded-2xl bg-white/5 p-3 text-xs text-ink-200 ring-1 ring-white/10">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime text-ink-900">
                <ArrowRight className="h-4 w-4" />
              </span>
              <span>
                {students} students share one ride, you each pay{" "}
                <span className="font-semibold text-white">{formatINR(perHead)}</span>.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-5">
        <p className="text-xs text-ink-500">
          Numbers are illustrative for the prototype demo only.
        </p>
        <button onClick={() => navigate({ name: "find" })} className="vride-btn-brand text-xs h-9">
          Try it on a real ride
        </button>
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  icon: Icon,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-700">
          {Icon && <Icon className="h-4 w-4 text-ink-400" />}
          {label}
        </span>
        <span className="rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold text-white">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-ink-200"
        style={{
          background: `linear-gradient(to right, #10b981 ${pct}%, #e2e8f0 ${pct}%)`,
          accentColor: "#10b981",
        }}
      />
      <div className="mt-1 flex justify-between text-[10px] text-ink-400">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

function AnimatedNumber({
  value,
  format = (v) => String(v),
  className,
}: {
  value: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(display, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, inView]);

  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  );
}
