"use client";

import { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  UserMinus,
  UserCheck,
  ArrowRightLeft,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useWithdrawStudent,
  useReAdmitStudent,
  useUndoLastStudent,
} from "@/src/lib/api/useSchoolStudents";
import type { Student } from "@/src/types/student";

export default function StudentActionsMenu({
  student,
  onTransfer,
}: {
  student: Student;
  onTransfer: (student: Student) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const withdraw = useWithdrawStudent();
  const reAdmit = useReAdmitStudent();
  const undo = useUndoLastStudent();

  const busy = withdraw.isPending || reAdmit.isPending || undo.isPending;
  const isActive = student.status !== "withdrawn";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function run(fn: () => Promise<unknown>, ok: string) {
    setOpen(false);
    try {
      const res = await fn();
      toast.success(typeof res === "string" && res ? res : ok);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed.");
    }
  }

  const itemCls =
    "flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-surface-muted disabled:opacity-40";

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={busy}
        className="flex h-[30px] w-[30px] items-center justify-center rounded-md text-grey-text hover:bg-surface-muted disabled:opacity-40"
      >
        <MoreHorizontal className="h-[16px] w-[16px]" />
      </button>

      {open && (
        <div className="absolute right-0 top-[34px] z-20 w-[190px] overflow-hidden rounded-lg border border-border-default bg-white py-1 shadow-lg">
          {isActive ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onTransfer(student);
                }}
                className={`${itemCls} text-dark-blue`}
              >
                <ArrowRightLeft className="h-[14px] w-[14px] text-grey-text" />
                Transfer arm
              </button>
              <button
                type="button"
                onClick={() =>
                  run(
                    () => withdraw.mutateAsync(student.id),
                    "Student withdrawn."
                  )
                }
                className={`${itemCls} text-[#e84040]`}
              >
                <UserMinus className="h-[14px] w-[14px]" />
                Withdraw
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() =>
                run(
                  () => reAdmit.mutateAsync(student.id),
                  "Student re-admitted."
                )
              }
              className={`${itemCls} text-brand-green`}
            >
              <UserCheck className="h-[14px] w-[14px]" />
              Re-admit
            </button>
          )}

          <div className="my-1 border-t border-border-default" />
          <button
            type="button"
            onClick={() => run(() => undo.mutateAsync(student.id), "Reverted.")}
            className={`${itemCls} text-dark-blue`}
          >
            <Undo2 className="h-[14px] w-[14px] text-grey-text" />
            Undo last change
          </button>
        </div>
      )}
    </div>
  );
}
