"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Package,
  Plus,
  Search,
  X,
  ChevronRight,
  Users,
  User,
  Pencil,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useStaffFeatures } from "@/src/context/StaffFeaturesContext";
import {
  getStoreItems,
  createStoreItem,
  updateStoreItem,
  getMaterialAssignments,
  assignItemToStudents,
  getClassOptions,
  getStudentOptions,
  getAssignmentPreview,
  formatNaira,
  CATEGORY_META,
  STORE_CATEGORIES,
  type ClassOption,
  type StudentOption,
  type AssignTarget,
} from "@/src/lib/api/store";
import type {
  StoreItem,
  MaterialAssignment,
  StoreCategory,
} from "@/src/types/store";

// ── Helpers ────────────────────────────────────────────────────────────────────

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

// ── Item card ─────────────────────────────────────────────────────────────────

function ItemCard({
  item,
  canManage,
  onAssign,
  onEdit,
}: {
  item: StoreItem;
  canManage: boolean;
  onAssign: (item: StoreItem) => void;
  onEdit: (item: StoreItem) => void;
}) {
  const meta = CATEGORY_META[item.category];
  const stockLabel =
    item.stock === null
      ? "Unlimited"
      : item.stock === 0
        ? "Out of stock"
        : `${item.stock} in stock`;
  const stockColor =
    item.stock === 0
      ? "text-[#dc2626]"
      : item.stock !== null && item.stock < 10
        ? "text-[#b45309]"
        : "text-[#6b7280]";

  return (
    <div className="flex flex-col overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white transition-shadow hover:shadow-sm">
      {/* Emoji header */}
      <div className="flex items-center justify-center bg-[#f9fafb] py-7 text-[44px]">
        {item.emoji}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Name + category */}
        <div>
          <p className="text-[14px] font-semibold leading-snug text-text-heading">
            {item.name}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${meta.bg} ${meta.text}`}
          >
            {meta.label}
          </span>
        </div>

        {/* Price + stock */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[18px] font-bold text-text-heading">
              {formatNaira(item.price)}
            </p>
            <p className="text-[11px] text-[#9ca3af]">per {item.unit}</p>
          </div>
          <p className={`text-[12px] font-medium ${stockColor}`}>
            {stockLabel}
          </p>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-[12px] leading-relaxed text-text-body line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Actions */}
        {canManage && (
          <div className="mt-auto flex gap-2 pt-1">
            <button
              onClick={() => onAssign(item)}
              disabled={item.stock === 0}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-brand-green px-3 py-2 text-[12px] font-medium text-white hover:bg-[#17904f] disabled:opacity-50 transition-colors"
            >
              <Users className="h-[13px] w-[13px]" />
              Assign to students
            </button>
            <button
              onClick={() => onEdit(item)}
              className="flex items-center justify-center rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[12px] text-text-body hover:border-[#d1d5db] transition-colors"
            >
              <Pencil className="h-[13px] w-[13px]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Add / Edit item panel ──────────────────────────────────────────────────────

const EMOJI_SUGGESTIONS = [
  "👕",
  "🎽",
  "👔",
  "📚",
  "📖",
  "📐",
  "🔬",
  "📓",
  "📏",
  "🎒",
  "🧮",
  "🖊️",
  "📦",
  "🧪",
  "🗂️",
  "💼",
];

const UNIT_OPTIONS = [
  "piece",
  "pair",
  "set",
  "copy",
  "pack",
  "bundle",
  "dozen",
  "roll",
  "ream",
  "box",
];

function ItemPanel({
  initial,
  onSave,
  onClose,
}: {
  initial?: StoreItem;
  onSave: (
    data: Omit<StoreItem, "id" | "createdAt" | "schoolId">
  ) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<StoreCategory>(
    initial?.category ?? "other"
  );
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [unit, setUnit] = useState(initial?.unit ?? "piece");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "📦");
  const [stockStr, setStockStr] = useState(
    initial?.stock != null ? String(initial.stock) : ""
  );
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim() || !price) return;
    setSaving(true);
    await onSave({
      name: name.trim(),
      description: description.trim(),
      category,
      price: Math.round(parseFloat(price)),
      unit: unit.trim() || "piece",
      emoji,
      stock: parseInt(stockStr) || 0,
      isActive,
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="flex h-full w-full max-w-[480px] flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f3f4f6] px-6 py-4">
          <p className="text-[15px] font-semibold text-text-heading">
            {initial ? "Edit item" : "Add new item"}
          </p>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-text-heading"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Emoji picker */}
          <div>
            <p className="mb-2 text-[12px] font-semibold text-text-heading">
              Icon
            </p>
            <div className="flex flex-wrap gap-2">
              {EMOJI_SUGGESTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border text-[20px] transition-colors ${
                    emoji === e
                      ? "border-brand-green bg-[#e8f5ee]"
                      : "border-[#e5e7eb] hover:border-[#d1d5db]"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-text-heading">
              Item name <span className="text-[#dc2626]">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Winter Uniform"
              className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
            />
          </div>

          {/* Category + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-text-heading">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StoreCategory)}
                className="w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
              >
                {STORE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_META[c].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-text-heading">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-text-heading">
              Price (₦) <span className="text-[#dc2626]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#9ca3af]">
                ₦
              </span>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full rounded-[8px] border border-[#e5e7eb] py-2 pl-7 pr-3 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-text-heading">
              Stock quantity <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={stockStr}
              onChange={(e) => setStockStr(e.target.value)}
              placeholder="e.g. 50"
              className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-text-heading">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description shown to parents and staff…"
              className="w-full resize-none rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
            />
          </div>

          {/* Active toggle */}
          {initial && (
            <label className="flex cursor-pointer items-center gap-3">
              <div
                onClick={() => setIsActive((v) => !v)}
                className={`relative h-[22px] w-[40px] rounded-full transition-colors ${isActive ? "bg-brand-green" : "bg-[#d1d5db]"}`}
              >
                <div
                  className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-[19px]" : "translate-x-[2px]"}`}
                />
              </div>
              <span className="text-[13px] text-text-heading">
                {isActive
                  ? "Active — visible in store"
                  : "Inactive — hidden from store"}
              </span>
            </label>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-[#f3f4f6] px-6 py-4">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim() || !price}
            className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:bg-[#17904f] disabled:opacity-60 transition-colors"
          >
            {saving && <Loader2 className="h-[14px] w-[14px] animate-spin" />}
            {saving ? "Saving…" : initial ? "Save changes" : "Add item"}
          </button>
          <button
            onClick={onClose}
            className="rounded-[8px] border border-[#e5e7eb] px-5 py-2.5 text-[13px] text-text-body hover:border-[#d1d5db] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Assign modal ───────────────────────────────────────────────────────────────

type AssignStep = "scope" | "target" | "qty" | "preview";

function AssignModal({
  item,
  classes,
  students,
  onConfirm,
  onClose,
}: {
  item: StoreItem;
  classes: ClassOption[];
  students: StudentOption[];
  onConfirm: (target: AssignTarget, qty: number, note: string) => Promise<void>;
  onClose: () => void;
}) {
  const [step, setStep] = useState<AssignStep>("scope");
  const [scope, setScope] = useState<AssignTarget["scope"]>("individual");
  const [studentId, setStudentId] = useState("");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [studentSearch, setStudentSearch] = useState("");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const target: AssignTarget = { scope, studentId, classId };
  const preview = getAssignmentPreview(target, classes, students);
  const total = preview.length * item.price * qty;

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  async function handleConfirm() {
    setConfirming(true);
    await onConfirm(target, qty, note);
    setConfirming(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
        <div className="w-full max-w-[420px] rounded-[16px] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#f0fdf4]">
            <CheckCircle2 className="h-[28px] w-[28px] text-[#16a34a]" />
          </div>
          <p className="text-[16px] font-semibold text-text-heading">
            Assignment complete
          </p>
          <p className="mt-2 text-[13px] text-text-body">
            <span className="font-semibold text-text-heading">
              {item.emoji} {item.name}
            </span>{" "}
            assigned to{" "}
            <span className="font-semibold text-text-heading">
              {preview.length} student{preview.length !== 1 ? "s" : ""}
            </span>
            .
            <br />
            <span className="font-semibold text-brand-green">
              {formatNaira(total)}
            </span>{" "}
            added to their invoices.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:bg-[#17904f] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 pt-[60px]">
      <div className="w-full max-w-[520px] rounded-[16px] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f3f4f6] px-6 py-4">
          <div>
            <p className="text-[15px] font-semibold text-text-heading">
              Assign to students
            </p>
            <p className="text-[12px] text-text-body">
              {item.emoji} {item.name} · {formatNaira(item.price)}/{item.unit}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-text-heading"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-0 border-b border-[#f3f4f6]">
          {(["scope", "target", "qty", "preview"] as AssignStep[]).map(
            (s, i) => {
              const steps: AssignStep[] = ["scope", "target", "qty", "preview"];
              const idx = steps.indexOf(step);
              const sIdx = steps.indexOf(s);
              const labels = ["Who", "Select", "Quantity", "Confirm"];
              return (
                <div
                  key={s}
                  className={`flex-1 py-2.5 text-center text-[11px] font-medium ${
                    sIdx === idx
                      ? "border-b-2 border-brand-green text-brand-green"
                      : sIdx < idx
                        ? "text-[#9ca3af]"
                        : "text-[#d1d5db]"
                  }`}
                >
                  {labels[i]}
                </div>
              );
            }
          )}
        </div>

        <div className="px-6 py-5">
          {/* Step 1: Scope */}
          {step === "scope" && (
            <div className="space-y-3">
              <p className="text-[13px] text-text-body">
                Who do you want to assign this to?
              </p>
              {[
                {
                  value: "individual",
                  icon: User,
                  label: "Individual student",
                  desc: "Pick one specific student",
                },
                {
                  value: "class",
                  icon: Users,
                  label: "Whole class",
                  desc: "All students in a selected class",
                },
                {
                  value: "all",
                  icon: Package,
                  label: "All students",
                  desc: `Assign to all ${students.length} students in the school`,
                },
              ].map(({ value, icon: Icon, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setScope(value as AssignTarget["scope"])}
                  className={`flex w-full items-center gap-4 rounded-[12px] border p-4 text-left transition-colors ${
                    scope === value
                      ? "border-brand-green bg-[#e8f5ee]"
                      : "border-[#e5e7eb] hover:border-[#d1d5db]"
                  }`}
                >
                  <div
                    className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full ${
                      scope === value ? "bg-brand-green" : "bg-[#f3f4f6]"
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] ${scope === value ? "text-white" : "text-[#6b7280]"}`}
                    />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-text-heading">
                      {label}
                    </p>
                    <p className="text-[12px] text-text-body">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Target */}
          {step === "target" && scope === "individual" && (
            <div className="space-y-3">
              <p className="text-[13px] text-text-body">
                Search for the student
              </p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#9ca3af]" />
                <input
                  autoFocus
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Type a student's name…"
                  className="w-full rounded-[8px] border border-[#e5e7eb] py-2 pl-9 pr-3 text-[13px] focus:border-brand-green focus:outline-none"
                />
              </div>
              <div className="max-h-[260px] overflow-y-auto space-y-1">
                {filteredStudents.slice(0, 20).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStudentId(s.id)}
                    className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2.5 text-left transition-colors ${
                      studentId === s.id
                        ? "bg-[#e8f5ee] text-brand-green"
                        : "hover:bg-[#f9fafb] text-text-heading"
                    }`}
                  >
                    <span className="text-[13px] font-medium">{s.name}</span>
                    <span className="text-[11px] text-text-body">
                      {s.className}
                    </span>
                  </button>
                ))}
                {filteredStudents.length === 0 && (
                  <p className="py-6 text-center text-[13px] text-[#9ca3af]">
                    No students found
                  </p>
                )}
              </div>
            </div>
          )}

          {step === "target" && scope === "class" && (
            <div className="space-y-3">
              <p className="text-[13px] text-text-body">Select a class</p>
              <div className="space-y-2">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setClassId(cls.id)}
                    className={`flex w-full items-center justify-between rounded-[12px] border p-4 text-left transition-colors ${
                      classId === cls.id
                        ? "border-brand-green bg-[#e8f5ee]"
                        : "border-[#e5e7eb] hover:border-[#d1d5db]"
                    }`}
                  >
                    <span className="text-[14px] font-semibold text-text-heading">
                      {cls.name}
                    </span>
                    <span className="text-[12px] text-text-body">
                      {cls.studentCount} student
                      {cls.studentCount !== 1 ? "s" : ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "target" && scope === "all" && (
            <div className="rounded-[12px] bg-[#f9fafb] p-5 text-center">
              <p className="text-[32px]">🏫</p>
              <p className="mt-2 text-[14px] font-semibold text-text-heading">
                All {students.length} students
              </p>
              <p className="mt-1 text-[13px] text-text-body">
                This item will be assigned to every student currently enrolled
                in the school.
              </p>
            </div>
          )}

          {/* Step 3: Quantity + note */}
          {step === "qty" && (
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-text-heading">
                  Quantity per student
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((v) => Math.max(1, v - 1))}
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border border-[#e5e7eb] text-[18px] text-text-body hover:border-[#d1d5db] transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) =>
                      setQty(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-[80px] rounded-[8px] border border-[#e5e7eb] py-2 text-center text-[15px] font-semibold text-text-heading focus:border-brand-green focus:outline-none"
                  />
                  <button
                    onClick={() => setQty((v) => v + 1)}
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border border-[#e5e7eb] text-[18px] text-text-body hover:border-[#d1d5db] transition-colors"
                  >
                    +
                  </button>
                  <span className="text-[13px] text-text-body">
                    {item.unit}
                    {qty > 1 ? "s" : ""} × {formatNaira(item.price)} ={" "}
                    <strong className="text-text-heading">
                      {formatNaira(item.price * qty)}
                    </strong>{" "}
                    per student
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-text-heading">
                  Note (optional)
                </label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Required for new term"
                  className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] focus:border-brand-green focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {step === "preview" && (
            <div className="space-y-4">
              <div className="rounded-[12px] bg-[#f9fafb] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-text-body">
                    Students affected
                  </p>
                  <p className="text-[14px] font-bold text-text-heading">
                    {preview.length}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[13px] text-text-body">Cost per student</p>
                  <p className="text-[14px] font-bold text-text-heading">
                    {formatNaira(item.price * qty)}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-[#e5e7eb] pt-2">
                  <p className="text-[13px] font-semibold text-text-heading">
                    Total added to invoices
                  </p>
                  <p className="text-[16px] font-bold text-brand-green">
                    {formatNaira(total)}
                  </p>
                </div>
              </div>

              <div className="max-h-[200px] overflow-y-auto rounded-[10px] border border-[#e5e7eb]">
                {preview.map((s, i) => (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between px-4 py-2.5 ${
                      i < preview.length - 1 ? "border-b border-[#f3f4f6]" : ""
                    }`}
                  >
                    <div>
                      <p className="text-[13px] font-medium text-text-heading">
                        {s.name}
                      </p>
                      <p className="text-[11px] text-text-body">
                        {s.className}
                      </p>
                    </div>
                    <p className="text-[12px] font-medium text-text-body">
                      {formatNaira(item.price * qty)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="flex items-center gap-3 border-t border-[#f3f4f6] px-6 py-4">
          {step !== "scope" ? (
            <button
              onClick={() => {
                const steps: AssignStep[] = [
                  "scope",
                  "target",
                  "qty",
                  "preview",
                ];
                setStep(steps[steps.indexOf(step) - 1]);
              }}
              className="rounded-[8px] border border-[#e5e7eb] px-5 py-2.5 text-[13px] text-text-body hover:border-[#d1d5db] transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="rounded-[8px] border border-[#e5e7eb] px-5 py-2.5 text-[13px] text-text-body hover:border-[#d1d5db] transition-colors"
            >
              Cancel
            </button>
          )}

          {step !== "preview" ? (
            <button
              onClick={() => {
                const steps: AssignStep[] = [
                  "scope",
                  "target",
                  "qty",
                  "preview",
                ];
                setStep(steps[steps.indexOf(step) + 1]);
              }}
              disabled={
                (step === "target" && scope === "individual" && !studentId) ||
                (step === "target" && scope === "class" && !classId)
              }
              className="ml-auto flex items-center gap-1.5 rounded-[8px] bg-brand-green px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#17904f] disabled:opacity-50 transition-colors"
            >
              Continue <ChevronRight className="h-[14px] w-[14px]" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={confirming || preview.length === 0}
              className="ml-auto flex items-center gap-2 rounded-[8px] bg-brand-green px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#17904f] disabled:opacity-50 transition-colors"
            >
              {confirming && (
                <Loader2 className="h-[14px] w-[14px] animate-spin" />
              )}
              {confirming
                ? "Assigning…"
                : `Confirm & bill ${preview.length} student${preview.length !== 1 ? "s" : ""}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Assignments tab ────────────────────────────────────────────────────────────

function AssignmentsTab({
  assignments,
}: {
  assignments: MaterialAssignment[];
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
                    <td className="px-4 py-3 text-[13px] font-medium text-text-heading">
                      {a.studentName}
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

// ── Page ───────────────────────────────────────────────────────────────────────

type Tab = "catalog" | "assignments";

export default function SchoolStorePage() {
  const { features, profile } = useStaffFeatures();
  const canManage = features.can_manage_store;

  const [tab, setTab] = useState<Tab>("catalog");
  const [items, setItems] = useState<StoreItem[]>([]);
  const [assignments, setAssignments] = useState<MaterialAssignment[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<StoreCategory | "all">(
    "all"
  );

  const [addingItem, setAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [assigningItem, setAssigningItem] = useState<StoreItem | null>(null);

  const load = useCallback(() => {
    Promise.all([
      getStoreItems(),
      getMaterialAssignments(),
      getClassOptions(),
      getStudentOptions(),
    ]).then(([itemsData, assignData, classData, studentData]) => {
      setItems(itemsData);
      setAssignments(assignData);
      setClasses(classData);
      setStudents(studentData);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visibleItems = items.filter((item) => {
    if (!item.isActive && !canManage) return false;
    if (categoryFilter !== "all" && item.category !== categoryFilter)
      return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  async function handleCreateItem(
    data: Omit<StoreItem, "id" | "createdAt" | "schoolId">
  ) {
    await createStoreItem({ ...data, schoolId: "sch-001" });
    setAddingItem(false);
    load();
  }

  async function handleEditItem(
    data: Omit<StoreItem, "id" | "createdAt" | "schoolId">
  ) {
    if (!editingItem) return;
    await updateStoreItem(editingItem.id, data);
    setEditingItem(null);
    load();
  }

  async function handleAssign(target: AssignTarget, qty: number, note: string) {
    if (!assigningItem || !profile) return;
    await assignItemToStudents({
      item: assigningItem,
      target,
      quantity: qty,
      note,
      assignedBy: profile.staff.id,
    });
    load();
  }

  const tabCls = (t: Tab) =>
    `px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 ${
      tab === t
        ? "border-brand-green text-brand-green"
        : "border-transparent text-text-body hover:text-text-heading"
    }`;

  return (
    <div className="p-[30px]">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-text-heading">
            School Store
          </h1>
          <p className="mt-0.5 text-[14px] text-text-body">
            Manage uniforms, books, and materials — assign items to students and
            bill them through their invoices.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setAddingItem(true)}
            className="flex shrink-0 items-center gap-2 rounded-[8px] bg-brand-green px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#17904f] transition-colors"
          >
            <Plus className="h-[14px] w-[14px]" />
            Add item
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-[#e5e7eb]">
        <button className={tabCls("catalog")} onClick={() => setTab("catalog")}>
          Catalog
          {items.length > 0 && (
            <span className="ml-1.5 rounded-full bg-[#f3f4f6] px-2 py-px text-[11px] text-[#6b7280]">
              {items.filter((i) => i.isActive).length}
            </span>
          )}
        </button>
        <button
          className={tabCls("assignments")}
          onClick={() => setTab("assignments")}
        >
          Assignments
          {assignments.length > 0 && (
            <span className="ml-1.5 rounded-full bg-[#f3f4f6] px-2 py-px text-[11px] text-[#6b7280]">
              {assignments.length}
            </span>
          )}
        </button>
      </div>

      {!loaded ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      ) : tab === "catalog" ? (
        <>
          {/* Filters */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#9ca3af]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items…"
                className="w-full rounded-[8px] border border-[#e5e7eb] py-2 pl-9 pr-3 text-[13px] focus:border-brand-green focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", ...STORE_CATEGORIES] as const).map((c) => {
                const active = categoryFilter === c;
                const label = c === "all" ? "All" : CATEGORY_META[c].label;
                return (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                      active
                        ? "bg-brand-green text-white"
                        : "border border-[#e5e7eb] text-text-body hover:border-[#d1d5db]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          {visibleItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#e5e7eb] py-20">
              <Package className="mb-3 h-[32px] w-[32px] text-[#d1d5db]" />
              <p className="text-[14px] text-[#9ca3af]">
                {search || categoryFilter !== "all"
                  ? "No items match your filters"
                  : "No items in the store yet"}
              </p>
              {canManage && !search && categoryFilter === "all" && (
                <button
                  onClick={() => setAddingItem(true)}
                  className="mt-4 flex items-center gap-1.5 rounded-[8px] bg-brand-green px-4 py-2 text-[13px] font-medium text-white hover:bg-[#17904f] transition-colors"
                >
                  <Plus className="h-[13px] w-[13px]" /> Add your first item
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  canManage={canManage}
                  onAssign={setAssigningItem}
                  onEdit={setEditingItem}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <AssignmentsTab assignments={assignments} />
      )}

      {/* Add item panel */}
      {addingItem && (
        <ItemPanel
          onSave={handleCreateItem}
          onClose={() => setAddingItem(false)}
        />
      )}

      {/* Edit item panel */}
      {editingItem && (
        <ItemPanel
          initial={editingItem}
          onSave={handleEditItem}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Assign modal */}
      {assigningItem && (
        <AssignModal
          item={assigningItem}
          classes={classes}
          students={students}
          onConfirm={handleAssign}
          onClose={() => setAssigningItem(null)}
        />
      )}
    </div>
  );
}
