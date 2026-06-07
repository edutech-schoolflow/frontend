"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import SavedBadge from "./SavedBadge";
import EmailVerifyModal from "./EmailVerifyModal";

const cls =
  "h-[44px] w-full rounded-[8px] border border-[#ccc] bg-white px-[14px] text-[14px] text-[#1b1b1b] focus:outline-none focus:ring-2 focus:ring-[#1ca95c]/30 disabled:bg-[#f5f5f5] disabled:text-[#888]";

export default function ProfileSection() {
  const [profile] = useState({
    name: "John Okafor",
    phone: "+234 803 456 7890",
  });
  const [email, setEmail] = useState("john.okafor@gmail.com");
  const [draftEmail, setDraftEmail] = useState(email);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  function handleSave() {
    const changed = draftEmail !== email;
    setEmail(draftEmail);
    setEditing(false);
    if (changed) {
      setEmailVerified(false);
      setShowVerifyModal(true);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <>
      {showVerifyModal && (
        <EmailVerifyModal
          email={email}
          onSuccess={() => setEmailVerified(true)}
          onClose={() => setShowVerifyModal(false)}
        />
      )}

      <div className="rounded-[10px] border border-[#e0e0e0] px-[32px] py-[28px]">
        <div className="mb-[20px] flex items-center justify-between">
          <p className="text-[16px] font-medium text-[#1b1b1b]">Profile</p>
          <div className="flex items-center gap-[12px]">
            <SavedBadge show={saved} />
            {!editing ? (
              <button
                type="button"
                onClick={() => {
                  setDraftEmail(email);
                  setEditing(true);
                }}
                className="text-[13px] text-[#1ca95c] hover:underline"
              >
                Edit email
              </button>
            ) : (
              <div className="flex gap-[10px]">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="text-[13px] text-[#888] hover:text-[#1b1b1b]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-[6px] bg-[#1ca95c] px-[16px] py-[6px] text-[13px] text-white hover:opacity-90"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] text-[#666]">Full name</label>
            <input className={cls} value={profile.name} disabled />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] text-[#666]">Email address</label>
            <input
              className={cls}
              type="email"
              value={editing ? draftEmail : email}
              disabled={!editing}
              onChange={(e) => setDraftEmail(e.target.value)}
            />
            {!editing &&
              (emailVerified ? (
                <span className="flex items-center gap-[4px] text-[12px] text-[#1ca95c]">
                  <Check className="h-[12px] w-[12px]" strokeWidth={2.5} />
                  Verified
                </span>
              ) : (
                <span className="text-[12px] text-[#888]">
                  Not verified ·{" "}
                  <button
                    type="button"
                    onClick={() => setShowVerifyModal(true)}
                    className="text-[#1ca95c] underline hover:opacity-80"
                  >
                    Verify now
                  </button>
                </span>
              ))}
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] text-[#666]">
              Phone number
              <span className="ml-[6px] text-[11px] text-[#aaa]"></span>
            </label>
            <input className={cls} type="tel" value={profile.phone} disabled />
          </div>
        </div>
      </div>
    </>
  );
}
