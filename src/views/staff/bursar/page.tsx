"use client";

import { useState } from "react";
import { useCollections } from "@/src/lib/api/useSchoolFees";
import { useTerms } from "@/src/lib/api/useTerms";
import { termLabel } from "@/src/lib/api/terms";

function formatNaira(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function BursarDashboardPage() {
  const { data: terms = [], isPending: termsLoading } = useTerms();
  const [selectedTermId, setSelectedTermId] = useState("");
  // Default to the current term until the user picks one — derived, no effect.
  const currentTermId = (terms.find((t) => t.isCurrent) ?? terms[0])?.id ?? "";
  const termId = selectedTermId || currentTermId;

  const { data: collections, isPending: collectionsLoading } =
    useCollections(termId);

  const collectionPct =
    collections && collections.totalExpected > 0
      ? Math.round(
          (collections.totalCollected / collections.totalExpected) * 100
        )
      : 0;

  const loading = termsLoading || (!!termId && collectionsLoading);

  return (
    <div className="p-[30px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-text-heading">
            Bursar Dashboard
          </h1>
          <p className="mt-0.5 text-[14px] text-text-body">
            Fee collections — expected vs collected per fee.
          </p>
        </div>
        <select
          value={termId}
          onChange={(e) => setSelectedTermId(e.target.value)}
          disabled={termsLoading || terms.length === 0}
          className="h-[40px] rounded-[8px] border border-[#e0e0e0] bg-white px-3 text-[13px] text-[#1b1b1b] outline-none focus:border-[#1ca95c] disabled:opacity-60"
        >
          {terms.length === 0 && <option value="">No terms yet</option>}
          {terms.map((t) => (
            <option key={t.id} value={t.id}>
              {termLabel(t.name)}
              {t.isCurrent ? " (current)" : ""}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      )}

      {!loading && collections && (
        <>
          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: "Total expected",
                value: formatNaira(collections.totalExpected),
                color: "text-text-heading",
                bg: "bg-[#f9fafb]",
              },
              {
                label: "Collected",
                value: formatNaira(collections.totalCollected),
                color: "text-[#16a34a]",
                bg: "bg-[#f0fdf4]",
              },
              {
                label: "Outstanding",
                value: formatNaira(collections.totalOutstanding),
                color: "text-[#dc2626]",
                bg: "bg-[#fef2f2]",
              },
              {
                label: "Collection rate",
                value: `${collectionPct}%`,
                color:
                  collectionPct >= 80 ? "text-[#16a34a]" : "text-[#b45309]",
                bg: "bg-[#f9fafb]",
              },
            ].map((s) => (
              <div key={s.label} className={`rounded-[12px] ${s.bg} px-5 py-5`}>
                <p className={`text-[22px] font-semibold ${s.color}`}>
                  {s.value}
                </p>
                <p className="mt-1 text-[12px] text-text-body">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Collection progress bar */}
          <div className="mb-6 rounded-[12px] border border-[#e5e7eb] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[14px] font-semibold text-text-heading">
                Collection progress
              </p>
              <p className="text-[13px] font-semibold text-text-heading">
                {collectionPct}%
              </p>
            </div>
            <div className="h-[10px] w-full overflow-hidden rounded-full bg-[#f3f4f6]">
              <div
                className={`h-full rounded-full transition-all ${collectionPct >= 80 ? "bg-[#16a34a]" : collectionPct >= 50 ? "bg-[#f59e0b]" : "bg-[#dc2626]"}`}
                style={{ width: `${collectionPct}%` }}
              />
            </div>
          </div>

          {/* Per-fee breakdown */}
          <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
            <div className="border-b border-[#f3f4f6] px-5 py-4">
              <p className="text-[14px] font-semibold text-text-heading">
                Collections by fee
              </p>
            </div>

            {collections.byFee.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <p className="text-[15px] font-medium text-[#888]">
                  No approved fees for this term yet
                </p>
                <p className="text-[13px] text-[#aaa]">
                  Approved fee types and their payments show up here.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-[1fr_110px_120px_120px_120px_90px] border-b border-[#f3f4f6] px-5 py-2.5 text-[12px] font-medium text-[#888]">
                  <span>Fee</span>
                  <span>Category</span>
                  <span>Expected</span>
                  <span>Collected</span>
                  <span>Outstanding</span>
                  <span>Payers</span>
                </div>
                <div className="divide-y divide-[#f3f4f6]">
                  {collections.byFee.map((f) => (
                    <div
                      key={f.feeTypeId}
                      className="grid grid-cols-[1fr_110px_120px_120px_120px_90px] items-center px-5 py-3.5"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-text-heading">
                          {f.name}
                        </p>
                        <p className="text-[11px] text-[#999]">
                          {formatNaira(f.amount)} ·{" "}
                          {f.category === "optional"
                            ? `${f.applicableCount} subscribed`
                            : `${f.applicableCount} students`}
                        </p>
                      </div>
                      <p className="text-[12px] capitalize text-[#666]">
                        {f.category}
                      </p>
                      <p className="text-[13px] text-text-heading">
                        {formatNaira(f.expected)}
                      </p>
                      <p className="text-[13px] font-semibold text-[#16a34a]">
                        {formatNaira(f.collected)}
                      </p>
                      <p className="text-[13px] font-semibold text-[#dc2626]">
                        {formatNaira(f.outstanding)}
                      </p>
                      <p className="text-[13px] text-[#666]">{f.payers}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
