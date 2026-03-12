"use client";

import { motion } from "framer-motion";
import type { ScoreResult, ScoreTier, CategoryKey } from "@/types/funnel";
import { generateInsights } from "@/lib/insights";
import { trackEvent } from "@/lib/tracking";
import ScoreGauge from "@/components/ui/ScoreGauge";
import Button from "@/components/ui/Button";

interface ResultPageProps {
  result: ScoreResult;
}

const TIER_LABEL: Record<ScoreTier, string> = {
  blindflug: "Blindflug",
  basis: "Solide Basis",
  guter_ansatz: "Guter Ansatz",
  top_performer: "Top-Performer",
};

const TIER_SUBTITLE: Record<ScoreTier, string> = {
  blindflug: "Du fliegst blind.",
  basis: "Du hast eine Basis, aber Geld bleibt liegen.",
  guter_ansatz: "Besser als die meisten. Aber da geht noch was.",
  top_performer: "Du gehörst zu den Top 10%.",
};

const TIER_BODY: Record<ScoreTier, string> = {
  blindflug:
    "Dein Unternehmen hat entweder noch kein Lead-Gen-System oder es fehlen kritische Bausteine. Das bedeutet: Du lässt systematisch Umsatz liegen – nicht weil dein Angebot schlecht ist, sondern weil kein System existiert, das Interessenten zu Kunden macht.",
  basis:
    "Du machst mehr als die meisten Unternehmen – aber zwischen deinem Marketing und dem Abschluss gehen zu viele Leads verloren. Die Kette hat schwache Glieder, und jedes davon kostet dich konkret Kunden.",
  guter_ansatz:
    "Du hast ein funktionierendes System – Funnel, Tracking, Sales-Prozess sind vorhanden. Aber die Details machen den Unterschied zwischen gut und exzellent. Hier liegen noch 20–30% mehr Effizienz.",
  top_performer:
    "Dein System ist stark – schnelle Reaktion, strukturiertes Follow-up, sauberes Tracking. Die Frage ist jetzt: Wie skalierst du, ohne dass die Qualität leidet?",
};

const TIER_CTA_BODY: Record<ScoreTier, string> = {
  blindflug:
    "Du brauchst kein besseres Marketing – du brauchst ein System. In 30 Minuten zeigen wir dir, wie ein Lead-Gen-System für dein Business von Grund auf aussehen kann.",
  basis:
    "Dein System hat Potenzial – aber die Lücken kosten dich täglich Kunden. Lass uns in 30 Minuten die 2–3 Hebel identifizieren, die bei dir den größten Impact hätten.",
  guter_ansatz:
    "Du bist nah dran am Optimum. Lass uns in 30 Minuten die 2–3 Feinschliff-Hebel identifizieren, die dein System auf das nächste Level bringen.",
  top_performer:
    "Dein Setup ist beeindruckend. Lass uns sprechen, wie wir dein System durch AI-Automatisierung und fortgeschrittene Funnel-Architektur weiter skalieren können.",
};

const CATEGORY_LABEL: Record<CategoryKey, string> = {
  funnel_maturity: "Funnel-Reife",
  speed_to_lead: "Reaktionszeit",
  sales_process: "Sales & Follow-up",
  tracking: "Messbarkeit",
  alignment: "Marketing-Sales-Sync",
};

const CATEGORY_MAX: Record<CategoryKey, number> = {
  funnel_maturity: 25,
  speed_to_lead: 20,
  sales_process: 25,
  tracking: 15,
  alignment: 15,
};

const SEVERITY_COLOR: Record<string, string> = {
  critical: "var(--score-red)",
  moderate: "var(--score-orange)",
  good: "var(--score-green)",
};

const CALENDLY_URL = "https://calendar.app.google/gRioFxoyaXwjQXEx8";

const VISION_ITEMS = [
  "Dein Sales-Team spricht nur noch mit Leads, die wirklich kaufbereit sind",
  "Jeder Lead wird innerhalb von Minuten kontaktiert – automatisch",
  "Du weißt genau, was ein Kunde dich kostet und welcher Kanal den besten ROI liefert",
  "Weniger Leads, aber mehr Abschlüsse – bei niedrigeren Kosten",
];

