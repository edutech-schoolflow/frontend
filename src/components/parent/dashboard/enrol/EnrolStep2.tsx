"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ChildInfoForm, {
  type ChildInfoValues,
} from "@/src/components/shared/ChildInfoForm";
import { upsertChild, saveMyChild } from "@/src/lib/api/parentChildren";
import { useChildProfile } from "@/src/lib/api/useParentChildren";

const STEPS = ["Step 1", "Step 2", "Step 3", "Step 4"];

export default function EnrolStep2() {
  const router = useRouter();
  const params = useSearchParams();
  const childId = params.get("childId"); // existing child_profile id, if any
  const schoolId = params.get("schoolId") ?? "";

  // No school ⇒ "add a child" (identity space): save the child to the account, ready to apply later.
  // With a school ⇒ the enrol step, which continues into review.
  const saveMode = !schoolId;

  // For an existing child, prefill the form from their saved profile.
  const { data: profile, isPending: loadingProfile } = useChildProfile(
    childId ?? undefined
  );

  const childFields = (values: ChildInfoValues) => ({
    id: childId ?? undefined,
    firstName: values.firstName,
    middleName: values.middleName || undefined,
    lastName: values.lastName,
    dateOfBirth: values.dateOfBirth,
    gender: values.gender,
    previousSchool: values.previousSchool || undefined,
    medicalInfo: values.medicalInfo || undefined,
    relationship: values.guardianRelationship || undefined,
  });

  const handleSubmit = async (
    values: ChildInfoValues,
    _photo: File | null,
    _birthCert: File | null,
    _medicalDoc: File | null
  ) => {
    try {
      if (saveMode) {
        // Save the child to my account (creates the parent profile on the first child), then back to
        // the list — no school picked, no application.
        await saveMyChild(childFields(values));
        toast.success("Child saved to your account.");
        router.push("/parent/dashboard/children");
        return;
      }

      // Enrol: persist the child, then carry id + class + school into review.
      const { childProfileId } = await upsertChild(childFields(values));
      const qs = new URLSearchParams({
        childProfileId,
        schoolId,
        desiredClass: values.desiredClass,
      });
      router.push(`/parent/dashboard/enrol/review?${qs.toString()}`);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not save your child's details."
      );
    }
  };

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <div className="flex flex-col gap-[24px]">
        <h1 className="text-[24px] font-medium text-[#1b1b1b]">
          {saveMode ? "Add a child" : "Enrol your child"}
        </h1>
        {/* The enrol stepper only makes sense in the enrol journey; a plain save has no steps. */}
        {!saveMode && (
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
        )}
      </div>

      <div className="mx-auto mt-[16px] w-[822px] rounded-[10px] border border-[#ccc] px-[44px] py-[41px]">
        <p className="mb-[20px] text-[18px] font-normal text-[#1b1b1b]">
          Tell us about your child
        </p>
        {childId && loadingProfile ? (
          <div className="flex h-[200px] items-center justify-center">
            <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#eee] border-t-[#1ca95c]" />
          </div>
        ) : (
          <ChildInfoForm
            submitLabel={saveMode ? "Save child" : "Review"}
            schoolId={schoolId}
            defaultValues={
              profile
                ? {
                    firstName: profile.firstName,
                    middleName: profile.middleName ?? "",
                    lastName: profile.lastName,
                    dateOfBirth: profile.dateOfBirth,
                    gender: profile.gender ?? undefined,
                    previousSchool: profile.previousSchool ?? "",
                    medicalInfo: profile.medicalInfo ?? "",
                  }
                : undefined
            }
            existingPhotoUrl={profile?.photoUrl ?? null}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
