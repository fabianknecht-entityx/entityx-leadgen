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
      {/* Atmospheric ghost number behind the layout */}
      {step.stat_number && (
        <div
          aria-hidden
          className="pointer-events-none select-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center font-[family-name:var(--font-display)] font-bold leading-none text-accent opacity-[0.04] text-[clamp(14rem,40vw,22rem)] whitespace-nowrap"
        >
          {step.stat_number}
        </div>
      )}

      {/* Stat number — foreground */}
      <motion.div
        className="relative mb-3 font-[family-name:var(--font-display)] text-[clamp(5rem,15vw,9rem)] font-bold leading-none text-accent"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 180, damping: 18 }}
      >
        {step.stat_number}
      </motion.div>

      {/* Stat label */}
      <motion.p
        className="mb-8 text-lg font-medium text-text-primary sm:text-xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {step.stat_label}
      </motion.p>

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
