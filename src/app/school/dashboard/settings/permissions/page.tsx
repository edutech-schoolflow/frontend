"use client";

import { useEffect, useState } from "react";
import { getStaffWithPermissions } from "@/src/lib/api/staffProfile";
import {
  getPermissionTemplates,
  assignStaffTemplate,
  setStaffFeatureOverrides,
} from "@/src/lib/api/permissionTemplates";
import {
  FEATURE_LABELS,
  FEATURE_DESCRIPTIONS,
  FEATURE_GROUPS,
} from "@/src/types/staffFeatures";
import { ROLE_LABELS } from "@/src/types/staff";
import type { StaffWithPermissions } from "@/src/lib/api/staffProfile";
import type { PermissionTemplate } from "@/src/types/permissionTemplate";
import type { StaffFeatures } from "@/src/types/staffFeatures";

const FEATURE_KEYS = Object.keys(FEATURE_LABELS) as (keyof StaffFeatures)[];

// ── Feature toggle ─────────────────────────────────────────────────────────────

function FeatureToggle({
  featureKey,
  enabled,
  fromTemplate,
  isOverride,
  onToggle,
}: {
  featureKey: keyof StaffFeatures;
  enabled: boolean;
  fromTemplate: boolean;
  isOverride: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={() => !fromTemplate && onToggle()}
      className={`flex items-start gap-3 rounded-[10px] border px-4 py-3 transition-colors ${
        fromTemplate
          ? "border-[#e5e7eb] bg-[#f9fafb] cursor-default"
          : "border-[#e5e7eb] cursor-pointer hover:border-[#d1d5db] bg-white"
      }`}
    >
      {/* Toggle pill */}
      <div
        className={`relative mt-0.5 h-[18px] w-[32px] shrink-0 rounded-full transition-colors ${
          enabled ? "bg-brand-green" : "bg-[#d1d5db]"
        } ${fromTemplate ? "opacity-60" : ""}`}
      >
        <div
          className={`absolute top-[1px] h-[16px] w-[16px] rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-[15px]" : "translate-x-[1px]"
          }`}
        />
      </div>

      {/* Label + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-medium text-text-heading">
            {FEATURE_LABELS[featureKey]}
          </span>
          {fromTemplate && (
            <span className="rounded-full bg-[#e8f5ee] px-2 py-px text-[10px] font-medium text-brand-green">
              via template
            </span>
          )}
          {isOverride && !fromTemplate && (
            <span className="rounded-full bg-[#eff6ff] px-2 py-px text-[10px] font-medium text-[#2563eb]">
              added
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11px] text-text-body leading-relaxed">
          {FEATURE_DESCRIPTIONS[featureKey]}
        </p>
      </div>
    </div>
  );
}

// ── Staff permission row ────────────────────────────────────────────────────────

function StaffPermissionRow({
  item,
  templates,
  onSaved,
}: {
  item: StaffWithPermissions;
  templates: PermissionTemplate[];
  onSaved: () => void;
}) {
  const { staff } = item;
  const [open, setOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    staff.permissionTemplateId ?? ""
  );
  const [overrides, setOverrides] = useState<Partial<StaffFeatures>>(
    staff.featureOverrides ?? {}
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedTemplateId(staff.permissionTemplateId ?? "");

    setOverrides(staff.featureOverrides ?? {});
  }, [staff]);

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId);

  function handleTemplateChange(id: string) {
    setSelectedTemplateId(id);
    setOverrides({});
    setSaved(false);
  }

  function toggleOverride(key: keyof StaffFeatures) {
    setOverrides((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    await assignStaffTemplate(staff.id, selectedTemplateId || null);
    await setStaffFeatureOverrides(staff.id, overrides);
    setSaving(false);
    setSaved(true);
    onSaved();
  }

  function cancel() {
    setSelectedTemplateId(staff.permissionTemplateId ?? "");
    setOverrides(staff.featureOverrides ?? {});
    setOpen(false);
    setSaved(false);
  }

  const enabledCount = FEATURE_KEYS.filter(
    (k) => activeTemplate?.features[k] || overrides[k]
  ).length;

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
      {/* Header row — click to expand */}
      <div
        className="flex cursor-pointer items-center gap-3 px-5 py-4 hover:bg-[#fafafa]"
        onClick={() => {
          setOpen((v) => !v);
          setSaved(false);
        }}
      >
        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#e8f5ee] text-[13px] font-bold text-brand-green">
          {staff.firstName[0]}
          {staff.lastName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-text-heading">
            {staff.firstName} {staff.lastName}
          </p>
          <p className="text-[12px] text-text-body">
            {ROLE_LABELS[staff.role]}
            {staff.position ? ` · ${staff.position}` : ""}
            {" · "}
            {activeTemplate ? (
              <span className="text-brand-green">{activeTemplate.name}</span>
            ) : (
              <span className="text-[#9ca3af]">No template</span>
            )}
            {" · "}
            {enabledCount} of {FEATURE_KEYS.length} permissions on
          </p>
        </div>
        <span className="shrink-0 text-[12px] font-medium text-brand-green">
          {open ? "Close" : "Edit"}
        </span>
      </div>

      {open && (
        <div className="border-t border-[#f3f4f6] px-5 py-5 space-y-6">
          {/* ── Step 1: Template ── */}
          <div>
            <p className="mb-0.5 text-[12px] font-semibold uppercase tracking-wide text-text-heading">
              Step 1 — Choose a template
            </p>
            <p className="mb-3 text-[12px] text-text-body">
              Templates set the base permissions for this person&apos;s role.
              Pick the one that best matches what they do.
            </p>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
            >
              <option value="">No template — use role defaults only</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {activeTemplate && (
              <p className="mt-1.5 text-[12px] text-[#6b7280]">
                {activeTemplate.description}
              </p>
            )}
          </div>

          {/* ── Step 2: Fine-tune ── */}
          <div>
            <p className="mb-0.5 text-[12px] font-semibold uppercase tracking-wide text-text-heading">
              Step 2 — Fine-tune (optional)
            </p>
            <p className="mb-4 text-[12px] text-text-body">
              Greyed permissions come from the template and cannot be removed
              here. Toggle any extra permission this person needs beyond their
              template.
            </p>

            <div className="space-y-5">
              {FEATURE_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="mb-2 flex items-baseline gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                      {group.label}
                    </p>
                    <p className="text-[11px] text-[#c4c4c4]">— {group.hint}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {group.keys.map((key) => {
                      const fromTemplate = !!activeTemplate?.features[key];
                      const isOverride = !!overrides[key];
                      const enabled = fromTemplate || isOverride;
                      return (
                        <FeatureToggle
                          key={key}
                          featureKey={key}
                          enabled={enabled}
                          fromTemplate={fromTemplate}
                          isOverride={isOverride}
                          onToggle={() => toggleOverride(key)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-[8px] bg-brand-green px-5 py-2 text-[13px] font-medium text-white hover:bg-[#17904f] disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              onClick={cancel}
              className="rounded-[8px] border border-[#e5e7eb] px-5 py-2 text-[13px] font-medium text-text-body hover:border-[#d1d5db] transition-colors"
            >
              Cancel
            </button>
            {saved && (
              <span className="text-[13px] text-[#16a34a]">
                Saved successfully
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function StaffPermissionsPage() {
  const [list, setList] = useState<StaffWithPermissions[]>([]);
  const [templates, setTemplates] = useState<PermissionTemplate[]>([]);
  const [loaded, setLoaded] = useState(false);

  function load() {
    Promise.all([getStaffWithPermissions(), getPermissionTemplates()]).then(
      ([staffList, tplList]) => {
        setList(staffList);
        setTemplates(tplList);
        setLoaded(true);
      }
    );
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-[30px]">
      <div className="mb-2">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Staff Permissions
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          Each staff member gets a template that matches their role, plus any
          extras they need on top. Most staff never need anything beyond their
          template.
        </p>
      </div>
      <a
        href="/school/dashboard/settings/templates"
        className="mb-6 inline-block text-[13px] font-medium text-brand-green hover:underline"
      >
        Manage permission templates →
      </a>

      {!loaded ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((item) => (
            <StaffPermissionRow
              key={item.staff.id}
              item={item}
              templates={templates}
              onSaved={load}
            />
          ))}
        </div>
      )}
    </div>
  );
}
