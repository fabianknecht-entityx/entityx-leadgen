"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { FunnelStep } from "@/types/funnel";
import { useFunnel } from "@/context/FunnelContext";
import Button from "@/components/ui/Button";

interface ContactStepProps {
  step: FunnelStep;
}

export default function ContactStep({ step }: ContactStepProps) {
  const { submitContact } = useFunnel();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fields = step.fields ?? [];

  const requiredFields = fields.filter((f) => f.required);
  const allRequiredFilled = requiredFields.every(
    (f) => formData[f.id]?.trim()
  );

  // Basic email validation
  const emailField = formData.email ?? "";
  const emailValid = !emailField || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField);

  const canSubmit = allRequiredFilled && emailValid && !submitting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    submitContact(formData);
  };

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex w-full max-w-md flex-col">
      <motion.h2
        className="mb-2 font-[family-name:var(--font-display)] text-2xl font-medium text-text-primary sm:text-3xl"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {step.question}
      </motion.h2>

      <motion.p
        className="mb-8 text-base text-text-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {step.body}
      </motion.p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {fields.map((field, i) => (
          <motion.div
            key={field.id}
            className="flex flex-col gap-1.5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
          >
            <label
              htmlFor={field.id}
              className="text-sm font-medium text-text-primary"
            >
              {field.label}
              {!field.required && (
                <span className="ml-1 text-text-muted font-normal">
                  (optional)
                </span>
              )}
            </label>
            {field.sublabel && (
              <span className="text-xs text-text-muted">{field.sublabel}</span>
            )}

            {field.type === "dropdown" ? (
              <select
                id={field.id}
                value={formData[field.id] ?? ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="h-12 rounded-[var(--radius-card)] border border-border bg-surface px-4 text-text-primary outline-none transition-colors focus:border-accent appearance-none"
              >
                <option value="" disabled>
                  Bitte wählen
                </option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "tel_with_code" ? (
              <div className="flex gap-2">
                <select
                  value={formData[`${field.id}_code`] ?? field.options?.[0] ?? ""}
                  onChange={(e) => handleChange(`${field.id}_code`, e.target.value)}
                  className="h-12 w-28 shrink-0 rounded-[var(--radius-card)] border border-border bg-surface px-3 text-text-primary outline-none transition-colors focus:border-accent appearance-none"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <input
                  id={field.id}
                  type="tel"
                  value={formData[field.id] ?? ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="h-12 flex-1 rounded-[var(--radius-card)] border border-border bg-surface px-4 text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent"
                />
              </div>
            ) : (
              <input
                id={field.id}
                type={field.type}
                value={formData[field.id] ?? ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className="h-12 rounded-[var(--radius-card)] border border-border bg-surface px-4 text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent"
              />
            )}
          </motion.div>
        ))}

        {/* Trust text */}
        <motion.p
          className="text-xs text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          Kein Spam. Deine Daten werden ausschließlich für dein Ergebnis und eine
          mögliche Kontaktaufnahme genutzt.
        </motion.p>

        <motion.div
          className="mt-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.3 }}
        >
          <Button
            type="submit"
            disabled={!canSubmit}
            size="large"
            className="w-full"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="31.4 31.4"
                    strokeLinecap="round"
                  />
                </svg>
                Analyse wird erstellt...
              </span>
            ) : (
              step.cta_button ?? "Ergebnis anzeigen"
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
