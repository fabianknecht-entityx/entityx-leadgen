"use client";

import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "large";
  type?: "button" | "submit";
  className?: string;
}

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "default",
  type = "button",
  className = "",
}: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 font-medium transition-colors duration-300 rounded-[var(--radius-button)] cursor-pointer select-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

  const variants = {
    primary:
      "text-white hover:bg-accent-hover hover:shadow-[0_4px_24px_rgba(17,59,210,0.35)] disabled:opacity-40 disabled:cursor-not-allowed",
    secondary:
      "bg-surface-elevated text-text-primary border border-border hover:border-text-muted disabled:opacity-40 disabled:cursor-not-allowed",
    ghost:
      "text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed",
  };

  const sizes = {
    default: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {variant === "primary" && (
        <span
          className="absolute inset-0 rounded-[var(--radius-button)]"
          style={{ backgroundImage: "linear-gradient(135deg, #113BD2 0%, #1a4de6 100%)" }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
