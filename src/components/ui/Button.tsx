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
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-[var(--radius-button)] cursor-pointer select-none";

  const variants = {
    primary:
      "bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed",
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
      whileTap={disabled ? undefined : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
