"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { FunnelStep } from "@/types/funnel";
import { useFunnel } from "@/context/FunnelContext";
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

  // Dual question state
  const [dualAnswers, setDualAnswers] = useState<Record<string, string>>({});

  // Reset selection when step changes
  useEffect(() => {
    setSelected(null);
    setMultiSelected([]);
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

  // Dual question
  if (step.type === "dual_question" && step.questions) {
    const allAnswered = step.questions.every(
      (q) => dualAnswers[q.id] !== undefined
    );

    const handleDualSelect = (questionId: string, optionId: string) => {
      setDualAnswers((prev) => ({ ...prev, [questionId]: optionId }));
      setAnswer(questionId, optionId);
    };

    const handleContinue = () => {
      nextStep();
    };

    return (
      <StepLayout>
        <div className="flex flex-col gap-10">
          {step.questions.map((q, qi) => (
            <div key={q.id}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qi * 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-medium text-text-primary sm:text-2xl">
                  {q.label}
                </h2>
                {q.sublabel && (
                  <p className="mb-4 text-sm text-text-muted">{q.sublabel}</p>
                )}
              </motion.div>
              <div className="flex flex-col gap-3">
                {q.options.map((opt, oi) => (
                  <motion.div
                    key={opt.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: qi * 0.2 + oi * 0.08,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  >
                    <OptionCard
                      label={opt.label}
                      sublabel={opt.sublabel}
                      selected={dualAnswers[q.id] === opt.id}
                      onClick={() => handleDualSelect(q.id, opt.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            onClick={handleContinue}
            disabled={!allAnswered}
            size="large"
          >
            {step.cta_button ?? "Weiter"}
          </Button>
        </motion.div>
      </StepLayout>
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
        <motion.h2
          className="mb-2 font-[family-name:var(--font-display)] text-2xl font-medium text-text-primary sm:text-3xl"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {question}
        </motion.h2>
      )}
      {instruction && (
        <motion.p
          className="mb-6 text-sm text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {instruction}
        </motion.p>
      )}
      {!instruction && question && <div className="mb-6" />}
      {children}
    </div>
  );
}
