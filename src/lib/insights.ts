import type { ScoreResult, CategoryKey, Insight } from "@/types/funnel";

interface InsightVariant {
  maxScore: number;
  severity: "critical" | "moderate" | "good";
  title: string;
  body: string;
  datapoint: string;
}

const INSIGHT_MAP: Record<CategoryKey, InsightVariant[]> = {
  funnel_maturity: [
    {
      maxScore: 5,
      severity: "critical",
      title: "Kein funktionierender Funnel",
      body: "Jeder Interessent, der auf dein Angebot aufmerksam wird, muss sich selbst durch deinen Prozess navigieren. Ohne Landing Page und Qualifizierung sprichst du mit jedem – auch mit den 73%, die nie kaufen werden.",
      datapoint: "73% der Leads werden ohne Qualifizierung nie zu Kunden",
    },
    {
      maxScore: 14,
      severity: "moderate",
      title: "Funnel vorhanden, aber ohne Filter",
      body: "Du hast eine Landing Page – gut. Aber ohne Vorqualifizierung landen alle Leads gleichwertig bei deinem Sales-Team. Das kostet Zeit, Energie und Motivation. Die besten Funnels filtern vor dem Gespräch, nicht währenddessen.",
      datapoint: "Unternehmen mit Vorqualifizierung haben 3× höhere Abschlussquoten",
    },
    {
      maxScore: 25,
      severity: "good",
      title: "Solider Funnel – nächste Stufe: Segmentierung",
      body: "Dein Funnel qualifiziert, aber er personalisiert noch nicht. Verschiedene Zielgruppen brauchen verschiedene Funnels. Das bedeutet: spezifischere Ansprache, höhere Relevanz und bessere Lead-Qualität für dein Sales-Team.",
      datapoint: "Segmentierte Funnels steigern die Conversion um bis zu 73%",
    },
  ],

  speed_to_lead: [
    {
      maxScore: 5,
      severity: "critical",
      title: "Deine Reaktionszeit kostet dich Deals",
      body: "Ohne festen Prozess oder mit Reaktionszeiten über 24 Stunden hast du den Lead in den meisten Fällen bereits verloren. 78% der Kunden kaufen beim Unternehmen, das zuerst antwortet – nicht beim besten oder günstigsten.",
      datapoint: "21× höhere Qualifizierungsrate bei Antwort unter 5 Min vs. 30 Min",
    },
    {
      maxScore: 12,
      severity: "moderate",
      title: "Schnell, aber nicht schnell genug",
      body: "Du reagierst innerhalb von Stunden – aber nicht Minuten. In dieser Zeitspanne hat der Interessent bereits 2–3 andere Anbieter kontaktiert. Der Unterschied zwischen 5 Minuten und 1 Stunde kann einen Deal entscheiden.",
      datapoint: "Nach 1 Stunde sinkt die Qualifizierungswahrscheinlichkeit um das 7-Fache",
    },
    {
      maxScore: 20,
      severity: "good",
      title: "Gute Reaktionszeit – der entscheidende Hebel liegt in der Automatisierung",
      body: "Unter 1 Stunde ist solide. Der nächste Schritt: eine automatisierte Erstreaktion per WhatsApp oder SMS innerhalb von Sekunden. Das hält den Lead warm, bis dein Team persönlich übernimmt.",
      datapoint: "Automatisierte Sofort-Antwort verdoppelt die Kontaktrate",
    },
  ],

  sales_process: [
    {
      maxScore: 8,
      severity: "critical",
      title: "Dein Follow-up verschenkt abschlussbereite Leads",
      body: "Ohne strukturiertes Follow-up verlierst du den Großteil deiner Leads. 80% aller Abschlüsse passieren erst nach dem 5. Kontakt – aber die meisten Teams geben nach 1–2 Versuchen auf. Das bedeutet: Du investierst in die Lead-Generierung, lässt aber den Abschluss systematisch liegen.",
      datapoint: "80% der Sales brauchen 5+ Follow-ups, 48% der Vertriebler machen nur einen Versuch",
    },
    {
      maxScore: 16,
      severity: "moderate",
      title: "Sales-Prozess vorhanden, aber Lücken im Follow-up",
      body: "Du hast einen Ansatz, aber er ist nicht konsequent genug. Die besten Teams arbeiten mit Multi-Channel-Sequenzen: E-Mail, Anruf, LinkedIn, WhatsApp – über 6+ Touchpoints. Jeder zusätzliche Kanal erhöht die Kontaktrate signifikant.",
      datapoint: "Multi-Channel-Cadences erzielen 28% höhere Conversion als Einzel-Kanal",
    },
    {
      maxScore: 25,
      severity: "good",
      title: "Starker Sales-Prozess – Optimierung im Detail",
      body: "Dein Follow-up ist strukturiert und multi-channel. Der nächste Hebel: Timing-Optimierung und personalisierte Sequenzen basierend auf dem Lead-Verhalten. Leads, die bestimmte Seiten besucht oder bestimmte Fragen beantwortet haben, brauchen eine andere Ansprache.",
      datapoint: "Personalisierte Sequenzen steigern Engagement um das 10-Fache",
    },
  ],

  tracking: [
    {
      maxScore: 3,
      severity: "critical",
      title: "Du optimierst im Dunkeln",
      body: "Ohne exakten CPL und CPA weißt du nicht, welcher Kanal, welche Ad, welcher Funnel wirklich performt – und wo Budget ohne Ergebnis abfließt. Du triffst Entscheidungen auf Basis von Annahmen statt auf Basis von Daten. Damit lässt sich kein System gezielt optimieren.",
      datapoint: "Unternehmen ohne Tracking verschwenden bis zu 50% ihres Marketing-Budgets",
    },
    {
      maxScore: 8,
      severity: "moderate",
      title: "Ungefähres Tracking reicht nicht",
      body: "Du hast eine Ahnung, was funktioniert – aber keine Gewissheit. Exaktes Tracking bedeutet: Du kannst innerhalb von 48 Stunden sehen, ob eine neue Kampagne profitabel ist. Ohne das fährst du wochenlang in die falsche Richtung.",
      datapoint: "46% der Marketer mit ausgereiftem Tracking haben Sales-Teams, die 75%+ der Leads bearbeiten",
    },
    {
      maxScore: 15,
      severity: "good",
      title: "Gutes Tracking – nächster Schritt: End-to-End Attribution",
      body: "Du trackst die wichtigsten KPIs. Der nächste Schritt: Closed-Loop-Reporting, das jeden Euro vom Klick bis zum Abschluss nachverfolgt. So siehst du nicht nur den CPL, sondern den echten ROI pro Kanal und Kampagne.",
      datapoint: "End-to-End-Attribution steigert Marketing-ROI um durchschnittlich 15–20%",
    },
  ],

  alignment: [
    {
      maxScore: 0,
      severity: "critical",
      title: "Marketing und Sales leben in getrennten Welten",
      body: "Keines der drei Alignment-Kriterien ist erfüllt: kein Qualifizierungs-Funnel, keine schnelle Reaktionszeit, kein strukturiertes Follow-up. Das bedeutet: Selbst wenn dein Marketing Leads liefert, kann dein Sales-Prozess sie nicht konvertieren. Das kostet dich nicht nur Kunden – es frisst dein gesamtes Marketing-Budget.",
      datapoint: "Fehlende Alignment kostet Unternehmen 10%+ ihres Jahresumsatzes",
    },
    {
      maxScore: 5,
      severity: "moderate",
      title: "Teilweise verzahnt – aber nicht durchgängig",
      body: "Ein Teil deiner Kette funktioniert, aber Marketing und Sales übergeben sich Leads, ohne dass der Prozess nahtlos ist. Das führt zu Reibungsverlusten an jeder Schnittstelle. Verzahnte Teams wachsen 24% schneller im Umsatz.",
      datapoint: "Verzahnte Organisationen erzielen 24% schnelleres Umsatzwachstum",
    },
    {
      maxScore: 15,
      severity: "good",
      title: "Gute Verzahnung – letzte Lücke schließen",
      body: "Zwei von drei Kriterien sind erfüllt. Der letzte Baustein würde dein System auf Top-Performer-Niveau bringen. Meist fehlt entweder die automatisierte Sofort-Reaktion oder die konsequente Multi-Channel-Sequenz.",
      datapoint: "Voll verzahnte Teams erzielen 38% höhere Win-Rates",
    },
  ],
};

/**
 * Generates up to 3 insights based on the weakest scoring categories.
 */
export function generateInsights(result: ScoreResult): Insight[] {
  return result.weakestCategories.map((category) => {
    const variants = INSIGHT_MAP[category];
    const score = result.breakdown[category];
    const variant = variants.find((v) => score <= v.maxScore) ?? variants[variants.length - 1];

    return {
      category,
      title: variant.title,
      body: variant.body,
      datapoint: variant.datapoint,
      severity: variant.severity,
    };
  });
}
