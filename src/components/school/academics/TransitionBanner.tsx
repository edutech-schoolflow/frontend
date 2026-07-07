"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTransition, useConfirmTransition } from "@/src/lib/api/useTransition";
import { termLabel } from "@/src/lib/api/terms";

/**
 * The confirm half of the auto-prepare + confirm calendar flow. The platform prepares the next
 * term/session; this banner is where the school actually moves onto it. Hidden unless a transition
 * is due. At a session boundary it enforces the promotion gate before letting them confirm.
 */
export default function TransitionBanner() {
  const { data: proposal } = useTransition();
  const confirm = useConfirmTransition();

  if (!proposal || proposal.status !== "transition_due") return null;

  const awaiting = proposal.studentsAwaitingPromotion ?? 0;
  const blockedByPromotion = proposal.isSessionBoundary && awaiting > 0;

  const nextLabel = proposal.isSessionBoundary
    ? `First Term of the ${proposal.nextSessionStartYear}/${
        (proposal.nextSessionStartYear ?? 0) + 1
      } session`
    : proposal.nextTerm
      ? termLabel(proposal.nextTerm)
      : "the next term";

  const currentLabel = proposal.currentTerm
    ? termLabel(proposal.currentTerm)
    : "The current term";

  async function handleConfirm() {
    try {
      const { message } = await confirm.mutateAsync();
      toast.success(message);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not confirm the transition."
      );
    }
  }

  return (
    <div className="mb-5 rounded-[12px] border border-amber-200 bg-amber-50 px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
          <CalendarClock className="h-[18px] w-[18px] text-amber-700" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-amber-900">
            {currentLabel} has ended
          </p>
          <p className="mt-0.5 text-[13px] text-amber-800">
            We&apos;ve prepared <span className="font-medium">{nextLabel}</span>.
            {proposal.isSessionBoundary
              ? " Moving into a new session requires promoting your students first."
              : " Confirm to move your school onto it."}
          </p>

          {blockedByPromotion && (
            <p className="mt-2 text-[13px] text-amber-900">
              {awaiting} active student{awaiting === 1 ? "" : "s"} still need
              {awaiting === 1 ? "s" : ""} to be promoted.{" "}
              <Link
                href="/school/dashboard/students"
                className="font-medium underline hover:opacity-80"
              >
                Run end-of-session promotion
              </Link>
              , then confirm the new session.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={blockedByPromotion || confirm.isPending}
          className="flex h-[38px] shrink-0 items-center gap-[7px] rounded-[8px] bg-amber-600 px-[16px] text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {confirm.isPending ? (
            <>
              <Loader2 className="h-[14px] w-[14px] animate-spin" />
              Confirming…
            </>
          ) : (
            <>
              {proposal.isSessionBoundary ? "Start new session" : "Move to next term"}
              <ArrowRight className="h-[14px] w-[14px]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
