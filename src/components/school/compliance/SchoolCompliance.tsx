"use client";

import { useEffect, useState, useRef } from "react";
import {
  ChevronRight,
  Upload,
  Trash2,
  ExternalLink,
  UserCheck,
  UserPlus,
  MapPin,
  Navigation,
  Link2,
} from "lucide-react";
import { inviteProprietor } from "@/src/lib/api/schools";
import {
  getComplianceRecord,
  updateComplianceStep,
} from "@/src/lib/api/compliance";
import { useAuth } from "@/src/context/AuthContext";
import type { StepStatus, ComplianceStep } from "@/src/types/compliance";

// Section is just a ComplianceStep
type Section = ComplianceStep;

const TIPS: Record<
  string,
  { heading: string; bullets: string[]; note?: string }
> = {
  school_profile: {
    heading: "School Profile",
    bullets: [
      "Use the exact legal name of your school",
      "Address must match your CAC registration",
      "Ensure your phone number is reachable",
    ],
    note: "You can update these details before final submission.",
  },
  contact_setup: {
    heading: "Contact Setup",
    bullets: [
      "Enter the primary admin contact for the school",
      "This email will receive all platform notifications",
      "Phone number must be active and reachable",
    ],
  },
  proprietor: {
    heading: "Identity Verification",
    bullets: [
      "Verification is powered by Dojah",
      "Have your BVN or NIN ready",
      "Ensure your face is well-lit for liveness check",
      "The name must match your ID document exactly",
    ],
    note: "Your data is encrypted and never shared with third parties.",
  },
  business_registration: {
    heading: "Please upload documents that:",
    bullets: [
      "Are government-issued",
      "Are full-sized, original, and unedited",
      "Are in JPG, JPEG, PNG, or PDF format",
    ],
    note: "Address on your CAC must match the address entered above.",
  },
  review: {
    heading: "Before you submit",
    bullets: [
      "Review all sections for accuracy",
      "Ensure all documents are clear and readable",
      "Approval typically takes 1–2 business days",
    ],
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StepStatus }) {
  const map: Record<StepStatus, { label: string; cls: string }> = {
    not_started: { label: "Not Started", cls: "bg-[#f3f4f6] text-[#6b7280]" },
    in_progress: { label: "In Progress", cls: "bg-[#fef3c7] text-[#b45309]" },
    pending: { label: "Under Review", cls: "bg-[#dbeafe] text-[#1d4ed8]" },
    verified: { label: "Approved", cls: "bg-[#dcfce7] text-[#15803d]" },
  };
  const { label, cls } = map[status];
  return (
    <span
      className={`inline-block rounded-full px-[10px] py-[3px] text-[11px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

function FileUploadRow({
  label,
  file,
  onUpload,
  onRemove,
}: {
  label: string;
  file: File | null;
  onUpload: (f: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-between rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-3">
      {file ? (
        <span className="text-[13px] font-medium text-brand-green truncate max-w-[260px]">
          {file.name}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 text-[13px] font-medium text-brand-green hover:underline"
        >
          <Upload className="h-[14px] w-[14px]" />
          {label}
        </button>
      )}
      {file ? (
        <button type="button" onClick={onRemove} aria-label="Remove file">
          <Trash2 className="h-[16px] w-[16px] text-[#ef4444] hover:text-[#dc2626]" />
        </button>
      ) : (
        <Trash2 className="h-[16px] w-[16px] text-[#d1d5db]" />
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
        }}
      />
    </div>
  );
}

// ─── Section forms ────────────────────────────────────────────────────────────

function SchoolProfileForm({ onSave }: { onSave: () => void }) {
  const TYPES = [
    { value: "nursery", label: "Nursery / Creche" },
    { value: "primary", label: "Primary School" },
    { value: "secondary", label: "Secondary School" },
    { value: "combined", label: "Combined (Nursery–Secondary)" },
  ];
  const STATES = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT (Abuja)",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const inputCls =
    "h-[46px] w-full rounded-[8px] border border-[#e5e7eb] bg-white px-4 text-[14px] text-text-heading outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20";
  const selectCls = `${inputCls} appearance-none cursor-pointer`;
  const labelCls = "mb-1.5 block text-[13px] font-medium text-text-heading";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className={labelCls}>School Name</label>
        <input className={inputCls} placeholder="e.g. Greenfield Academy" />
      </div>
      <div>
        <label className={labelCls}>School Type</label>
        <select className={selectCls} defaultValue="">
          <option value="" disabled>
            Select school type
          </option>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>School Phone</label>
        <input className={inputCls} placeholder="e.g. 08012345678" type="tel" />
      </div>
      <div>
        <label className={labelCls}>School Email</label>
        <input
          className={inputCls}
          placeholder="e.g. info@greenfield.com"
          type="email"
        />
      </div>
      <div>
        <label className={labelCls}>Full Address</label>
        <input
          className={inputCls}
          placeholder="e.g. 12 Adeola Odeku Street, Victoria Island"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>City</label>
          <input className={inputCls} placeholder="e.g. Lagos" />
        </div>
        <div>
          <label className={labelCls}>State</label>
          <select className={selectCls} defaultValue="">
            <option value="" disabled>
              Select state
            </option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={onSave}
        className="mt-2 h-[46px] w-full rounded-[8px] bg-brand-green text-[14px] font-medium text-white transition-opacity hover:opacity-90"
      >
        Save & Continue
      </button>
    </div>
  );
}

type LocationData = { lat: number; lng: number } | null;

function ContactSetupForm({ onSave }: { onSave: () => void }) {
  const [mapsUrl, setMapsUrl] = useState("");
  const [location, setLocation] = useState<LocationData>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");

  const inputCls =
    "h-[46px] w-full rounded-[8px] border border-[#e5e7eb] bg-white px-4 text-[14px] text-text-heading outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20";
  const labelCls = "mb-1.5 block text-[13px] font-medium text-text-heading";

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError(
          "Could not get your location. Please allow location access or paste a Google Maps link instead."
        );
        setLocating(false);
      }
    );
  }

  function handleMapsUrl(val: string) {
    setMapsUrl(val);
    setLocation(null);
    // Extract @lat,lng from a Google Maps URL if present
    const match = val.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      setLocation({ lat: parseFloat(match[1]), lng: parseFloat(match[2]) });
    }
  }

  const locationSet = !!location;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Contact Name</label>
          <input className={inputCls} placeholder="e.g. Chukwuemeka Okonkwo" />
        </div>
        <div>
          <label className={labelCls}>Position / Title</label>
          <input className={inputCls} placeholder="e.g. Principal, Director" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Official Email</label>
          <input
            className={inputCls}
            placeholder="e.g. info@greenfield.com"
            type="email"
          />
        </div>
        <div>
          <label className={labelCls}>Support Email</label>
          <input
            className={inputCls}
            placeholder="e.g. support@greenfield.com"
            type="email"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Phone Number</label>
          <input
            className={inputCls}
            placeholder="e.g. 08012345678"
            type="tel"
          />
        </div>
        <div>
          <label className={labelCls}>Website (optional)</label>
          <input
            className={inputCls}
            placeholder="e.g. https://greenfield.edu.ng"
            type="url"
          />
        </div>
      </div>

      {/* Digital proof of address */}
      <div>
        <label className={labelCls}>
          School Location{" "}
          <span className="font-normal text-text-body">— proof of address</span>
        </label>
        <p className="mb-3 text-[12px] text-text-body">
          Instead of uploading a document, share your school&apos;s exact
          location digitally. Either paste your Google Maps link or use your
          device&apos;s GPS.
        </p>

        <div className="flex flex-col gap-3">
          {/* GPS button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="flex h-[46px] items-center gap-2 rounded-[8px] border border-[#e5e7eb] bg-white px-4 text-[13.5px] font-medium text-text-heading transition-colors hover:border-brand-green hover:text-brand-green disabled:opacity-60"
          >
            <Navigation className="h-[16px] w-[16px] shrink-0" />
            {locating ? "Getting location…" : "Use my current location (GPS)"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e5e7eb]" />
            <span className="text-[12px] text-text-body">or</span>
            <div className="h-px flex-1 bg-[#e5e7eb]" />
          </div>

          {/* Google Maps URL */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Link2 className="h-[16px] w-[16px] text-[#9ca3af]" />
            </div>
            <input
              className="h-[46px] w-full rounded-[8px] border border-[#e5e7eb] bg-white pl-9 pr-4 text-[13.5px] text-text-heading outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
              placeholder="Paste Google Maps link — e.g. https://maps.app.goo.gl/…"
              value={mapsUrl}
              onChange={(e) => handleMapsUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Error */}
        {locError && (
          <p className="mt-2 text-[12px] text-[#ef4444]">{locError}</p>
        )}

        {/* Confirmed location */}
        {locationSet && (
          <div className="mt-3 flex items-center gap-3 rounded-[8px] border border-green-200 bg-green-50 px-4 py-3">
            <MapPin className="h-[18px] w-[18px] shrink-0 text-brand-green" />
            <div>
              <p className="text-[13px] font-medium text-text-heading">
                Location captured
              </p>
              <p className="text-[12px] text-text-body">
                {location!.lat.toFixed(6)}, {location!.lng.toFixed(6)}
              </p>
            </div>
            <a
              href={`https://www.google.com/maps?q=${location!.lat},${location!.lng}`}
              target="_blank"
              rel="noreferrer"
              className="ml-auto text-[12px] font-medium text-brand-green hover:underline"
            >
              View on map ↗
            </a>
          </div>
        )}
      </div>

      <button
        onClick={onSave}
        className="mt-2 h-[46px] w-full rounded-[8px] bg-brand-green text-[14px] font-medium text-white transition-opacity hover:opacity-90"
      >
        Save & Continue
      </button>
    </div>
  );
}

