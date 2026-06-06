"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SavedBadge from "./SavedBadge";

const cls =
  "h-[44px] w-full rounded-[8px] border border-[#ccc] bg-white px-[14px] text-[14px] text-[#1b1b1b] focus:outline-none focus:ring-2 focus:ring-[#1ca95c]/30";

type PwKey = "current" | "next" | "confirm";

export default function PasswordSection() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSave() {
    setError("");
    if (form.next.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.next !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm({ current: "", next: "", confirm: "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  }

  const fields: { key: PwKey; label: string }[] = [
    { key: "current", label: "Current password" },
    { key: "next", label: "New password" },
    { key: "confirm", label: "Confirm new password" },
  ];

  return (
    <div className="rounded-[10px] border border-[#e0e0e0] px-[32px] py-[28px]">
      <div className="mb-[20px] flex items-center justify-between">
        <p className="text-[16px] font-medium text-[#1b1b1b]">
          Change password
        </p>
        <SavedBadge show={saved} />
      </div>
      <div className="grid grid-cols-2 gap-[16px]">
        {fields.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-[6px]">
            <label className="text-[13px] text-[#666]">{label}</label>
            <div className="relative">
              <input
                className={`${cls} pr-[40px]`}
                type={show[key] ? "text" : "password"}
                value={form[key]}
                placeholder="••••••••"
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, [key]: !s[key] }))}
                className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#666]"
              >
                {show[key] ? (
                  <EyeOff className="h-[16px] w-[16px]" />
                ) : (
                  <Eye className="h-[16px] w-[16px]" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      {error && <p className="mt-[10px] text-[13px] text-red-500">{error}</p>}
      <button
        type="button"
        onClick={handleSave}
        disabled={submitting || !form.current || !form.next || !form.confirm}
        className="mt-[20px] flex h-[44px] items-center rounded-[8px] bg-[#1ca95c] px-[24px] text-[14px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Updating…" : "Update password"}
      </button>
    </div>
  );
}
