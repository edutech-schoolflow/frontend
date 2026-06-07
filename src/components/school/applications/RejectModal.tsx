"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { rejectApplication } from "@/src/lib/api/applications";

type Props = { applicationId: string; onDone: () => void; onClose: () => void };

export default function RejectModal({ applicationId, onDone, onClose }: Props) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleReject() {
    setSaving(true);
    await rejectApplication(applicationId, reason);
    setSaving(false);
    onDone();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-dark-blue">
            Reject Application
          </h2>
          <button
            onClick={onClose}
            className="text-grey-text hover:text-dark-blue"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-[13px] text-grey-text">
          The parent will be notified via WhatsApp and email. This action cannot
          be undone.
        </p>

        <div>
          <label className="mb-1 block text-[13px] font-medium text-dark-blue">
            Reason{" "}
            <span className="font-normal text-grey-text">(optional)</span>
          </label>
          <textarea
            rows={4}
            placeholder="e.g. Class capacity reached for the requested term."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full resize-none rounded-lg border border-border-default px-3 py-2 text-[13px] text-dark-blue outline-none focus:border-brand-green"
          />
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
            onClick={handleReject}
            disabled={saving}
            className="flex-1 rounded-lg bg-[#e84040] py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Rejecting…" : "Reject & Notify Parent"}
          </button>
        </div>
      </div>
    </div>
  );
}