type ProprietorPath = "self" | "other" | null;

function ProprietorForm({ onSave }: { onSave: () => void }) {
  const [path, setPath] = useState<ProprietorPath>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [invited, setInvited] = useState(false);

  const inputCls =
    "h-[46px] w-full rounded-[8px] border border-[#e5e7eb] bg-white px-4 text-[14px] text-text-heading outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20";
  const labelCls = "mb-1.5 block text-[13px] font-medium text-text-heading";

  async function handleSendInvite() {
    if (!name.trim() || !email.trim()) return;
    setSending(true);
    await inviteProprietor({ name, email, phone: "" });
    setSending(false);
    setInvited(true);
    onSave();
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Path selector */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPath("self")}
          className={`flex flex-col items-center gap-2 rounded-[10px] border-2 px-4 py-5 text-center transition-colors ${
            path === "self"
              ? "border-brand-green bg-[#f0faf4]"
              : "border-[#e5e7eb] hover:border-brand-green/40"
          }`}
        >
          <UserCheck
            className={`h-[28px] w-[28px] ${path === "self" ? "text-brand-green" : "text-[#9ca3af]"}`}
          />
          <span className="text-[13px] font-medium text-text-heading">
            I am the proprietor
          </span>
          <span className="text-[11px] text-text-body">
            Verify your identity with Dojah
          </span>
        </button>

        <button
          type="button"
          onClick={() => setPath("other")}
          className={`flex flex-col items-center gap-2 rounded-[10px] border-2 px-4 py-5 text-center transition-colors ${
            path === "other"
              ? "border-brand-green bg-[#f0faf4]"
              : "border-[#e5e7eb] hover:border-brand-green/40"
          }`}
        >
          <UserPlus
            className={`h-[28px] w-[28px] ${path === "other" ? "text-brand-green" : "text-[#9ca3af]"}`}
          />
          <span className="text-[13px] font-medium text-text-heading">
            Someone else is the proprietor
          </span>
          <span className="text-[11px] text-text-body">
            Send them a verification invite
          </span>
        </button>
      </div>

      {/* Path A — self KYC via Dojah */}
      {path === "self" && (
        <div className="rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-5">
          <p className="text-[13px] text-text-body">
            You will need a valid government-issued ID — BVN, NIN, or Passport.
            Have it ready before starting.
          </p>
          <button
            onClick={onSave}
            className="mt-4 flex h-[44px] items-center gap-2 rounded-[8px] bg-brand-green px-6 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            <ExternalLink className="h-[15px] w-[15px]" />
            Start Verification with Dojah
          </button>
          <p className="mt-3 text-[11px] text-text-body opacity-70">
            Your data is encrypted and never shared with third parties.
          </p>
        </div>
      )}

      {/* Path B — invite someone else */}
      {path === "other" && (
        <>
          {invited ? (
            <div className="flex items-start gap-3 rounded-[10px] border border-green-200 bg-green-50 px-5 py-4">
              <div className="mt-0.5 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-brand-green text-white text-[11px] font-bold">
                ✓
              </div>
              <div>
                <p className="text-[14px] font-medium text-text-heading">
                  Invitation sent to {name}
                </p>
                <p className="mt-0.5 text-[12px] text-text-body">
                  They will receive an email at{" "}
                  <span className="font-medium">{email}</span> with a link to
                  verify their identity via Dojah. No platform account needed.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 rounded-[10px] border border-[#e5e7eb] p-5">
              <p className="text-[13px] text-text-body">
                Enter the proprietor&apos;s details. They will receive an email
                with a secure link to complete identity verification — no
                platform account required.
              </p>
              <div>
                <label className={labelCls}>Proprietor&apos;s full name</label>
                <input
                  className={inputCls}
                  placeholder="e.g. Mrs. Grace Okafor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Proprietor&apos;s email address
                </label>
                <input
                  className={inputCls}
                  type="email"
                  placeholder="e.g. grace@greenfield.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={handleSendInvite}
                disabled={!name.trim() || !email.trim() || sending}
                className="h-[46px] w-full rounded-[8px] bg-brand-green text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? "Sending invite…" : "Send Verification Invite"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function BusinessRegistrationForm({ onSave }: { onSave: () => void }) {
  const [docs, setDocs] = useState<Record<string, File | null>>({
    cac: null,
    tin_cert: null,
    status_report: null,
    cac7: null,
  });

  const setDoc = (key: string, file: File | null) =>
    setDocs((prev) => ({ ...prev, [key]: file }));

  const inputCls =
    "h-[46px] w-full rounded-[8px] border border-[#e5e7eb] bg-white px-4 text-[14px] text-text-heading outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20";
  const labelCls = "mb-1.5 block text-[13px] font-medium text-text-heading";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className={labelCls}>
          Business Name (as registered with CAC)
        </label>
        <input className={inputCls} placeholder="e.g. Greenfield Academy Ltd" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Tax Identification Number (TIN)</label>
          <input className={inputCls} placeholder="e.g. 12345678-0001" />
        </div>
        <div>
          <label className={labelCls}>RC Number / BN Number</label>
          <input className={inputCls} placeholder="e.g. RC1234567" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Certificate of Incorporation</label>
          <FileUploadRow
            label="Upload Certificate"
            file={docs.cac}
            onUpload={(f) => setDoc("cac", f)}
            onRemove={() => setDoc("cac", null)}
          />
        </div>
        <div>
          <label className={labelCls}>Resolution To Open Account</label>
          <FileUploadRow
            label="Upload Resolution"
            file={docs.tin_cert}
            onUpload={(f) => setDoc("tin_cert", f)}
            onRemove={() => setDoc("tin_cert", null)}
          />
        </div>
        <div>
          <label className={labelCls}>Status Report</label>
          <FileUploadRow
            label="Upload Status Report"
            file={docs.status_report}
            onUpload={(f) => setDoc("status_report", f)}
            onRemove={() => setDoc("status_report", null)}
          />
        </div>
        <div>
          <label className={labelCls}>CAC 7 (Particulars of Director)</label>
          <FileUploadRow
            label="Upload CAC 7"
            file={docs.cac7}
            onUpload={(f) => setDoc("cac7", f)}
            onRemove={() => setDoc("cac7", null)}
          />
        </div>
      </div>

      <button
        onClick={onSave}
        className="mt-2 h-[46px] w-full rounded-[8px] bg-brand-green text-[14px] font-medium text-white transition-opacity hover:opacity-90"
      >
        Save & Continue
      </button>
    </div>
  );
}

function ReviewForm({
  sections,
  onSubmit,
}: {
  sections: Section[];
  onSubmit: () => void;
}) {
  const allDone = sections
    .filter((s) => s.id !== "review")
    .every((s) => s.status === "verified");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        {sections
          .filter((s) => s.id !== "review")
          .map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-white px-5 py-4"
            >
              <span className="text-[14px] font-medium text-text-heading">
                {s.label}
              </span>
              <StatusBadge status={s.status} />
            </div>
          ))}
      </div>

      {!allDone && (
        <div className="rounded-[10px] bg-[#fef3c7] px-5 py-4 text-[13px] text-[#92400e]">
          Please complete all sections above before submitting for review.
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={!allDone}
        className="h-[46px] w-full rounded-[8px] bg-brand-green text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Submit for Review
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const FALLBACK_SECTIONS: Section[] = [
  {
    id: "school_profile",
    label: "School Profile",
    status: "not_started",
    required: true,
  },
  {
    id: "contact_setup",
    label: "Contact Setup",
    status: "not_started",
    required: true,
  },
  {
    id: "proprietor",
    label: "Proprietor / Owner",
    status: "not_started",
    required: true,
  },
  {
    id: "business_registration",
    label: "Business Registration",
    status: "not_started",
    required: true,
  },
  {
    id: "review",
    label: "Review & Submit",
    status: "not_started",
    required: true,
  },
];

export default function SchoolCompliance() {
  const { user } = useAuth();
  const [sections, setSections] = useState<Section[]>(FALLBACK_SECTIONS);
  const [activeId, setActiveId] = useState(FALLBACK_SECTIONS[0].id);

  useEffect(() => {
    let cancelled = false;
    getComplianceRecord("school", user?.schoolId ?? "sch-001").then(
      (record) => {
        if (cancelled) return;
        setSections(record.steps as Section[]);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [user?.schoolId]);

  const handleSectionSave = async (stepId: string) => {
    const updated = await updateComplianceStep(
      "school",
      user?.schoolId ?? "sch-001",
      stepId,
      "in_progress"
    );
    setSections(updated.steps as Section[]);
    const ids = FALLBACK_SECTIONS.map((s) => s.id);
    const nextIdx = ids.indexOf(stepId) + 1;
    if (nextIdx < ids.length) setActiveId(ids[nextIdx]);
  };

  const tips = TIPS[activeId];

  const sectionTitles: Record<string, { title: string; subtitle: string }> = {
    school_profile: {
      title: "School Profile",
      subtitle: "Enter your school's basic information",
    },
    contact_setup: {
      title: "Contact Setup",
      subtitle: "Enter the primary contact for your school account",
    },
    proprietor: {
      title: "Proprietor / Owner Verification",
      subtitle: "Verify the identity of the school proprietor or director",
    },
    business_registration: {
      title: "Business Registration Details",
      subtitle:
        "Enter your school's CAC registration details and upload documents",
    },
    review: {
      title: "Review & Submit",
      subtitle: "Review all sections before submitting for approval",
    },
  };

  return (
    <div className="flex h-full">
      {/* Left nav */}
      <div className="w-[260px] shrink-0 border-r border-[#e5e7eb] bg-white py-6">
        <div className="flex flex-col gap-1 px-4">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveId(section.id)}
                className={`flex w-full items-center justify-between rounded-[8px] px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "border-l-[3px] border-brand-green bg-[#f0faf4] pl-[13px]"
                    : "hover:bg-[#f9fafb]"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span
                    className={`text-[14px] font-medium ${isActive ? "text-brand-green" : "text-text-heading"}`}
                  >
                    {section.label}
                  </span>
                  <StatusBadge status={section.status} />
                </div>
                <ChevronRight
                  className={`h-[16px] w-[16px] shrink-0 ${isActive ? "text-brand-green" : "text-[#9ca3af]"}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Center: form */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <h2 className="text-[20px] font-semibold text-text-heading">
          {sectionTitles[activeId].title}
        </h2>
        <p className="mt-1 mb-7 text-[13px] text-text-body">
          {sectionTitles[activeId].subtitle}
        </p>

        {activeId === "school_profile" && (
          <SchoolProfileForm
            onSave={() => handleSectionSave("school_profile")}
          />
        )}
        {activeId === "contact_setup" && (
          <ContactSetupForm onSave={() => handleSectionSave("contact_setup")} />
        )}
        {activeId === "proprietor" && (
          <ProprietorForm onSave={() => handleSectionSave("proprietor")} />
        )}
        {activeId === "business_registration" && (
          <BusinessRegistrationForm
            onSave={() => handleSectionSave("business_registration")}
          />
        )}
        {activeId === "review" && (
          <ReviewForm
            sections={sections}
            onSubmit={() => handleSectionSave("review")}
          />
        )}
      </div>

      {/* Right tips panel */}
      <div className="w-[260px] shrink-0 border-l border-[#e5e7eb] bg-[#f9fafb] px-6 py-8">
        <p className="mb-3 text-[13px] font-semibold text-text-heading">
          {tips.heading}
        </p>
        <ul className="flex flex-col gap-2">
          {tips.bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-[13px] text-text-body"
            >
              <span className="mt-[3px] h-[6px] w-[6px] shrink-0 rounded-full bg-brand-green" />
              {b}
            </li>
          ))}
        </ul>
        {tips.note && (
          <p className="mt-4 text-[12px] text-text-body opacity-70">
            {tips.note}
          </p>
        )}
      </div>
    </div>
  );
}
