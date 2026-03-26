"use client";

import Image from "next/image";
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

const TIER_PERCENTILE: Record<ScoreTier, string> = {
  blindflug: "Unter 40% der Unternehmen in deiner Branche.",
  basis: "Besser als ~40% der Unternehmen in deiner Branche.",
  guter_ansatz: "Besser als ~75% der Unternehmen in deiner Branche.",
  top_performer: "Du gehörst zu den Top 10% der Unternehmen.",
};

const TIER_SUBTITLE: Record<ScoreTier, string> = {
  blindflug: "Dein System kostet dich jeden Tag Kunden.",
  basis: "Es gibt messbare Lücken in deinem System.",
  guter_ansatz: "Die letzten 20% machen den Unterschied.",
  top_performer: "Du gehörst zu den Top 10%.",
};

const TIER_BODY: Record<ScoreTier, string> = {
  blindflug:
    "Dein Unternehmen hat entweder noch kein Lead-Gen-System oder es fehlen kritische Bausteine. Du lässt systematisch Umsatz liegen – nicht weil dein Angebot schlecht ist, sondern weil kein System existiert, das Interessenten zu Kunden macht.",
  basis:
    "Du machst mehr als die meisten Unternehmen – aber zwischen deinem Marketing und dem Abschluss gehen zu viele Leads verloren. Die Kette hat schwache Glieder, und jedes davon kostet dich konkret Kunden.",
  guter_ansatz:
    "Du hast ein funktionierendes System – Funnel, Tracking, Sales-Prozess sind vorhanden. Aber die Details machen den Unterschied zwischen gut und exzellent. Hier liegen noch 20–30% mehr Effizienz.",
  top_performer:
    "Dein System ist stark – schnelle Reaktion, strukturiertes Follow-up, sauberes Tracking. Die Frage ist jetzt: Wie skalierst du, ohne dass die Qualität leidet?",
};

const TIER_CTA_HEADLINE: Record<ScoreTier, string> = {
  blindflug: "Lass uns dein System von Grund auf aufbauen",
  basis: "Lass uns die Lücken in deinem System schließen",
  guter_ansatz: "Lass uns dein System auf Exzellenz bringen",
  top_performer: "Lass uns dein System gemeinsam skalieren",
};

const TIER_CTA_BODY: Record<ScoreTier, string> = {
  blindflug:
    "Du brauchst kein besseres Marketing – du brauchst ein System. In 30 Minuten zeigen wir dir, wie ein Lead-Gen-System für dein Business aussehen kann.",
  basis:
    "Dein System hat Potenzial – aber die Lücken kosten dich täglich Kunden. Lass uns in 30 Minuten die 2–3 Hebel identifizieren, die den größten Impact hätten.",
  guter_ansatz:
    "Du bist nah dran am Optimum. Lass uns in 30 Minuten die 2–3 Stellschrauben finden, die den Unterschied zwischen gut und exzellent ausmachen.",
  top_performer:
    "Dein Setup ist beeindruckend. Lass uns gemeinsam herausfinden, welche Hebel dein System weiter skalierbar machen – ohne dass die Qualität leidet.",
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
  critical: "#EF4444",
  moderate: "#F59E0B",
  good: "#22C55E",
};

const CALENDLY_URL = "https://calendar.app.google/gRioFxoyaXwjQXEx8";

const VISION_ITEMS = [
  {
    num: "01",
    text: "Dein Sales-Team spricht nur noch mit qualifizierten Interessenten – weil dein Funnel vorher filtert.",
  },
  {
    num: "02",
    text: "Jeder Lead wird innerhalb von Minuten kontaktiert – weil automatisierte Prozesse die Erstreaktion übernehmen.",
  },
  {
    num: "03",
    text: "Du weißt exakt, was ein Kunde kostet und welcher Kanal den besten ROI liefert – weil End-to-End-Tracking die Datengrundlage schafft.",
  },
  {
    num: "04",
    text: "Weniger Leads, aber mehr Abschlüsse bei niedrigeren Kosten – weil jeder Schritt im System aufeinander abgestimmt ist.",
  },
];

const TEAM_MEMBERS = [
  { name: "Dennis Langer", role: "Head of Growth Consulting", img: "Dennis.jpg" },
  { name: "Fabian Knecht", role: "Senior Growth Consultant", img: "Fabian.jpg" },
  { name: "Theresa Rüther", role: "Senior Growth Consultant", img: "Theresa.jpg" },
  { name: "Felix Tamm", role: "Senior Growth Consultant", img: "Felix.jpg" },
  { name: "Paul Laduch", role: "Growth Consultant", img: "Paul.jpg" },
  { name: "Luise Domschke", role: "Associate Growth Consultant", img: "Luise_2_Highres.jpg" },
  { name: "Julia Kamper", role: "Associate Growth Consultant", img: "Julia-HR.jpg" },
  { name: "Luca Carcaterra", role: "Senior Motion Designer", img: "Luca.jpg" },
];

