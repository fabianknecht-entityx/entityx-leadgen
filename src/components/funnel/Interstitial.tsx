"use client";

import { motion } from "framer-motion";
import type { FunnelStep } from "@/types/funnel";
import { useFunnel } from "@/context/FunnelContext";
import Button from "@/components/ui/Button";

interface InterstitialProps {
  step: FunnelStep;
}

export default function Interstitial({ step }: InterstitialProps) {
  const { nextStep } = useFunnel();

  return (
    <div className="relative flex w-full max-w-xl flex-col items-center text-center overflow-hidden">
      {/* Atmospheric ghost number — truly massive, brand blue */}
      {step.stat_number && (
        <div
          aria-hidden
          className="pointer-events-none select-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center font-[family-name:var(--font-display)] font-bold leading-none text-accent whitespace-nowrap"
          style={{ fontSize: "clamp(10rem, 32vw, 20rem)", opacity: 0.045 }}
        >
          {step.stat_number}
        </div>
      )}

      {/* Stat number — foreground with brand glow */}
      <motion.div
        className="relative mb-2 font-[family-name:var(--font-display)] font-bold leading-none"
        style={{
          fontSize: "clamp(5.5rem, 16vw, 10rem)",
          color: "var(--accent)",
          textShadow: "0 0 60px rgba(17,58,209,0.18)",
        }}
        initial={{ opacity: 0, scale: 0.72 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75, type: "spring", stiffness: 160, damping: 16 }}
      >
        {step.stat_number}
      </motion.div>

      {/* Stat label with accent underline */}
      <motion.div
        className="mb-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <p className="text-lg font-medium text-text-primary sm:text-xl">
          {step.stat_label}
        </p>
        {/* Thin blue accent underline */}
        <div
          className="h-[2px] w-12 rounded-full"
          style={{ background: "linear-gradient(90deg, #113AD1, #5C9DF2)" }}
        />
      </motion.div>

      {/* Body */}
      <motion.p
        className="mb-6 max-w-md text-base leading-relaxed text-text-secondary"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        {step.body}
      </motion.p>

      {/* Divider + Source */}
      {step.source && (
        <motion.div
          className="mb-10 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {/* Gradient divider */}
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          <p className="text-xs text-text-muted">{step.source}</p>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <Button onClick={nextStep} size="large">
          {step.cta_button ?? "Weiter"}
        </Button>
      </motion.div>
    </div>
  );
}
