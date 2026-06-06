"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChildInfoForm, {
  type ChildInfoValues,
} from "@/src/components/shared/ChildInfoForm";
import { getChildProfiles } from "@/src/lib/api/parents";
import type { ChildProfile } from "@/src/types/parent";

const STEPS = ["Step 1", "Step 2", "Step 3", "Step 4"];

export default function EnrolStep2() {
  const router = useRouter();
  const params = useSearchParams();
  const childId = params.get("childId");

  // null = still loading, undefined = no childId / not found
  const [prefill, setPrefill] = useState<ChildProfile | undefined | null>(
    childId ? null : undefined
  );

  useEffect(() => {
    if (!childId) return;
    getChildProfiles().then((profiles) => {
      const match = profiles.find((p) => p.id === childId);
      setPrefill(match ?? undefined);
    });
  }, [childId]);

  const handleSubmit = async (
    _values: ChildInfoValues,
    _photo: File | null,
    _birthCert: File | null
  ) => {
    router.push("/parent/dashboard/enrol/review");
  };

  // Wait for pre-fill data before mounting the form so defaultValues are correct
  const isReady = prefill !== null;

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <div className="flex flex-col gap-[24px]">
        <h1 className="text-[24px] font-medium text-[#1b1b1b]">
          Enrol your child
        </h1>
        <div className="flex items-center gap-[5px]">
          {STEPS.map((step, i) => (
            <div key={step} className="flex w-[213px] flex-col gap-[7px]">
              <p
                className={`text-[12px] ${i <= 1 ? "text-[#1b1b1b]" : "text-[#aaa]"}`}
              >
                {step}
              </p>
              <div
                className={`h-[6px] rounded-[5px] ${i <= 1 ? "bg-[#1ca95c]" : "bg-[#eee]"}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-[16px] w-[822px] rounded-[10px] border border-[#ccc] px-[44px] py-[41px]">
        <p className="mb-[20px] text-[18px] font-normal text-[#1b1b1b]">
          Tell us about your child
        </p>
        {isReady ? (
          <ChildInfoForm
            submitLabel="Review"
            defaultValues={prefill}
            existingPhotoUrl={prefill?.photoUrl ?? null}
            onSubmit={handleSubmit}
          />
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#eee] border-t-[#1ca95c]" />
          </div>
        )}
      </div>
    </div>
  );
}
