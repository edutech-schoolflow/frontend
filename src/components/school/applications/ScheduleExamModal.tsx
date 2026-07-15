"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useScheduleExam } from "@/src/lib/api/useSchoolApplications";

type Props = { applicationId: string; onDone: () => void; onClose: () => void };

const TYPES = ["Written", "Interview", "Both"] as const;

export default function ScheduleExamModal({
  applicationId,
  onDone,
  onClose,
}: Props) {
  const [type, setType] = useState<"Written" | "Interview" | "Both">("Written");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [instructions, setInstructions] = useState("");
  const schedule = useScheduleExam(applicationId);
  const saving = schedule.isPending;

  const canSave = date && time && venue;

  async function handleSave() {
    try {
      await schedule.mutateAsync({ type, date, time, venue, instructions });
      onDone();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not schedule the exam."
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[480px] rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-dark-blue">
            Schedule Exam / Interview
          </h2>
          <button
            onClick={onClose}
            className="text-grey-text hover:text-dark-blue"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Type */}
          <div>
            <p className="mb-2 text-[13px] font-medium text-dark-blue">
              Assessment type
            </p>
            <div className="flex gap-2">
              {TYPES.map((t) => (
                <label
                  key={t}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border py-2 text-[13px] transition-colors ${type === t ? "border-brand-green bg-green-50 font-medium text-brand-green" : "border-border-default text-grey-text hover:border-brand-green/40"}`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={type === t}
                    onChange={() => setType(t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-border-default px-3 py-2 text-[13px] text-dark-blue outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-border-default px-3 py-2 text-[13px] text-dark-blue outline-none focus:border-brand-green"
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-dark-blue">
              Venue
            </label>
            <input
              type="text"
              placeholder="e.g. Main Hall, Block B"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full rounded-lg border border-border-default px-3 py-2 text-[13px] text-dark-blue outline-none focus:border-brand-green"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-dark-blue">
              Instructions{" "}
              <span className="font-normal text-grey-text">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="What to bring, what to expect…"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full resize-none rounded-lg border border-border-default px-3 py-2 text-[13px] text-dark-blue outline-none focus:border-brand-green"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-default px-5 py-2.5 text-[13px] text-dark-blue hover:bg-surface-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave || saving}
            className="flex-1 rounded-lg bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save & Notify Parent"}
          </button>
        </div>
      </div>
    </div>
  );
}
