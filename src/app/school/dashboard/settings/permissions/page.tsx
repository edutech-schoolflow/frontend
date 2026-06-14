"use client";

import { useEffect, useState } from "react";
import { getStaffWithPermissions } from "@/src/lib/api/staffProfile";
import {
  getPermissionTemplates,
  assignStaffTemplate,
  setStaffFeatureOverrides,
} from "@/src/lib/api/permissionTemplates";
import { FEATURE_LABELS } from "@/src/types/staffFeatures";
import { ROLE_LABELS } from "@/src/types/staff";
import type { StaffWithPermissions } from "@/src/lib/api/staffProfile";
import type { PermissionTemplate } from "@/src/types/permissionTemplate";
import type { StaffFeatures } from "@/src/types/staffFeatures";

const FEATURE_KEYS = Object.keys(FEATURE_LABELS) as (keyof StaffFeatures)[];

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

  const effectiveCount = FEATURE_KEYS.filter(
    (k) => activeTemplate?.features[k] || overrides[k]
  ).length;

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
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
            {ROLE_LABELS[staff.role]} ·{" "}
            {activeTemplate ? (
              <span className="text-brand-green">{activeTemplate.name}</span>
            ) : (
              "No template"
            )}{" "}
            · {effectiveCount}/{FEATURE_KEYS.length} features
          </p>
        </div>
        <span className="shrink-0 text-[12px] font-medium text-brand-green">
          {open ? "Close" : "Edit"}
        </span>
      </div>

      {open && (
        <div className="border-t border-[#f3f4f6] px-5 py-4">
          {/* Template picker */}
          <div className="mb-5">
            <p className="mb-1.5 text-[12px] font-semibold text-text-heading uppercase tracking-wide">
              Permission template
            </p>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
            >
              <option value="">No template (role defaults only)</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {activeTemplate && (
              <p className="mt-1.5 text-[12px] text-text-body">
                {activeTemplate.description}
              </p>
            )}
          </div>

          {/* Feature list */}
          <div className="mb-5">
            <p className="mb-2 text-[12px] font-semibold text-text-heading uppercase tracking-wide">
              Permissions
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {FEATURE_KEYS.map((key) => {
                const fromTemplate = !!activeTemplate?.features[key];
                const isOverride = !!overrides[key];
                const enabled = fromTemplate || isOverride;

                return (
                  <div
                    key={key}
                    onClick={() => !fromTemplate && toggleOverride(key)}
                    className={`flex items-center gap-3 rounded-[8px] border px-3 py-2.5 transition-colors ${
                      fromTemplate
                        ? "border-[#e5e7eb] bg-[#f9fafb] cursor-default"
                        : "border-[#e5e7eb] cursor-pointer hover:border-[#d1d5db]"
                    }`}
                  >
                    {/* Toggle indicator */}
                    <div
                      className={`relative h-[18px] w-[32px] shrink-0 rounded-full transition-colors ${
                        enabled ? "bg-brand-green" : "bg-[#d1d5db]"
                      } ${fromTemplate ? "opacity-60" : ""}`}
                    >
                      <div
                        className={`absolute top-[1px] h-[16px] w-[16px] rounded-full bg-white shadow transition-transform ${
                          enabled ? "translate-x-[15px]" : "translate-x-[1px]"
                        }`}
                      />
                    </div>
                    <span className="flex-1 text-[12px] text-text-heading">
                      {FEATURE_LABELS[key]}
                    </span>
                    {fromTemplate && (
                      <span className="shrink-0 rounded-full bg-[#e8f5ee] px-2 py-0.5 text-[10px] text-brand-green">
                        template
                      </span>
                    )}
                    {isOverride && !fromTemplate && (
                      <span className="shrink-0 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[10px] text-[#2563eb]">
                        added
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-[8px] bg-brand-green px-5 py-2 text-[13px] font-medium text-white hover:bg-[#17904f] disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={cancel}
              className="rounded-[8px] border border-[#e5e7eb] px-5 py-2 text-[13px] font-medium text-text-body hover:border-[#d1d5db] transition-colors"
            >
              Cancel
            </button>
            {saved && <span className="text-[13px] text-[#16a34a]">Saved</span>}
          </div>
        </div>
      )}
    </div>
  );
}

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
          Assign a permission template to each staff member, then add individual
          extras on top. Greyed toggles come from the template and can only be
          changed by editing the template itself.
        </p>
      </div>
      <a
        href="/school/dashboard/settings/templates"
        className="mb-6 inline-block text-[13px] font-medium text-brand-green hover:underline"
      >
        Manage permission templates →
      </a>

      {!loaded && (
        <div className="flex items-center justify-center py-16">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      )}

      {loaded && (
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
