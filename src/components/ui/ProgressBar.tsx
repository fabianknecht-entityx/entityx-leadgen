"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0-100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="relative h-1.5 w-full overflow-hidden bg-surface-elevated">
      <motion.div
        className="absolute inset-y-0 left-0 bg-accent shadow-[0_0_12px_rgba(17,59,210,0.6)]"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Expo Out
      />
      {/* Glow effect at the leading edge */}
      <motion.div
        className="absolute inset-y-0 left-0"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute right-0 top-1/2 h-4 w-12 -translate-y-1/2 animate-pulse rounded-full bg-white opacity-60 blur-sm mix-blend-overlay" />
      </motion.div>
    </div>
  );
}
