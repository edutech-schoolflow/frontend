"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useRecordAssessment } from "@/src/lib/api/useSchoolApplications";

type Props = { applicationId: string; onDone: () => void; onClose: () => void };

const IMPRESSIONS = ["excellent", "good", "fair", "poor"] as const;

export default function RecordAssessmentModal({
  applicationId,
  onDone,
  onClose,
}: Props) {
  const [attended, setAttended] = useState(true);
  const [impression, setImpression] =
    useState<(typeof IMPRESSIONS)[number]>("good");
  const [notes, setNotes] = useState("");
  const assess = useRecordAssessment(applicationId);
  const saving = assess.isPending;

  async function handleSave() {
    try {
      await assess.mutateAsync({ attended, impression, notes });
      onDone();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not record the assessment."
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[440px] rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-dark-blue">
            Record Assessment
          </h2>
          <button
            onClick={onClose}
            className="text-grey-text hover:text-dark-blue"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Attendance */}
          <div>
            <p className="mb-2 text-[13px] font-medium text-dark-blue">
              Did the applicant attend?
            </p>
            <div className="flex gap-3">
              {[true, false].map((v) => (
                <label
                  key={String(v)}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border py-2.5 text-[13px] transition-colors ${attended === v ? "border-brand-green bg-green-50 font-medium text-brand-green" : "border-border-default text-grey-text hover:border-brand-green/40"}`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={attended === v}
                    onChange={() => setAttended(v)}
                  />
                  {v ? "Present" : "No-show"}
                </label>
              ))}
            </div>
          </div>

          {/* Impression */}
          {attended && (
            <div>
              <p className="mb-2 text-[13px] font-medium text-dark-blue">
                Overall impression
              </p>
              <div className="grid grid-cols-4 gap-2">
                {IMPRESSIONS.map((imp) => (
                  <label
                    key={imp}
                    className={`flex cursor-pointer items-center justify-center rounded-lg border py-2 text-[12px] capitalize transition-colors ${impression === imp ? "border-brand-green bg-green-50 font-medium text-brand-green" : "border-border-default text-grey-text hover:border-brand-green/40"}`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      checked={impression === imp}
                      onChange={() => setImpression(imp)}
                    />
                    {imp}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-dark-blue">
              Observations{" "}
              <span className="font-normal text-grey-text">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Key observations from the assessment…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
            disabled={saving}
            className="flex-1 rounded-lg bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}
