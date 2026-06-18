"use client";

import { Package } from "lucide-react";
import { formatNaira, type StudentOption } from "@/src/lib/api/store";
import type { MaterialAssignment } from "@/src/types/store";
import StudentAvatar from "./StudentAvatar";

const STATUS_STYLE = {
  pending: { bg: "bg-[#fff7ed]", text: "text-[#c2410c]", label: "Pending" },
  invoiced: { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]", label: "Invoiced" },
  paid: { bg: "bg-[#f0fdf4]", text: "text-[#16a34a]", label: "Paid" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AssignmentsTab({
  assignments,
  students,
}: {
  assignments: MaterialAssignment[];
  students: StudentOption[];
}) {
  const totalBilled = assignments.reduce((s, a) => s + a.totalPrice, 0);
  const collected = assignments
    .filter((a) => a.status === "paid")
    .reduce((s, a) => s + a.totalPrice, 0);
  const pending = assignments
    .filter((a) => a.status !== "paid")
    .reduce((s, a) => s + a.totalPrice, 0);
  const paidCount = assignments.filter((a) => a.status === "paid").length;
  const pendingCount = assignments.filter((a) => a.status !== "paid").length;

  return (
    <div className="space-y-5">
      {/* Revenue summary */}
      <div className="rounded-[14px] border border-[#e5e7eb] bg-white p-5">
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-wide text-[#9ca3af]">
          Store Revenue
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-[11px] text-text-body">Total billed</p>
            <p className="mt-0.5 text-[22px] font-bold text-text-heading">
              {formatNaira(totalBilled)}
            </p>
            <p className="text-[11px] text-[#9ca3af]">
              {assignments.length} assignment
              {assignments.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-text-body">Collected</p>
            <p className="mt-0.5 text-[22px] font-bold text-[#16a34a]">
              {formatNaira(collected)}
            </p>
            <p className="text-[11px] text-[#9ca3af]">{paidCount} paid</p>
          </div>
          <div>
            <p className="text-[11px] text-text-body">Outstanding</p>
            <p className="mt-0.5 text-[22px] font-bold text-[#b45309]">
              {formatNaira(pending)}
            </p>
            <p className="text-[11px] text-[#9ca3af]">{pendingCount} pending</p>
          </div>
        </div>
        {totalBilled > 0 && (
          <div className="mt-4">
            <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#f3f4f6]">
              <div
                className="h-full rounded-full bg-[#16a34a] transition-all"
                style={{
                  width: `${Math.round((collected / totalBilled) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-[#9ca3af]">
              {Math.round((collected / totalBilled) * 100)}% collected
            </p>
          </div>
        )}
      </div>

      {/* Table */}
      {assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#e5e7eb] py-16">
          <Package className="mb-3 h-[32px] w-[32px] text-[#d1d5db]" />
          <p className="text-[14px] text-[#9ca3af]">No assignments yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                {["Student", "Item", "Qty", "Total", "Date", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, i) => {
                const st = STATUS_STYLE[a.status];
                return (
                  <tr
                    key={a.id}
                    className={`${i < assignments.length - 1 ? "border-b border-[#f3f4f6]" : ""} hover:bg-[#fafafa]`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StudentAvatar
                          name={a.studentName}
                          photoUrl={
                            students.find((s) => s.id === a.studentId)?.photoUrl
                          }
                          size={26}
                        />
                        <span className="text-[13px] font-medium text-text-heading">
                          {a.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-text-body">
                      {a.storeItemName}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-text-body">
                      {a.quantity}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium text-text-heading">
                      {formatNaira(a.totalPrice)}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-body">
                      {fmtDate(a.assignedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${st.bg} ${st.text}`}
                      >
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
