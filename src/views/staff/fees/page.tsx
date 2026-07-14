"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import {
  useFeeTypes,
  useCreateFeeType,
  useUpdateFeeType,
  useApproveFeeType,
  useRejectFeeType,
  useDeleteFeeType,
} from "@/src/lib/api/useSchoolFees";
import { useTerms } from "@/src/lib/api/useTerms";
import { termLabel } from "@/src/lib/api/terms";
import { useClasses } from "@/src/lib/api/useSchoolClasses";
import { useAppSelector } from "@/src/lib/store/hooks";
import type { FeeType, FeeCategory } from "@/src/lib/api/schoolFees";

type ClassOption = { id: string; name: string };

function formatNaira(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

// ── Approval status chip ──────────────────────────────────────────────────────

function StatusChip({ fee }: { fee: FeeType }) {
  const map: Record<FeeType["approvalStatus"], { label: string; cls: string }> =
    {
      pending_approval: {
        label: "Pending approval",
        cls: "bg-amber-50 text-amber-700 border-amber-200",
      },
      approved: {
        label: "Approved",
        cls: "bg-green-50 text-green-700 border-green-200",
      },
      rejected: {
        label: "Rejected",
        cls: "bg-red-50 text-red-700 border-red-200",
      },
    };
  const { label, cls } = map[fee.approvalStatus];
  return (
    <span
      title={
        fee.approvalStatus === "rejected" ? (fee.rejectionReason ?? "") : ""
      }
      className={`inline-flex items-center rounded-full border px-[10px] py-[2px] text-[11px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

// ── Class multi-select dropdown ───────────────────────────────────────────────

function ClassPicker({
  classes,
  selected,
  onChange,
}: {
  classes: ClassOption[];
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
        <span className={selected.length === 0 ? "text-[#aaa]" : "truncate"}>
          {label}
        </span>
        <ChevronDown
          className={`h-[14px] w-[14px] shrink-0 text-[#888] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[46px] z-20 max-h-[260px] overflow-y-auto rounded-[8px] border border-[#e0e0e0] bg-white shadow-lg">
          {classes.length === 0 && (
            <p className="px-[14px] py-[12px] text-[12px] text-[#999]">
              No classes yet — create classes first.
            </p>
          )}
          {classes.length > 0 && (
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
                  <Check className="h-[10px] w-[10px] text-white" />
                )}
              </div>
              <span className="font-medium text-[#1b1b1b]">All classes</span>
            </button>
          )}

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
                    <Check className="h-[10px] w-[10px] text-white" />
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

interface PanelData {
  name: string;
  amount: number;
  category: FeeCategory;
  classIds: string[];
}

function FeeTypePanel({
  editing,
  classes,
  termName,
  onSave,
  onClose,
}: {
  editing: FeeType | null;
  classes: ClassOption[];
  termName: string;
  onSave: (data: PanelData) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(editing?.name ?? "");
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [category, setCategory] = useState<FeeCategory>(
    editing?.category ?? "compulsory"
  );
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
    try {
      await onSave({ name: name.trim(), amount: parsed, category, classIds });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save the fee type.");
      setSaving(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-40 flex w-[420px] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-[24px] py-[20px]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1b1b1b]">
              {editing ? "Edit fee type" : "New fee type"}
            </h2>
            <p className="mt-0.5 text-[12px] text-[#999]">{termName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#888] transition-colors hover:text-[#1b1b1b]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-[20px] overflow-y-auto px-[24px] py-[24px]">
          {/* Name */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-medium text-[#555]">
              Fee name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tuition, PTA Levy, Lessons"
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

          {/* Category */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-medium text-[#555]">
              Category
            </label>
            <div className="flex gap-2">
              {(["compulsory", "optional"] as const).map((c) => (
                <label
                  key={c}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-[8px] border py-2.5 text-[13px] capitalize transition-colors ${
                    category === c
                      ? "border-[#1ca95c] bg-green-50 font-medium text-[#1ca95c]"
                      : "border-[#e0e0e0] text-[#888] hover:border-[#1ca95c]/40"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={category === c}
                    onChange={() => setCategory(c)}
                  />
                  {c}
                </label>
              ))}
            </div>
            <p className="text-[11px] text-[#999]">
              {category === "compulsory"
                ? "Every student in the selected classes owes this fee."
                : "Optional — a parent owes it only after they choose to pay (subscribe)."}
            </p>
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
          </div>

          {err && (
            <p className="rounded-[6px] bg-[#fff0f0] px-[12px] py-[10px] text-[12px] text-[#e84040]">
              {err}
            </p>
          )}
        </div>

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

// ── Reject modal (owner) ──────────────────────────────────────────────────────

function RejectFeeModal({
  fee,
  saving,
  onConfirm,
  onClose,
}: {
  fee: FeeType;
  saving: boolean;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#1b1b1b]">
            Reject “{fee.name}”
          </h2>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-[#1b1b1b]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-[13px] text-[#888]">
          The staff member who set this up will see why it was rejected and can
          edit and resubmit it.
        </p>
        <textarea
          rows={4}
          placeholder="Reason (optional) — e.g. amount is too high for this term."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full resize-none rounded-lg border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1ca95c]"
        />
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#e0e0e0] px-5 py-2.5 text-[13px] text-[#1b1b1b] hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={saving}
            className="flex-1 rounded-lg bg-[#e84040] py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Rejecting…" : "Reject fee"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function StaffFeesPage() {
  const isOwner = useAppSelector((s) => s.auth.user?.isOwner ?? false);
  const { data: terms = [], isPending: termsLoading } = useTerms();
  const { data: classesData = [] } = useClasses();
  const classes: ClassOption[] = useMemo(
    () => classesData.map((c) => ({ id: c.id, name: c.name })),
    [classesData]
  );

  const [selectedTermId, setSelectedTermId] = useState("");
  // Default to the current term until the user picks one — derived, no effect.
  const currentTermId = (terms.find((t) => t.isCurrent) ?? terms[0])?.id ?? "";
  const termId = selectedTermId || currentTermId;

  const { data: feeTypes = [], isPending: feesLoading } = useFeeTypes({
    termId,
  });

  const create = useCreateFeeType();
  const update = useUpdateFeeType();
  const approve = useApproveFeeType();
  const reject = useRejectFeeType();
  const del = useDeleteFeeType();

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<FeeType | null>(null);
  const [rejecting, setRejecting] = useState<FeeType | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const selectedTerm = terms.find((t) => t.id === termId);
  const termName = selectedTerm ? termLabel(selectedTerm.name) : "—";

  async function handleSave(data: PanelData) {
    if (editing) {
      await update.mutateAsync({
        id: editing.id,
        input: {
          name: data.name,
          amount: data.amount,
          category: data.category,
          classIds: data.classIds,
        },
      });
      toast.success("Fee type updated.");
    } else {
      await create.mutateAsync({
        name: data.name,
        amount: data.amount,
        termId,
        category: data.category,
        classIds: data.classIds,
      });
      toast.success(
        isOwner
          ? "Fee type created and approved."
          : "Fee type created — pending owner approval."
      );
    }
    setPanelOpen(false);
    setEditing(null);
  }

  async function handleApprove(fee: FeeType) {
    setBusyId(fee.id);
    try {
      await approve.mutateAsync(fee.id);
      toast.success(`“${fee.name}” approved — parents can now see it.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not approve.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(reason: string) {
    if (!rejecting) return;
    setBusyId(rejecting.id);
    try {
      await reject.mutateAsync({ id: rejecting.id, reason });
      toast.success(`“${rejecting.name}” rejected.`);
      setRejecting(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not reject.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(fee: FeeType) {
    setBusyId(fee.id);
    try {
      const { archived } = await del.mutateAsync(fee.id);
      toast.success(archived ? "Fee type archived." : "Fee type deleted.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setBusyId(null);
    }
  }

  function classLabel(ids: string[]) {
    if (ids.length === 0) return "—";
    if (classes.length > 0 && ids.length === classes.length)
      return "All classes";
    const names = classes.filter((c) => ids.includes(c.id)).map((c) => c.name);
    return names.length > 0 ? names.join(", ") : "—";
  }

  const pendingCount = feeTypes.filter(
    (f) => f.approvalStatus === "pending_approval"
  ).length;

  return (
    <div className="p-[30px]">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-text-heading">
            Fee Management
          </h1>
          <p className="mt-0.5 text-[14px] text-text-body">
            Define the fees parents pay this term.
            {!isOwner && " Fees you create await owner approval."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Term selector */}
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
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setPanelOpen(true);
            }}
            disabled={!termId}
            className="flex h-[40px] items-center gap-[8px] rounded-[8px] bg-[#1ca95c] px-[16px] text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-[15px] w-[15px]" />
            Add fee type
          </button>
        </div>
      </div>

      {/* Owner pending-approval banner */}
      {isOwner && pendingCount > 0 && (
        <div className="mb-4 rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          {pendingCount} fee {pendingCount === 1 ? "type" : "types"} awaiting
          your approval. Approve to make {pendingCount === 1 ? "it" : "them"}{" "}
          visible to parents.
        </div>
      )}

      {(termsLoading || feesLoading) && (
        <div className="flex items-center justify-center py-16">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      )}

      {!termsLoading && !feesLoading && (
        <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
          <div className="flex items-center justify-between border-b border-[#f3f4f6] px-5 py-4">
            <p className="text-[14px] font-semibold text-text-heading">
              Fee types · {termName}
            </p>
            <span className="rounded-full bg-[#f3f4f6] px-[10px] py-[2px] text-[12px] text-[#555]">
              {feeTypes.length}
            </span>
          </div>

          {feeTypes.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <p className="text-[15px] font-medium text-[#888]">
                No fee types for {termName}
              </p>
              <p className="text-[13px] text-[#aaa]">
                Click “Add fee type” to define the fees for this term.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_120px_110px_1fr_150px_120px] border-b border-[#f3f4f6] px-5 py-2.5 text-[12px] font-medium text-[#888]">
                <span>Fee name</span>
                <span>Amount</span>
                <span>Category</span>
                <span>Classes</span>
                <span>Status</span>
                <span />
              </div>

              <div className="divide-y divide-[#f3f4f6]">
                {feeTypes.map((ft) => {
                  const editable =
                    ft.approvalStatus === "pending_approval" ||
                    ft.approvalStatus === "rejected";
                  const busy = busyId === ft.id;
                  return (
                    <div
                      key={ft.id}
                      className="grid grid-cols-[1fr_120px_110px_1fr_150px_120px] items-center px-5 py-3.5"
                    >
                      <p className="text-[13px] font-medium text-text-heading">
                        {ft.name}
                        {!ft.isActive && (
                          <span className="ml-2 text-[11px] text-[#aaa]">
                            (archived)
                          </span>
                        )}
                      </p>
                      <p className="text-[13px] font-semibold text-text-heading">
                        {formatNaira(ft.amount)}
                      </p>
                      <p className="text-[12px] capitalize text-[#666]">
                        {ft.category}
                      </p>
                      <p className="truncate pr-2 text-[12px] text-[#666]">
                        {classLabel(ft.applicableClassIds)}
                      </p>
                      <div>
                        <StatusChip fee={ft} />
                      </div>
                      <div className="flex items-center justify-end gap-[6px]">
                        {/* Owner approve / reject for pending fees */}
                        {isOwner &&
                          ft.approvalStatus === "pending_approval" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(ft)}
                                disabled={busy}
                                title="Approve"
                                className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[#1ca95c] transition-colors hover:bg-green-50 disabled:opacity-40"
                              >
                                <Check className="h-[15px] w-[15px]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejecting(ft)}
                                disabled={busy}
                                title="Reject"
                                className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[#e84040] transition-colors hover:bg-[#fff0f0] disabled:opacity-40"
                              >
                                <X className="h-[15px] w-[15px]" />
                              </button>
                            </>
                          )}
                        {editable && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(ft);
                              setPanelOpen(true);
                            }}
                            title="Edit"
                            className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[#888] transition-colors hover:bg-[#f3f4f6] hover:text-[#1b1b1b]"
                          >
                            <Pencil className="h-[13px] w-[13px]" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(ft)}
                          disabled={busy}
                          title="Delete"
                          className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[#888] transition-colors hover:bg-[#fff0f0] hover:text-[#e84040] disabled:opacity-40"
                        >
                          {busy ? (
                            <div className="h-[12px] w-[12px] animate-spin rounded-full border-2 border-[#e84040] border-t-transparent" />
                          ) : (
                            <Trash2 className="h-[13px] w-[13px]" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {panelOpen && (
        <FeeTypePanel
          editing={editing}
          classes={classes}
          termName={termName}
          onSave={handleSave}
          onClose={() => {
            setPanelOpen(false);
            setEditing(null);
          }}
        />
      )}

      {rejecting && (
        <RejectFeeModal
          fee={rejecting}
          saving={busyId === rejecting.id}
          onConfirm={handleReject}
          onClose={() => setRejecting(null)}
        />
      )}
    </div>
  );
}
