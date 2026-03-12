"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0-100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="relative h-1 w-full overflow-hidden bg-surface-elevated">
      <motion.div
        className="absolute inset-y-0 left-0 bg-accent"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      {/* Glow effect at the leading edge */}
      <motion.div
        className="absolute inset-y-0 left-0"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="absolute right-0 top-1/2 h-3 w-8 -translate-y-1/2 rounded-full bg-accent opacity-40 blur-md" />
      </motion.div>
    </div>
  );
}
