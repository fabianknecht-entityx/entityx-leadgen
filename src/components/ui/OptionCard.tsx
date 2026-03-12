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
      className={`group relative w-full cursor-pointer rounded-[var(--radius-card)] border px-5 py-4 text-left transition-all duration-200 ${
        selected
          ? "border-accent bg-accent-muted"
          : "border-border bg-surface hover:border-text-muted"
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox / Radio indicator */}
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-all duration-200 ${
            multiSelect ? "rounded" : "rounded-full"
          } ${
            selected
              ? "border-accent bg-accent"
              : "border-text-muted bg-transparent"
          }`}
        >
          {selected && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
        </div>

        <div className="flex-1">
          <span className="text-base font-medium text-text-primary">
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
