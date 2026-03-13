"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import BackgroundEffects from "@/components/ui/BackgroundEffects";

const TRUST_CLIENTS = [
  { name: "Mercedes-Benz", logo: "/logos/Mercedes-benz-1.webp", width: 120, height: 30 },
  { name: "Telekom", logo: "/logos/Telekom-1.webp", width: 100, height: 30 },
  { name: "Douglas", logo: "/logos/Douglas-1.webp", width: 110, height: 30 },
  { name: "Karl Lagerfeld", logo: "/logos/Karl-Lagerfeld-1.webp", width: 140, height: 30 },
  { name: "HUK24", logo: "/logos/Huk24-1.webp", width: 100, height: 30 },
  { name: "Schöffel", logo: "/logos/Schoeffel-1.webp", width: 110, height: 30 },
];

const TRUST_FACTS = [
  { icon: "✓", label: "Kostenfrei" },
  { icon: "⏱", label: "2 Minuten" },
  { icon: "⚡", label: "Ergebnis in Echtzeit" },
];

export default function HeroPage() {
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);
  const router = useRouter();
  useEffect(() => setMounted(true), []);

  const handleStart = () => {
    setExiting(true);
    setTimeout(() => router.push("/funnel"), 500);
  };

  return (
    <motion.main
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center"
      initial={{ backgroundColor: "#0B1A2E" }}
      animate={exiting ? { backgroundColor: "#F4F6FB" } : { backgroundColor: "#0B1A2E" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <BackgroundEffects variant="dark" exiting={exiting} />

      <motion.div
        className="relative z-10 flex max-w-2xl flex-col items-center gap-10"
        initial={{ opacity: 0, y: 40 }}
        animate={exiting ? { opacity: 0, scale: 0.95 } : mounted ? { opacity: 1, y: 0 } : false}
        transition={exiting ? { duration: 0.3, ease: [0.16, 1, 0.3, 1] } : { duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* entity x logo */}
        <Image
          src="/logos/entityx/entityx_Logo_RGB_Long_White_LowRes.png"
          alt="entity x"
          width={120}
          height={32}
          className="mb-2"
          unoptimized
        />

        {/* Headline */}
        <h1 className="font-[family-name:var(--font-display)] text-4xl italic leading-tight tracking-tight text-hero-text sm:text-5xl md:text-6xl">
          Wie viel Umsatz verliert dein Lead‑Gen‑System zwischen Klick und{" "}
          <span className="text-accent">Abschluss</span>?
        </h1>

        {/* Subheadline */}
        <motion.p
          className="max-w-lg text-lg text-hero-text-muted sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={mounted ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Diese Analyse zeigt dir in 2 Minuten, an welchen Stellen dein System
          qualifizierte Interessenten verliert – und wo die größten Hebel liegen.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={mounted ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={handleStart}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-button)] bg-accent px-8 py-4 text-lg font-medium text-white shadow-[0_0_30px_rgba(17,59,210,0.4)] transition-all hover:bg-accent-hover hover:shadow-[0_0_40px_rgba(17,59,210,0.6)]"
            style={{
              backgroundImage: "linear-gradient(135deg, #113BD2 0%, #1a4de6 100%)",
            }}
          >
            Analyse starten
            <span aria-hidden="true">→</span>
          </button>
        </motion.div>

        {/* Trust elements */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {TRUST_FACTS.map((fact, i) => (
            <motion.span
              key={fact.label}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm text-hero-text-muted backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={mounted ? { opacity: 1, y: 0 } : false}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span aria-hidden="true">{fact.icon}</span>
              {fact.label}
            </motion.span>
          ))}
        </div>

        {/* Client trust bar */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : false}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-widest text-hero-text-muted/50">
            Entwickelt auf Basis von 500+ Lead-Gen-Systemen
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:flex-nowrap">
            {TRUST_CLIENTS.map((client, i) => (
              <motion.div
                key={client.name}
                className="opacity-60 transition-opacity duration-300 hover:opacity-100"
                initial={{ opacity: 0, y: 8 }}
                animate={mounted ? { opacity: 0.6, y: 0 } : false}
                whileHover={{ opacity: 1 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={client.width}
                  height={client.height}
                  className="h-5 w-auto sm:h-8"
                  unoptimized
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.main>
  );
}