// Inner content wrapper — consistent padding for all sections
function Inner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-6 lg:px-12 ${className}`}>{children}</div>
  );
}

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
    <div className="w-full overflow-x-hidden">

      {/* ── Result Page Header ── */}
      <header
        className="sticky top-0 z-20 w-full shadow-[0_1px_0_rgba(15,23,42,0.08)]"
        style={{
          background: "rgba(238,242,250,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Blue gradient top stripe */}
        <div
          className="h-[3px] w-full"
          style={{
            background:
              "linear-gradient(90deg, #113AD1 0%, #1E6FD9 35%, #5C9DF2 65%, #94BDF2 100%)",
          }}
        />
        <div className="mx-auto flex w-full max-w-5xl items-center px-6 py-3 lg:px-12">
          <Image
            src="/logos/entityx/entityx_Logo_RGB_Long_Blue_LowRes.png"
            alt="entity x"
            width={90}
            height={24}
            unoptimized
          />
        </div>
      </header>

      {/* ══════════════════════════════════════════
          S1 — SCORE HERO  (light atmospheric)
      ══════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden py-24 lg:py-32"
        style={{ background: "var(--background)" }}
      >
        {/* Atmospheric background glows */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(17,58,209,0.10) 0%, transparent 70%)",
              "radial-gradient(ellipse 40% 40% at 90% 90%, rgba(242,139,48,0.06) 0%, transparent 60%)",
              "radial-gradient(circle, rgba(17,58,209,0.09) 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: "100% 100%, 100% 100%, 28px 28px",
          }}
          aria-hidden
        />

        {/* Giant score watermark behind content */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          aria-hidden
        >
          <span
            className="font-[family-name:var(--font-display)] font-bold leading-none text-text-primary"
            style={{ fontSize: "clamp(8rem, 25vw, 22rem)", opacity: 0.035 }}
          >
            {breakdown.total}
          </span>
        </div>

        <Inner className="relative flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <ScoreGauge score={breakdown.total} size={220} />
          </motion.div>

          <motion.div
            className="mt-6 flex flex-col items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <span className="inline-block rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-text-secondary shadow-sm ring-1 ring-black/5">
              {TIER_LABEL[tier]}
            </span>
            <span className="text-xs text-text-muted">{TIER_PERCENTILE[tier]}</span>
          </motion.div>

          <motion.h1
            className="mt-8 font-[family-name:var(--font-display)] text-4xl font-bold text-text-primary sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            Dein Lead-Gen-Score: {breakdown.total}/100
          </motion.h1>

          <motion.p
            className="mt-4 font-[family-name:var(--font-display)] text-xl italic text-accent sm:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          >
            {TIER_SUBTITLE[tier]}
          </motion.p>

          <motion.p
            className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {TIER_BODY[tier]}
          </motion.p>
        </Inner>

        {/* Angled cut → dark */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polygon points="0,72 1440,0 1440,72" fill="#0B1A2E" />
        </svg>
      </section>

      {/* ══════════════════════════════════════════
          S2 — ANALYSIS  (dark navy)
      ══════════════════════════════════════════ */}
      <section
        className="relative w-full py-24 lg:py-32"
        style={{
          background: "#0B1A2E",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        {/* Subtle brand blue ambient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 100% 0%, rgba(17,58,209,0.18) 0%, transparent 60%)",
          }}
          aria-hidden
        />

        <Inner className="relative">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">

            {/* ── Left: Score breakdown ── */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Analyse
              </p>
              <h2 className="mb-10 font-[family-name:var(--font-display)] text-2xl font-medium text-white sm:text-3xl">
                Dein Score im Detail
              </h2>

              <div className="flex flex-col">
                {categories.map((cat, i) => {
                  const score = breakdown[cat];
                  const max = CATEGORY_MAX[cat];
                  const pct = (score / max) * 100;
                  const color =
                    pct <= 40 ? "#EF4444" : pct <= 65 ? "#F59E0B" : pct <= 79 ? "#84CC16" : "#22C55E";

                  return (
                    <motion.div
                      key={cat}
                      className="py-5"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 3 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="mb-3 flex items-baseline justify-between">
                        <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
                          {CATEGORY_LABEL[cat]}
                        </span>
                        <span className="text-sm font-bold tabular-nums" style={{ color }}>
                          {score}
                          <span className="font-normal" style={{ color: "rgba(255,255,255,0.3)" }}>
                            /{max}
                          </span>
                        </span>
                      </div>
                      <div
                        className="h-[3px] w-full rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 3.1 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* ── Right: Insights ── */}
            {insights.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Handlungsfelder
                </p>
                <h2 className="mb-10 font-[family-name:var(--font-display)] text-2xl font-medium text-white sm:text-3xl">
                  Wo du am meisten verlierst
                </h2>

                <div className="flex flex-col">
                  {insights.map((insight, i) => (
                    <motion.div
                      key={insight.category}
                      className="relative py-6"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3.4 + i * 0.18, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Background number */}
                      <span
                        className="pointer-events-none absolute right-0 top-4 font-[family-name:var(--font-display)] font-bold leading-none select-none"
                        style={{ fontSize: "4.5rem", color: "rgba(255,255,255,0.05)" }}
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="relative">
                        <p
                          className="mb-1.5 text-xs font-semibold uppercase tracking-wider"
                          style={{ color: SEVERITY_COLOR[insight.severity] }}
                        >
                          {CATEGORY_LABEL[insight.category]}
                        </p>
                        <h3 className="mb-2 text-base font-semibold leading-snug text-white">
                          {insight.title}
                        </h3>
                        <p className="mb-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {insight.body}
                        </p>
                        <p className="text-xs italic" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {insight.datapoint}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div />
            )}
          </div>
        </Inner>

        {/* Angled cut → blue */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polygon points="0,0 1440,72 1440,72 0,72" fill="#113AD1" />
        </svg>
      </section>

      {/* ══════════════════════════════════════════
          S3 — VISION  (brand blue)
      ══════════════════════════════════════════ */}
      <section
        className="relative w-full py-24 lg:py-32"
        style={{ background: "#113AD1" }}
      >
        {/* Subtle radial variation */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse 80% 60% at 100% 100%, rgba(0,0,0,0.2) 0%, transparent 60%)",
              "radial-gradient(ellipse 50% 50% at 0% 0%, rgba(255,255,255,0.06) 0%, transparent 55%)",
            ].join(", "),
          }}
          aria-hidden
        />

        <Inner className="relative">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Das Potential
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Was ein optimiertes System<br className="hidden sm:block" /> für dich bedeutet
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            {VISION_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                className="group relative py-8 pl-6 pr-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4.3 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-8 h-6 w-[3px] rounded-full"
                  style={{ background: "rgba(255,255,255,0.4)" }}
                  aria-hidden
                />
                {/* Background number */}
                <span
                  className="pointer-events-none absolute right-4 top-5 font-[family-name:var(--font-display)] font-bold italic leading-none select-none"
                  style={{ fontSize: "3.5rem", color: "rgba(255,255,255,0.07)" }}
                  aria-hidden
                >
                  {item.num}
                </span>
                <p className="mb-1.5 text-xs font-semibold text-white/40">{item.num}</p>
                <p className="text-base leading-relaxed text-white/85">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </Inner>

        {/* Angled cut → dark */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polygon points="0,72 1440,0 1440,72" fill="#0B1A2E" />
        </svg>
      </section>

      {/* ══════════════════════════════════════════
          S4 — ANDRÉ + CTA  (dark navy)
      ══════════════════════════════════════════ */}
      <section
        className="relative w-full py-24 lg:py-32"
        style={{
          background: "#0B1A2E",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(17,58,209,0.18) 0%, transparent 60%)",
          }}
          aria-hidden
        />

        <Inner className="relative">
          {/* ── André Quote ── */}
          <motion.div
            className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-20"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Photo — tall editorial portrait */}
            <div className="flex flex-col items-center gap-4 lg:flex-shrink-0">
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ width: "clamp(160px, 18vw, 220px)", aspectRatio: "3/4" }}
              >
                <Image
                  src="/team/Andre_2.jpg"
                  alt="André Vieregge"
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
                {/* Subtle vignette */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow: "inset 0 -60px 60px rgba(11,26,46,0.5)",
                  }}
                  aria-hidden
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white/90">André Vieregge</p>
                <p className="text-xs text-white/45">Managing Director, entity x</p>
              </div>
            </div>

            {/* Quote */}
            <div className="flex-1">
              <div
                className="mb-2 font-[family-name:var(--font-display)] leading-none"
                style={{ fontSize: "6rem", color: "rgba(17,58,209,0.5)", lineHeight: 0.75 }}
                aria-hidden
              >
                &ldquo;
              </div>
              <blockquote
                className="font-[family-name:var(--font-display)] font-medium italic leading-snug text-white/90"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.25rem)" }}
              >
                Wachstum ist kein Zufall, sondern das Ergebnis einer sauberen Methodik
                und konsequenter Datenarbeit.
              </blockquote>
            </div>
          </motion.div>

          {/* ── Divider ── */}
          <div
            className="my-20 h-px w-full"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />

          {/* ── CTA ── */}
          <motion.div
            className="mx-auto flex max-w-2xl flex-col items-center text-center"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6">
              <Image
                src="/logos/entityx/entityx_Logo_RGB_Long_White_LowRes.png"
                alt="entity x"
                width={110}
                height={28}
                unoptimized
              />
            </div>

            <h2
              className="mb-4 font-[family-name:var(--font-display)] font-bold text-white"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              {TIER_CTA_HEADLINE[tier]}
            </h2>

            <p className="mb-8 max-w-lg text-base leading-relaxed text-white/60">
              {TIER_CTA_BODY[tier]}
            </p>

            <Button
              onClick={handleCalendlyClick}
              size="large"
              className="!bg-accent hover:!bg-accent-hover !text-white px-10"
            >
              Kostenlose Potenzial-Analyse buchen →
            </Button>

            <div className="mt-6 flex flex-col items-center gap-2">
              {[
                "30 Minuten, kostenlos & unverbindlich",
                "Konkrete Handlungsempfehlungen",
                "Kein Sales-Pitch, sondern Substanz",
              ].map((text) => (
                <p key={text} className="flex items-center gap-2 text-xs text-white/35">
                  <svg
                    className="h-3.5 w-3.5 flex-shrink-0 text-score-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {text}
                </p>
              ))}
            </div>

            {isDisqualified && (
              <button
                onClick={handleGuideClick}
                className="mt-6 text-sm underline underline-offset-2 text-white/30 transition-colors hover:text-white/50"
              >
                Oder starte mit unserer kostenlosen Checkliste →
              </button>
            )}
          </motion.div>
        </Inner>

        {/* Angled cut → white */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polygon points="0,0 1440,72 1440,72 0,72" fill="#FFFFFF" />
        </svg>
      </section>

      {/* ══════════════════════════════════════════
          S5 — TEAM  (white)
      ══════════════════════════════════════════ */}
      <section className="relative w-full bg-white py-24 lg:py-32">
        <Inner>
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Das Team
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
              Das Team hinter<br className="hidden sm:block" /> deiner Analyse
            </h2>
            <p className="mt-3 text-base text-text-secondary">
              25+ Spezialist:innen für Performance Marketing — Berlin, seit 2019.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-7">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={member.img}
                className="group flex flex-col"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 5.2 + i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="relative w-full overflow-hidden rounded-2xl"
                  style={{ aspectRatio: "3/4", background: "#E8EDF5" }}
                >
                  <Image
                    src={`/team/${member.img}`}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    unoptimized
                  />
                </div>
                <div className="mt-3 px-0.5">
                  <p className="text-sm font-semibold leading-tight text-text-primary">
                    {member.name}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-text-muted">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Second CTA — below team photos */}
          <motion.div
            className="mt-16 flex flex-col items-center text-center"
            style={{ borderTop: "1px solid rgba(15,23,42,0.08)", paddingTop: "4rem" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Nächster Schritt
            </p>
            <h2 className="mb-3 font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
              Bereit, dein Lead-Gen-System<br className="hidden sm:block" /> zu optimieren?
            </h2>
            <p className="mb-8 max-w-lg text-base leading-relaxed text-text-secondary">
              Buche jetzt dein kostenloses 30-Minuten-Gespräch – ohne Pitch, mit konkreten Ergebnissen für dein Business.
            </p>
            <Button
              onClick={handleCalendlyClick}
              size="large"
              className="!bg-accent hover:!bg-accent-hover !text-white px-10"
            >
              Kostenlose Potenzial-Analyse buchen →
            </Button>
            <div className="mt-5 flex flex-col items-center gap-1.5">
              {[
                "30 Minuten, kostenlos & unverbindlich",
                "Konkrete Handlungsempfehlungen für dein Business",
                "Kein Sales-Pitch, sondern echte Substanz",
              ].map((text) => (
                <p key={text} className="flex items-center gap-2 text-xs text-text-muted">
                  <svg className="h-3.5 w-3.5 flex-shrink-0 text-score-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {text}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Trust bar + legal */}
          <motion.div
            className="mt-14 border-t pt-8"
            style={{ borderColor: "rgba(15,23,42,0.08)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 6.0, duration: 0.5 }}
          >
            <p className="text-center text-xs text-text-muted">
              Zertifizierter Partner von Meta · Google · TikTok · LinkedIn
            </p>
            <div
              className="mt-4 flex flex-col items-center gap-3 pt-4 sm:flex-row sm:justify-between"
              style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}
            >
              <p className="text-xs text-text-muted/60">
                &copy; {new Date().getFullYear()} entity x GmbH
              </p>
              <nav className="flex items-center gap-5">
                <a
                  href="https://entityx.com/datenschutz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-text-muted transition-colors duration-150 hover:text-text-secondary"
                >
                  Datenschutz
                </a>
                <a
                  href="https://entityx.com/impressum/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-text-muted transition-colors duration-150 hover:text-text-secondary"
                >
                  Impressum
                </a>
              </nav>
            </div>
          </motion.div>
        </Inner>
      </section>

    </div>
  );
}
