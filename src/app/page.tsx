"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BackgroundEffects from "@/components/ui/BackgroundEffects";

const TRUST_CLIENTS = [
  "Mercedes-Benz",
  "Telekom",
  "Douglas",
  "Karl Lagerfeld",
  "HUK24",
  "Schöffel",
];

export default function HeroPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-hero-bg px-6 text-center">
      <BackgroundEffects variant="dark" />

      <motion.div
        className="relative z-10 flex max-w-2xl flex-col items-center gap-8"
        initial={{ opacity: 0, y: 40 }}
        animate={mounted ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Headline */}
        <h1 className="font-[family-name:var(--font-display)] text-4xl italic leading-tight tracking-tight text-hero-text sm:text-5xl md:text-6xl">
          Wie gut ist dein Lead‑Gen‑System{" "}
          <span className="text-accent">wirklich</span>?
        </h1>

        {/* Subheadline */}
        <motion.p
          className="max-w-lg text-lg text-hero-text-muted sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={mounted ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Finde in 2 Minuten heraus, wo dein Funnel Geld verbrennt – und wie du
          mehr Kunden aus dem gleichen Budget holst.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={mounted ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/funnel"
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-accent px-8 py-4 text-lg font-medium text-white shadow-[0_0_30px_rgba(17,59,210,0.4)] transition-all hover:bg-accent-hover hover:shadow-[0_0_40px_rgba(17,59,210,0.6)]"
            style={{
              backgroundImage: "linear-gradient(135deg, #113BD2 0%, #1a4de6 100%)",
            }}
          >
            Jetzt Score berechnen
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

        {/* Trust elements */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-hero-text-muted"
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : false}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <span>Kostenlos & unverbindlich</span>
          <span className="hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <span>Dauert nur 2 Minuten</span>
          <span className="hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <span>Sofort Ergebnis</span>
        </motion.div>

        {/* Client trust bar */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : false}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-widest text-hero-text-muted/50">
            Vertraut von führenden Unternehmen
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            {TRUST_CLIENTS.map((client, i) => (
              <motion.span
                key={client}
                className="text-sm text-hero-text-muted/70"
                initial={{ opacity: 0, y: 8 }}
                animate={mounted ? { opacity: 1, y: 0 } : false}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {i > 0 && (
                  <span className="mr-2 text-hero-text-muted/30" aria-hidden="true">
                    ·
                  </span>
                )}
                {client}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
