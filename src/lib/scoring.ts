import type {
  FunnelAnswers,
  FunnelStep,
  ScoreBreakdown,
  ScoreResult,
  ScoreTier,
  CategoryKey,
} from "@/types/funnel";

const CATEGORY_MAX: Record<CategoryKey, number> = {
  funnel_maturity: 25,
  speed_to_lead: 20,
  sales_process: 25,
  tracking: 15,
  alignment: 15,
};

/**
 * Finds a step by ID, then finds the selected option and returns its score field value.
 */
function getOptionScore(
  steps: FunnelStep[],
  stepId: string,
  answerValue: string,
  scoreField: keyof Pick<
    import("@/types/funnel").StepOption,
    "score_funnel" | "score_speed" | "score_sales" | "score_followup" | "score_tracking"
  >
): number {
  const step = steps.find((s) => s.id === stepId);
  if (!step?.options) return 0;
  const option = step.options.find((o) => o.id === answerValue);
  return option?.[scoreField] ?? 0;
}

export function getScoreTier(total: number): ScoreTier {
  if (total <= 25) return "blindflug";
  if (total <= 50) return "basis";
  if (total <= 75) return "guter_ansatz";
  return "top_performer";
}

export function getWeakestCategories(breakdown: ScoreBreakdown): CategoryKey[] {
  const percentages: Record<CategoryKey, number> = {
    funnel_maturity: breakdown.funnel_maturity / CATEGORY_MAX.funnel_maturity,
    speed_to_lead: breakdown.speed_to_lead / CATEGORY_MAX.speed_to_lead,
    sales_process: breakdown.sales_process / CATEGORY_MAX.sales_process,
    tracking: breakdown.tracking / CATEGORY_MAX.tracking,
    alignment: breakdown.alignment / CATEGORY_MAX.alignment,
  };

  return (Object.entries(percentages) as [CategoryKey, number][])
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([key]) => key);
}

function calculateAlignment(
  funnelScore: number,
  speedScore: number,
  salesScore: number
): number {
  const hasQualification = funnelScore >= 14;
  const hasFastResponse = speedScore >= 12;
  const hasStructuredFollowup = salesScore >= 15;

  const criteriaCount = [hasQualification, hasFastResponse, hasStructuredFollowup].filter(
    Boolean
  ).length;

  switch (criteriaCount) {
    case 3:
      return 15;
    case 2:
      return 10;
    case 1:
      return 5;
    default:
      return 0;
  }
}

/**
 * Main scoring engine. Receives answers + steps as params (no direct config import → testable).
 */
export function calculateScore(
  answers: FunnelAnswers,
  steps: FunnelStep[]
): ScoreResult {
  const isActive = answers.path === "active";

  // Funnel Maturity (max 25)
  const funnelStepId = isActive ? "funnel_maturity_active" : "funnel_maturity_starter";
  let funnelScore = getOptionScore(steps, funnelStepId, answers.funnel_maturity, "score_funnel");

  // Channel diversity bonus: +2 if 3+ channels, capped at 25
  if (answers.channels.length >= 3) {
    funnelScore = Math.min(funnelScore + 2, 25);
  }

  // Speed-to-Lead (max 20)
  const speedStepId = isActive ? "speed_active" : "speed_starter";
  const speedScore = getOptionScore(steps, speedStepId, answers.speed, "score_speed");

  // Tracking (max 15)
  const trackingStepId = isActive ? "tracking_active" : "tracking_starter";
  const trackingScore = getOptionScore(steps, trackingStepId, answers.tracking, "score_tracking");

  // Sales Process (max 25)
  let salesScore: number;
  if (isActive) {
    const salesBase = getOptionScore(
      steps,
      "sales_process_active",
      answers.sales_process,
      "score_sales"
    );
    const followupBase = getOptionScore(
      steps,
      "followup_active",
      answers.followup ?? "",
      "score_followup"
    );
    salesScore = salesBase + followupBase;
  } else {
    const salesBase = getOptionScore(
      steps,
      "sales_process_starter",
      answers.sales_process,
      "score_sales"
    );
    salesScore = Math.round((salesBase / 10) * 25);
  }

  // Alignment (max 15)
  const alignmentScore = calculateAlignment(funnelScore, speedScore, salesScore);

  const total = funnelScore + speedScore + trackingScore + salesScore + alignmentScore;

  const breakdown: ScoreBreakdown = {
    funnel_maturity: funnelScore,
    speed_to_lead: speedScore,
    sales_process: salesScore,
    tracking: trackingScore,
    alignment: alignmentScore,
    total,
  };

  // Disqualification
  let isDisqualified = false;
  if (isActive) {
    isDisqualified =
      answers.budget === "under_2k" && answers.tracking === "whats_cpl";
  } else {
    isDisqualified =
      answers.planned_budget === "under_2k" && answers.clv === "under_1k";
  }

  return {
    breakdown,
    tier: getScoreTier(total),
    weakestCategories: getWeakestCategories(breakdown),
    isDisqualified,
  };
}
