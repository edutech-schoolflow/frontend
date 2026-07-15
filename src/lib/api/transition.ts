import { apiGet, apiPost } from "./client";
import type { TermName } from "./terms";

// Mirrors the backend auto-prepare + confirm contract (api/v1/academics/transition).

export type TransitionStatus =
  | "no_current_term"
  | "term_ongoing"
  | "transition_due";

export interface TransitionProposal {
  status: TransitionStatus;
  currentTerm?: TermName | null;
  currentSession?: string | null;
  currentTermEndDate?: string | null;
  nextTerm?: TermName | null;
  nextSessionStartYear?: number | null;
  isSessionBoundary: boolean;
  nextTermPrepared: boolean;
  nextTermId?: string | null;
  /** Session boundary only: active students not yet promoted into the target session. */
  studentsAwaitingPromotion?: number | null;
}

export async function getTransition(): Promise<TransitionProposal> {
  const { data } = await apiGet<TransitionProposal>("/academics/transition");
  return data;
}

/** Confirms the due transition; returns the backend message so the UI can echo it. */
export async function confirmTransition(): Promise<{
  proposal: TransitionProposal;
  message: string;
}> {
  const { data, message } = await apiPost<TransitionProposal>(
    "/academics/transition/confirm",
    {}
  );
  return { proposal: data, message };
}
