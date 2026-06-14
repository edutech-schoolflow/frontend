"use client";

import { useEffect, useState } from "react";
import {
  getPermissionTemplates,
  createPermissionTemplate,
  updatePermissionTemplate,
  deletePermissionTemplate,
  getTemplateStaffCount,
} from "@/src/lib/api/permissionTemplates";
import { FEATURE_LABELS, DEFAULT_FEATURES } from "@/src/types/staffFeatures";
import type { PermissionTemplate } from "@/src/types/permissionTemplate";
import type { StaffFeatures } from "@/src/types/staffFeatures";

const FEATURE_KEYS = Object.keys(FEATURE_LABELS) as (keyof StaffFeatures)[];

function enabledCount(f: StaffFeatures) {
  return (Object.values(f) as boolean[]).filter(Boolean).length;
}

function TemplateEditor({
  initial,
  onSave,
  onCancel,
  onDelete,
  staffCount,
}: {
  initial: PermissionTemplate;
  onSave: (patch: {
    name: string;
    description: string;
    features: StaffFeatures;
  }) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  staffCount: number;
}) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [features, setFeatures] = useState<StaffFeatures>({
    ...initial.features,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  function toggle(key: keyof StaffFeatures) {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    await onSave({
      name: name.trim(),
      description: description.trim(),
      features,
    });
    setSaving(false);
  }

  async function handleDelete() {
    if (!onDelete) return;
    setDeleting(true);
    setDeleteError("");
    await onDelete();
    setDeleting(false);
  }

  return (
    <div className="border-t border-[#f3f4f6] px-5 py-4">
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-text-heading">
            Template name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
            placeholder="e.g. Class Teacher"
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-text-heading">
            Description
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
            placeholder="What this template is for"
          />
        </div>
      </div>

      <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-text-heading">
        Features
      </p>
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {FEATURE_KEYS.map((key) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-[#e5e7eb] px-3 py-2.5 hover:border-[#d1d5db] transition-colors"
          >
            <div
              onClick={() => toggle(key)}
              className={`relative h-[18px] w-[32px] shrink-0 rounded-full transition-colors ${
                features[key] ? "bg-brand-green" : "bg-[#d1d5db]"
              }`}
            >
              <div
                className={`absolute top-[1px] h-[16px] w-[16px] rounded-full bg-white shadow transition-transform ${
                  features[key] ? "translate-x-[15px]" : "translate-x-[1px]"
                }`}
              />
            </div>
            <span className="text-[12px] text-text-heading">
              {FEATURE_LABELS[key]}
            </span>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={save}
          disabled={saving || !name.trim()}
          className="rounded-[8px] bg-brand-green px-5 py-2 text-[13px] font-medium text-white hover:bg-[#17904f] disabled:opacity-60 transition-colors"
        >
          {saving ? "Saving…" : "Save template"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-[8px] border border-[#e5e7eb] px-5 py-2 text-[13px] font-medium text-text-body hover:border-[#d1d5db] transition-colors"
        >
          Cancel
        </button>
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting || staffCount > 0}
            title={
              staffCount > 0
                ? `${staffCount} staff member(s) are on this template`
                : ""
            }
            className="ml-auto rounded-[8px] border border-[#fecaca] px-4 py-2 text-[13px] font-medium text-[#dc2626] hover:bg-[#fef2f2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {deleting
              ? "Deleting…"
              : staffCount > 0
                ? `Can't delete (${staffCount} assigned)`
                : "Delete template"}
          </button>
        )}
        {deleteError && (
          <p className="w-full text-[12px] text-[#dc2626]">{deleteError}</p>
        )}
      </div>
    </div>
  );
}

function TemplateRow({
  template,
  onUpdated,
  onDeleted,
}: {
  template: PermissionTemplate;
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const staffCount = getTemplateStaffCount(template.id);
  const enabled = enabledCount(template.features);

  async function handleSave(patch: {
    name: string;
    description: string;
    features: StaffFeatures;
  }) {
    await updatePermissionTemplate(template.id, patch);
    setOpen(false);
    onUpdated();
  }

  async function handleDelete() {
    const result = await deletePermissionTemplate(template.id);
    if (result.success) {
      onDeleted();
    }
  }

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
      <div
        className="flex cursor-pointer items-center gap-4 px-5 py-4 hover:bg-[#fafafa]"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-text-heading">
            {template.name}
          </p>
          <p className="mt-0.5 text-[12px] text-text-body">
            {template.description}
          </p>
        </div>
        <div className="flex shrink-0 gap-3 text-[12px] text-text-body">
          <span className="rounded-full bg-[#f0fdf4] px-2.5 py-0.5 text-[11px] text-brand-green">
            {enabled} feature{enabled !== 1 ? "s" : ""}
          </span>
          <span className="rounded-full bg-[#f3f4f6] px-2.5 py-0.5 text-[11px] text-text-body">
            {staffCount} staff
          </span>
        </div>
        <span className="shrink-0 text-[12px] font-medium text-brand-green">
          {open ? "Close" : "Edit"}
        </span>
      </div>

      {open && (
        <TemplateEditor
          initial={template}
          onSave={handleSave}
          onCancel={() => setOpen(false)}
          onDelete={handleDelete}
          staffCount={staffCount}
        />
      )}
    </div>
  );
}

const BLANK_FEATURES = { ...DEFAULT_FEATURES };

export default function PermissionTemplatesPage() {
  const [templates, setTemplates] = useState<PermissionTemplate[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [creating, setCreating] = useState(false);

  function load() {
    getPermissionTemplates().then((list) => {
      setTemplates(list);
      setLoaded(true);
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(patch: {
    name: string;
    description: string;
    features: StaffFeatures;
  }) {
    await createPermissionTemplate(
      patch.name,
      patch.description,
      patch.features
    );
    setCreating(false);
    load();
  }

  return (
    <div className="p-[30px]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-text-heading">
            Permission Templates
          </h1>
          <p className="mt-0.5 text-[14px] text-text-body">
            Define reusable permission sets. Editing a template instantly
            updates every staff member assigned to it.
          </p>
        </div>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="shrink-0 rounded-[8px] bg-brand-green px-4 py-2 text-[13px] font-medium text-white hover:bg-[#17904f] transition-colors"
          >
            New template
          </button>
        )}
      </div>

      {!loaded && (
        <div className="flex items-center justify-center py-16">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      )}

      {loaded && (
        <div className="flex flex-col gap-3">
          {/* New template inline form */}
          {creating && (
            <div className="overflow-hidden rounded-[12px] border border-brand-green bg-white">
              <div className="px-5 pt-4">
                <p className="text-[14px] font-semibold text-text-heading">
                  New template
                </p>
              </div>
              <TemplateEditor
                initial={{
                  id: "",
                  name: "",
                  description: "",
                  features: { ...BLANK_FEATURES },
                  createdAt: "",
                }}
                onSave={handleCreate}
                onCancel={() => setCreating(false)}
                staffCount={0}
              />
            </div>
          )}

          {templates.map((t) => (
            <TemplateRow
              key={t.id}
              template={t}
              onUpdated={load}
              onDeleted={load}
            />
          ))}
        </div>
      )}
    </div>
  );
}
