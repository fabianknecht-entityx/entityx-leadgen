"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0-100
  totalSteps?: number;
  currentStep?: number;
}

export default function ProgressBar({ progress, totalSteps, currentStep = 0 }: ProgressBarProps) {
  // Segmented indicator when totalSteps is provided
  if (totalSteps && totalSteps > 0) {
    const completedCount = Math.round((progress / 100) * totalSteps);

    return (
      <div className="flex items-center gap-1 px-5 py-2.5 sm:px-8">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = i < completedCount;
          const isCurrent = i === completedCount && i < totalSteps;

          return (
            <motion.div
              key={i}
              className="h-1 rounded-full overflow-hidden"
              animate={{
                flex: isCurrent ? 1.6 : 1,
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="h-full w-full rounded-full"
                animate={{
                  backgroundColor:
                    isCompleted || isCurrent
                      ? "var(--accent)"
                      : "var(--surface-elevated)",
                  boxShadow:
                    isCurrent
                      ? "0 0 8px rgba(17,59,210,0.55)"
                      : "none",
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Fallback: simple continuous bar
  return (
    <div className="relative h-1.5 w-full overflow-hidden bg-surface-elevated">
      <motion.div
        className="absolute inset-y-0 left-0 bg-accent shadow-[0_0_12px_rgba(17,59,210,0.6)]"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
