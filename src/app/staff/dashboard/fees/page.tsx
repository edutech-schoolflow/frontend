"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, ChevronDown } from "lucide-react";
import {
  getFeeTypes,
  createFeeType,
  updateFeeType,
  deleteFeeType,
} from "@/src/lib/api/fees";
import { getClasses } from "@/src/lib/api/students";
import type { FeeType } from "@/src/types/fee";
import type { Class } from "@/src/types/student";

function formatNaira(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

// ── Class multi-select dropdown ───────────────────────────────────────────────

function ClassPicker({
  classes,
  selected,
  onChange,
}: {
  classes: Class[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );
  };

  const label =
    selected.length === 0
      ? "Select classes"
      : selected.length === classes.length
        ? "All classes"
        : classes
            .filter((c) => selected.includes(c.id))
            .map((c) => c.name)
            .join(", ");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-[42px] w-full items-center justify-between rounded-[8px] border border-[#e0e0e0] bg-white px-[14px] text-[13px] text-[#1b1b1b] transition-colors hover:border-[#aaa]"
      >
        <span className={selected.length === 0 ? "text-[#aaa]" : ""}>
          {label}
        </span>
        <ChevronDown
          className={`h-[14px] w-[14px] text-[#888] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[46px] z-20 overflow-hidden rounded-[8px] border border-[#e0e0e0] bg-white shadow-lg">
          {/* All classes shortcut */}
          <button
            type="button"
            onClick={() =>
              onChange(
                selected.length === classes.length
                  ? []
                  : classes.map((c) => c.id)
              )
            }
            className="flex w-full items-center gap-[10px] border-b border-[#f0f0f0] px-[14px] py-[10px] text-[13px] hover:bg-[#fafafa]"
          >
            <div
              className={`flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[3px] border-2 ${
                selected.length === classes.length
                  ? "border-[#1ca95c] bg-[#1ca95c]"
                  : "border-[#ccc]"
              }`}
            >
              {selected.length === classes.length && (
                <svg
                  viewBox="0 0 12 10"
                  fill="none"
                  className="h-[9px] w-[9px]"
                >
                  <path
                    d="M1 5l3.5 3.5L11 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="font-medium text-[#1b1b1b]">All classes</span>
          </button>

          {classes.map((cls) => {
            const checked = selected.includes(cls.id);
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => toggle(cls.id)}
                className="flex w-full items-center gap-[10px] px-[14px] py-[10px] text-[13px] hover:bg-[#fafafa]"
              >
                <div
                  className={`flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[3px] border-2 ${
                    checked ? "border-[#1ca95c] bg-[#1ca95c]" : "border-[#ccc]"
                  }`}
                >
                  {checked && (
                    <svg
                      viewBox="0 0 12 10"
                      fill="none"
                      className="h-[9px] w-[9px]"
                    >
                      <path
                        d="M1 5l3.5 3.5L11 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-[#1b1b1b]">{cls.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Fee type panel (create / edit) ────────────────────────────────────────────

interface PanelProps {
  editing: FeeType | null;
  classes: Class[];
  onSave: (
    data: Omit<FeeType, "id" | "schoolId" | "createdAt">
  ) => Promise<void>;
  onClose: () => void;
}

function FeeTypePanel({ editing, classes, onSave, onClose }: PanelProps) {
  const [name, setName] = useState(editing?.name ?? "");
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [classIds, setClassIds] = useState<string[]>(
    editing?.applicableClassIds ?? []
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    if (!name.trim()) return setErr("Fee name is required.");
    const parsed = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(parsed) || parsed <= 0) return setErr("Enter a valid amount.");
    if (classIds.length === 0) return setErr("Select at least one class.");
    setErr("");
    setSaving(true);
    await onSave({
      name: name.trim(),
      amount: parsed,
      termId: "term-001",
      applicableClassIds: classIds,
    });
    setSaving(false);
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-30 bg-black/30" onClick={onClose} />
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-40 flex w-[420px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-[24px] py-[20px]">
          <h2 className="text-[16px] font-semibold text-[#1b1b1b]">
            {editing ? "Edit fee type" : "New fee type"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#888] transition-colors hover:text-[#1b1b1b]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-[20px] overflow-y-auto px-[24px] py-[24px]">
          {/* Name */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-medium text-[#555]">
              Fee name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tuition, PTA Levy, Sports fee"
              className="h-[42px] rounded-[8px] border border-[#e0e0e0] px-[14px] text-[13px] text-[#1b1b1b] outline-none transition-colors placeholder:text-[#bbb] focus:border-[#1ca95c]"
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-medium text-[#555]">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 50000"
              min="0"
              className="h-[42px] rounded-[8px] border border-[#e0e0e0] px-[14px] text-[13px] text-[#1b1b1b] outline-none transition-colors placeholder:text-[#bbb] focus:border-[#1ca95c]"
            />
          </div>

          {/* Classes */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-medium text-[#555]">
              Applicable classes
            </label>
            <ClassPicker
              classes={classes}
              selected={classIds}
              onChange={setClassIds}
            />
            <p className="text-[11px] text-[#999]">
              This fee will appear on invoices for students in the selected
              classes.
            </p>
          </div>

          {err && (
            <p className="rounded-[6px] bg-[#fff0f0] px-[12px] py-[10px] text-[12px] text-[#e84040]">
              {err}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#f0f0f0] px-[24px] py-[20px]">
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="flex h-[44px] w-full items-center justify-center rounded-[8px] bg-[#1ca95c] text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : editing ? "Save changes" : "Create fee type"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function StaffFeesPage() {
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<FeeType | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  function load() {
    Promise.all([getFeeTypes(), getClasses()]).then(([types, cls]) => {
      setFeeTypes(types);
      setClasses(cls);
      setLoaded(true);
    });
  }

  useEffect(() => {
    Promise.all([getFeeTypes(), getClasses()]).then(([types, cls]) => {
      setFeeTypes(types);
      setClasses(cls);
      setLoaded(true);
    });
  }, []);

  function openCreate() {
    setEditing(null);
    setPanelOpen(true);
  }

  function openEdit(ft: FeeType) {
    setEditing(ft);
    setPanelOpen(true);
  }

  async function handleSave(
    data: Omit<FeeType, "id" | "schoolId" | "createdAt">
  ) {
    if (editing) {
      await updateFeeType(editing.id, data);
    } else {
      await createFeeType(data);
    }
    setPanelOpen(false);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await deleteFeeType(id);
    setDeleting(null);
    load();
  }

  function classLabel(ids: string[]) {
    if (ids.length === 0) return "—";
    if (ids.length === classes.length) return "All classes";
    return classes
      .filter((c) => ids.includes(c.id))
      .map((c) => c.name)
      .join(", ");
  }

  return (
    <div className="p-[30px]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-text-heading">
            Fee Management
          </h1>
          <p className="mt-0.5 text-[14px] text-text-body">
            Set and manage fee types for the current term.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex h-[40px] items-center gap-[8px] rounded-[8px] bg-[#1ca95c] px-[16px] text-[13px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-[15px] w-[15px]" />
          Add fee type
        </button>
      </div>

      {!loaded && (
        <div className="flex items-center justify-center py-16">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      )}

      {loaded && (
        <>
          {/* Fee types table */}
          <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
            <div className="flex items-center justify-between border-b border-[#f3f4f6] px-5 py-4">
              <p className="text-[14px] font-semibold text-text-heading">
                Fee types · Current term
              </p>
              <span className="rounded-full bg-[#f3f4f6] px-[10px] py-[2px] text-[12px] text-[#555]">
                {feeTypes.length}
              </span>
            </div>

            {feeTypes.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <p className="text-[15px] font-medium text-[#888]">
                  No fee types yet
                </p>
                <p className="text-[13px] text-[#aaa]">
                  Click &ldquo;Add fee type&rdquo; to define the fees for this
                  term.
                </p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="grid grid-cols-[1fr_140px_1fr_100px] border-b border-[#f3f4f6] px-5 py-2.5 text-[12px] font-medium text-[#888]">
                  <span>Fee name</span>
                  <span>Amount</span>
                  <span>Classes</span>
                  <span />
                </div>

                <div className="divide-y divide-[#f3f4f6]">
                  {feeTypes.map((ft) => (
                    <div
                      key={ft.id}
                      className="grid grid-cols-[1fr_140px_1fr_100px] items-center px-5 py-3.5"
                    >
                      <p className="text-[13px] font-medium text-text-heading">
                        {ft.name}
                      </p>
                      <p className="text-[13px] font-semibold text-text-heading">
                        {formatNaira(ft.amount)}
                      </p>
                      <p className="text-[12px] text-[#666]">
                        {classLabel(ft.applicableClassIds)}
                      </p>
                      <div className="flex items-center justify-end gap-[8px]">
                        <button
                          type="button"
                          onClick={() => openEdit(ft)}
                          className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[#888] transition-colors hover:bg-[#f3f4f6] hover:text-[#1b1b1b]"
                        >
                          <Pencil className="h-[13px] w-[13px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ft.id)}
                          disabled={deleting === ft.id}
                          className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[#888] transition-colors hover:bg-[#fff0f0] hover:text-[#e84040] disabled:opacity-40"
                        >
                          {deleting === ft.id ? (
                            <div className="h-[12px] w-[12px] animate-spin rounded-full border-2 border-[#e84040] border-t-transparent" />
                          ) : (
                            <Trash2 className="h-[13px] w-[13px]" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Create / edit panel */}
      {panelOpen && (
        <FeeTypePanel
          editing={editing}
          classes={classes}
          onSave={handleSave}
          onClose={() => {
            setPanelOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
