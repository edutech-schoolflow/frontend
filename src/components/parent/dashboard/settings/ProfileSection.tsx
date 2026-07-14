"use client";

import { Check } from "lucide-react";
import { useIdentity } from "@/src/lib/api/useIdentity";

const cls =
  "h-[44px] w-full rounded-[8px] border border-[#ccc] bg-white px-[14px] text-[14px] text-[#1b1b1b] focus:outline-none focus:ring-2 focus:ring-[#1ca95c]/30 disabled:bg-[#f5f5f5] disabled:text-[#888]";

/**
 * The identity's profile, straight from GET /auth/me — no mock data, nothing editable here yet.
 * Name/phone/email changes belong to the identity-settings surface once the backend exposes an
 * update endpoint; until then this section only tells the truth.
 */
export default function ProfileSection() {
  const { data: me, isPending } = useIdentity();

  return (
    <div className="rounded-[10px] border border-[#e0e0e0] px-[32px] py-[28px]">
      <div className="mb-[20px] flex items-center justify-between">
        <p className="text-[16px] font-medium text-[#1b1b1b]">Profile</p>
      </div>

      <div className="grid grid-cols-2 gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] text-[#666]">Full name</label>
          <input className={cls} value={isPending ? "" : (me?.fullName ?? "")} disabled />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] text-[#666]">Email address</label>
          <input
            className={cls}
            type="email"
            value={isPending ? "" : (me?.email ?? "")}
            placeholder="—"
            disabled
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] text-[#666]">Phone number</label>
          <input className={cls} value={isPending ? "" : (me?.phone ?? "")} disabled />
          {me?.phoneVerified && (
            <span className="flex items-center gap-[4px] text-[12px] text-[#1ca95c]">
              <Check className="h-[12px] w-[12px]" strokeWidth={2.5} />
              Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