export default function ResultPage({ result }: ResultPageProps) {
  const { breakdown, tier, isDisqualified } = result;
  const insights = generateInsights(result);

  const categories: CategoryKey[] = [
    "funnel_maturity",
    "speed_to_lead",
    "sales_process",
    "tracking",
    "alignment",
  ];

  const handleCalendlyClick = () => {
    trackEvent("cta_calendly_clicked", { tier, score: breakdown.total });
    window.open(CALENDLY_URL, "_blank", "noopener");
  };

  const handleGuideClick = () => {
    trackEvent("cta_guide_clicked", { tier, score: breakdown.total });
  };

  return (
    <div className="flex w-full flex-col items-center px-4 py-12 sm:py-16">
      {/* Score Header */}
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ScoreGauge score={breakdown.total} size={220} />

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <span className="inline-block rounded-full bg-surface-elevated px-4 py-1.5 text-sm font-medium text-text-secondary">
            {TIER_LABEL[tier]}
          </span>
        </motion.div>

        <motion.h1
          className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold text-text-primary sm:text-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          Dein Lead-Gen-Score: {breakdown.total}/100
        </motion.h1>

        <motion.p
          className="mt-3 font-[family-name:var(--font-display)] text-xl text-accent sm:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
        >
          {TIER_SUBTITLE[tier]}
        </motion.p>

        <motion.p
          className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.5 }}
        >
          {TIER_BODY[tier]}
        </motion.p>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        className="mt-14 w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 0.5 }}
      >
        <h2 className="mb-6 font-[family-name:var(--font-display)] text-xl font-medium text-text-primary sm:text-2xl">
          Dein Score im Detail
        </h2>
        <div className="flex flex-col gap-4">
          {categories.map((cat, i) => {
            const score = breakdown[cat];
            const max = CATEGORY_MAX[cat];
            const pct = (score / max) * 100;

            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.8 + i * 0.1, duration: 0.4 }}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    {CATEGORY_LABEL[cat]}
                  </span>
                  <span className="text-sm font-medium tabular-nums text-text-primary">
                    {score}/{max}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor:
                        pct <= 33
                          ? "var(--score-red)"
                          : pct <= 66
                            ? "var(--score-orange)"
                            : "var(--score-green)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      delay: 3 + i * 0.1,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Insights */}
      {insights.length > 0 && (
        <motion.div
          className="mt-14 w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.5 }}
        >
          <h2 className="mb-6 font-[family-name:var(--font-display)] text-xl font-medium text-text-primary sm:text-2xl">
            Wo du am meisten verlierst
          </h2>
          <div className="flex flex-col gap-4">
            {insights.map((insight, i) => (
              <motion.div
                key={insight.category}
                className="rounded-[var(--radius-card)] border border-border bg-surface p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.7 + i * 0.15, duration: 0.4 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: SEVERITY_COLOR[insight.severity],
                    }}
                  />
                  <span
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: SEVERITY_COLOR[insight.severity] }}
                  >
                    {CATEGORY_LABEL[insight.category]}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-medium text-text-primary">
                  {insight.title}
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-text-secondary">
                  {insight.body}
                </p>
                <p className="text-xs font-medium text-text-muted">
                  {insight.datapoint}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Vision Section */}
      <motion.div
        className="mt-14 w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.2, duration: 0.5 }}
      >
        <h2 className="mb-6 font-[family-name:var(--font-display)] text-xl font-medium text-text-primary sm:text-2xl">
          Stell dir vor...
        </h2>
        <div className="flex flex-col gap-3">
          {VISION_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 4.4 + i * 0.1, duration: 0.3 }}
            >
              <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
              <p className="text-base text-text-secondary">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trust Strip */}
      <motion.div
        className="mt-14 w-full max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.8, duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-3 border-t border-border py-6 text-center">
          <p className="text-xs text-text-muted">
            entity x — Performance Marketing aus Berlin · 25+ Expert:innen ·
            Seit 2019
          </p>
          <p className="text-xs text-text-muted/60">
            Zertifizierter Partner von Meta · Google · TikTok · LinkedIn
          </p>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="mt-2 w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5, duration: 0.5 }}
      >
        {isDisqualified ? (
          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6 text-center sm:p-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-text-muted/50">
              entity x®
            </p>
            <h2 className="mb-3 font-[family-name:var(--font-display)] text-2xl font-medium text-text-primary">
              Dein nächster Schritt
            </h2>
            <p className="mb-6 text-base text-text-secondary">
              Basierend auf deinem Score empfehlen wir dir, mit unserer
              kostenlosen Lead-Gen-Checkliste zu starten. Wenn du bereit bist zu
              skalieren, sind wir für dich da.
            </p>
            <Button onClick={handleGuideClick} size="large" className="w-full">
              Kostenlose Checkliste herunterladen
            </Button>
            <button
              onClick={handleCalendlyClick}
              className="mt-4 text-sm text-text-muted transition-colors hover:text-accent"
            >
              Trotzdem Termin buchen? &rarr;
            </button>
          </div>
        ) : (
          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6 text-center sm:p-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-text-muted/50">
              entity x®
            </p>
            <h2 className="mb-3 font-[family-name:var(--font-display)] text-2xl font-medium text-text-primary">
              Lass uns dein System optimieren
            </h2>
            <p className="mb-6 text-base text-text-secondary">
              {TIER_CTA_BODY[tier]}
            </p>
            <Button
              onClick={handleCalendlyClick}
              size="large"
              className="w-full"
            >
              Kostenlose Potenzial-Analyse buchen
            </Button>
            <div className="mt-5 flex flex-col gap-1.5">
              {[
                "30 Minuten, kostenlos & unverbindlich",
                "Konkrete Handlungsempfehlungen",
                "Kein Sales-Pitch, sondern Substanz",
              ].map((text) => (
                <p
                  key={text}
                  className="flex items-center justify-center gap-2 text-xs text-text-muted"
                >
                  <svg
                    className="h-3.5 w-3.5 text-score-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {text}
                </p>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.p
        className="mt-12 text-xs text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.2, duration: 0.5 }}
      >
        &copy; {new Date().getFullYear()} entity x &mdash; Performance Marketing
        aus Berlin
      </motion.p>
    </div>
  );
}
