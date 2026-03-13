"use client";

import { motion } from "framer-motion";

interface BackgroundEffectsProps {
  variant?: "light" | "dark";
}

export default function BackgroundEffects({ variant = "light" }: BackgroundEffectsProps) {
  if (variant === "dark") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Primary blue glow — top center */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(17,59,210,0.25) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [0.98, 1.03, 0.98],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Warm accent glow — bottom right */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle 500px at 80% 80%, rgba(239,68,68,0.08) 0%, transparent 100%)",
          }}
          animate={{
            x: [0, -25, 0],
            y: [0, -15, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary blue glow — left */}
        <motion.div
          className="absolute -left-[15%] top-[40%] h-[600px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(17,59,210,0.12) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Subtle warm accent — top right */}
        <motion.div
          className="absolute -right-[10%] -top-[10%] h-[400px] w-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>
    );
  }

  // Light variant
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Top-center primary glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 15%, rgba(17,59,210,0.08) 0%, transparent 70%)",
        }}
        animate={{
          opacity: [0.8, 1, 0.8],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bottom-right secondary glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 600px at 85% 85%, rgba(17,59,210,0.05) 0%, transparent 100%)",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Left-center tertiary glow */}
      <motion.div
        className="absolute -left-[10%] top-[30%] h-[700px] w-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(17,59,210,0.04) 0%, transparent 70%)",
        }}
        animate={{
          opacity: [0.6, 0.9, 0.6],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
}
