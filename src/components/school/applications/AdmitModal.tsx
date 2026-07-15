"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useAdmitApplication } from "@/src/lib/api/useSchoolApplications";
import { useClasses, useClassArms } from "@/src/lib/api/useSchoolClasses";

type Props = {
  applicationId: string;
  childName: string;
  onDone: () => void;
  onClose: () => void;
};

const SELECT =
  "h-[42px] w-full appearance-none rounded-lg border border-border-default bg-white px-3 pr-9 text-[13px] text-dark-blue outline-none focus:border-brand-green";

export default function AdmitModal({
  applicationId,
  childName,
  onDone,
  onClose,
}: Props) {
  const { data: classes = [], isPending: loadingClasses } = useClasses();
  const [classId, setClassId] = useState("");
  const [armId, setArmId] = useState("");
  const { data: arms = [] } = useClassArms(classId);
  const admit = useAdmitApplication(applicationId);

  async function handleAdmit() {
    if (!classId) {
      toast.error("Select a class to admit into.");
      return;
    }
    try {
      await admit.mutateAsync({ classId, classArmId: armId || undefined });
      toast.success("Application admitted — parent notified.");
      onDone();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not admit applicant."
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[440px] rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-dark-blue">
            Admit applicant
          </h2>
          <button
            onClick={onClose}
            className="text-grey-text hover:text-dark-blue"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-5 text-[13px] text-grey-text">
          Choose the class to enrol <strong>{childName}</strong> into. They get
          an admission number and become an active student.
        </p>

        <div className="space-y-4">
          {/* Class — required */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-dark-blue">
              Class <span className="text-[#e84040]">*</span>
            </label>
            <div className="relative">
              <select
                className={SELECT}
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  setArmId("");
                }}
                disabled={loadingClasses}
              >
                <option value="">
                  {loadingClasses ? "Loading classes…" : "Select a class"}
                </option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-grey-text" />
            </div>
            {!loadingClasses && classes.length === 0 && (
              <p className="mt-1.5 text-[12px] text-grey-text">
                No classes yet. Create one under Classes first.
              </p>
            )}
          </div>

          {/* Arm — optional, only when the class has streams */}
          {arms.length > 0 && (
            <div>
              <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                Arm / Stream{" "}
                <span className="font-normal text-grey-text">(optional)</span>
              </label>
              <div className="relative">
                <select
                  className={SELECT}
                  value={armId}
                  onChange={(e) => setArmId(e.target.value)}
                >
                  <option value="">No specific arm</option>
                  {arms.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.arm || "Main"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-grey-text" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-default px-5 py-2.5 text-[13px] text-dark-blue hover:bg-surface-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdmit}
            disabled={!classId || admit.isPending}
            className="flex-1 rounded-lg bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            {admit.isPending ? "Admitting…" : "Admit & Notify Parent"}
          </button>
        </div>
      </div>
    </div>
  );
}
