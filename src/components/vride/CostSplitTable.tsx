"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { formatINR } from "@/lib/format";

export function CostSplitTable({
  total,
  selectedStudents = 4,
}: {
  total: number;
  selectedStudents?: number;
}) {
  const rows = [1, 2, 3, 4, 5].slice(0, Math.max(selectedStudents, 1));
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
        Cost split preview
      </div>
      <table className="mt-3 w-full text-sm">
        <thead>
          <tr className="border-b border-ink-200 text-[11px] uppercase tracking-wider text-ink-500">
            <th className="py-1.5 text-left font-medium">Students</th>
            <th className="py-1.5 text-right font-medium">Per person</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((n, i) => {
            const perHead = Math.max(1, Math.round(total / n));
            const active = n === selectedStudents;
            return (
              <motion.tr
                key={n}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`border-b border-ink-100 ${
                  active ? "bg-brand-50" : ""
                }`}
              >
                <td className="py-2 text-left">
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-ink-400" />
                    <span className={active ? "font-bold text-brand-700" : "text-ink-700"}>
                      {n} student{n > 1 ? "s" : ""}
                    </span>
                  </span>
                </td>
                <td className={`py-2 text-right font-bold ${active ? "text-brand-700" : "text-ink-900"}`}>
                  {formatINR(perHead)}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-ink-950 p-3 text-white">
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-300">Ride total</span>
          <span className="text-lg font-bold">{formatINR(total)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-ink-200">
          <span className="rounded-full bg-white/10 px-2 py-0.5 font-semibold">
            {selectedStudents} sharing
          </span>
          <span>→</span>
          <span className="font-bold text-lime">
            {formatINR(Math.max(1, Math.round(total / Math.max(selectedStudents, 1))))}
          </span>
          <span className="text-ink-400">/ head</span>
        </div>
      </div>
    </div>
  );
}
