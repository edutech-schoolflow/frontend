"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useTransferStudent } from "@/src/lib/api/useSchoolStudents";
import { useClassArms } from "@/src/lib/api/useSchoolClasses";
import type { Student } from "@/src/types/student";

type Props = { student: Student; onDone: () => void; onClose: () => void };

export default function TransferStudentModal({
  student,
  onDone,
  onClose,
}: Props) {
  const { data: arms = [], isPending } = useClassArms(student.classId ?? "");
  const [armId, setArmId] = useState("");
  const transfer = useTransferStudent();

  async function handleSave() {
    if (!armId) return;
    try {
      await transfer.mutateAsync({ id: student.id, classArmId: armId });
      toast.success("Student transferred.");
      onDone();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not transfer student."
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-dark-blue">
            Transfer student
          </h2>
          <button
            onClick={onClose}
            className="text-grey-text hover:text-dark-blue"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-5 text-[13px] text-grey-text">
          Move{" "}
          <strong>
            {student.firstName} {student.lastName}
          </strong>{" "}
          to a different arm of their class.
        </p>

        <label className="mb-1 block text-[13px] font-medium text-dark-blue">
          Arm / Stream <span className="text-[#e84040]">*</span>
        </label>
        <div className="relative">
          <select
            value={armId}
            onChange={(e) => setArmId(e.target.value)}
            disabled={isPending || arms.length === 0}
            className="h-[42px] w-full appearance-none rounded-lg border border-border-default bg-white px-3 pr-9 text-[13px] text-dark-blue outline-none focus:border-brand-green disabled:opacity-60"
          >
            <option value="">
              {isPending
                ? "Loading arms…"
                : arms.length === 0
                  ? "This class has no arms"
                  : "Select an arm"}
            </option>
            {arms.map((a) => (
              <option key={a.id} value={a.id}>
                {a.arm || "Main"}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-grey-text" />
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
            onClick={handleSave}
            disabled={!armId || transfer.isPending}
            className="flex-1 rounded-lg bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            {transfer.isPending ? "Transferring…" : "Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
}
