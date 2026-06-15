"use client";

import { useEffect, useState } from "react";
import { getBursarSummary, getDefaulters } from "@/src/lib/api/fees";
import type { BursarSummary } from "@/src/types/fee";

function formatNaira(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Defaulter {
  studentId: string;
  studentName: string;
  className: string;
  amountOwed: number;
  lastPaymentDate: string | null;
}

export default function BursarDashboardPage() {
  const [summary, setSummary] = useState<BursarSummary | null>(null);
  const [defaulters, setDefaulters] = useState<Defaulter[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getBursarSummary("term-001"), getDefaulters("term-001")]).then(
      ([s, d]) => {
        setSummary(s);
        setDefaulters(d as Defaulter[]);
        setLoaded(true);
      }
    );
  }, []);

  const collectionPct = summary
    ? Math.round((summary.totalCollected / summary.totalExpected) * 100)
    : 0;

  return (
    <div className="p-[30px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Bursar Dashboard
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          Fee collection overview for the current term.
        </p>
      </div>

      {!loaded && (
        <div className="flex items-center justify-center py-16">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      )}

      {loaded && summary && (
        <>
          {/* Stats */}
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
            <div className="mt-3 grid grid-cols-3 gap-4 text-center">
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
                <div key={s.label}>
                  <p className={`text-[24px] font-bold ${s.color}`}>
                    {s.value}
                  </p>
                  <p className="text-[12px] text-text-body">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Defaulters */}
          {defaulters.length > 0 && (
            <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
              <div className="border-b border-[#f3f4f6] px-5 py-4">
                <p className="text-[14px] font-semibold text-text-heading">
                  Outstanding payments
                </p>
              </div>
              <div className="grid grid-cols-[1fr_120px_140px_120px] border-b border-[#f3f4f6] px-5 py-2.5 text-[12px] font-medium text-[#888]">
                <span>Student</span>
                <span>Class</span>
                <span>Amount owed</span>
                <span>Last payment</span>
              </div>
              <div className="divide-y divide-[#f3f4f6]">
                {defaulters.map((d) => (
                  <div
                    key={d.studentId}
                    className="grid grid-cols-[1fr_120px_140px_120px] items-center px-5 py-3.5"
                  >
                    <p className="text-[13px] font-medium text-text-heading">
                      {d.studentName}
                    </p>
                    <p className="text-[12px] text-[#666]">{d.className}</p>
                    <p className="text-[13px] font-semibold text-[#dc2626]">
                      {formatNaira(d.amountOwed)}
                    </p>
                    <p className="text-[12px] text-[#888]">
                      {d.lastPaymentDate
                        ? new Date(d.lastPaymentDate).toLocaleDateString(
                            "en-NG",
                            { day: "numeric", month: "short" }
                          )
                        : "No payment"}
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
