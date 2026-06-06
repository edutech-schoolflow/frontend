"use client";

import { useState } from "react";
import Toggle from "./Toggle";
import SavedBadge from "./SavedBadge";

const TYPES = [
  { key: "fee_reminder", label: "Fee reminders" },
  { key: "payment_confirmation", label: "Payment confirmations" },
  { key: "result_released", label: "Results released" },
  { key: "school_announcement", label: "School announcements" },
  { key: "attendance_alert", label: "Attendance alerts" },
  { key: "application_update", label: "Application updates" },
];

type Prefs = Record<
  string,
  { whatsapp: boolean; email: boolean; sms: boolean }
>;

export default function NotifSection() {
  const [prefs, setPrefs] = useState<Prefs>(() =>
    Object.fromEntries(
      TYPES.map(({ key }) => [
        key,
        { whatsapp: true, email: true, sms: key === "attendance_alert" },
      ])
    )
  );
  const [saved, setSaved] = useState(false);

  function toggle(
    key: string,
    channel: "whatsapp" | "email" | "sms",
    value: boolean
  ) {
    setPrefs((prev) => ({
      ...prev,
      [key]: { ...prev[key], [channel]: value },
    }));
  }

  return (
    <div className="rounded-[10px] border border-[#e0e0e0] px-[32px] py-[28px]">
      <div className="mb-[20px] flex items-center justify-between">
        <p className="text-[16px] font-medium text-[#1b1b1b]">
          Notification preferences
        </p>
        <div className="flex items-center gap-[12px]">
          <SavedBadge show={saved} />
          <button
            type="button"
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
            className="rounded-[6px] bg-[#1ca95c] px-[16px] py-[6px] text-[13px] text-white hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
      <div className="mb-[10px] grid grid-cols-[1fr_80px_80px_80px] items-center gap-[8px] border-b border-[#f0f0f0] pb-[10px]">
        <span className="text-[12px] text-[#888]">Notification type</span>
        <span className="text-center text-[12px] text-[#888]">WhatsApp</span>
        <span className="text-center text-[12px] text-[#888]">Email</span>
        <span className="text-center text-[12px] text-[#888]">SMS</span>
      </div>
      <div className="flex flex-col divide-y divide-[#f0f0f0]">
        {TYPES.map(({ key, label }) => (
          <div
            key={key}
            className="grid grid-cols-[1fr_80px_80px_80px] items-center gap-[8px] py-[14px]"
          >
            <span className="text-[14px] text-[#1b1b1b]">{label}</span>
            {(["whatsapp", "email", "sms"] as const).map((ch) => (
              <div key={ch} className="flex justify-center">
                <Toggle
                  checked={prefs[key]?.[ch] ?? false}
                  onChange={(v) => toggle(key, ch, v)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-[16px] text-[12px] text-[#aaa]">
        Urgent alerts (emergencies, school closures) are always sent and cannot
        be disabled.
      </p>
    </div>
  );
}
