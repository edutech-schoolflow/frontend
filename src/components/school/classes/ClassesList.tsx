"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Users,
  ChevronRight,
  BookOpen,
  Trash2,
  X,
  UserCheck,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useClasses,
  useCreateClass,
  useDeleteClass,
  useSchoolTeachers,
} from "@/src/lib/api/useSchoolClasses";
import type { SchoolClass, ClassLevel } from "@/src/types/school";
import { useWorkspaceHref } from "@/src/hooks/useWorkspaceHref";

// ─── Constants ─────────────────────────────────────────────────────────────────

const LEVEL_LABELS: Record<ClassLevel, string> = {
  nursery: "Nursery",
  primary: "Primary",
  junior_secondary: "Junior Secondary",
  senior_secondary: "Senior Secondary",
};

const LEVEL_COLORS: Record<ClassLevel, string> = {
  nursery: "bg-[#fef3c7] text-[#92400e]",
  primary: "bg-[#dbeafe] text-[#1e40af]",
  junior_secondary: "bg-[#dcfce7] text-[#166534]",
  senior_secondary: "bg-[#f3e8ff] text-[#6b21a8]",
};

// ─── Add Class Modal ───────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, "Class name is required"),
  level: z.enum(["nursery", "primary", "junior_secondary", "senior_secondary"]),
  // Arms are optional — a class with no streams gets a single default arm on the backend.
  arms: z.array(z.object({ value: z.string().min(1, "Arm name is required") })),
});

type FormValues = z.infer<typeof schema>;

function AddClassModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (c: SchoolClass) => void;
}) {
  const { data: teachers = [] } = useSchoolTeachers();
  const createClass = useCreateClass();
  // arm index → selected teacher id
  const [teacherPerArm, setTeacherPerArm] = useState<Record<number, string>>(
    {}
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      level: "primary",
      arms: [], // start with no arms — a class with no streams gets a default arm on the backend
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "arms" });

  const onSubmit = async (values: FormValues) => {
    const armNames = values.arms.map((a) => a.value);
    const teacherByName: Record<string, string> = {};
    armNames.forEach((arm, idx) => {
      if (teacherPerArm[idx]) teacherByName[arm] = teacherPerArm[idx];
    });

    try {
      const created = await createClass.mutateAsync({
        name: values.name,
        level: values.level,
        arms: armNames,
        teacherPerArm:
          Object.keys(teacherByName).length > 0 ? teacherByName : undefined,
      });
      onCreated(created);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not create class."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[480px] rounded-[16px] bg-white p-7 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-text-heading">
            Add a class
          </h2>
          <button
            onClick={onClose}
            className="text-text-body hover:text-text-heading"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Class name */}
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
              Class name
            </label>
            <input
              {...register("name")}
              placeholder="e.g. JSS 1, Primary 3, SS 2"
              className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
            />
            {errors.name && (
              <p className="mt-1 text-[12px] text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Level */}
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
              School level
            </label>
            <select
              {...register("level")}
              className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
            >
              <option value="nursery">Nursery</option>
              <option value="primary">Primary</option>
              <option value="junior_secondary">Junior Secondary (JSS)</option>
              <option value="senior_secondary">Senior Secondary (SS)</option>
            </select>
          </div>

          {/* Arms + teacher assignment */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[13px] font-medium text-text-heading">
                Arms / streams
              </label>
              <button
                type="button"
                onClick={() => append({ value: "" })}
                className="text-[12px] font-medium text-brand-green hover:underline"
              >
                + Add arm
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {fields.map((field, idx) => (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      {...register(`arms.${idx}.value`)}
                      placeholder={`e.g. ${String.fromCharCode(65 + idx)}`}
                      className="h-[38px] flex-1 rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        remove(idx);
                        setTeacherPerArm((prev) => {
                          const next = { ...prev };
                          delete next[idx];
                          return next;
                        });
                      }}
                      className="text-[#d1d5db] hover:text-red-400"
                    >
                      <X className="h-[15px] w-[15px]" />
                    </button>
                  </div>
                  {teachers.length > 0 && (
                    <select
                      value={teacherPerArm[idx] ?? ""}
                      onChange={(e) =>
                        setTeacherPerArm((prev) => ({
                          ...prev,
                          [idx]: e.target.value,
                        }))
                      }
                      className="h-[36px] w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 text-[12px] text-text-body outline-none focus:border-brand-green"
                    >
                      <option value="">
                        — Assign class teacher (optional) —
                      </option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
            {errors.arms && (
              <p className="mt-1 text-[12px] text-red-500">
                {errors.arms.message ?? errors.arms.root?.message}
              </p>
            )}
            <p className="mt-2 text-[12px] text-text-body">
              Arms are optional. Add them for streamed classes, e.g. JSS 1
              <strong>A</strong>, JSS 1<strong>B</strong> — or leave empty if
              this class has just one group.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[8px] border border-[#e5e7eb] py-2.5 text-[13px] font-medium text-text-body hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createClass.isPending}
              className="flex-1 rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {createClass.isPending ? "Creating…" : "Create class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Class Card ────────────────────────────────────────────────────────────────

function ClassCard({
  cls,
  onDelete,
}: {
  cls: SchoolClass;
  onDelete: (id: string) => Promise<void>;
}) {
  const wsHref = useWorkspaceHref();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${cls.name}" and all its arms?`)) return;
    setDeleting(true);
    try {
      await onDelete(cls.id);
    } catch (err) {
      setDeleting(false);
      toast.error(err instanceof Error ? err.message : "Could not delete.");
    }
  };

  const teacherLabel =
    cls.teacherNames.length === 0
      ? "No teacher assigned"
      : cls.teacherNames.join(", ");

  return (
    <Link
      href={wsHref(`/school/dashboard/classes/${cls.id}?name=${encodeURIComponent(cls.name)}`)}
      className="group flex flex-col rounded-[12px] border border-[#e5e7eb] bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-[#e8f5ee]">
          <BookOpen className="h-[18px] w-[18px] text-brand-green" />
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="opacity-0 transition-opacity group-hover:opacity-100 text-[#d1d5db] hover:text-red-400 disabled:opacity-40"
          aria-label="Delete class"
        >
          <Trash2 className="h-[15px] w-[15px]" />
        </button>
      </div>

      <h3 className="text-[15px] font-semibold text-text-heading">
        {cls.name}
      </h3>

      <span
        className={`mt-1.5 inline-block self-start rounded-full px-[8px] py-[2px] text-[11px] font-medium ${LEVEL_COLORS[cls.level]}`}
      >
        {LEVEL_LABELS[cls.level]}
      </span>

      <div className="mt-2 flex items-center gap-1.5">
        <UserCheck className="h-[12px] w-[12px] shrink-0 text-[#9ca3af]" />
        <span
          className={`truncate text-[12px] ${
            cls.teacherNames.length === 0
              ? "text-[#9ca3af] italic"
              : "text-text-body"
          }`}
        >
          {teacherLabel}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-[#f3f4f6] pt-4">
        <div className="flex items-center gap-1.5 text-[12px] text-text-body">
          <BookOpen className="h-[13px] w-[13px]" />
          <span>
            {cls.armsCount} {cls.armsCount === 1 ? "arm" : "arms"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-text-body">
          <Users className="h-[13px] w-[13px]" />
          <span>{cls.studentsCount} students</span>
        </div>
        <ChevronRight className="ml-auto h-[14px] w-[14px] text-[#d1d5db]" />
      </div>
    </Link>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[16px] border-2 border-dashed border-[#e5e7eb] bg-white py-[80px] text-center">
      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#e8f5ee]">
        <BookOpen className="h-[24px] w-[24px] text-brand-green" />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-text-heading">
          No classes yet
        </p>
        <p className="mt-1 max-w-[320px] text-[13px] text-text-body">
          Add your first class to start managing attendance, grades, timetables,
          and assignments.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="mt-2 flex items-center gap-2 rounded-[8px] bg-brand-green px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
      >
        <Plus className="h-[14px] w-[14px]" />
        Add your first class
      </button>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function ClassesList() {
  const { data: classes = [], isPending } = useClasses();
  const deleteClass = useDeleteClass();
  const [showModal, setShowModal] = useState(false);

  // Mutations invalidate the classes query, so the list refreshes automatically.
  const handleCreated = () => setShowModal(false);
  const handleDelete = (id: string) => deleteClass.mutateAsync(id);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="px-[32px] py-[28px] pb-[60px]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold text-text-heading">
              Classes
            </h1>
            <p className="mt-0.5 text-[13px] text-text-body">
              Manage class groups and arms. Each arm has its own teacher,
              students, timetable and grades.
            </p>
          </div>
          {classes.length > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-[8px] bg-brand-green px-4 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
            >
              <Plus className="h-[14px] w-[14px]" />
              Add class
            </button>
          )}
        </div>

        {classes.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {classes.map((cls) => (
              <ClassCard key={cls.id} cls={cls} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddClassModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}
