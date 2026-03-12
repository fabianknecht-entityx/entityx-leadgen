import type { FunnelStep, FunnelPath } from "@/types/funnel";

export const FUNNEL_STEPS: FunnelStep[] = [
  // Step 1 – Einstieg / Selbstselektion
  {
    id: "situation",
    type: "single_select",
    question: "Was beschreibt deine aktuelle Situation am besten?",
    options: [
      {
        id: "quality_issue",
        label: "Wir generieren aktiv Leads, aber die Qualität stimmt nicht",
        path: "active",
      },
      {
        id: "getting_started",
        label: "Wir wollen mit Lead-Gen starten, wissen aber nicht wo anfangen",
        path: "starter",
      },
      {
        id: "scaling_issue",
        label: "Wir machen Lead-Gen, es läuft okay, aber skaliert nicht profitabel",
        path: "active",
      },
      {
        id: "optimization",
        label: "Unser Lead-Gen läuft gut, wir suchen den nächsten Hebel",
        path: "active",
      },
    ],
  },

  // Interstitial 1 – "Warum dieser Score?"
  {
    id: "interstitial_1",
    type: "interstitial",
    stat_number: "79%",
    stat_label: "aller Marketing-Leads werden nie zu Kunden",
    body: "Nicht weil die Ads schlecht sind – sondern weil zwischen Klick und Abschluss zu viel verloren geht. Dein Lead-Gen-Score zeigt dir in 2 Minuten, wo genau dein System Geld verbrennt.",
    source: "Quelle: MarketingSherpa / ZoomInfo Research",
    cta_button: "Weiter",
  },

  // Step 2a – Kanal & Setup (Active)
  {
    id: "channels_active",
    type: "multi_select",
    path_filter: "active",
    question: "Über welche Kanäle generierst du aktuell Leads?",
    instruction: "Wähle alle zutreffenden aus",
    min_selections: 1,
    cta_button: "Weiter",
    options: [
      { id: "meta", label: "Meta Ads", sublabel: "Facebook / Instagram" },
      { id: "google", label: "Google Ads", sublabel: "Search / Display" },
      { id: "linkedin", label: "LinkedIn Ads" },
      { id: "organic", label: "Organisch", sublabel: "SEO, Content, Social Media" },
      { id: "outbound", label: "Outbound", sublabel: "Cold Mail, Telefon" },
      { id: "referral", label: "Empfehlungen / Netzwerk" },
    ],
  },

  // Step 2b – Kanal & Setup (Starter)
  {
    id: "channels_starter",
    type: "multi_select",
    path_filter: "starter",
    question: "Welche Kanäle würdest du für Lead-Gen in Betracht ziehen?",
    instruction: "Wähle alle aus, die dich interessieren",
    min_selections: 1,
    cta_button: "Weiter",
    options: [
      { id: "meta", label: "Meta Ads", sublabel: "Facebook / Instagram" },
      { id: "google", label: "Google Ads", sublabel: "Search / Display" },
      { id: "linkedin", label: "LinkedIn Ads" },
      { id: "content", label: "Content Marketing / SEO" },
      { id: "outbound", label: "Outbound", sublabel: "Cold Mail, Telefon" },
      { id: "unsure", label: "Weiß ich noch nicht" },
    ],
  },

  // Step 3a – Funnel-Reife (Active)
  {
    id: "funnel_maturity_active",
    type: "single_select",
    path_filter: "active",
    question: "Was passiert, nachdem jemand auf deine Ad oder dein Angebot klickt?",
    options: [
      { id: "website_direct", label: "Direkt auf unsere Website oder Kontaktseite", score_funnel: 3 },
      { id: "landing_page", label: "Eigene Landing Page", score_funnel: 8 },
      {
        id: "lp_followup",
        label: "Landing Page + automatisiertes Follow-up",
        sublabel: "E-Mail, WhatsApp oder SMS",
        score_funnel: 14,
      },
      { id: "multi_step", label: "Mehrstufiger Funnel mit Vorqualifizierung", score_funnel: 20 },
      { id: "segmented", label: "Verschiedene Funnels für verschiedene Zielgruppen", score_funnel: 25 },
    ],
  },

  // Step 3b – Funnel-Reife (Starter)
  {
    id: "funnel_maturity_starter",
    type: "single_select",
    path_filter: "starter",
    question: "Wie sieht aktuell dein Weg vom Interessenten zum Kunden aus?",
    options: [
      {
        id: "referrals_only",
        label: "Interessenten kommen über Empfehlungen, wir sprechen direkt",
        score_funnel: 4,
      },
      { id: "website_form", label: "Wir haben eine Website mit Kontaktformular", score_funnel: 5 },
      {
        id: "social_unstructured",
        label: "Wir nutzen Social Media, aber ohne klaren Prozess",
        score_funnel: 3,
      },
      { id: "no_process", label: "Wir haben aktuell keinen definierten Prozess", score_funnel: 0 },
    ],
  },

  // Interstitial 2 – "Marketing ≠ Lead-Gen"
  {
    id: "interstitial_2",
    type: "interstitial",
    stat_number: "67%",
    stat_label: "effektiver beim Closing",
    body: "Unternehmen mit verzahntem Marketing und Sales schließen 67% mehr Deals ab und sparen 30% bei der Kundenakquise. Dein Funnel endet nicht beim Lead – er beginnt dort erst.",
    source: "Quelle: SiriusDecisions / Aberdeen Group",
    cta_button: "Weiter",
  },

  // Step 4a – Lead-Volumen & Investment (Active)
  {
    id: "volume_budget_active",
    type: "dual_question",
    path_filter: "active",
    cta_button: "Weiter",
    questions: [
      {
        id: "lead_volume",
        label: "Wie viele Leads generierst du pro Monat?",
        type: "single_select",
        options: [
          { id: "under_50", label: "Unter 50" },
          { id: "50_200", label: "50 – 200" },
          { id: "200_500", label: "200 – 500" },
          { id: "over_500", label: "Über 500" },
          { id: "not_tracked", label: "Wir tracken das nicht" },
        ],
      },
      {
        id: "budget",
        label: "Wie hoch ist dein monatliches Marketing-Budget?",
        sublabel: "Media + Agentur",
        type: "single_select",
        options: [
          { id: "under_2k", label: "Unter 2.000 €" },
          { id: "2k_5k", label: "2.000 – 5.000 €" },
          { id: "5k_15k", label: "5.000 – 15.000 €" },
          { id: "over_15k", label: "Über 15.000 €" },
        ],
      },
    ],
  },

  // Step 4b – Lead-Volumen & Investment (Starter)
  {
    id: "volume_budget_starter",
    type: "dual_question",
    path_filter: "starter",
    cta_button: "Weiter",
    questions: [
      {
        id: "planned_budget",
        label: "Wie viel würdest du monatlich in Lead-Generierung investieren?",
        type: "single_select",
        options: [
          { id: "under_2k", label: "Unter 2.000 €" },
          { id: "2k_5k", label: "2.000 – 5.000 €" },
          { id: "5k_15k", label: "5.000 – 15.000 €" },
          { id: "over_15k", label: "Über 15.000 €" },
          { id: "unclear", label: "Noch unklar" },
        ],
      },
      {
        id: "clv",
        label: "Was ist ein Neukunde für dich durchschnittlich wert?",
        sublabel: "Customer Lifetime Value",
        type: "single_select",
        options: [
          { id: "under_1k", label: "Unter 1.000 €" },
          { id: "1k_5k", label: "1.000 – 5.000 €" },
          { id: "5k_20k", label: "5.000 – 20.000 €" },
          { id: "over_20k", label: "Über 20.000 €" },
          { id: "unknown", label: "Weiß ich nicht" },
        ],
      },
    ],
  },

  // Step 5a – Messbarkeit (Active)
  {
    id: "tracking_active",
    type: "single_select",
    path_filter: "active",
    question: "Weißt du, was dich ein qualifizierter Lead kostet?",
    options: [
      { id: "exact", label: "Ja, wir tracken CPL, CPA und ROAS genau", score_tracking: 15 },
      { id: "approximate", label: "Ungefähr, aber nicht exakt", score_tracking: 8 },
      { id: "not_really", label: "Nein, nicht wirklich", score_tracking: 3 },
      { id: "whats_cpl", label: "Was ist ein CPL?", score_tracking: 0 },
    ],
  },

  // Step 5b – Messbarkeit (Starter)
  {
    id: "tracking_starter",
    type: "single_select",
    path_filter: "starter",
    question: "Wie trackst du aktuell, woher deine Kunden kommen?",
    options: [
      { id: "crm_clean", label: "CRM-System mit sauberer Zuordnung", score_tracking: 15 },
      { id: "excel_manual", label: "Excel oder Tabelle, manuell gepflegt", score_tracking: 8 },
      { id: "gut_feeling", label: "Bauchgefühl – wir wissen es ungefähr", score_tracking: 3 },
      { id: "nothing", label: "Gar nicht", score_tracking: 0 },
    ],
  },

  // Interstitial 3 – "Speed kills (Deals)"
  {
    id: "interstitial_3",
    type: "interstitial",
    stat_number: "100×",
    stat_label: "höhere Conversion bei Antwort unter 5 Minuten",
    body: "Trotzdem liegt die durchschnittliche Reaktionszeit bei über 42 Stunden. 78% der Kunden kaufen beim Unternehmen, das zuerst antwortet. Die Frage ist nicht nur, wie du Leads generierst – sondern wie schnell du reagierst.",
    source: "Quelle: Harvard Business Review / LeadResponseManagement.org",
    cta_button: "Weiter",
  },

  // Step 6a – Speed-to-Lead (Active)
  {
    id: "speed_active",
    type: "single_select",
    path_filter: "active",
    question: "Wie schnell wird ein neuer Lead von eurem Team kontaktiert?",
    options: [
      {
        id: "under_5min",
        label: "Innerhalb von 5 Minuten",
        sublabel: "Automatisiert oder sofort",
        score_speed: 20,
      },
      { id: "under_1h", label: "Innerhalb von 1 Stunde", score_speed: 12 },
      { id: "under_24h", label: "Innerhalb von 24 Stunden", score_speed: 5 },
      { id: "over_24h", label: "Länger als 24 Stunden", score_speed: 2 },
      { id: "no_process", label: "Unterschiedlich / kein fester Prozess", score_speed: 0 },
    ],
  },

  // Step 6b – Speed-to-Lead (Starter)
  {
    id: "speed_starter",
    type: "single_select",
    path_filter: "starter",
    question: "Wenn jemand Interesse zeigt – wie schnell meldest du dich?",
    options: [
      { id: "immediately", label: "Sofort oder innerhalb weniger Minuten", score_speed: 20 },
      { id: "same_day", label: "Am selben Tag", score_speed: 10 },
      { id: "1_2_days", label: "Innerhalb von 1–2 Tagen", score_speed: 4 },
      { id: "when_possible", label: "Wenn wir dazu kommen", score_speed: 1 },
      { id: "no_process", label: "Wir haben keinen festen Ablauf", score_speed: 0 },
    ],
  },

  // Step 7a – Sales-Prozess (Active)
  {
    id: "sales_process_active",
    type: "single_select",
    path_filter: "active",
    question: "Wie sieht euer Prozess nach der ersten Kontaktaufnahme aus?",
    options: [
      {
        id: "structured_sequence",
        label: "Strukturierte Follow-up-Sequenz",
        sublabel: "E-Mail + Call + weitere Touchpoints",
        score_sales: 15,
      },
      { id: "few_attempts", label: "1–2 Versuche, dann wird der Lead abgehakt", score_sales: 5 },
      {
        id: "individual",
        label: "Sales entscheidet individuell, kein fester Prozess",
        score_sales: 4,
      },
      {
        id: "crm_irregular",
        label: "Lead kommt ins CRM, aber Follow-up ist unregelmäßig",
        score_sales: 6,
      },
      { id: "no_process", label: "Wir haben keinen definierten Nachfass-Prozess", score_sales: 0 },
    ],
  },

  // Step 7b – Sales-Prozess (Starter)
  {
    id: "sales_process_starter",
    type: "single_select",
    path_filter: "starter",
    question: "Wie wird bei euch aus einem Interessenten ein Kunde?",
    options: [
      { id: "clear_process", label: "Klarer Prozess mit definierten Schritten", score_sales: 10 },
      {
        id: "unstructured",
        label: "Wir sprechen mit Interessenten, aber ohne feste Struktur",
        score_sales: 5,
      },
      {
        id: "random",
        label: "Es passiert eher zufällig oder über Beziehungen",
        score_sales: 3,
      },
      { id: "no_process", label: "Wir haben noch keinen Prozess dafür", score_sales: 0 },
    ],
  },

  // Step 8 – Follow-up-Struktur (Active only)
  {
    id: "followup_active",
    type: "single_select",
    path_filter: "active",
    question: "Wie viele Follow-up-Versuche macht euer Team pro Lead?",
    options: [
      { id: "6_plus_multichannel", label: "6+ Versuche über mehrere Kanäle", score_followup: 10 },
      { id: "automated_sequences", label: "Wir nutzen automatisierte Sequenzen", score_followup: 9 },
      { id: "3_5", label: "3–5 Versuche", score_followup: 6 },
      { id: "1_2", label: "1–2 Versuche", score_followup: 2 },
      { id: "no_system", label: "Kein festes System", score_followup: 0 },
    ],
  },

  // Interstitial 4 – "Das Gesamtbild"
  {
    id: "interstitial_4",
    type: "interstitial",
    stat_number: "208%",
    stat_label: "mehr Umsatz durch verzahntes Marketing & Sales",
    body: "Lead-Generierung ist eine Kette: Targeting → Ad → Funnel → Qualifizierung → Reaktionszeit → Sales-Prozess → Follow-up → Abschluss. Jedes schwache Glied kostet dich Kunden. Die Top-Performer optimieren nicht einzelne Schritte – sie optimieren das gesamte System.",
    source: "Quelle: Forrester / MarTech Research",
    cta_button: "Ergebnis berechnen",
  },

  // Step 9 – Kontaktdaten (shared)
  {
    id: "contact",
    type: "contact_form",
    question: "Fast geschafft – dein Score wird berechnet",
    body: "Gib deine Daten ein, um dein persönliches Ergebnis zu sehen.",
    cta_button: "Score berechnen →",
    fields: [
      {
        id: "name",
        label: "Name",
        type: "text",
        required: true,
        placeholder: "Dein vollständiger Name",
      },
      {
        id: "company",
        label: "Unternehmen",
        type: "text",
        required: true,
        placeholder: "Firmenname",
      },
      {
        id: "email",
        label: "E-Mail",
        type: "email",
        required: true,
        placeholder: "name@unternehmen.de",
      },
      {
        id: "phone",
        label: "Telefon",
        type: "tel",
        required: false,
        placeholder: "+49 ...",
        sublabel: "Optional – für schnellere Rückmeldung",
      },
      {
        id: "industry",
        label: "Branche",
        type: "dropdown",
        required: true,
        options: [
          "E-Commerce / Online-Handel",
          "SaaS / Software",
          "Dienstleistung / Beratung",
          "Immobilien",
          "Gesundheit / Medizin",
          "Handwerk / Bau",
          "Finanzen / Versicherung",
          "Bildung / Coaching",
          "Gastronomie / Tourismus",
          "Sonstige",
        ],
      },
    ],
  },
];

/**
 * Returns the steps visible for a given path (shared + path-specific).
 */
export function getStepsForPath(path: FunnelPath): FunnelStep[] {
  return FUNNEL_STEPS.filter(
    (step) => step.path_filter === undefined || step.path_filter === path
  );
}

/**
 * Determines the funnel path based on the Step 1 answer.
 */
export function determinePath(step1Answer: string): FunnelPath {
  if (["quality_issue", "scaling_issue", "optimization"].includes(step1Answer)) {
    return "active";
  }
  if (step1Answer === "getting_started") {
    return "starter";
  }
  return "active"; // fallback
}
