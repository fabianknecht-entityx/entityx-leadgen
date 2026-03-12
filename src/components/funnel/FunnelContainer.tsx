"use client";

import { useEffect } from "react";
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

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Top bar: progress + back + branding */}
      <div className="sticky top-0 z-10 bg-background">
        <ProgressBar progress={progress} />
        <div className="flex items-center justify-between px-4 py-3">
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
          <span className="font-display text-sm tracking-wide text-text-muted">
            entity x
          </span>
        </div>
      </div>

      {/* Step content */}
      <div className="flex flex-1 items-center justify-center px-4 pb-12">
        <StepRenderer step={currentStep} />
      </div>
    </div>
  );
}
