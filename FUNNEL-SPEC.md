# entity x Lead-Gen-Score Funnel – Complete Specification

> This document is the single source of truth for the entire funnel build. All copy, logic, scoring, and conditional routing is defined here.

---

## Table of Contents

1. [Funnel Overview](#1-funnel-overview)
2. [Conditional Routing Logic](#2-conditional-routing-logic)
3. [Step-by-Step Definition](#3-step-by-step-definition)
4. [Scoring Engine](#4-scoring-engine)
5. [Result Page](#5-result-page)
6. [Disqualification Logic](#6-disqualification-logic)
7. [Tracking Events](#7-tracking-events)
8. [TypeScript Types](#8-typescript-types)

---

## 1. Funnel Overview

### Flow Architecture

```
Hero/Entry → Step 1 (Path Selection)
                ↓
         ┌──────┴──────┐
    Active Path    Starter Path
    (A, C, D)         (B)
         ↓              ↓
    Interstitial 1 (shared)
         ↓              ↓
    Step 2a         Step 2b
         ↓              ↓
    Step 3a         Step 3b
         ↓              ↓
    Interstitial 2 (shared)
         ↓              ↓
    Step 4a         Step 4b
         ↓              ↓
    Step 5a         Step 5b
         ↓              ↓
    Interstitial 3 (shared)
         ↓              ↓
    Step 6a         Step 6b
         ↓              ↓
    Step 7a         Step 7b
         ↓              ↓
    Step 8a      (skip for Starter)
         ↓              ↓
    Interstitial 4 (shared)
         ↓              ↓
    Step 9 – Contact (shared)
         ↓
    Result Page (dynamic)
```

### Total Steps by Path
- **Active Path:** 8 question steps + 4 interstitials + 1 contact + 1 result = **14 screens**
- **Starter Path:** 7 question steps + 4 interstitials + 1 contact + 1 result = **13 screens**

### Progress Bar
Show progress as percentage. Calculate based on current screen / total screens for the active path. Do NOT show step numbers – just a smooth progress bar that fills up.

---

## 2. Conditional Routing Logic

### Path Determination (Step 1)

```typescript
type FunnelPath = "active" | "starter";

function determinePath(step1Answer: string): FunnelPath {
  // Answers A, C, D → Active Path
  if (["quality_issue", "scaling_issue", "optimization"].includes(step1Answer)) {
    return "active";
  }
  // Answer B → Starter Path
  if (step1Answer === "getting_started") {
    return "starter";
  }
  return "active"; // fallback
}
```

### Step 8 Skip Logic
Starter Path users skip Step 8 (Follow-up structure) entirely because they don't have an existing process to evaluate. Their Sales Process category score is normalized accordingly (see Scoring section).

---

## 3. Step-by-Step Definition

### Hero / Entry Screen

**This is the landing page the user arrives on from the Meta Ad.**

```yaml
headline: "Wie gut ist dein Lead-Gen-System wirklich?"
subheadline: "Finde in 2 Minuten heraus, wo dein Funnel Geld verbrennt – und wie du mehr Kunden aus dem gleichen Budget holst."
cta_button: "Jetzt Score berechnen"
trust_elements:
  - "Kostenlos & unverbindlich"
  - "Dauert nur 2 Minuten"
  - "Sofort Ergebnis"
```

**Design note:** Full viewport height. Headline large and bold (display font). Dark background. CTA button prominent with accent color. Subtle background animation (gradient shift or particle effect – keep it performant). No navigation, no distractions.

---

### Step 1 – Einstieg / Selbstselektion

```yaml
id: "situation"
type: "single_select"
question: "Was beschreibt deine aktuelle Situation am besten?"
options:
  - id: "quality_issue"
    label: "Wir generieren aktiv Leads, aber die Qualität stimmt nicht"
    path: "active"
  - id: "getting_started"
    label: "Wir wollen mit Lead-Gen starten, wissen aber nicht wo anfangen"
    path: "starter"
  - id: "scaling_issue"
    label: "Wir machen Lead-Gen, es läuft okay, aber skaliert nicht profitabel"
    path: "active"
  - id: "optimization"
    label: "Unser Lead-Gen läuft gut, wir suchen den nächsten Hebel"
    path: "active"
```

**Design note:** Large, clickable cards. Each card should have enough visual weight to feel like a meaningful choice. On click → auto-advance to next step (no separate "Weiter" button needed).

---

### Interstitial 1 – "Warum dieser Score?"

```yaml
id: "interstitial_1"
type: "interstitial"
stat_number: "79%"
stat_label: "aller Marketing-Leads werden nie zu Kunden"
body: "Nicht weil die Ads schlecht sind – sondern weil zwischen Klick und Abschluss zu viel verloren geht. Dein Lead-Gen-Score zeigt dir in 2 Minuten, wo genau dein System Geld verbrennt."
source: "Quelle: MarketingSherpa / ZoomInfo Research"
cta_button: "Weiter"
```

**Design note:** Interstitials look fundamentally different from question steps. The stat number should be MASSIVE (think 120px+ font size on desktop). Use the display font. Subtle background treatment – could be a gradient, a subtle pattern, or a very faint grid. The body text is smaller, set in the sans-serif body font. Auto-advance after 4-5 seconds OR on button click.

---

### Step 2 – Kanal & Setup

#### Active Path (Step 2a)

```yaml
id: "channels_active"
type: "multi_select"
question: "Über welche Kanäle generierst du aktuell Leads?"
instruction: "Wähle alle zutreffenden aus"
options:
  - id: "meta"
    label: "Meta Ads"
    sublabel: "Facebook / Instagram"
  - id: "google"
    label: "Google Ads"
    sublabel: "Search / Display"
  - id: "linkedin"
    label: "LinkedIn Ads"
  - id: "organic"
    label: "Organisch"
    sublabel: "SEO, Content, Social Media"
  - id: "outbound"
    label: "Outbound"
    sublabel: "Cold Mail, Telefon"
  - id: "referral"
    label: "Empfehlungen / Netzwerk"
min_selections: 1
cta_button: "Weiter"
```

#### Starter Path (Step 2b)

```yaml
id: "channels_starter"
type: "multi_select"
question: "Welche Kanäle würdest du für Lead-Gen in Betracht ziehen?"
instruction: "Wähle alle aus, die dich interessieren"
options:
  - id: "meta"
    label: "Meta Ads"
    sublabel: "Facebook / Instagram"
  - id: "google"
    label: "Google Ads"
    sublabel: "Search / Display"
  - id: "linkedin"
    label: "LinkedIn Ads"
  - id: "content"
    label: "Content Marketing / SEO"
  - id: "outbound"
    label: "Outbound"
    sublabel: "Cold Mail, Telefon"
  - id: "unsure"
    label: "Weiß ich noch nicht"
min_selections: 1
cta_button: "Weiter"
```

**Design note:** Multi-select cards with a checkbox visual. Selected state = accent color border + filled checkbox. Cards should be in a 2-column grid on desktop, single column on mobile.

---

### Step 3 – Funnel-Reife

#### Active Path (Step 3a)

```yaml
id: "funnel_maturity_active"
type: "single_select"
question: "Was passiert, nachdem jemand auf deine Ad oder dein Angebot klickt?"
options:
  - id: "website_direct"
    label: "Direkt auf unsere Website oder Kontaktseite"
    score_funnel: 3
  - id: "landing_page"
    label: "Eigene Landing Page"
    score_funnel: 8
  - id: "lp_followup"
    label: "Landing Page + automatisiertes Follow-up"
    sublabel: "E-Mail, WhatsApp oder SMS"
    score_funnel: 14
  - id: "multi_step"
    label: "Mehrstufiger Funnel mit Vorqualifizierung"
    score_funnel: 20
  - id: "segmented"
    label: "Verschiedene Funnels für verschiedene Zielgruppen"
    score_funnel: 25
```

#### Starter Path (Step 3b)

```yaml
id: "funnel_maturity_starter"
type: "single_select"
question: "Wie sieht aktuell dein Weg vom Interessenten zum Kunden aus?"
options:
  - id: "referrals_only"
    label: "Interessenten kommen über Empfehlungen, wir sprechen direkt"
    score_funnel: 4
  - id: "website_form"
    label: "Wir haben eine Website mit Kontaktformular"
    score_funnel: 5
  - id: "social_unstructured"
    label: "Wir nutzen Social Media, aber ohne klaren Prozess"
    score_funnel: 3
  - id: "no_process"
    label: "Wir haben aktuell keinen definierten Prozess"
    score_funnel: 0
```

---

### Interstitial 2 – "Marketing ≠ Lead-Gen"

```yaml
id: "interstitial_2"
type: "interstitial"
stat_number: "67%"
stat_label: "effektiver beim Closing"
body: "Unternehmen mit verzahntem Marketing und Sales schließen 67% mehr Deals ab und sparen 30% bei der Kundenakquise. Dein Funnel endet nicht beim Lead – er beginnt dort erst."
source: "Quelle: SiriusDecisions / Aberdeen Group"
cta_button: "Weiter"
```

---

### Step 4 – Lead-Volumen & Investment

#### Active Path (Step 4a)

**This step contains TWO questions on the same screen.**

```yaml
id: "volume_budget_active"
type: "dual_question"
questions:
  - id: "lead_volume"
    label: "Wie viele Leads generierst du pro Monat?"
    type: "single_select"
    options:
      - id: "under_50"
        label: "Unter 50"
      - id: "50_200"
        label: "50 – 200"
      - id: "200_500"
        label: "200 – 500"
      - id: "over_500"
        label: "Über 500"
      - id: "not_tracked"
        label: "Wir tracken das nicht"
  - id: "budget"
    label: "Wie hoch ist dein monatliches Marketing-Budget?"
    sublabel: "Media + Agentur"
    type: "single_select"
    options:
      - id: "under_2k"
        label: "Unter 2.000 €"
      - id: "2k_5k"
        label: "2.000 – 5.000 €"
      - id: "5k_15k"
        label: "5.000 – 15.000 €"
      - id: "over_15k"
        label: "Über 15.000 €"
cta_button: "Weiter"
```

#### Starter Path (Step 4b)

```yaml
id: "volume_budget_starter"
type: "dual_question"
questions:
  - id: "planned_budget"
    label: "Wie viel würdest du monatlich in Lead-Generierung investieren?"
    type: "single_select"
    options:
      - id: "under_2k"
        label: "Unter 2.000 €"
      - id: "2k_5k"
        label: "2.000 – 5.000 €"
      - id: "5k_15k"
        label: "5.000 – 15.000 €"
      - id: "over_15k"
        label: "Über 15.000 €"
      - id: "unclear"
        label: "Noch unklar"
  - id: "clv"
    label: "Was ist ein Neukunde für dich durchschnittlich wert?"
    sublabel: "Customer Lifetime Value"
    type: "single_select"
    options:
      - id: "under_1k"
        label: "Unter 1.000 €"
      - id: "1k_5k"
        label: "1.000 – 5.000 €"
      - id: "5k_20k"
        label: "5.000 – 20.000 €"
      - id: "over_20k"
        label: "Über 20.000 €"
      - id: "unknown"
        label: "Weiß ich nicht"
```

**Design note:** Dual questions on one screen. Stack vertically. First question on top, second below. Each has its own set of option cards. Both must be answered before "Weiter" enables.

---

### Step 5 – Messbarkeit

#### Active Path (Step 5a)

```yaml
id: "tracking_active"
type: "single_select"
question: "Weißt du, was dich ein qualifizierter Lead kostet?"
options:
  - id: "exact"
    label: "Ja, wir tracken CPL, CPA und ROAS genau"
    score_tracking: 15
  - id: "approximate"
    label: "Ungefähr, aber nicht exakt"
    score_tracking: 8
  - id: "not_really"
    label: "Nein, nicht wirklich"
    score_tracking: 3
  - id: "whats_cpl"
    label: "Was ist ein CPL?"
    score_tracking: 0
```

#### Starter Path (Step 5b)

```yaml
id: "tracking_starter"
type: "single_select"
question: "Wie trackst du aktuell, woher deine Kunden kommen?"
options:
  - id: "crm_clean"
    label: "CRM-System mit sauberer Zuordnung"
    score_tracking: 15
  - id: "excel_manual"
    label: "Excel oder Tabelle, manuell gepflegt"
    score_tracking: 8
  - id: "gut_feeling"
    label: "Bauchgefühl – wir wissen es ungefähr"
    score_tracking: 3
  - id: "nothing"
    label: "Gar nicht"
    score_tracking: 0
```

---

### Interstitial 3 – "Speed kills (Deals)"

```yaml
id: "interstitial_3"
type: "interstitial"
stat_number: "100×"
stat_label: "höhere Conversion bei Antwort unter 5 Minuten"
body: "Trotzdem liegt die durchschnittliche Reaktionszeit bei über 42 Stunden. 78% der Kunden kaufen beim Unternehmen, das zuerst antwortet. Die Frage ist nicht nur, wie du Leads generierst – sondern wie schnell du reagierst."
source: "Quelle: Harvard Business Review / LeadResponseManagement.org"
cta_button: "Weiter"
```

---

### Step 6 – Speed-to-Lead

#### Active Path (Step 6a)

```yaml
id: "speed_active"
type: "single_select"
question: "Wie schnell wird ein neuer Lead von eurem Team kontaktiert?"
options:
  - id: "under_5min"
    label: "Innerhalb von 5 Minuten"
    sublabel: "Automatisiert oder sofort"
    score_speed: 20
  - id: "under_1h"
    label: "Innerhalb von 1 Stunde"
    score_speed: 12
  - id: "under_24h"
    label: "Innerhalb von 24 Stunden"
    score_speed: 5
  - id: "over_24h"
    label: "Länger als 24 Stunden"
    score_speed: 2
  - id: "no_process"
    label: "Unterschiedlich / kein fester Prozess"
    score_speed: 0
```

#### Starter Path (Step 6b)

```yaml
id: "speed_starter"
type: "single_select"
question: "Wenn jemand Interesse zeigt – wie schnell meldest du dich?"
options:
  - id: "immediately"
    label: "Sofort oder innerhalb weniger Minuten"
    score_speed: 20
  - id: "same_day"
    label: "Am selben Tag"
    score_speed: 10
  - id: "1_2_days"
    label: "Innerhalb von 1–2 Tagen"
    score_speed: 4
  - id: "when_possible"
    label: "Wenn wir dazu kommen"
    score_speed: 1
  - id: "no_process"
    label: "Wir haben keinen festen Ablauf"
    score_speed: 0
```

---

### Step 7 – Sales-Prozess

#### Active Path (Step 7a)

```yaml
id: "sales_process_active"
type: "single_select"
question: "Wie sieht euer Prozess nach der ersten Kontaktaufnahme aus?"
options:
  - id: "structured_sequence"
    label: "Strukturierte Follow-up-Sequenz"
    sublabel: "E-Mail + Call + weitere Touchpoints"
    score_sales: 15
  - id: "few_attempts"
    label: "1–2 Versuche, dann wird der Lead abgehakt"
    score_sales: 5
  - id: "individual"
    label: "Sales entscheidet individuell, kein fester Prozess"
    score_sales: 4
  - id: "crm_irregular"
    label: "Lead kommt ins CRM, aber Follow-up ist unregelmäßig"
    score_sales: 6
  - id: "no_process"
    label: "Wir haben keinen definierten Nachfass-Prozess"
    score_sales: 0
```

#### Starter Path (Step 7b)

```yaml
id: "sales_process_starter"
type: "single_select"
question: "Wie wird bei euch aus einem Interessenten ein Kunde?"
options:
  - id: "clear_process"
    label: "Klarer Prozess mit definierten Schritten"
    score_sales: 10
  - id: "unstructured"
    label: "Wir sprechen mit Interessenten, aber ohne feste Struktur"
    score_sales: 5
  - id: "random"
    label: "Es passiert eher zufällig oder über Beziehungen"
    score_sales: 3
  - id: "no_process"
    label: "Wir haben noch keinen Prozess dafür"
    score_sales: 0
```

---

### Step 8 – Follow-up-Struktur (ACTIVE PATH ONLY)

```yaml
id: "followup_active"
type: "single_select"
question: "Wie viele Follow-up-Versuche macht euer Team pro Lead?"
options:
  - id: "6_plus_multichannel"
    label: "6+ Versuche über mehrere Kanäle"
    score_followup: 10
  - id: "automated_sequences"
    label: "Wir nutzen automatisierte Sequenzen"
    score_followup: 9
  - id: "3_5"
    label: "3–5 Versuche"
    score_followup: 6
  - id: "1_2"
    label: "1–2 Versuche"
    score_followup: 2
  - id: "no_system"
    label: "Kein festes System"
    score_followup: 0
```

**Starter Path skips this step entirely.**

---

### Interstitial 4 – "Das Gesamtbild"

```yaml
id: "interstitial_4"
type: "interstitial"
stat_number: "208%"
stat_label: "mehr Umsatz durch verzahntes Marketing & Sales"
body: "Lead-Generierung ist eine Kette: Targeting → Ad → Funnel → Qualifizierung → Reaktionszeit → Sales-Prozess → Follow-up → Abschluss. Jedes schwache Glied kostet dich Kunden. Die Top-Performer optimieren nicht einzelne Schritte – sie optimieren das gesamte System."
source: "Quelle: Forrester / MarTech Research"
cta_button: "Ergebnis berechnen"
```

**Design note:** This is the last interstitial before the contact form. The CTA should feel like a climax – "Ergebnis berechnen" instead of just "Weiter". Slightly different button style (larger, more prominent).

---

### Step 9 – Kontaktdaten (SHARED)

```yaml
id: "contact"
type: "contact_form"
headline: "Fast geschafft – dein Score wird berechnet"
subheadline: "Gib deine Daten ein, um dein persönliches Ergebnis zu sehen."
fields:
  - id: "name"
    label: "Name"
    type: "text"
    required: true
    placeholder: "Dein vollständiger Name"
  - id: "company"
    label: "Unternehmen"
    type: "text"
    required: true
    placeholder: "Firmenname"
  - id: "email"
    label: "E-Mail"
    type: "email"
    required: true
    placeholder: "name@unternehmen.de"
  - id: "phone"
    label: "Telefon"
    type: "tel"
    required: false
    placeholder: "+49 ..."
    sublabel: "Optional – für schnellere Rückmeldung"
  - id: "industry"
    label: "Branche"
    type: "dropdown"
    required: true
    options:
      - "E-Commerce / Online-Handel"
      - "SaaS / Software"
      - "Dienstleistung / Beratung"
      - "Immobilien"
      - "Gesundheit / Medizin"
      - "Handwerk / Bau"
      - "Finanzen / Versicherung"
      - "Bildung / Coaching"
      - "Gastronomie / Tourismus"
      - "Sonstige"
trust_text: "Kein Spam. Deine Daten werden ausschließlich für dein Ergebnis und eine mögliche Kontaktaufnahme genutzt."
cta_button: "Score berechnen →"
```

**Design note:** Clean form. Single column. Clear labels above fields (not placeholders only). The CTA button should feel weighty – this is the conversion moment. Show a subtle loading animation after click before transitioning to the result page.

---

## 4. Scoring Engine

### Categories and Weights

```typescript
interface ScoreBreakdown {
  funnel_maturity: number;    // max 25 points (weight: 25%)
  speed_to_lead: number;      // max 20 points (weight: 20%)
  sales_process: number;      // max 25 points (weight: 25%)
  tracking: number;           // max 15 points (weight: 15%)
  alignment: number;          // max 15 points (weight: 15%)
  total: number;              // max 100 points
}
```

### Scoring Rules

#### Funnel Maturity (max 25 points)
Points are assigned directly from the `score_funnel` value on the selected option in Step 3.

#### Speed-to-Lead (max 20 points)
Points are assigned directly from the `score_speed` value on the selected option in Step 6.

#### Sales Process & Follow-up (max 25 points)

**Active Path:**
- `score_sales` from Step 7a (max 15) + `score_followup` from Step 8 (max 10) = max 25

**Starter Path:**
- `score_sales` from Step 7b (max 10) → **normalize to 25 points**: `(score_sales / 10) * 25`

#### Tracking / Messbarkeit (max 15 points)
Points are assigned directly from the `score_tracking` value on the selected option in Step 5.

#### Marketing-Sales Alignment (max 15 points)
This is a **composite score** calculated from the OTHER categories:

```typescript
function calculateAlignment(
  funnelScore: number,
  speedScore: number,
  salesScore: number // already normalized to 25
): number {
  // Alignment = how well the system works together
  // Criteria: Has qualification step + Fast response + Structured follow-up
  
  const hasQualification = funnelScore >= 14; // LP + follow-up or better
  const hasFastResponse = speedScore >= 12;   // Under 1 hour
  const hasStructuredFollowup = salesScore >= 15; // Structured sequence or equivalent

  const criteriaCount = [hasQualification, hasFastResponse, hasStructuredFollowup]
    .filter(Boolean).length;

  switch (criteriaCount) {
    case 3: return 15;
    case 2: return 10;
    case 1: return 5;
    case 0: return 0;
  }
}
```

### Score Tiers

```typescript
type ScoreTier = "blindflug" | "basis" | "guter_ansatz" | "top_performer";

function getScoreTier(total: number): ScoreTier {
  if (total <= 25) return "blindflug";
  if (total <= 50) return "basis";
  if (total <= 75) return "guter_ansatz";
  return "top_performer";
}
```

### Channel Diversity Bonus (applied to Funnel Maturity)
If user selected 3+ channels in Step 2, add +2 bonus points to funnel_maturity (capped at 25). This rewards diversified lead generation.

---

## 5. Result Page

### Structure

The result page has these sections, in order:

1. **Score Header** – Animated gauge + score number + tier label
2. **Tier Explanation** – 2-3 sentences contextualizing the score
3. **Category Breakdown** – Visual bars for each of 5 categories
4. **Top 3 Insights** – Dynamic, based on weakest categories
5. **"Was würde sich ändern?"** – Vision of the optimized state
6. **CTA Section** – Calendly embed OR guide download (based on disqualification)

---

### 5.1 Score Header

**Animated circular gauge** that counts up from 0 to the user's score over ~2 seconds. Use the display font for the number. Color gradient on the gauge:

```
0-25:   Red (#EF4444)
26-50:  Orange (#F59E0B)
51-75:  Yellow-Green (#84CC16)
76-100: Green (#22C55E)
```

Below the gauge, show the tier label:

```yaml
blindflug: "Blindflug"
basis: "Solide Basis"
guter_ansatz: "Guter Ansatz"
top_performer: "Top-Performer"
```

---

### 5.2 Tier Explanation

#### Tier: Blindflug (0–25)

```
headline: "Dein Lead-Gen-Score: {score}/100"
subtitle: "Du fliegst blind."
body: "Dein Unternehmen hat entweder noch kein Lead-Gen-System oder es fehlen kritische Bausteine. Das bedeutet: Du lässt systematisch Umsatz liegen – nicht weil dein Angebot schlecht ist, sondern weil kein System existiert, das Interessenten zu Kunden macht."
```

#### Tier: Basis (26–50)

```
headline: "Dein Lead-Gen-Score: {score}/100"
subtitle: "Du hast eine Basis, aber Geld bleibt liegen."
body: "Du machst mehr als die meisten Unternehmen – aber zwischen deinem Marketing und dem Abschluss gehen zu viele Leads verloren. Die Kette hat schwache Glieder, und jedes davon kostet dich konkret Kunden."
```

#### Tier: Guter Ansatz (51–75)

```
headline: "Dein Lead-Gen-Score: {score}/100"
subtitle: "Besser als die meisten. Aber da geht noch was."
body: "Du hast ein funktionierendes System – Funnel, Tracking, Sales-Prozess sind vorhanden. Aber die Details machen den Unterschied zwischen gut und exzellent. Hier liegen noch 20–30% mehr Effizienz."
```

#### Tier: Top-Performer (76–100)

```
headline: "Dein Lead-Gen-Score: {score}/100"
subtitle: "Du gehörst zu den Top 10%."
body: "Dein System ist stark – schnelle Reaktion, strukturiertes Follow-up, sauberes Tracking. Die Frage ist jetzt: Wie skalierst du, ohne dass die Qualität leidet?"
```

---

### 5.3 Category Breakdown

Show 5 horizontal bars with labels, each filled proportionally:

```
Funnel-Reife:        ████████░░░░░  16/25
Reaktionszeit:       ██████████████  20/20
Sales & Follow-up:   ████░░░░░░░░░   8/25
Messbarkeit:         ████████░░░░░   8/15
Marketing-Sales-Sync: █████░░░░░░░░   5/15
                                    ──────
                              Total: 57/100
```

**Design:** Use the accent color for the filled portion. Gray for unfilled. Show "{points}/{max}" next to each bar. Animate bars filling in with staggered delay (200ms between each). Use a distinct label for each category (German):

```typescript
const categoryLabels = {
  funnel_maturity: "Funnel-Reife",
  speed_to_lead: "Reaktionszeit",
  sales_process: "Sales & Follow-up",
  tracking: "Messbarkeit",
  alignment: "Marketing-Sales-Sync"
};
```

---

### 5.4 Dynamic Insights (Top 3)

**Logic:** Sort the 5 categories by their score as a percentage of max (lowest first). Pick the bottom 3. For each, render the matching insight text.

```typescript
function getWeakestCategories(breakdown: ScoreBreakdown): CategoryKey[] {
  const percentages = {
    funnel_maturity: breakdown.funnel_maturity / 25,
    speed_to_lead: breakdown.speed_to_lead / 20,
    sales_process: breakdown.sales_process / 25,
    tracking: breakdown.tracking / 15,
    alignment: breakdown.alignment / 15,
  };
  
  return Object.entries(percentages)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([key]) => key as CategoryKey);
}
```

#### Insight Templates per Category

Each insight has a `title`, `body`, and `datapoint`. The body text varies by the actual score within the category (low/medium/high).

---

**FUNNEL MATURITY Insights:**

Score 0–5 (critical):
```yaml
title: "Kein funktionierender Funnel"
icon: "funnel" # use a relevant icon
body: "Jeder Interessent, der auf dein Angebot aufmerksam wird, muss sich selbst durch deinen Prozess navigieren. Ohne Landing Page und Qualifizierung sprichst du mit jedem – auch mit den 73%, die nie kaufen werden."
datapoint: "73% der Leads werden ohne Qualifizierung nie zu Kunden"
```

Score 6–14 (moderate):
```yaml
title: "Funnel vorhanden, aber ohne Filter"
body: "Du hast eine Landing Page – gut. Aber ohne Vorqualifizierung landen alle Leads gleichwertig bei deinem Sales-Team. Das kostet Zeit, Energie und Motivation. Die besten Funnels filtern vor dem Gespräch, nicht währenddessen."
datapoint: "Unternehmen mit Vorqualifizierung haben 3× höhere Abschlussquoten"
```

Score 15–20 (good, room for improvement):
```yaml
title: "Solider Funnel – nächste Stufe: Segmentierung"
body: "Dein Funnel qualifiziert, aber er personalisiert noch nicht. Verschiedene Zielgruppen brauchen verschiedene Funnels. Das bedeutet: spezifischere Ansprache, höhere Relevanz und bessere Lead-Qualität für dein Sales-Team."
datapoint: "Segmentierte Funnels steigern die Conversion um bis zu 73%"
```

---

**SPEED-TO-LEAD Insights:**

Score 0–5 (critical):
```yaml
title: "Deine Reaktionszeit kostet dich Deals"
body: "Ohne festen Prozess oder mit Reaktionszeiten über 24 Stunden hast du den Lead in den meisten Fällen bereits verloren. 78% der Kunden kaufen beim Unternehmen, das zuerst antwortet – nicht beim besten oder günstigsten."
datapoint: "100× bessere Conversion bei Antwort unter 5 Min vs. 30 Min"
```

Score 6–12 (moderate):
```yaml
title: "Schnell, aber nicht schnell genug"
body: "Du reagierst innerhalb von Stunden – aber nicht Minuten. In dieser Zeitspanne hat der Interessent bereits 2–3 andere Anbieter kontaktiert. Der Unterschied zwischen 5 Minuten und 1 Stunde kann einen Deal entscheiden."
datapoint: "Nach 1 Stunde sinkt die Qualifizierungswahrscheinlichkeit um das 7-Fache"
```

Score 13–17 (good):
```yaml
title: "Gute Reaktionszeit – Automatisierung als nächster Schritt"
body: "Unter 1 Stunde ist solide. Der Game-Changer: automatisierte Erstreaktion per WhatsApp oder SMS innerhalb von Sekunden. Das hält den Lead warm, bis dein Team persönlich übernimmt."
datapoint: "Automatisierte Sofort-Antwort verdoppelt die Kontaktrate"
```

---

**SALES PROCESS & FOLLOW-UP Insights:**

Score 0–8 (critical):
```yaml
title: "Dein Follow-up verschenkt abschlussbereite Leads"
body: "Ohne strukturiertes Follow-up verlierst du den Großteil deiner Leads. 80% aller Abschlüsse passieren erst nach dem 5. Kontakt – aber die meisten Teams geben nach 1–2 Versuchen auf. Das ist, als würdest du kurz vor der Ziellinie stehen bleiben."
datapoint: "80% der Sales brauchen 5+ Follow-ups, 48% der Vertriebler machen nur einen Versuch"
```

Score 9–16 (moderate):
```yaml
title: "Sales-Prozess vorhanden, aber Lücken im Follow-up"
body: "Du hast einen Ansatz, aber er ist nicht konsequent genug. Die besten Teams arbeiten mit Multi-Channel-Sequenzen: E-Mail, Anruf, LinkedIn, WhatsApp – über 6+ Touchpoints. Jeder zusätzliche Kanal erhöht die Kontaktrate signifikant."
datapoint: "Multi-Channel-Cadences erzielen 28% höhere Conversion als Einzel-Kanal"
```

Score 17–21 (good):
```yaml
title: "Starker Sales-Prozess – Optimierung im Detail"
body: "Dein Follow-up ist strukturiert und multi-channel. Der nächste Hebel: Timing-Optimierung und personalisierte Sequenzen basierend auf dem Lead-Verhalten. Leads, die bestimmte Seiten besucht oder bestimmte Fragen beantwortet haben, brauchen eine andere Ansprache."
datapoint: "Personalisierte Sequenzen steigern Engagement um das 10-Fache"
```

---

**TRACKING / MESSBARKEIT Insights:**

Score 0–3 (critical):
```yaml
title: "Du optimierst im Dunkeln"
body: "Ohne exakten CPL und CPA weißt du nicht, welcher Kanal, welche Ad, welcher Funnel wirklich performt – und welcher nur Geld verbrennt. Du investierst Budget, ohne zu wissen, ob es sich rentiert. Das ist wie Autofahren ohne Tacho."
datapoint: "Unternehmen ohne Tracking verschwenden bis zu 50% ihres Marketing-Budgets"
```

Score 4–8 (moderate):
```yaml
title: "Ungefähres Tracking reicht nicht"
body: "Du hast eine Ahnung, was funktioniert – aber keine Gewissheit. Exaktes Tracking bedeutet: Du kannst innerhalb von 48 Stunden sehen, ob eine neue Kampagne profitabel ist. Ohne das fährst du wochenlang in die falsche Richtung."
datapoint: "46% der Marketer mit ausgereiftem Tracking haben Sales-Teams, die 75%+ der Leads bearbeiten"
```

Score 9–12 (good):
```yaml
title: "Gutes Tracking – nächster Schritt: End-to-End Attribution"
body: "Du trackst die wichtigsten KPIs. Der nächste Level: Closed-Loop-Reporting, das jeden Euro vom Klick bis zum Abschluss nachverfolgt. So siehst du nicht nur den CPL, sondern den echten ROI pro Kanal und Kampagne."
datapoint: "End-to-End-Attribution steigert Marketing-ROI um durchschnittlich 15–20%"
```

---

**ALIGNMENT Insights:**

Score 0 (critical):
```yaml
title: "Marketing und Sales leben in getrennten Welten"
body: "Keines der drei Alignment-Kriterien ist erfüllt: kein Qualifizierungs-Funnel, keine schnelle Reaktionszeit, kein strukturiertes Follow-up. Das bedeutet: Selbst wenn dein Marketing Leads liefert, kann dein Sales-Prozess sie nicht konvertieren. Das kostet dich nicht nur Kunden – es frisst dein gesamtes Marketing-Budget."
datapoint: "Fehlende Alignment kostet Unternehmen 10%+ ihres Jahresumsatzes"
```

Score 5 (moderate):
```yaml
title: "Teilweise verzahnt – aber nicht durchgängig"
body: "Ein Teil deiner Kette funktioniert, aber Marketing und Sales übergeben sich Leads, ohne dass der Prozess nahtlos ist. Das führt zu Reibungsverlusten an jeder Schnittstelle. Aligned Teams wachsen 24% schneller im Umsatz."
datapoint: "Aligned Organisationen erzielen 24% schnelleres Umsatzwachstum"
```

Score 10 (good):
```yaml
title: "Gute Verzahnung – letzte Lücke schließen"
body: "Zwei von drei Kriterien sind erfüllt. Der letzte Baustein würde dein System auf Top-Performer-Niveau bringen. Meist fehlt entweder die automatisierte Sofort-Reaktion oder die konsequente Multi-Channel-Sequenz."
datapoint: "Voll verzahnte Teams erzielen 38% höhere Win-Rates"
```

---

### 5.5 "Was würde sich ändern?"

This section appears after the insights. It paints the picture of the optimized state.

```yaml
headline: "Stell dir vor..."
items:
  - "Dein Sales-Team spricht nur noch mit Leads, die wirklich kaufbereit sind"
  - "Jeder Lead wird innerhalb von Minuten kontaktiert – automatisch"
  - "Du weißt genau, was ein Kunde dich kostet und welcher Kanal den besten ROI liefert"
  - "Weniger Leads, aber mehr Abschlüsse – bei niedrigeren Kosten"
```

**Design note:** This should feel aspirational. Maybe a different background shade, slightly lighter. The items appear with staggered fade-in animation. Each item has a subtle checkmark or arrow icon.

---

### 5.6 CTA Section

#### Standard CTA (qualified leads)

```yaml
headline: "Lass uns dein System optimieren"
body: "In einer kostenlosen 30-Minuten-Analyse zeigen wir dir, wie ein optimierter Funnel für dein Business konkret aussehen würde – basierend auf deinem Score."
cta_button: "Kostenlose Potenzial-Analyse buchen"
calendly_url: "https://calendar.app.google/gRioFxoyaXwjQXEx8"
trust_elements:
  - "30 Minuten, kostenlos & unverbindlich"
  - "Konkrete Handlungsempfehlungen"
  - "Kein Sales-Pitch, sondern Substanz"
```

**Design note:** Calendly inline embed if possible. Otherwise, a prominent button that opens Calendly in a modal/new tab. This section should feel like a natural next step, not a hard sell.

#### CTA Variant per Tier

Adjust the body text to match the tier:

**Blindflug:**
```
"Du brauchst kein besseres Marketing – du brauchst ein System. In 30 Minuten zeigen wir dir, wie ein Lead-Gen-System für dein Business von Grund auf aussehen kann."
```

**Basis:**
```
"Dein System hat Potenzial – aber die Lücken kosten dich täglich Kunden. Lass uns in 30 Minuten die 2–3 Hebel identifizieren, die bei dir den größten Impact hätten."
```

**Guter Ansatz:**
```
"Du bist nah dran am Optimum. Lass uns in 30 Minuten die 2–3 Feinschliff-Hebel identifizieren, die dein System auf das nächste Level bringen."
```

**Top-Performer:**
```
"Dein Setup ist beeindruckend. Lass uns sprechen, wie wir dein System durch AI-Automatisierung und fortgeschrittene Funnel-Architektur weiter skalieren können."
```

#### Disqualified CTA (see section 6)

```yaml
headline: "Dein nächster Schritt"
body: "Basierend auf deinem Score empfehlen wir dir, mit unserer kostenlosen Lead-Gen-Checkliste zu starten. Wenn du bereit bist zu skalieren, sind wir für dich da."
cta_button: "Kostenlose Checkliste herunterladen"
download_url: "#" # placeholder
secondary_cta: "Trotzdem Termin buchen? →"
secondary_url: "https://calendar.app.google/gRioFxoyaXwjQXEx8"
```

---

## 6. Disqualification Logic

### Rules

A lead is disqualified from the Calendly CTA if ANY of these conditions are true:

```typescript
function isDisqualified(answers: FunnelAnswers): boolean {
  const path = answers.path;
  
  if (path === "starter") {
    // Starter: Budget under 2k AND CLV under 1k
    return (
      answers.planned_budget === "under_2k" &&
      answers.clv === "under_1k"
    );
  }
  
  if (path === "active") {
    // Active: Budget under 2k AND tracking = "whats_cpl"
    return (
      answers.budget === "under_2k" &&
      answers.tracking_active === "whats_cpl"
    );
  }
  
  return false;
}
```

### Important

Disqualified users STILL see their full score and all insights. They just see the alternative CTA (guide download) instead of the Calendly embed. The secondary CTA link to Calendly is still shown as a text link – they can book if they want, but it's not pushed.

---

## 7. Tracking Events

Fire these events via the `trackEvent()` utility. These will be picked up by GTM / Meta Pixel when integrated.

```typescript
// Event naming convention: snake_case, prefixed with "funnel_"
trackEvent("funnel_started");                           // Hero CTA clicked
trackEvent("funnel_step_completed", { step: "situation", answer: "quality_issue" });
trackEvent("funnel_interstitial_viewed", { id: "interstitial_1" });
trackEvent("funnel_path_determined", { path: "active" });
trackEvent("funnel_contact_submitted", { score: 57, tier: "guter_ansatz" });
trackEvent("funnel_result_viewed", { score: 57, tier: "guter_ansatz" });
trackEvent("funnel_calendly_clicked", { score: 57, tier: "guter_ansatz" });
trackEvent("funnel_guide_downloaded", { score: 23, tier: "blindflug" });
trackEvent("funnel_step_back", { from: "channels_active", to: "situation" });
```

---

## 8. TypeScript Types

```typescript
// ---- Path & Routing ----
type FunnelPath = "active" | "starter";

// ---- Step Types ----
type StepType = "single_select" | "multi_select" | "dual_question" | "contact_form" | "interstitial";

interface StepOption {
  id: string;
  label: string;
  sublabel?: string;
  path?: FunnelPath;           // only on Step 1
  score_funnel?: number;
  score_speed?: number;
  score_sales?: number;
  score_followup?: number;
  score_tracking?: number;
}

interface FunnelStep {
  id: string;
  type: StepType;
  question?: string;
  instruction?: string;
  options?: StepOption[];
  // For dual_question type
  questions?: {
    id: string;
    label: string;
    sublabel?: string;
    type: "single_select";
    options: StepOption[];
  }[];
  // For interstitial type
  stat_number?: string;
  stat_label?: string;
  body?: string;
  source?: string;
  // For contact_form type
  fields?: ContactField[];
  // UI
  cta_button?: string;
  min_selections?: number;     // for multi_select
  path_filter?: FunnelPath;    // which path this step belongs to (undefined = shared)
}

interface ContactField {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "dropdown";
  required: boolean;
  placeholder?: string;
  sublabel?: string;
  options?: string[];          // for dropdown
}

// ---- Answers ----
interface FunnelAnswers {
  path: FunnelPath;
  situation: string;
  channels: string[];          // multi-select, array of option ids
  funnel_maturity: string;
  lead_volume?: string;        // active path
  budget?: string;             // active path
  planned_budget?: string;     // starter path
  clv?: string;                // starter path
  tracking: string;
  speed: string;
  sales_process: string;
  followup?: string;           // active path only
  // Contact
  name: string;
  company: string;
  email: string;
  phone?: string;
  industry: string;
}

// ---- Scoring ----
interface ScoreBreakdown {
  funnel_maturity: number;     // max 25
  speed_to_lead: number;       // max 20
  sales_process: number;       // max 25
  tracking: number;            // max 15
  alignment: number;           // max 15
  total: number;               // max 100
}

type ScoreTier = "blindflug" | "basis" | "guter_ansatz" | "top_performer";

interface ScoreResult {
  breakdown: ScoreBreakdown;
  tier: ScoreTier;
  weakestCategories: CategoryKey[];  // bottom 3
  isDisqualified: boolean;
}

type CategoryKey = keyof Omit<ScoreBreakdown, "total">;

// ---- Insights ----
interface Insight {
  category: CategoryKey;
  title: string;
  body: string;
  datapoint: string;
  severity: "critical" | "moderate" | "good";
}
```

---

## Appendix: Data Points Reference

These statistics are used throughout the funnel (interstitials + result insights). All sourced from published research.

| Stat | Source | Used In |
|---|---|---|
| 79% of marketing leads never convert to sales | MarketingSherpa / ZoomInfo | Interstitial 1 |
| 100× better conversion at <5min vs 30min response | LeadResponseManagement.org | Interstitial 3, Speed insight |
| Avg. B2B response time = 42 hours | InsideSales.com / Kixie | Interstitial 3 |
| 78% buy from first responder | HBR / Lead Response Management Study | Speed insight |
| 80% of sales need 5+ follow-ups | Sales statistics / Martal | Sales insight |
| 48% of sales reps never follow up | Sales follow-up research | Sales insight |
| 67% better at closing when aligned | Aberdeen / SiriusDecisions | Interstitial 2 |
| 30% savings on customer acquisition with alignment | Aberdeen Group | Interstitial 2 |
| 208% more marketing revenue with alignment | Forrester / MarTech | Interstitial 4, Alignment insight |
| 24% faster revenue growth with aligned operations | SiriusDecisions | Alignment insight |
| 73% of leads never contacted | Kixie research | Funnel insight |
| 36% higher retention with alignment | Aberdeen Group | Alignment insight |
| 10%+ revenue loss from misalignment | ZoomInfo / B2B research | Alignment insight |
| 28% higher conversion with multi-channel cadence | Sales follow-up statistics | Sales insight |
| 391% conversion increase at <1min response | Velocify | Speed insight (background) |
