"use client";

import { motion } from "framer-motion";

interface OptionCardProps {
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
  multiSelect?: boolean;
}

export default function OptionCard({
  label,
  sublabel,
  selected,
  onClick,
  multiSelect = false,
}: OptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-[var(--radius-card)] border-2 px-5 py-4 text-left transition-colors duration-200 ${
        selected
          ? "border-accent bg-accent-muted shadow-[0_4px_16px_rgba(17,59,210,0.12)]"
          : "border-border bg-surface hover:border-text-secondary hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
      }`}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Shine sweep on hover */}
      <div className="pointer-events-none absolute inset-0 translate-x-[-110%] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-500 group-hover:translate-x-[110%]" />

      {/* Selected background glow */}
      {selected && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(17,59,210,0.07),transparent)]" />
      )}

      <div className="flex items-start gap-4 relative z-10">
        {/* Checkbox / Radio indicator */}
        <motion.div
          animate={selected ? { scale: 1.05 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors duration-200 ${
            multiSelect ? "rounded" : "rounded-full"
          } ${
            selected
              ? "border-accent bg-accent shadow-[0_0_10px_rgba(17,59,210,0.45)]"
              : "border-text-muted bg-transparent group-hover:border-text-secondary"
          }`}
        >
          {selected && (
            <motion.svg
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.5 }}
              className="h-3 w-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </motion.div>

        <div className="flex-1">
          <span className={`text-base font-medium transition-colors duration-200 ${selected ? "text-accent" : "text-text-primary"}`}>
            {label}
          </span>
          {sublabel && (
            <span className="mt-0.5 block text-sm text-text-muted">
              {sublabel}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
