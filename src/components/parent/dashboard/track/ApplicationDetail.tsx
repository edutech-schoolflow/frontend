"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserRound, CheckCircle2, XCircle } from "lucide-react";
import { getApplication } from "@/src/lib/api/applications";
import type { Application } from "@/src/types/application";
import { formatCurrency } from "../fees/feeUtils";
import ApplicationTimeline from "./ApplicationTimeline";

const STATUS_CONFIG = {
  under_review: { label: "Under review", cls: "bg-[#fff4e5] text-[#ff8d28]" },
  exam_scheduled: {
    label: "Exam / Interview scheduled",
    cls: "bg-[#fff4e5] text-[#ff8d28]",
  },
  admitted: { label: "Admitted", cls: "bg-[#e8f8ef] text-[#1ca95c]" },
  not_admitted: { label: "Not admitted", cls: "bg-[#fef2f2] text-[#e84040]" },
};

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between py-[10px]">
      <p className="text-[13px] text-[#888]">{label}</p>
      <p className="text-right text-[13px] font-medium text-[#1b1b1b]">
        {value}
      </p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[10px] border border-[#e0e0e0] bg-white px-[24px] py-[20px]">
      <p className="mb-[8px] text-[14px] font-semibold text-[#1b1b1b]">
        {title}
      </p>
      <div className="divide-y divide-[#f5f5f5]">{children}</div>
    </div>
  );
}

export default function ApplicationDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [app, setApp] = useState<Application | null | undefined>(undefined);

  useEffect(() => {
    getApplication(id).then((data) => setApp(data ?? null));
  }, [id]);

  if (app === undefined)
    return (
      <div className="flex justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-2 border-[#eee] border-t-[#1ca95c]" />
      </div>
    );

  if (!app)
    return (
      <div className="px-[88px] py-[60px]">
        <p className="text-[14px] text-[#888]">Application not found.</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-[10px] text-[14px] text-[#1ca95c] underline"
        >
          Go back
        </button>
      </div>
    );

  const childName = [app.childFirstName, app.childMiddleName, app.childLastName]
    .filter(Boolean)
    .join(" ");
  const dob = new Date(app.childDateOfBirth).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const submittedOn = new Date(app.submittedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const { label, cls } = STATUS_CONFIG[app.status];

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-[24px] flex items-center gap-[8px] text-[14px] text-[#666] hover:text-[#1b1b1b]"
      >
        <ArrowLeft className="h-[16px] w-[16px]" /> Back
      </button>

      {/* Header */}
      <div className="mb-[28px] flex items-start justify-between">
        <div className="flex items-center gap-[16px]">
          <div className="relative flex h-[56px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
            {app.photoUrl ? (
              <Image
                src={app.photoUrl}
                alt={childName}
                fill
                className="object-cover"
              />
            ) : (
              <UserRound className="h-[28px] w-[28px] text-[#ccc]" />
            )}
          </div>
          <div>
            <h1 className="text-[22px] font-semibold text-[#1b1b1b]">
              {childName}
            </h1>
            <p className="text-[13px] text-[#888]">
              {app.schoolName} · {app.desiredClass}
            </p>
            <p className="mt-[2px] text-[12px] text-[#aaa]">
              Ref: {app.referenceNumber} · Applied {submittedOn}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-[14px] py-[5px] text-[12px] font-medium ${cls}`}
        >
          {label}
        </span>
      </div>

      {/* Timeline */}
      <div className="mb-[28px] rounded-[10px] border border-[#e0e0e0] bg-white px-[32px] py-[24px]">
        <ApplicationTimeline status={app.status} />
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-[16px]">
        <Card title="Child details">
          <InfoRow label="Full name" value={childName} />
          <InfoRow label="Date of birth" value={dob} />
          <InfoRow
            label="Gender"
            value={app.childGender === "male" ? "Male" : "Female"}
          />
          <InfoRow label="Desired class" value={app.desiredClass} />
          <InfoRow label="Previous school" value={app.previousSchool} />
          <InfoRow label="Medical notes" value={app.medicalNotes} />
        </Card>

        <div className="flex flex-col gap-[16px]">
          <Card title="Parent & guardians">
            <InfoRow label="Parent" value={app.parentName} />
            <InfoRow label="Phone" value={app.parentPhone} />
            {app.additionalGuardians.map((g, i) => (
              <InfoRow
                key={i}
                label={g.relationship}
                value={`${g.name} · ${g.phone}`}
              />
            ))}
          </Card>

          <Card title="Application fee">
            <InfoRow
              label="Amount"
              value={formatCurrency(app.applicationFeeAmount)}
            />
            <InfoRow
              label="Status"
              value={app.applicationFeePaid ? "Paid" : "Unpaid"}
            />
          </Card>
        </div>

        {/* Exam card */}
        {(app.examDate || app.examVenue) && (
          <Card title="Exam / Interview details">
            <InfoRow label="Date" value={app.examDate} />
            <InfoRow label="Time" value={app.examTime} />
            <InfoRow label="Venue" value={app.examVenue} />
            <InfoRow label="Instructions" value={app.examInstructions} />
          </Card>
        )}
      </div>

      {/* Decision banner */}
      {app.status === "admitted" && (
        <div className="mt-[16px] flex items-center gap-[16px] rounded-[10px] border border-[#1ca95c]/30 bg-[#f0faf5] px-[24px] py-[20px]">
          <CheckCircle2 className="h-[28px] w-[28px] shrink-0 text-[#1ca95c]" />
          <div>
            <p className="text-[15px] font-semibold text-[#1b1b1b]">
              Congratulations — {childName} has been admitted!
            </p>
            <p className="text-[13px] text-[#555]">
              The school will be in touch with next steps and enrolment details.
            </p>
          </div>
        </div>
      )}

      {app.status === "not_admitted" && (
        <div className="mt-[16px] flex items-center gap-[16px] rounded-[10px] border border-[#e84040]/20 bg-[#fef2f2] px-[24px] py-[20px]">
          <XCircle className="h-[28px] w-[28px] shrink-0 text-[#e84040]" />
          <div>
            <p className="text-[15px] font-semibold text-[#1b1b1b]">
              Application not successful
            </p>
            {app.rejectionReason && (
              <p className="text-[13px] text-[#555]">{app.rejectionReason}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
