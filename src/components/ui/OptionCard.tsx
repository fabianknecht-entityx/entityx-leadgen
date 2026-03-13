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
      className={`group relative w-full cursor-pointer overflow-hidden rounded-[var(--radius-card)] border px-5 py-4 text-left transition-colors duration-300 ${
        selected
          ? "border-accent border-l-[3px] bg-accent-muted shadow-[inset_0_0_0_1px_var(--color-accent-muted),0_4px_12px_rgba(17,59,210,0.10)]"
          : "border-border bg-surface hover:border-text-secondary"
      }`}
      whileHover={{ y: -3, boxShadow: selected ? "inset 0 0 0 1px var(--color-accent-muted), 0 8px 20px rgba(17,59,210,0.14)" : "0 8px 20px rgba(15,23,42,0.06)" }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex items-start gap-4 relative z-10">
        {/* Checkbox / Radio indicator */}
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors duration-300 ${
            multiSelect ? "rounded" : "rounded-full"
          } ${
            selected
              ? "border-accent bg-accent shadow-[0_0_8px_rgba(17,59,210,0.4)]"
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
