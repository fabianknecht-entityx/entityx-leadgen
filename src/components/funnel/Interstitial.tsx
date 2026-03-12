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
    <div className="flex w-full max-w-xl flex-col items-center text-center">
      {/* Stat number — massive */}
      <motion.div
        className="mb-3 font-[family-name:var(--font-display)] text-[clamp(5rem,15vw,9rem)] font-bold leading-none text-accent"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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
        className="mb-4 max-w-md text-base leading-relaxed text-text-secondary"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        {step.body}
      </motion.p>

      {/* Source */}
      {step.source && (
        <motion.p
          className="mb-10 text-xs text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {step.source}
        </motion.p>
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
