"use client";

import { CheckCircle2 } from "lucide-react";
import { formatNaira } from "@/src/lib/api/store";
import type { CartLine } from "@/src/types/store";

export default function SuccessScreen({
  lines,
  onDone,
}: {
  lines: CartLine[];
  onDone: () => void;
}) {
  const total = lines.reduce((s, l) => s + l.storeItem.price * l.quantity, 0);

  const byStudent = new Map<string, CartLine[]>();
  for (const line of lines) {
    if (!byStudent.has(line.studentId)) byStudent.set(line.studentId, []);
    byStudent.get(line.studentId)!.push(line);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-[440px] rounded-[20px] bg-white p-8 shadow-xl">
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#f0fdf4]">
            <CheckCircle2 className="h-[30px] w-[30px] text-[#16a34a]" />
          </div>
          <p className="mt-4 text-[18px] font-bold text-text-heading">
            Purchase confirmed!
          </p>
          <p className="mt-1.5 text-[13px] text-text-body">
            Items have been added to your children&apos;s school invoices. Pay
            through the Fees section when ready.
          </p>
        </div>

        <div className="mb-5 space-y-4 rounded-[12px] border border-[#e5e7eb] p-4">
          {Array.from(byStudent.entries()).map(([studentId, sLines]) => (
            <div key={studentId}>
              <p className="mb-2 text-[12px] font-semibold text-text-heading">
                {sLines[0].studentName}
              </p>
              {sLines.map((l) => (
                <div
                  key={l.storeItem.id}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-[12px] text-text-body">
                    {l.storeItem.emoji} {l.storeItem.name} × {l.quantity}
                  </span>
                  <span className="text-[12px] font-medium text-text-heading">
                    {formatNaira(l.storeItem.price * l.quantity)}
                  </span>
                </div>
              ))}
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-[#f3f4f6] pt-3">
            <p className="text-[13px] font-semibold text-text-heading">
              Total added to fees
            </p>
            <p className="text-[16px] font-bold text-brand-green">
              {formatNaira(total)}
            </p>
          </div>
        </div>

        <button
          onClick={onDone}
          className="w-full rounded-[10px] bg-brand-green py-3 text-[14px] font-semibold text-white hover:bg-[#17904f] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
