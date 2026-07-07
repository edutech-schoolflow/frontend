"use client";

import { useState } from "react";
import { Plus, X, CalendarDays, Check, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useAcademicYears,
  useTerms,
  useCreateAcademicYear,
  useSetCurrentYear,
  useCreateTerm,
  useSetCurrentTerm,
  useRenameAcademicYear,
  useDeleteAcademicYear,
  useUpdateTermDates,
  useDeleteTerm,
} from "@/src/lib/api/useTerms";
import {
  termLabel,
  type Term,
  type TermName,
  type AcademicYear,
} from "@/src/lib/api/terms";
import TransitionBanner from "./TransitionBanner";

const TERM_ORDER: TermName[] = ["first", "second", "third"];

function getAcademicYearLabel(year: AcademicYear): string {
  return year.name || `${year.startYear}/${year.endYear}`;
}

// ── Create session (academic year) modal ──────────────────────────────────────

function CreateYearModal({ onClose }: { onClose: () => void }) {
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const create = useCreateAcademicYear();

  async function submit() {
    const start = Number(startYear);
    const end = Number(endYear);

    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start <= 0 ||
      end <= 0 ||
      end <= start
    ) {
      toast.error("Enter a valid session range.");
      return;
    }

    try {
      await create.mutateAsync({ startYear: start, endYear: end });
      toast.success("Session created.");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not create session."
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[400px] rounded-[16px] bg-white p-7 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-text-heading">
            New academic session
          </h2>
          <button
            onClick={onClose}
            className="text-text-body hover:text-text-heading"
          >
            <X className="h-[17px] w-[17px]" />
          </button>
        </div>

        <div className="grid gap-3">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
              Start year
            </label>
            <input
              type="number"
              min="1900"
              max="2100"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              placeholder="e.g. 2024"
              className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
              End year
            </label>
            <input
              type="number"
              min="1900"
              max="2100"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              placeholder="e.g. 2025"
              className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-[8px] border border-[#e5e7eb] py-2.5 text-[13px] font-medium text-text-body hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={create.isPending || !startYear.trim() || !endYear.trim()}
            className="flex-1 rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {create.isPending ? "Creating…" : "Create session"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add term modal ─────────────────────────────────────────────────────────────

function AddTermModal({
  year,
  existing,
  onClose,
}: {
  year: AcademicYear;
  existing: TermName[];
  onClose: () => void;
}) {
  // Terms run in order: start at any term, then only the next one is offered (no skipping/backfilling).
  const ordinal: Record<TermName, number> = { first: 1, second: 2, third: 3 };
  const maxOrd = existing.length
    ? Math.max(...existing.map((t) => ordinal[t]))
    : 0;
  const available: TermName[] =
    maxOrd === 0 ? TERM_ORDER : maxOrd < 3 ? [TERM_ORDER[maxOrd]] : [];
  const [name, setName] = useState<TermName | "">(available[0] ?? "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const create = useCreateTerm();

  async function submit() {
    if (!name) return;
    try {
      await create.mutateAsync({
        academicYearId: year.id,
        name,
        startDate: startDate || null,
        endDate: endDate || null,
      });
      toast.success(`${termLabel(name)} added.`);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add term.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-[16px] bg-white p-7 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-text-heading">
              Add term
            </h2>
            <p className="mt-0.5 text-[12px] text-text-body">
              {getAcademicYearLabel(year)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-body hover:text-text-heading"
          >
            <X className="h-[17px] w-[17px]" />
          </button>
        </div>

        {available.length === 0 ? (
          <p className="text-[13px] text-text-body">
            All three terms already exist for this session.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
                Term
              </label>
              <div className="flex gap-2">
                {available.map((t) => (
                  <label
                    key={t}
                    className={`flex flex-1 cursor-pointer items-center justify-center rounded-[8px] border py-2.5 text-[13px] transition-colors ${
                      name === t
                        ? "border-brand-green bg-green-50 font-medium text-brand-green"
                        : "border-[#e5e7eb] text-text-body hover:border-brand-green/40"
                    }`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      checked={name === t}
                      onChange={() => setName(t)}
                    />
                    {termLabel(t)}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
                  Start date{" "}
                  <span className="font-normal text-text-body">(optional)</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
                  End date{" "}
                  <span className="font-normal text-text-body">(optional)</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-[8px] border border-[#e5e7eb] py-2.5 text-[13px] font-medium text-text-body hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={create.isPending || !name}
                className="flex-1 rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {create.isPending ? "Adding…" : "Add term"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Rename session modal ───────────────────────────────────────────────────────

function RenameYearModal({
  year,
  onClose,
}: {
  year: AcademicYear;
  onClose: () => void;
}) {
  const [startYear, setStartYear] = useState(String(year.startYear ?? ""));
  const [endYear, setEndYear] = useState(String(year.endYear ?? ""));
  const rename = useRenameAcademicYear();

  async function submit() {
    const start = Number(startYear);
    const end = Number(endYear);

    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start <= 0 ||
      end <= 0 ||
      end <= start
    ) {
      toast.error("Enter a valid session range.");
      return;
    }

    try {
      await rename.mutateAsync({
        yearId: year.id,
        startYear: start,
        endYear: end,
      });
      toast.success("Session updated.");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update session."
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[400px] rounded-[16px] bg-white p-7 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-text-heading">
            Update session
          </h2>
          <button
            onClick={onClose}
            className="text-text-body hover:text-text-heading"
          >
            <X className="h-[17px] w-[17px]" />
          </button>
        </div>

        <div className="grid gap-3">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
              Start year
            </label>
            <input
              type="number"
              min="1900"
              max="2100"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              placeholder="e.g. 2024"
              className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
              End year
            </label>
            <input
              type="number"
              min="1900"
              max="2100"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              placeholder="e.g. 2025"
              className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-[8px] border border-[#e5e7eb] py-2.5 text-[13px] font-medium text-text-body hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={rename.isPending || !startYear.trim() || !endYear.trim()}
            className="flex-1 rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {rename.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit term dates modal ───────────────────────────────────────────────────────

function EditTermDatesModal({
  term,
  onClose,
}: {
  term: Term;
  onClose: () => void;
}) {
  const [startDate, setStartDate] = useState(term.startDate ?? "");
  const [endDate, setEndDate] = useState(term.endDate ?? "");
  const update = useUpdateTermDates();

  async function submit() {
    try {
      await update.mutateAsync({
        termId: term.id,
        startDate: startDate || null,
        endDate: endDate || null,
      });
      toast.success("Term dates updated.");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update dates."
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-[16px] bg-white p-7 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-text-heading">
            {termLabel(term.name)} dates
          </h2>
          <button
            onClick={onClose}
            className="text-text-body hover:text-text-heading"
          >
            <X className="h-[17px] w-[17px]" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
              Start date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
              End date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
            />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-[8px] border border-[#e5e7eb] py-2.5 text-[13px] font-medium text-text-body hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={update.isPending}
            className="flex-1 rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {update.isPending ? "Saving…" : "Save dates"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function AcademicCalendar() {
  const { data: years = [], isPending: yearsLoading } = useAcademicYears();
  const { data: terms = [] } = useTerms();
  const setCurrentYear = useSetCurrentYear();
  const setCurrentTerm = useSetCurrentTerm();
  const deleteYear = useDeleteAcademicYear();
  const deleteTerm = useDeleteTerm();

  const [showAddYear, setShowAddYear] = useState(false);
  const [addTermFor, setAddTermFor] = useState<AcademicYear | null>(null);
  const [renameYear, setRenameYear] = useState<AcademicYear | null>(null);
  const [editTerm, setEditTerm] = useState<Term | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const hasCurrentTerm = terms.some((t) => t.isCurrent);

  async function handleDeleteYear(id: string) {
    setBusyId(id);
    try {
      await deleteYear.mutateAsync(id);
      toast.success("Session deleted.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete session."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDeleteTerm(id: string) {
    setBusyId(id);
    try {
      await deleteTerm.mutateAsync(id);
      toast.success("Term deleted.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete term."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function makeYearCurrent(id: string) {
    setBusyId(id);
    try {
      await setCurrentYear.mutateAsync(id);
      toast.success("Current session updated.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not set current session."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function makeTermCurrent(id: string) {
    setBusyId(id);
    try {
      await setCurrentTerm.mutateAsync(id);
      toast.success("Current term updated.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not set current term."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="px-[32px] py-[28px] pb-[60px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-text-heading">
            Academic Calendar
          </h1>
          <p className="mt-0.5 text-[13px] text-text-body">
            Sessions and terms. The current term is what fees, attendance and
            results are recorded against.
          </p>
        </div>
        <button
          onClick={() => setShowAddYear(true)}
          className="flex items-center gap-2 rounded-[8px] bg-brand-green px-4 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
        >
          <Plus className="h-[14px] w-[14px]" />
          Add session
        </button>
      </div>

      {/* Auto-prepare + confirm: shows only when a term/session transition is due */}
      <TransitionBanner />

      {/* No current term warning — fees/attendance need one */}
      {!yearsLoading && years.length > 0 && !hasCurrentTerm && (
        <div className="mb-4 rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          No current term is set. Set one below — fees and other term-based
          features stay empty until you do.
        </div>
      )}

      {yearsLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      ) : years.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[16px] border-2 border-dashed border-[#e5e7eb] bg-white py-[70px] text-center">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#e8f5ee]">
            <CalendarDays className="h-[22px] w-[22px] text-brand-green" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-text-heading">
              No academic session yet
            </p>
            <p className="mt-1 max-w-[320px] text-[13px] text-text-body">
              Create a session (e.g. 2024/25), add its terms, then set the
              current term to start using fees and results.
            </p>
          </div>
          <button
            onClick={() => setShowAddYear(true)}
            className="mt-1 flex items-center gap-2 rounded-[8px] bg-brand-green px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
          >
            <Plus className="h-[14px] w-[14px]" />
            Create session
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {years.map((year) => {
            const yearTerms = terms
              .filter((t) => t.academicYearId === year.id)
              .sort(
                (a, b) =>
                  TERM_ORDER.indexOf(a.name) - TERM_ORDER.indexOf(b.name)
              );
            return (
              <div
                key={year.id}
                className="rounded-[12px] border border-[#e5e7eb] bg-white p-5"
              >
                {/* Session header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-text-heading">
                      {getAcademicYearLabel(year)}
                    </h3>
                    {year.isCurrent && (
                      <span className="rounded-full bg-green-50 px-[10px] py-[2px] text-[11px] font-medium text-brand-green">
                        Current session
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!year.isCurrent && (
                      <button
                        onClick={() => makeYearCurrent(year.id)}
                        disabled={busyId === year.id}
                        className="rounded-[6px] border border-[#e5e7eb] px-3 py-1.5 text-[12px] font-medium text-text-body hover:border-brand-green hover:text-brand-green disabled:opacity-50"
                      >
                        Set current
                      </button>
                    )}
                    <button
                      onClick={() => setAddTermFor(year)}
                      className="flex items-center gap-1 rounded-[6px] bg-brand-green/10 px-3 py-1.5 text-[12px] font-medium text-brand-green hover:bg-brand-green/20"
                    >
                      <Plus className="h-[12px] w-[12px]" />
                      Add term
                    </button>
                    <button
                      onClick={() => setRenameYear(year)}
                      title="Rename session"
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-text-body hover:bg-[#f3f4f6] hover:text-text-heading"
                    >
                      <Pencil className="h-[13px] w-[13px]" />
                    </button>
                    {/* A session with terms can't be deleted (remove its terms first). */}
                    {yearTerms.length === 0 && (
                      <button
                        onClick={() => handleDeleteYear(year.id)}
                        disabled={busyId === year.id}
                        title="Delete session"
                        className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-text-body hover:bg-[#fff0f0] hover:text-[#e84040] disabled:opacity-40"
                      >
                        <Trash2 className="h-[13px] w-[13px]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Terms */}
                {yearTerms.length === 0 ? (
                  <p className="rounded-[8px] bg-[#f9fafb] px-3 py-3 text-[13px] text-text-body">
                    No terms yet. Add First, Second and Third term.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {yearTerms.map((term, ti) => (
                      <div
                        key={term.id}
                        className={`rounded-[8px] border px-3 py-3 ${
                          term.isCurrent
                            ? "border-brand-green bg-green-50"
                            : "border-[#e5e7eb] bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-[13px] font-medium text-text-heading">
                            {termLabel(term.name)}
                            {term.season && (
                              <span className="ml-1.5 text-[11px] font-normal text-text-body">
                                · {term.season}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-1">
                            {term.isCurrent && (
                              <span className="flex items-center gap-1 text-[11px] font-medium text-brand-green">
                                <Check className="h-[12px] w-[12px]" />
                                Current
                              </span>
                            )}
                            <button
                              onClick={() => setEditTerm(term)}
                              title="Edit dates"
                              className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] text-text-body hover:bg-white hover:text-text-heading"
                            >
                              <Pencil className="h-[12px] w-[12px]" />
                            </button>
                            {/* Terms are removed in reverse order, so only the last one is deletable. */}
                            {ti === yearTerms.length - 1 && (
                              <button
                                onClick={() => handleDeleteTerm(term.id)}
                                disabled={busyId === term.id}
                                title="Delete term"
                                className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] text-text-body hover:bg-[#fff0f0] hover:text-[#e84040] disabled:opacity-40"
                              >
                                <Trash2 className="h-[12px] w-[12px]" />
                              </button>
                            )}
                          </div>
                        </div>
                        {(term.startDate || term.endDate) && (
                          <p className="mt-1 text-[11px] text-text-body">
                            {term.startDate ?? "—"} → {term.endDate ?? "—"}
                          </p>
                        )}
                        {!term.isCurrent && (
                          <button
                            onClick={() => makeTermCurrent(term.id)}
                            disabled={busyId === term.id}
                            className="mt-2 text-[12px] font-medium text-brand-green hover:underline disabled:opacity-50"
                          >
                            Set as current term
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showAddYear && <CreateYearModal onClose={() => setShowAddYear(false)} />}
      {addTermFor && (
        <AddTermModal
          year={addTermFor}
          existing={
            terms
              .filter((t) => t.academicYearId === addTermFor.id)
              .map((t) => t.name) as TermName[]
          }
          onClose={() => setAddTermFor(null)}
        />
      )}
      {renameYear && (
        <RenameYearModal
          year={renameYear}
          onClose={() => setRenameYear(null)}
        />
      )}
      {editTerm && (
        <EditTermDatesModal term={editTerm} onClose={() => setEditTerm(null)} />
      )}
    </div>
  );
}
