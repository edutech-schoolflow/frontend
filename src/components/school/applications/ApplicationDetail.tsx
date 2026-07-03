"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Circle,
  CalendarClock,
  ClipboardList,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { useApplication } from "@/src/lib/api/useSchoolApplications";
import type { Application } from "@/src/types/application";
import AppStatusChip from "./AppStatusChip";
import ScheduleExamModal from "./ScheduleExamModal";
import RejectModal from "./RejectModal";
import RecordAssessmentModal from "./RecordAssessmentModal";
import AdmitModal from "./AdmitModal";

type Modal = "schedule" | "reject" | "assess" | "admit" | null;

// ─── Pipeline step config ───────────────────────────────────────────────────────

interface PipelineStep {
  key: string;
  label: string;
  isDone: (app: Application) => boolean;
}

const PIPELINE: PipelineStep[] = [
  {
    key: "review",
    label: "Under Review",
    isDone: () => true,
  },
  {
    key: "exam",
    label: "Exam Scheduled",
    isDone: (app) =>
      ["exam_scheduled", "admitted", "not_admitted"].includes(app.status),
  },
  {
    key: "assessed",
    label: "Assessed",
    isDone: (app) =>
      !!app.assessmentRating &&
      ["exam_scheduled", "admitted", "not_admitted"].includes(app.status),
  },
  {
    key: "decision",
    label: "Decision",
    isDone: (app) => app.status === "admitted" || app.status === "not_admitted",
  },
];

function getActiveStep(app: Application): number {
  if (app.status === "admitted" || app.status === "not_admitted") return 3;
  if (app.assessmentRating) return 2;
  if (app.status === "exam_scheduled") return 1;
  return 0;
}

// ─── Next-action callout ────────────────────────────────────────────────────────

function NextActionBanner({
  app,
  onAction,
}: {
  app: Application;
  onAction: (modal: Modal) => void;
}) {
  if (app.status === "under_review") {
    return (
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <CalendarClock className="h-[18px] w-[18px] shrink-0 text-blue-600" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-blue-800">
            Next step: Schedule an exam or interview
          </p>
          <p className="text-[12px] text-blue-600">
            The applicant is waiting. Schedule their assessment to move forward.
          </p>
        </div>
        <button
          onClick={() => onAction("schedule")}
          className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-90"
        >
          Schedule now
        </button>
      </div>
    );
  }

  if (app.status === "exam_scheduled" && !app.assessmentRating) {
    return (
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <ClipboardList className="h-[18px] w-[18px] shrink-0 text-amber-600" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-amber-800">
            Next step: Record the assessment outcome
          </p>
          <p className="text-[12px] text-amber-600">
            Exam has been scheduled. Record how the applicant performed.
          </p>
        </div>
        <button
          onClick={() => onAction("assess")}
          className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-90"
        >
          Record now
        </button>
      </div>
    );
  }

  if (app.status === "exam_scheduled" && app.assessmentRating) {
    return (
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <UserCheck className="h-[18px] w-[18px] shrink-0 text-brand-green" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-green-800">
            Assessment recorded — ready for a decision
          </p>
          <p className="text-[12px] text-green-600">
            Use the Admit or Reject buttons above to finalise this application.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

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

// ─── Main component ─────────────────────────────────────────────────────────────

export default function ApplicationDetail({
  id,
  backPath = "/school/dashboard/applications",
}: {
  id: string;
  backPath?: string;
}) {
  const router = useRouter();
  const { data: app, isPending: loading } = useApplication(id);
  const [modal, setModal] = useState<Modal>(null);
  const [done, setDone] = useState<
    "admitted" | "rejected" | "scheduled" | "assessed" | null
  >(null);

  // Each action mutation invalidates the application query, so the view refetches
  // the authoritative state — we only flip the success banner here.
  function handleModalDone(
    type: "scheduled" | "rejected" | "assessed" | "admitted"
  ) {
    setModal(null);
    setDone(type);
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
  const isTerminal = app.status === "admitted" || app.status === "not_admitted";
  const activeStep = getActiveStep(app);

  // Action buttons depend on pipeline stage
  const showSchedule = app.status === "under_review";
  const showAssess = app.status === "exam_scheduled" && !app.assessmentRating;
  const showAdmit = app.status === "exam_scheduled" && !!app.assessmentRating;
  const showReject =
    app.status === "under_review" || app.status === "exam_scheduled";

  return (
    <>
      {/* Back */}
      <button
        onClick={() => router.push(backPath)}
        className="mb-5 flex items-center gap-[6px] text-[13px] text-grey-text hover:text-dark-blue"
      >
        <ArrowLeft className="h-[14px] w-[14px]" /> Back to Applications
      </button>

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] font-semibold text-dark-blue">
              {childName}
            </h1>
            <AppStatusChip status={app.status} />
          </div>
          <p className="mt-1 text-[13px] text-grey-text">
            {app.admissionNumber ? (
              <>
                <span className="font-medium text-brand-green">
                  Admission No: {app.admissionNumber}
                </span>
                {" · "}App. Ref: {app.referenceNumber}
              </>
            ) : (
              <>App. No: {app.referenceNumber}</>
            )}
            {" · Applied "}
            {new Date(app.submittedAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Action buttons — context-sequenced */}
        {!isTerminal && (
          <div className="flex flex-wrap gap-2">
            {showSchedule && (
              <button
                onClick={() => setModal("schedule")}
                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-[13px] font-medium text-blue-700 hover:bg-blue-100"
              >
                Schedule Exam
              </button>
            )}
            {showAssess && (
              <button
                onClick={() => setModal("assess")}
                className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-100"
              >
                Record Assessment
              </button>
            )}
            {showAdmit && (
              <button
                onClick={() => setModal("admit")}
                className="rounded-lg bg-brand-green px-4 py-2 text-[13px] font-medium text-white hover:opacity-90"
              >
                Admit
              </button>
            )}
            {showReject && (
              <button
                onClick={() => setModal("reject")}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-medium text-[#e84040] hover:bg-red-100"
              >
                Reject
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pipeline progress */}
      <div className="mb-6 overflow-hidden rounded-xl border border-border-default bg-white px-6 py-4">
        <div className="flex items-center">
          {PIPELINE.map((step, idx) => {
            const done = step.isDone(app);
            const active = idx === activeStep;
            return (
              <div key={step.key} className="flex flex-1 items-center min-w-0">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  {done ? (
                    <CheckCircle2
                      className={`h-[20px] w-[20px] ${
                        active ? "text-brand-green" : "text-brand-green"
                      }`}
                    />
                  ) : (
                    <Circle
                      className={`h-[20px] w-[20px] ${
                        active ? "text-brand-green" : "text-[#d1d5db]"
                      }`}
                    />
                  )}
                  <span
                    className={`text-[11px] font-medium whitespace-nowrap ${
                      done || active ? "text-dark-blue" : "text-[#9ca3af]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < PIPELINE.length - 1 && (
                  <ChevronRight
                    className={`mx-2 h-[14px] w-[14px] shrink-0 ${
                      PIPELINE[idx + 1].isDone(app)
                        ? "text-brand-green"
                        : "text-[#d1d5db]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next-action callout */}
      {!isTerminal && <NextActionBanner app={app} onAction={setModal} />}

      {/* Outcome banners */}
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

        {/* Right column: payment + exam + assessment + outcome */}
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

          {/* Exam details — shown whenever an exam was scheduled, regardless of current status */}
          {app.examDate && (
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
      {modal === "admit" && (
        <AdmitModal
          applicationId={app.id}
          childName={childName}
          onDone={() => handleModalDone("admitted")}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
