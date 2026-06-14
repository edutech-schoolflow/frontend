"use client";

import { useEffect, useState } from "react";
import { getBursarSummary, getFeeTypes } from "@/src/lib/api/fees";
import type { BursarSummary, FeeType } from "@/src/types/fee";

function formatNaira(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function StaffFeesPage() {
  const [summary, setSummary] = useState<BursarSummary | null>(null);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getBursarSummary("term-001"), getFeeTypes()]).then(
      ([s, types]) => {
        if (cancelled) return;
        setSummary(s);
        setFeeTypes(types);
        setLoaded(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const collectionPct = summary
    ? Math.round((summary.totalCollected / summary.totalExpected) * 100)
    : 0;

  return (
    <div className="p-[30px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Fee Management
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          Current term fee collection summary.
        </p>
      </div>

      {!loaded && (
        <div className="flex items-center justify-center py-16">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      )}

      {loaded && summary && (
        <>
          {/* Summary stats */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: "Total expected",
                value: formatNaira(summary.totalExpected),
                color: "text-text-heading",
                bg: "bg-[#f9fafb]",
              },
              {
                label: "Collected",
                value: formatNaira(summary.totalCollected),
                color: "text-[#16a34a]",
                bg: "bg-[#f0fdf4]",
              },
              {
                label: "Outstanding",
                value: formatNaira(summary.totalOutstanding),
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

          {/* Payer breakdown */}
          <div className="mb-6 rounded-[12px] border border-[#e5e7eb] bg-white p-5">
            <p className="mb-4 text-[14px] font-semibold text-text-heading">
              Payer breakdown
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Full payers",
                  value: summary.fullPayers,
                  color: "text-[#16a34a]",
                },
                {
                  label: "Partial payers",
                  value: summary.partialPayers,
                  color: "text-[#b45309]",
                },
                {
                  label: "No payment",
                  value: summary.zeroPayers,
                  color: "text-[#dc2626]",
                },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-[28px] font-bold ${s.color}`}>
                    {s.value}
                  </p>
                  <p className="text-[12px] text-text-body">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fee types */}
          {feeTypes.length > 0 && (
            <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
              <div className="border-b border-[#f3f4f6] px-5 py-3">
                <p className="text-[14px] font-semibold text-text-heading">
                  Fee types this term
                </p>
              </div>
              <div className="divide-y divide-[#f3f4f6]">
                {feeTypes.map((ft) => (
                  <div
                    key={ft.id}
                    className="flex items-center justify-between px-5 py-3.5"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-text-heading">
                        {ft.name}
                      </p>
                    </div>
                    <p className="text-[14px] font-semibold text-text-heading">
                      {formatNaira(ft.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
