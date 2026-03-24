"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FunnelStep } from "@/types/funnel";
import { useFunnel } from "@/context/FunnelContext";
import { trackEvent } from "@/lib/tracking";
import OptionCard from "@/components/ui/OptionCard";
import Button from "@/components/ui/Button";

interface QuestionStepProps {
  step: FunnelStep;
}

export default function QuestionStep({ step }: QuestionStepProps) {
  const { state, setAnswer, nextStep, handleStep1Answer } = useFunnel();

  // Single/multi select state
  const [selected, setSelected] = useState<string | null>(null);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);

  // Dual question — track which sub-question is active (0 or 1)
  const [dualSubIndex, setDualSubIndex] = useState(0);
  const [dualAnswers, setDualAnswers] = useState<Record<string, string>>({});

  // Reset selection when step changes
  useEffect(() => {
    setSelected(null);
    setMultiSelected([]);
    setDualSubIndex(0);
    setDualAnswers({});
  }, [step.id]);

  const isStep1 = step.id === "situation";

  // Single select
  if (step.type === "single_select") {
    const handleSelect = (optionId: string) => {
      if (isStep1) {
        handleStep1Answer(optionId);
        return;
      }
      setSelected(optionId);
      setAnswer(step.id, optionId);
      trackEvent("funnel_question_answered", {
        step_id: step.id,
        step_index: state.currentStepIndex,
        answer_id: optionId,
        path: state.path ?? "unknown",
      });
      // Auto-advance after short delay for single select
      setTimeout(() => nextStep(), 300);
    };

    return (
      <StepLayout question={step.question!}>
        <div className="flex flex-col gap-3">
          {step.options?.map((opt, i) => (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <OptionCard
                label={opt.label}
                sublabel={opt.sublabel}
                selected={selected === opt.id}
                onClick={() => handleSelect(opt.id)}
              />
            </motion.div>
          ))}
        </div>
      </StepLayout>
    );
  }

  // Multi select
  if (step.type === "multi_select") {
    const handleToggle = (optionId: string) => {
      setMultiSelected((prev) => {
        const next = prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId];
        return next;
      });
    };

    const handleContinue = () => {
      setAnswer(step.id, multiSelected);
      trackEvent("funnel_question_answered", {
        step_id: step.id,
        step_index: state.currentStepIndex,
        answer_id: multiSelected.join(","),
        path: state.path ?? "unknown",
      });
      nextStep();
    };

    const canContinue =
      multiSelected.length >= (step.min_selections ?? 1);

    return (
      <StepLayout
        question={step.question!}
        instruction={step.instruction}
      >
        <div className="flex flex-col gap-3">
          {step.options?.map((opt, i) => (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <OptionCard
                label={opt.label}
                sublabel={opt.sublabel}
                selected={multiSelected.includes(opt.id)}
                onClick={() => handleToggle(opt.id)}
                multiSelect
              />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            size="large"
          >
            {step.cta_button ?? "Weiter"}
          </Button>
        </motion.div>
      </StepLayout>
    );
  }

  // Dual question — one sub-question at a time, tap to auto-advance
  if (step.type === "dual_question" && step.questions) {
    const activeQuestion = step.questions[dualSubIndex];

    const handleDualSelect = (optionId: string) => {
      const updatedAnswers = { ...dualAnswers, [activeQuestion.id]: optionId };
      setDualAnswers(updatedAnswers);
      setAnswer(activeQuestion.id, optionId);
      trackEvent("funnel_question_answered", {
        step_id: activeQuestion.id,
        step_index: state.currentStepIndex,
        answer_id: optionId,
        path: state.path ?? "unknown",
      });

      if (dualSubIndex < step.questions!.length - 1) {
        // Advance to next sub-question
        setTimeout(() => setDualSubIndex((prev) => prev + 1), 300);
      } else {
        // All sub-questions answered — go to next step
        setTimeout(() => nextStep(), 300);
      }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${step.id}-${dualSubIndex}`}
          initial={{ opacity: 0, x: 40, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -40, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center"
        >
          <StepLayout question={activeQuestion.label} instruction={activeQuestion.sublabel}>
            <div className="flex flex-col gap-3">
              {activeQuestion.options.map((opt, oi) => (
                <motion.div
                  key={opt.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: oi * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <OptionCard
                    label={opt.label}
                    sublabel={opt.sublabel}
                    selected={dualAnswers[activeQuestion.id] === opt.id}
                    onClick={() => handleDualSelect(opt.id)}
                  />
                </motion.div>
              ))}
            </div>
          </StepLayout>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}

function StepLayout({
  question,
  instruction,
  children,
}: {
  question?: string;
  instruction?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full max-w-lg flex-col">
      {question && (
        <>
          <motion.h2
            className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,4vw,2rem)] font-medium text-text-primary"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {question}
          </motion.h2>
          {/* Decorative accent underline */}
          <motion.div
            className="mt-3 h-0.5 w-10 rounded-full bg-accent"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </>
      )}
      {instruction && (
        <motion.p
          className="mt-3 mb-5 text-sm text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {instruction}
        </motion.p>
      )}
      <div className={instruction ? "" : "mt-6"}>
        {children}
      </div>
    </div>
  );
}
