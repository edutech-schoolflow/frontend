"use client";

import { useEffect, useState } from "react";
import { getInvoiceList } from "@/src/lib/api/fees";
import type { Invoice, InvoiceStatus } from "@/src/types/fee";

const TERM_ID = "term-001";
const TERM_NAME = "2nd Term 2024/2025";

function formatNaira(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  paid: {
    label: "Paid",
    bg: "bg-[#f0fdf4]",
    text: "text-[#16a34a]",
    dot: "bg-[#16a34a]",
  },
  partial: {
    label: "Partial",
    bg: "bg-[#fffbeb]",
    text: "text-[#b45309]",
    dot: "bg-[#d97706]",
  },
  unpaid: {
    label: "Unpaid",
    bg: "bg-[#fef2f2]",
    text: "text-[#dc2626]",
    dot: "bg-[#dc2626]",
  },
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${c.bg} ${c.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#f3f4f6] last:border-0">
      {/* Main row */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Avatar */}
        <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#e8f5ee] text-[12px] font-bold text-brand-green">
          {invoice.studentName
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")}
        </div>

        {/* Student + class */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-[13px] font-semibold text-text-heading">
            {invoice.studentName}
          </p>
          <p className="text-[11px] text-text-body">{invoice.className}</p>
        </div>

        {/* Amounts — hide on small screens */}
        <div className="hidden sm:flex items-center gap-6 text-right">
          <div>
            <p className="text-[12px] text-text-body">Total</p>
            <p className="text-[13px] font-medium text-text-heading">
              {formatNaira(invoice.totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-text-body">Paid</p>
            <p className="text-[13px] font-medium text-[#16a34a]">
              {formatNaira(invoice.totalPaid)}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-text-body">Balance</p>
            <p
              className={`text-[13px] font-medium ${invoice.balance > 0 ? "text-[#dc2626]" : "text-[#9ca3af]"}`}
            >
              {formatNaira(invoice.balance)}
            </p>
          </div>
        </div>

        <StatusBadge status={invoice.status} />

        <button
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-[7px] border border-[#e5e7eb] px-3 py-1.5 text-[12px] font-medium text-text-body hover:border-[#d1d5db] hover:text-text-heading transition-colors"
        >
          {open ? "Close" : "View"}
        </button>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-[#f9fafb] bg-[#fafafa] px-5 py-4">
          {/* Mobile amounts */}
          <div className="mb-4 flex gap-6 sm:hidden">
            <div>
              <p className="text-[11px] text-text-body">Total</p>
              <p className="text-[13px] font-medium text-text-heading">
                {formatNaira(invoice.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-text-body">Paid</p>
              <p className="text-[13px] font-medium text-[#16a34a]">
                {formatNaira(invoice.totalPaid)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-text-body">Balance</p>
              <p
                className={`text-[13px] font-medium ${invoice.balance > 0 ? "text-[#dc2626]" : "text-[#9ca3af]"}`}
              >
                {formatNaira(invoice.balance)}
              </p>
            </div>
          </div>

          {/* Line items */}
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            Fee breakdown
          </p>
          <div className="overflow-hidden rounded-[8px] border border-[#e5e7eb] bg-white">
            {invoice.lines.map((line, i) => (
              <div
                key={line.feeTypeId}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < invoice.lines.length - 1
                    ? "border-b border-[#f3f4f6]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      line.status === "paid"
                        ? "bg-[#16a34a]"
                        : line.status === "partial"
                          ? "bg-[#d97706]"
                          : "bg-[#dc2626]"
                    }`}
                  />
                  <span className="text-[13px] text-text-heading">
                    {line.feeTypeName}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-[11px] text-text-body">Charged</p>
                    <p className="text-[12px] font-medium text-text-heading">
                      {formatNaira(line.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-text-body">Paid</p>
                    <p className="text-[12px] font-medium text-[#16a34a]">
                      {formatNaira(line.paid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-text-body">Balance</p>
                    <p
                      className={`text-[12px] font-medium ${
                        line.balance > 0 ? "text-[#dc2626]" : "text-[#9ca3af]"
                      }`}
                    >
                      {formatNaira(line.balance)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Last payment + actions */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[12px] text-text-body">
              {invoice.lastPaymentDate
                ? `Last payment: ${formatDate(invoice.lastPaymentDate)}`
                : "No payments recorded"}
            </p>
            {invoice.status !== "paid" && (
              <button
                onClick={() =>
                  alert(`Reminder sent to parent of ${invoice.studentName}`)
                }
                className="rounded-[7px] border border-[#fbbf24] bg-[#fffbeb] px-3 py-1.5 text-[12px] font-medium text-[#b45309] hover:bg-[#fef3c7] transition-colors"
              >
                Send reminder
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

const ALL_CLASSES = ["All classes", "Primary 1A", "Primary 2A"];
const STATUS_FILTERS: Array<{ value: InvoiceStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "unpaid", label: "Unpaid" },
  { value: "partial", label: "Partial" },
  { value: "paid", label: "Paid" },
];

export default function StaffInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">(
    "all"
  );
  const [classFilter, setClassFilter] = useState("All classes");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getInvoiceList(TERM_ID).then((list) => {
      setInvoices(list);
      setLoaded(true);
    });
  }, []);

  const counts = {
    paid: invoices.filter((i) => i.status === "paid").length,
    partial: invoices.filter((i) => i.status === "partial").length,
    unpaid: invoices.filter((i) => i.status === "unpaid").length,
  };

  const visible = invoices
    .filter((inv) => statusFilter === "all" || inv.status === statusFilter)
    .filter(
      (inv) => classFilter === "All classes" || inv.className === classFilter
    )
    .filter((inv) =>
      search.trim()
        ? inv.studentName.toLowerCase().includes(search.toLowerCase())
        : true
    )
    // sort: unpaid first, partial second, paid last
    .sort((a, b) => {
      const order: Record<InvoiceStatus, number> = {
        unpaid: 0,
        partial: 1,
        paid: 2,
      };
      return order[a.status] - order[b.status];
    });

  return (
    <div className="p-[30px]">
      {/* Header */}
      <div className="mb-1 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-text-heading">
            Invoices
          </h1>
          <p className="mt-0.5 text-[13px] text-text-body">{TERM_NAME}</p>
        </div>
      </div>

      {!loaded ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Status filter chips */}
          <div className="mt-5 mb-4 flex flex-wrap items-center gap-2">
            {STATUS_FILTERS.map(({ value, label }) => {
              const count = value === "all" ? invoices.length : counts[value];
              const active = statusFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                    active
                      ? "border-brand-green bg-brand-green text-white"
                      : "border-[#e5e7eb] bg-white text-text-body hover:border-[#d1d5db]"
                  }`}
                >
                  {label}
                  <span
                    className={`rounded-full px-1.5 py-px text-[10px] ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[#f3f4f6] text-text-body"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Spacer + search + class filter */}
            <div className="ml-auto flex items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student…"
                className="h-[34px] rounded-[8px] border border-[#e5e7eb] bg-white px-3 text-[12px] text-text-heading placeholder:text-[#9ca3af] focus:border-brand-green focus:outline-none w-[160px]"
              />
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="h-[34px] rounded-[8px] border border-[#e5e7eb] bg-white px-3 text-[12px] text-text-heading focus:border-brand-green focus:outline-none"
              >
                {ALL_CLASSES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Invoice list */}
          <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
            {visible.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[14px] font-medium text-text-heading">
                  No invoices found
                </p>
                <p className="mt-1 text-[13px] text-text-body">
                  Try adjusting your filters or search term.
                </p>
              </div>
            ) : (
              <div>
                {/* Table header */}
                <div className="hidden sm:flex items-center gap-4 border-b border-[#f3f4f6] px-5 py-3">
                  <div className="w-[36px] shrink-0" />
                  <p className="flex-1 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Student
                  </p>
                  <div className="flex items-center gap-6 text-right mr-[1px]">
                    <p className="w-[72px] text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                      Total
                    </p>
                    <p className="w-[72px] text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                      Paid
                    </p>
                    <p className="w-[72px] text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                      Balance
                    </p>
                  </div>
                  <p className="w-[60px] text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Status
                  </p>
                  <div className="w-[52px]" />
                </div>

                {visible.map((inv) => (
                  <InvoiceRow key={inv.id} invoice={inv} />
                ))}
              </div>
            )}
          </div>

          {/* Footer totals */}
          {visible.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-5 py-4">
              {[
                {
                  label: "Total expected",
                  value: formatNaira(
                    visible.reduce((s, i) => s + i.totalAmount, 0)
                  ),
                  color: "text-text-heading",
                },
                {
                  label: "Collected",
                  value: formatNaira(
                    visible.reduce((s, i) => s + i.totalPaid, 0)
                  ),
                  color: "text-[#16a34a]",
                },
                {
                  label: "Outstanding",
                  value: formatNaira(
                    visible.reduce((s, i) => s + i.balance, 0)
                  ),
                  color: "text-[#dc2626]",
                },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[11px] text-text-body">{s.label}</p>
                  <p className={`text-[15px] font-semibold ${s.color}`}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
