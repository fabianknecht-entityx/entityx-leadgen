// ---- Path & Routing ----
export type FunnelPath = "active" | "starter";

// ---- Step Types ----
export type StepType =
  | "single_select"
  | "multi_select"
  | "dual_question"
  | "contact_form"
  | "interstitial";

export interface StepOption {
  id: string;
  label: string;
  sublabel?: string;
  path?: FunnelPath;
  score_funnel?: number;
  score_speed?: number;
  score_sales?: number;
  score_followup?: number;
  score_tracking?: number;
}

export interface FunnelStep {
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
  min_selections?: number;
  path_filter?: FunnelPath;
}

export interface ContactField {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "tel_with_code" | "dropdown";
  required: boolean;
  placeholder?: string;
  sublabel?: string;
  options?: string[];
}

// ---- Answers ----
export interface FunnelAnswers {
  path: FunnelPath;
  situation: string;
  channels: string[];
  funnel_maturity: string;
  lead_volume?: string;
  budget?: string;
  planned_budget?: string;
  clv?: string;
  tracking: string;
  speed: string;
  sales_process: string;
  followup?: string;
  // Contact
  name: string;
  company: string;
  email: string;
  phone?: string;
  phone_code?: string;
  industry: string;
}

// ---- Scoring ----
export interface ScoreBreakdown {
  funnel_maturity: number;
  speed_to_lead: number;
  sales_process: number;
  tracking: number;
  alignment: number;
  total: number;
}

export type ScoreTier = "blindflug" | "basis" | "guter_ansatz" | "top_performer";

export interface ScoreResult {
  breakdown: ScoreBreakdown;
  tier: ScoreTier;
  weakestCategories: CategoryKey[];
  isDisqualified: boolean;
}

export type CategoryKey = keyof Omit<ScoreBreakdown, "total">;

// ---- Insights ----
export interface Insight {
  category: CategoryKey;
  title: string;
  body: string;
  datapoint: string;
  severity: "critical" | "moderate" | "good";
}
