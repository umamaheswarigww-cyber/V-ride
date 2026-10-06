"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, School } from "lucide-react";
import { formatINR } from "@/lib/format";

export function RouteVisualization({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % 3);
    }, 1600);
    return () => window.clearInterval(id);
  }, []);

  const labels = ["Vijayawada", "Benz Circle", "VIT-AP University"];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-ink-200 bg-white p-5 sm:p-6 shadow-lg">
      <div className="absolute inset-0 grid-bg-light opacity-60" />
      <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-lime/20 blur-3xl" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-3 py-1 text-[11px] font-medium text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
            </span>
            Live route preview
          </div>
          <span className="text-[11px] text-ink-400">Demo data</span>
        </div>

        <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
          <div className="sm:col-span-2 sm:order-2">
            <svg
              viewBox="0 0 360 120"
              className="w-full"
              role="img"
              aria-label="Route from Vijayawada to VIT-AP via pickup point"
            >
              <defs>
                <linearGradient id="route-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#c4f042" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                  <feOffset dy="2" result="off" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.2" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d="M40 90 C 120 90, 130 30, 200 30 S 320 90, 320 30"
                stroke="#e2e8f0"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <motion.path
                d="M40 90 C 120 90, 130 30, 200 30 S 320 90, 320 30"
                stroke="url(#route-grad)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="8 10"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
              <Waypoint x={40} y={90} color="#10b981" label="Vijayawada" />
              <Waypoint x={200} y={30} color="#f59e0b" label="Benz Circle" />
              <Waypoint x={320} y={30} color="#10b981" label="VIT-AP" />

              <motion.g
                animate={{ offsetDistance: ["0%", "50%", "100%"] }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  offsetPath: `path('M40 90 C 120 90, 130 30, 200 30 S 320 90, 320 30')`,
                }}
              >
                <circle r="9" fill="#0c1322" filter="url(#soft-shadow)" />
                <circle r="9" fill="#0c1322">
                  <animate
                    attributeName="r"
                    values="9;11;9"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="3.5" fill="#c4f042" />
              </motion.g>
            </svg>
          </div>

          <ol className="space-y-3 sm:order-1 sm:col-span-1">
            {labels.map((label, i) => (
              <li
                key={label}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-colors ${
                  step === i
                    ? "border-brand-300 bg-brand-50"
                    : "border-ink-200 bg-white opacity-70"
                }`}
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                    step === i ? "bg-brand-500 text-white" : "bg-ink-100 text-ink-600"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-ink-900">{label}</span>
                {step === i && (
                  <span className="ml-auto text-[10px] font-medium text-brand-600">
                    Active
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        {!compact && (
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-ink-100 pt-5">
            <Metric label="Total fare" value={formatINR(450)} tone="ink" />
            <Metric label="Students" value="3" tone="brand" />
            <Metric label="Per head" value={formatINR(150)} tone="green" />
          </div>
        )}
      </div>
    </div>
  );
}

function Waypoint({
  x,
  y,
  color,
  label,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r="11" fill="#fff" stroke={color} strokeWidth="3" />
      <circle cx={x} cy={y} r="4" fill={color} />
      <text
        x={x}
        y={y - 18}
        textAnchor="middle"
        className="fill-ink-500 text-[10px] font-medium"
      >
        {label}
      </text>
    </g>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ink" | "brand" | "green";
}) {
  const tones = {
    ink: "text-ink-900",
    brand: "text-brand-600",
    green: "text-emerald-600",
  };
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-wider text-ink-400">{label}</div>
      <div className={`text-lg font-bold ${tones[tone]}`}>{value}</div>
    </div>
  );
}
