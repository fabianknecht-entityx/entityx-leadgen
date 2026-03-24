"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const TRUST_CLIENTS = [
  { name: "Mercedes-Benz", logo: "/logos/Mercedes-benz-1.webp", width: 120, height: 30 },
  { name: "Telekom", logo: "/logos/Telekom-1.webp", width: 100, height: 30 },
  { name: "Douglas", logo: "/logos/Douglas-1.webp", width: 110, height: 30 },
  { name: "Karl Lagerfeld", logo: "/logos/Karl-Lagerfeld-1.webp", width: 140, height: 30 },
  { name: "HUK24", logo: "/logos/Huk24-1.webp", width: 100, height: 30 },
  { name: "Schöffel", logo: "/logos/Schoeffel-1.webp", width: 110, height: 30 },
];

const SCORE_CATEGORIES = [
  { label: "Speed-to-Lead",    score: 38, width: "38%" },
  { label: "Tracking & Daten", score: 61, width: "61%" },
  { label: "Funnel-Reife",     score: 74, width: "74%" },
];

function scoreColor(score: number): string {
  if (score <= 40) return "#EF4444";
  if (score <= 65) return "#F59E0B";
  return "#22C55E";
}

function ScorePreviewCard({ mounted }: { mounted: boolean }) {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={mounted ? { opacity: 1, y: 0 } : false}
      transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative w-full overflow-hidden rounded-[12px] p-8"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "2px solid rgba(92,157,242,0.50)",
          boxShadow:
            "0 0 0 1px rgba(17,58,209,0.12), 0 20px 60px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Card header */}
        <div className="mb-5 flex items-center justify-between">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Lead-Gen-Score
          </span>
          {/* Three pulsing blue dots */}
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block rounded-full"
                style={{
                  width: 4,
                  height: 4,
                  background: "rgba(92,157,242,0.7)",
                }}
                animate={mounted ? { opacity: [0.3, 1, 0.3] } : false}
                transition={{
                  duration: 1.6,
                  delay: i * 0.28,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>

        {/* Thin divider */}
        <div
          className="mb-6"
          style={{ height: 1, background: "rgba(255,255,255,0.06)" }}
        />

        {/* Score number */}
        <div className="relative mb-1">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 30% 50%, rgba(92,157,242,0.08) 0%, transparent 70%)",
            }}
          />
          <div className="flex items-baseline gap-2">
            <span
              className="font-[family-name:var(--font-display)] italic leading-none"
              style={{
                fontSize: "4.5rem",
                color: "rgba(92,157,242,1)",
                letterSpacing: "-0.02em",
                textShadow: "0 0 40px rgba(92,157,242,0.30)",
              }}
            >
              57
            </span>
            <span
              className="text-xl font-light"
              style={{ color: "rgba(255,255,255,0.20)" }}
            >
              / 100
            </span>
          </div>
        </div>

        {/* Beispiel-Score label */}
        <p
          className="mb-6 text-[9px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "rgba(92,157,242,0.50)" }}
        >
          Beispiel-Score
        </p>

        {/* Category bars */}
        <div className="flex flex-col gap-4">
          {SCORE_CATEGORIES.map((cat) => {
            const color = scoreColor(cat.score);
            return (
              <div key={cat.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-medium tracking-wide"
                    style={{ color: "rgba(255,255,255,0.40)" }}
                  >
                    {cat.label}
                  </span>
                  <span
                    className="text-[11px] font-semibold tabular-nums"
                    style={{ color }}
                  >
                    {cat.score}
                  </span>
                </div>
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: cat.width,
                      background: `linear-gradient(90deg, ${color}cc 0%, ${color}66 100%)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Caption row */}
        <div
          className="mt-6 flex items-center gap-2.5 rounded-[6px] px-3 py-2"
          style={{ background: "rgba(92,157,242,0.06)" }}
        >
          <div
            className="shrink-0 rounded-full"
            style={{
              width: 2,
              height: 16,
              background: "rgba(92,157,242,0.40)",
            }}
          />
          <p
            className="text-[11px] tracking-wide"
            style={{ color: "rgba(255,255,255,0.30)" }}
          >
            Dein persönliches Ergebnis nach der Analyse
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroPage() {
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleStart = () => {
    setExiting(true);
    setTimeout(() => router.push("/funnel"), 420);
  };

  return (
    <motion.main
      className="relative flex min-h-dvh flex-col overflow-hidden"
      style={{ background: "#060E1F" }}
      animate={exiting ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* ── Atmospheric layers ──────────────────────────── */}

      {/* Electric blue beam from right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 80% at 105% 50%, rgba(17,58,209,0.55) 0%, rgba(17,58,209,0.15) 45%, transparent 70%)",
        }}
      />

      {/* Blue highlight top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 35% at 95% 5%, rgba(92,157,242,0.30) 0%, transparent 60%)",
        }}
      />

      {/* Orange micro-accent bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 30% 25% at 0% 100%, rgba(242,139,48,0.12) 0%, transparent 65%)",
        }}
      />

      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top-edge hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(92,157,242,0.4) 40%, rgba(92,157,242,0.4) 60%, transparent 100%)",
        }}
      />

      {/* ── Header ───────────────────────────────────────── */}
      <header className="relative z-10 flex items-center px-8 pt-5 sm:px-12 sm:pt-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={mounted ? { opacity: 1, x: 0 } : false}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/logos/entityx/entityx_Logo_RGB_Long_White_LowRes.png"
            alt="entity x"
            width={120}
            height={32}
            className="h-7 w-auto"
            unoptimized
            priority
          />
        </motion.div>
      </header>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-8 py-8 sm:px-12 lg:py-0">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_360px] lg:gap-14 xl:gap-20">

            {/* Text column */}
            <div className="flex flex-col gap-7">

              {/* Eyebrow label */}
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={mounted ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="h-px w-8"
                  style={{
                    background:
                      "linear-gradient(90deg, #5C9DF2, rgba(92,157,242,0.15))",
                  }}
                />
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "#5C9DF2" }}
                >
                  Lead-Gen-Score Analyse
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="font-[family-name:var(--font-display)] italic leading-[1.07] tracking-tight text-white"
                style={{ fontSize: "clamp(2.4rem, 4.2vw, 4.4rem)" }}
                initial={{ opacity: 0, y: 24 }}
                animate={mounted ? { opacity: 1, y: 0 } : false}
                transition={{ delay: 0.08, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                Dein Lead-Gen-System verliert Umsatz.{" "}
                <span style={{ color: "#94BDF2" }}>
                  Diese Analyse zeigt dir, wo genau.
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                className="max-w-[42ch] text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.60)" }}
                initial={{ opacity: 0, y: 14 }}
                animate={mounted ? { opacity: 1, y: 0 } : false}
                transition={{ delay: 0.28, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Finde heraus, wo dein System Umsatz lässt – und was du als erstes optimieren solltest.
              </motion.p>

              {/* CTA */}
              <motion.div
                className="flex flex-col items-start gap-5"
                initial={{ opacity: 0, y: 14 }}
                animate={mounted ? { opacity: 1, y: 0 } : false}
                transition={{ delay: 0.42, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={handleStart}
                  className="inline-flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-button)] px-8 py-[14px] text-base font-medium text-white transition-all duration-200 active:scale-[0.975]"
                  style={{
                    background: "linear-gradient(135deg, #113BD2 0%, #1e56f0 100%)",
                    boxShadow:
                      "0 8px 40px rgba(17,58,209,0.50), inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 12px 50px rgba(17,58,209,0.65), inset 0 1px 0 rgba(255,255,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 8px 40px rgba(17,58,209,0.50), inset 0 1px 0 rgba(255,255,255,0.12)";
                  }}
                >
                  Meinen Score berechnen
                  <span aria-hidden="true" className="text-white/70">
                    →
                  </span>
                </button>
                <p
                  className="text-[11px] tracking-[0.14em] uppercase"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Ø 2 Minuten · Kostenfrei · Sofort-Ergebnis
                </p>
              </motion.div>
            </div>

            {/* Score preview card — desktop + tablet only */}
            <div className="hidden md:block">
              <ScorePreviewCard mounted={mounted} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust logo strip ─────────────────────────────── */}
      <motion.footer
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : false}
        transition={{ delay: 0.75, duration: 0.8 }}
      >
        <div className="mx-auto max-w-6xl px-8 sm:px-12">
          <div
            className="py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <span
                className="text-[10px] font-medium uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                Basiert auf der Analyse von 500+ Lead-Gen-Systemen
              </span>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:flex-nowrap">
                {TRUST_CLIENTS.map((client, i) => (
                  <motion.div
                    key={client.name}
                    initial={{ opacity: 0 }}
                    animate={
                      mounted
                        ? { opacity: 0.30 }
                        : false
                    }
                    whileHover={{ opacity: 0.65 }}
                    transition={{
                      default: {
                        delay: 0.9 + i * 0.06,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      },
                      opacity: { duration: 0.2 },
                    }}
                  >
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={client.width}
                      height={client.height}
                      className="h-[17px] w-auto sm:h-[19px]"
                      style={{ filter: "brightness(0) invert(1)" }}
                      unoptimized
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.main>
  );
}
