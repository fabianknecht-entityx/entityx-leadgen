"use client";

import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FunnelStep } from "@/types/funnel";
import QuestionStep from "@/components/funnel/QuestionStep";
import Interstitial from "@/components/funnel/Interstitial";
import ContactStep from "@/components/funnel/ContactStep";

interface StepRendererProps {
  step: FunnelStep;
}

export default function StepRenderer({ step }: StepRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus container after step transition for screen reader announcement
  useEffect(() => {
    const timer = setTimeout(() => {
      containerRef.current?.focus();
    }, 400); // after animation completes
    return () => clearTimeout(timer);
  }, [step.id]);

  const renderStep = () => {
    switch (step.type) {
      case "single_select":
      case "multi_select":
      case "dual_question":
        return <QuestionStep step={step} />;
      case "interstitial":
        return <Interstitial step={step} />;
      case "contact_form":
        return <ContactStep step={step} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        ref={containerRef}
        tabIndex={-1}
        role="region"
        aria-label={step.question || "Funnel-Schritt"}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="flex w-full items-center justify-center outline-none"
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
}
