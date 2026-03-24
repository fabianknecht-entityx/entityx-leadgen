"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type {
  FunnelPath,
  FunnelStep,
  FunnelAnswers,
  ScoreResult,
} from "@/types/funnel";
import { FUNNEL_STEPS, getStepsForPath, determinePath } from "@/lib/funnel-config";
import { calculateScore } from "@/lib/scoring";
import { trackEvent } from "@/lib/tracking";

type FunnelScreen = "funnel" | "result";

interface FunnelState {
  screen: FunnelScreen;
  path: FunnelPath | null;
  currentStepIndex: number;
  answers: Partial<FunnelAnswers>;
  steps: FunnelStep[];
  scoreResult: ScoreResult | null;
}

type FunnelAction =
  | { type: "SET_ANSWER"; key: keyof FunnelAnswers; value: unknown }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_PATH"; path: FunnelPath }
  | { type: "GO_TO_RESULT" };

const STEP_TO_ANSWER: Record<string, keyof FunnelAnswers> = {
  situation: "situation",
  channels_active: "channels",
  channels_starter: "channels",
  funnel_maturity_active: "funnel_maturity",
  funnel_maturity_starter: "funnel_maturity",
  tracking_active: "tracking",
  tracking_starter: "tracking",
  speed_active: "speed",
  speed_starter: "speed",
  sales_process_active: "sales_process",
  sales_process_starter: "sales_process",
  followup_active: "followup",
  // dual_question sub-ids map directly
  lead_volume: "lead_volume",
  budget: "budget",
  planned_budget: "planned_budget",
  clv: "clv",
  // contact fields map directly
  name: "name",
  company: "company",
  email: "email",
  phone: "phone",
  industry: "industry",
};

// Initialize with active path steps so the total count is correct from step 1.
// When SET_PATH fires after the user answers step 1, it replaces with the correct path.
const initialSteps = getStepsForPath("active");

const initialState: FunnelState = {
  screen: "funnel",
  path: null,
  currentStepIndex: 0,
  answers: {},
  steps: initialSteps,
  scoreResult: null,
};

function funnelReducer(state: FunnelState, action: FunnelAction): FunnelState {
  switch (action.type) {
    case "SET_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.key]: action.value },
      };

    case "SET_PATH": {
      const newSteps = getStepsForPath(action.path);
      return {
        ...state,
        path: action.path,
        answers: { ...state.answers, path: action.path },
        steps: newSteps,
        currentStepIndex: 0,
      };
    }

    case "NEXT_STEP": {
      const nextIndex = state.currentStepIndex + 1;
      if (nextIndex >= state.steps.length) return state;
      return { ...state, currentStepIndex: nextIndex };
    }

    case "PREV_STEP": {
      if (state.currentStepIndex <= 0) return state;
      return { ...state, currentStepIndex: state.currentStepIndex - 1 };
    }

    case "GO_TO_RESULT": {
      const fullAnswers = state.answers as FunnelAnswers;
      const result = calculateScore(fullAnswers, FUNNEL_STEPS);
      trackEvent("funnel_result_viewed", {
        score: result.breakdown.total,
        tier: result.tier,
      });
      return { ...state, screen: "result", scoreResult: result };
    }

    default:
      return state;
  }
}

interface FunnelContextValue {
  state: FunnelState;
  currentStep: FunnelStep | null;
  progress: number;
  totalSteps: number;
  setAnswer: (idOrKey: string, value: unknown) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleStep1Answer: (answerId: string) => void;
  submitContact: (data: Record<string, string>) => void;
}

