"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import {
  getSchoolApplication,
  admitApplication,
} from "@/src/lib/api/applications";
import type { Application } from "@/src/types/application";
import AppStatusChip from "./AppStatusChip";
import ScheduleExamModal from "./ScheduleExamModal";
import RejectModal from "./RejectModal";
import RecordAssessmentModal from "./RecordAssessmentModal";

type Modal = "schedule" | "reject" | "assess" | null;

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-[13px]">
      <span className="w-[140px] shrink-0 text-grey-text">{label}</span>
      <span className="text-dark-blue">{value}</span>
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
    <div className="rounded-xl border border-border-default bg-white p-5">
      <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-grey-text">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function ApplicationDetail({ id }: { id: string }) {
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [admitting, setAdmitting] = useState(false);
  const [done, setDone] = useState<
    "admitted" | "rejected" | "scheduled" | "assessed" | null
  >(null);

  useEffect(() => {
    getSchoolApplication(id).then((data) => {
      setApp(data);
      setLoading(false);
    });
  }, [id]);

  async function handleAdmit() {
    if (!app) return;
    setAdmitting(true);
    await admitApplication(app.id);
    setAdmitting(false);
    setDone("admitted");
    setApp((prev) => (prev ? { ...prev, status: "admitted" } : prev));
  }

  function handleModalDone(type: "scheduled" | "rejected" | "assessed") {
    setModal(null);
    setDone(type);
    if (type === "scheduled")
      setApp((prev) => (prev ? { ...prev, status: "exam_scheduled" } : prev));
    if (type === "rejected")
      setApp((prev) => (prev ? { ...prev, status: "not_admitted" } : prev));
  }

  if (loading) return <p className="text-[13px] text-grey-text">Loading…</p>;
  if (!app)
    return <p className="text-[13px] text-grey-text">Application not found.</p>;

  const childName = `${app.childFirstName}${app.childMiddleName ? " " + app.childMiddleName : ""} ${app.childLastName}`;
  const dob = new Date(app.childDateOfBirth).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Back + header */}
      <button
        onClick={() => router.push("/school/dashboard/applications")}
        className="mb-5 flex items-center gap-[6px] text-[13px] text-grey-text hover:text-dark-blue"
      >
        <ArrowLeft className="h-[14px] w-[14px]" /> Back to Applications
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] font-semibold text-dark-blue">
              {childName}
            </h1>
            <AppStatusChip status={app.status} />
          </div>
          <p className="mt-1 text-[13px] text-grey-text">
            Ref: {app.referenceNumber} · Applied{" "}
            {new Date(app.submittedAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Action buttons — context-aware */}
        {app.status !== "admitted" && app.status !== "not_admitted" && (
          <div className="flex flex-wrap gap-2">
            {app.status === "under_review" && (
              <button
                onClick={() => setModal("schedule")}
                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-[13px] font-medium text-blue-700 hover:bg-blue-100"
              >
                Schedule Exam
              </button>
            )}
            {app.status === "exam_scheduled" && (
              <button
                onClick={() => setModal("assess")}
                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-[13px] font-medium text-blue-700 hover:bg-blue-100"
              >
                Record Assessment
              </button>
            )}
            <button
              onClick={handleAdmit}
              disabled={admitting}
              className="rounded-lg bg-brand-green px-4 py-2 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
            >
              {admitting ? "Admitting…" : "Admit"}
            </button>
            <button
              onClick={() => setModal("reject")}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-medium text-[#e84040] hover:bg-red-100"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Success banners */}
      {done === "admitted" && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green" />
          <p className="text-[13px] font-medium text-green-700">
            Application admitted — parent has been notified.
          </p>
        </div>
      )}
      {done === "rejected" && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <XCircle className="h-5 w-5 shrink-0 text-[#e84040]" />
          <p className="text-[13px] font-medium text-red-700">
            Application rejected — parent has been notified.
          </p>
        </div>
      )}
      {done === "scheduled" && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
          <p className="text-[13px] font-medium text-blue-700">
            Exam scheduled — invitation sent to parent via WhatsApp.
          </p>
        </div>
      )}
      {done === "assessed" && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green" />
          <p className="text-[13px] font-medium text-green-700">
            Assessment recorded successfully.
          </p>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Child info */}
        <Card title="Child Details">
          <InfoRow label="Full name" value={childName} />
          <InfoRow label="Date of birth" value={dob} />
          <InfoRow
            label="Gender"
            value={app.childGender === "male" ? "Male" : "Female"}
          />
          <InfoRow label="Desired class" value={app.desiredClass} />
          <InfoRow label="Previous school" value={app.previousSchool} />
          <InfoRow label="Medical notes" value={app.medicalNotes} />
          {app.photoUrl && (
            <div className="text-[13px]">
              <a
                href={app.photoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-brand-green underline"
              >
                View passport photo
              </a>
            </div>
          )}
          {app.birthCertUrl && (
            <div className="text-[13px]">
              <a
                href={app.birthCertUrl}
                target="_blank"
                rel="noreferrer"
                className="text-brand-green underline"
              >
                View birth certificate
              </a>
            </div>
          )}
        </Card>

        {/* Parent / guardians */}
        <Card title="Parent / Guardians">
          <InfoRow label="Primary contact" value={app.parentName} />
          <InfoRow label="Phone" value={app.parentPhone} />
          {app.additionalGuardians.length > 0 && (
            <div className="border-t border-border-default pt-3">
              <p className="mb-2 text-[12px] font-medium text-grey-text">
                Additional Guardians
              </p>
              {app.additionalGuardians.map((g, i) => (
                <div key={i} className="space-y-1">
                  <InfoRow label="Name" value={g.name} />
                  <InfoRow label="Phone" value={g.phone} />
                  <InfoRow label="Relationship" value={g.relationship} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Payment + exam + outcome */}
        <div className="space-y-4">
          <Card title="Payment">
            <InfoRow
              label="Application fee"
              value={`₦${app.applicationFeeAmount.toLocaleString()}`}
            />
            <InfoRow
              label="Status"
              value={app.applicationFeePaid ? "Paid ✓" : "Unpaid"}
            />
          </Card>

          {app.status === "exam_scheduled" && app.examDate && (
            <Card title="Exam Details">
              <InfoRow
                label="Date"
                value={new Date(app.examDate).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
              <InfoRow label="Time" value={app.examTime} />
              <InfoRow label="Venue" value={app.examVenue} />
              <InfoRow label="Instructions" value={app.examInstructions} />
            </Card>
          )}

          {app.assessmentRating && (
            <Card title="Assessment">
              <InfoRow
                label="Rating"
                value={
                  app.assessmentRating.charAt(0).toUpperCase() +
                  app.assessmentRating.slice(1)
                }
              />
              <InfoRow label="Notes" value={app.assessmentNotes} />
            </Card>
          )}

          {app.status === "not_admitted" && app.rejectionReason && (
            <Card title="Rejection Reason">
              <p className="text-[13px] text-grey-text">
                {app.rejectionReason}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal === "schedule" && (
        <ScheduleExamModal
          applicationId={app.id}
          onDone={() => handleModalDone("scheduled")}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "reject" && (
        <RejectModal
          applicationId={app.id}
          onDone={() => handleModalDone("rejected")}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "assess" && (
        <RecordAssessmentModal
          applicationId={app.id}
          onDone={() => handleModalDone("assessed")}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
