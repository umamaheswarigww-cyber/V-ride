"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function LiveMatchIndicator({
  count = 3,
  route = "VIT-AP",
}: {
  count?: number;
  route?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-3 py-1.5 text-xs font-medium text-white shadow-sm"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
      </span>
      <span className="text-ink-200">
        <span className="font-bold text-lime">{count}</span> students heading to{" "}
        <span className="font-semibold">{route}</span> around your time
      </span>
      <Zap className="h-3.5 w-3.5 text-lime" />
    </motion.div>
  );
}
