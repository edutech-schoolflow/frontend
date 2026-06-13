"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Users, ChevronRight, BookOpen, Trash2, X } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getSchoolClasses,
  createSchoolClass,
  deleteSchoolClass,
} from "@/src/lib/api/schools";
import type { SchoolClass, ClassLevel } from "@/src/types/school";

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
  arms: z
    .array(z.object({ value: z.string().min(1, "Arm name is required") }))
    .min(1, "Add at least one arm"),
});

type FormValues = z.infer<typeof schema>;

function AddClassModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (c: SchoolClass) => void;
}) {
  const [saving, setSaving] = useState(false);

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
      arms: [{ value: "A" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "arms" });

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const created = await createSchoolClass({
        name: values.name,
        level: values.level,
        arms: values.arms.map((a) => a.value),
      });
      onCreated(created);
    } finally {
      setSaving(false);
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

          {/* Arms */}
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
            <div className="flex flex-col gap-2">
              {fields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    {...register(`arms.${idx}.value`)}
                    placeholder={`e.g. ${String.fromCharCode(65 + idx)}`}
                    className="h-[38px] flex-1 rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-[#d1d5db] hover:text-red-400"
                    >
                      <X className="h-[15px] w-[15px]" />
                    </button>
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
              Each arm is a separate class group, e.g. JSS 1<strong>A</strong>,
              JSS 1<strong>B</strong>
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
              disabled={saving}
              className="flex-1 rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Creating…" : "Create class"}
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
  onDelete: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${cls.name}" and all its arms?`)) return;
    setDeleting(true);
    await deleteSchoolClass(cls.id);
    onDelete(cls.id);
  };

  return (
    <Link
      href={`/school/dashboard/classes/${cls.id}?name=${encodeURIComponent(cls.name)}`}
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
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getSchoolClasses().then((data) => {
      setClasses(data);
      setLoading(false);
    });
  }, []);

  const handleCreated = (cls: SchoolClass) => {
    setClasses((prev) => [...prev, cls]);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
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