const FunnelContext = createContext<FunnelContextValue | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(funnelReducer, initialState);

  const currentStep = state.steps[state.currentStepIndex] ?? null;
  const totalSteps = state.steps.length;
  const progress =
    totalSteps > 0 ? (state.currentStepIndex / totalSteps) * 100 : 0;

  // Fire funnel_step_viewed on every step change and when result is shown
  useEffect(() => {
    if (state.screen === "result") {
      trackEvent("funnel_step_viewed", {
        step_index: state.steps.length,
        step_id: "result",
        step_type: "result",
        path: state.path ?? "unknown",
      });
    } else {
      const step = state.steps[state.currentStepIndex];
      if (step) {
        trackEvent("funnel_step_viewed", {
          step_index: state.currentStepIndex,
          step_id: step.id,
          step_type: step.type,
          path: state.path ?? "unknown",
        });
      }
    }
  }, [state.currentStepIndex, state.screen]); // eslint-disable-line react-hooks/exhaustive-deps

  const setAnswer = useCallback((idOrKey: string, value: unknown) => {
    const key = STEP_TO_ANSWER[idOrKey];
    if (!key) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[Funnel] No answer mapping for key "${idOrKey}"`);
      }
      return;
    }
    dispatch({ type: "SET_ANSWER", key, value });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: "NEXT_STEP" });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: "PREV_STEP" });
  }, []);

  const handleStep1Answer = useCallback(
    (answerId: string) => {
      const path = determinePath(answerId);
      dispatch({ type: "SET_ANSWER", key: "situation", value: answerId });
      dispatch({ type: "SET_PATH", path });
      trackEvent("funnel_path_determined", { path });
      // After SET_PATH, currentStepIndex is 0 (situation). Advance to 1 (interstitial_1).
      setTimeout(() => dispatch({ type: "NEXT_STEP" }), 0);
    },
    []
  );

  const submitContact = useCallback(
    (data: Record<string, string>) => {
      const contactKeys = ["name", "company", "email", "phone", "industry"] as const;
      const updatedAnswers = { ...state.answers };
      for (const key of contactKeys) {
        if (data[key] !== undefined) {
          dispatch({ type: "SET_ANSWER", key, value: data[key] });
          updatedAnswers[key] = data[key];
        }
      }
      // Calculate score now so we can include real values in the lead event
      const result = calculateScore(updatedAnswers as FunnelAnswers, FUNNEL_STEPS);
      trackEvent("funnel_lead_submitted", {
        score: result.breakdown.total,
        tier: result.tier,
        path: state.path ?? "unknown",
      });

      // Fire-and-forget: send all lead data to Make.com webhook
      fetch("https://hook.eu2.make.com/y67yp95m8a8nqrqiklmtijh4md37oosf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          contact: {
            name: data.name ?? "",
            company: data.company ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            phone_code: data.phone_code ?? "",
            industry: data.industry ?? "",
          },
          funnel: {
            path: state.path ?? "unknown",
            situation: updatedAnswers.situation ?? "",
            channels: updatedAnswers.channels ?? [],
            funnel_maturity: updatedAnswers.funnel_maturity ?? "",
            tracking: updatedAnswers.tracking ?? "",
            speed: updatedAnswers.speed ?? "",
            sales_process: updatedAnswers.sales_process ?? "",
            followup: updatedAnswers.followup ?? "",
            lead_volume: updatedAnswers.lead_volume ?? "",
            budget: updatedAnswers.budget ?? "",
            planned_budget: updatedAnswers.planned_budget ?? "",
            clv: updatedAnswers.clv ?? "",
          },
          score: {
            total: result.breakdown.total,
            tier: result.tier,
          },
        }),
      }).catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error("[Funnel] Webhook failed:", err);
        }
      });

      // Small delay so state updates settle before scoring
      setTimeout(() => dispatch({ type: "GO_TO_RESULT" }), 0);
    },
    [state.answers, state.path]
  );

  const value = useMemo(
    () => ({
      state,
      currentStep,
      progress,
      totalSteps,
      setAnswer,
      nextStep,
      prevStep,
      handleStep1Answer,
      submitContact,
    }),
    [
      state,
      currentStep,
      progress,
      totalSteps,
      setAnswer,
      nextStep,
      prevStep,
      handleStep1Answer,
      submitContact,
    ]
  );

  return (
    <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>
  );
}

export function useFunnel() {
  const ctx = useContext(FunnelContext);
  if (!ctx) throw new Error("useFunnel must be used within FunnelProvider");
  return ctx;
}
