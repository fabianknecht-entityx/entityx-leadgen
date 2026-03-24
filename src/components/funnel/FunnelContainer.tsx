"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useFunnel } from "@/context/FunnelContext";
import ProgressBar from "@/components/ui/ProgressBar";
import StepRenderer from "@/components/funnel/StepRenderer";
import ResultPage from "@/components/funnel/ResultPage";

export default function FunnelContainer() {
  const { state, currentStep, progress, prevStep } = useFunnel();

  // Scroll to top on step or screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [state.currentStepIndex, state.screen]);

  // Result screen
  if (state.screen === "result" && state.scoreResult) {
    return <ResultPage result={state.scoreResult} />;
  }

  // Funnel screen — show loading state instead of blank screen
  if (!currentStep) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const canGoBack = state.currentStepIndex > 0;
  const totalSteps = state.steps.length;
  const displayStep = state.currentStepIndex + 1;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Top bar: progress + back + branding */}
      <div
        className="sticky top-0 z-10 shadow-[0_1px_0_var(--border)]"
        style={{
          background: "rgba(238,242,250,0.90)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Brand blue gradient stripe — top edge */}
        <div
          className="h-[3px] w-full"
          style={{
            background: "linear-gradient(90deg, #113AD1 0%, #1E6FD9 35%, #5C9DF2 65%, #94BDF2 100%)",
          }}
        />
        <ProgressBar
          progress={progress}
          totalSteps={totalSteps}
          currentStep={state.currentStepIndex}
        />
        <div className="flex items-center justify-between px-5 py-3 sm:px-8">
          {canGoBack ? (
            <button
              onClick={prevStep}
              className="flex cursor-pointer items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Zurück
            </button>
          ) : (
            <div />
          )}

          {/* Step counter */}
          <span className="text-xs font-medium tabular-nums text-text-muted">
            {displayStep} / {totalSteps}
          </span>

          <Image
            src="/logos/entityx/entityx_Logo_RGB_Long_Blue_LowRes.png"
            alt="entity x"
            width={90}
            height={24}
            unoptimized
          />
        </div>
      </div>

      {/* Step content — generous vertical breathing room */}
      <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8 sm:py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex justify-center"
          >
            <StepRenderer step={currentStep} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
