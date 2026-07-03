"use client";

import { useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Upload,
  Trash2,
  Camera,
  MapPin,
  Navigation,
  Link2,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { useAppSelector } from "@/src/lib/store/hooks";
import { useKycStatus, useSubmitKyc } from "@/src/lib/api/useSchoolKyc";
import { kycSchema } from "@/src/lib/api/schoolKyc";
import type { KycSubmission } from "@/src/lib/api/schoolKyc";
import type { StepStatus } from "@/src/types/compliance";

// ─── Form state (lifted to the parent so it survives section navigation) ───────

interface KycForm {
  // School profile
  name: string;
  type: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  // Contact setup (UI-only — no backend home yet)
  contactName: string;
  position: string;
  officialEmail: string;
  contactPhone: string;
  mapsUrl: string;
  lat: number | null;
  lng: number | null;
  // Proprietor identity
  proprietorFirstName: string;
  proprietorMiddleName: string;
  proprietorLastName: string;
  nin: string;
  bvn: string;
  proprietorAddress: string;
  faceDone: boolean;
  // Business registration + settlement account
  businessName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const SECTION_IDS = [
  "school_profile",
  "contact_setup",
  "proprietor",
  "business_registration",
  "review",
] as const;
type SectionId = (typeof SECTION_IDS)[number];

const SECTION_LABELS: Record<SectionId, string> = {
  school_profile: "School Profile",
  contact_setup: "Contact Setup",
  proprietor: "Proprietor / Owner",
  business_registration: "Business Registration",
  review: "Review & Submit",
};

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
      "Have your BVN and NIN ready",
      "The name must match your ID document exactly",
      "NIN and BVN must each be 11 digits",
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
      "Ensure your CAC document is clear and readable",
      "Approval typically takes 1–2 business days",
    ],
  },
};

const inputCls =
  "h-[46px] w-full rounded-[8px] border border-[#e5e7eb] bg-white px-4 text-[14px] text-text-heading outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20";
const selectCls = `${inputCls} appearance-none cursor-pointer`;
const labelCls = "mb-1.5 block text-[13px] font-medium text-text-heading";

const SCHOOL_TYPE_OPTIONS = [
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

// ─── Shared sub-components ─────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StepStatus }) {
  const map: Record<StepStatus, { label: string; cls: string }> = {
    not_started: { label: "Not Started", cls: "bg-[#f3f4f6] text-[#6b7280]" },
    in_progress: { label: "Ready", cls: "bg-[#fef3c7] text-[#b45309]" },
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

// ─── Section forms (controlled by the parent) ─────────────────────────────────

type SectionProps = {
  form: KycForm;
  set: (patch: Partial<KycForm>) => void;
  onNext: () => void;
};

function SchoolProfileForm({ form, set, onNext }: SectionProps) {
  const canSave =
    form.name.trim() &&
    form.type &&
    form.phone.trim() &&
    form.email.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.state;

  return (
    <div className="flex flex-col gap-5">
      <Field label="School Name">
        <input
          className={inputCls}
          placeholder="e.g. Greenfield Academy"
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
        />
      </Field>
      <Field label="School Type">
        <select
          className={selectCls}
          value={form.type}
          onChange={(e) => set({ type: e.target.value })}
        >
          <option value="" disabled>
            Select school type
          </option>
          {SCHOOL_TYPE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="School Phone">
        <input
          className={inputCls}
          placeholder="e.g. 08012345678"
          type="tel"
          value={form.phone}
          onChange={(e) =>
            set({ phone: e.target.value.replace(/[^\d+]/g, "") })
          }
        />
      </Field>
      <Field label="School Email">
        <input
          className={inputCls}
          placeholder="e.g. info@greenfield.com"
          type="email"
          value={form.email}
          onChange={(e) => set({ email: e.target.value })}
        />
      </Field>
      <Field label="Full Address">
        <input
          className={inputCls}
          placeholder="e.g. 12 Adeola Odeku Street, Victoria Island"
          value={form.address}
          onChange={(e) => set({ address: e.target.value })}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="City">
          <input
            className={inputCls}
            placeholder="e.g. Lagos"
            value={form.city}
            onChange={(e) => set({ city: e.target.value })}
          />
        </Field>
        <Field label="State">
          <select
            className={selectCls}
            value={form.state}
            onChange={(e) => set({ state: e.target.value })}
          >
            <option value="" disabled>
              Select state
            </option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <SaveButton disabled={!canSave} onClick={onNext} />
    </div>
  );
}

function ContactSetupForm({ form, set, onNext }: SectionProps) {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError(
          "Could not get your location. Allow location access or paste a Google Maps link instead."
        );
        setLocating(false);
      }
    );
  }

  function handleMapsUrl(val: string) {
    const match = val.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    set({
      mapsUrl: val,
      lat: match ? parseFloat(match[1]) : null,
      lng: match ? parseFloat(match[2]) : null,
    });
  }

  const locationSet = form.lat !== null && form.lng !== null;
  const canSave =
    form.contactName.trim() &&
    form.position.trim() &&
    form.officialEmail.trim() &&
    form.contactPhone.trim() &&
    locationSet;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Contact Name">
          <input
            className={inputCls}
            placeholder="e.g. Chukwuemeka Okonkwo"
            value={form.contactName}
            onChange={(e) => set({ contactName: e.target.value })}
          />
        </Field>
        <Field label="Position / Title">
          <input
            className={inputCls}
            placeholder="e.g. Principal, Director"
            value={form.position}
            onChange={(e) => set({ position: e.target.value })}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Official Email">
          <input
            className={inputCls}
            placeholder="e.g. info@greenfield.com"
            type="email"
            value={form.officialEmail}
            onChange={(e) => set({ officialEmail: e.target.value })}
          />
        </Field>
        <Field label="Phone Number">
          <input
            className={inputCls}
            placeholder="e.g. 08012345678"
            type="tel"
            value={form.contactPhone}
            onChange={(e) =>
              set({ contactPhone: e.target.value.replace(/[^\d+]/g, "") })
            }
          />
        </Field>
      </div>

      <div>
        <label className={labelCls}>
          School Location{" "}
          <span className="font-normal text-text-body">— proof of address</span>
        </label>
        <p className="mb-3 text-[12px] text-text-body">
          Share your school&apos;s exact location digitally — use your
          device&apos;s GPS or paste a Google Maps link.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="flex h-[46px] items-center gap-2 rounded-[8px] border border-[#e5e7eb] bg-white px-4 text-[13.5px] font-medium text-text-heading transition-colors hover:border-brand-green hover:text-brand-green disabled:opacity-60"
          >
            <Navigation className="h-[16px] w-[16px] shrink-0" />
            {locating ? "Getting location…" : "Use my current location (GPS)"}
          </button>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e5e7eb]" />
            <span className="text-[12px] text-text-body">or</span>
            <div className="h-px flex-1 bg-[#e5e7eb]" />
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Link2 className="h-[16px] w-[16px] text-[#9ca3af]" />
            </div>
            <input
              className="h-[46px] w-full rounded-[8px] border border-[#e5e7eb] bg-white pl-9 pr-4 text-[13.5px] text-text-heading outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
              placeholder="Paste Google Maps link — e.g. https://maps.app.goo.gl/…"
              value={form.mapsUrl}
              onChange={(e) => handleMapsUrl(e.target.value)}
            />
          </div>
        </div>
        {locError && (
          <p className="mt-2 text-[12px] text-[#ef4444]">{locError}</p>
        )}
        {locationSet && (
          <div className="mt-3 flex items-center gap-3 rounded-[8px] border border-green-200 bg-green-50 px-4 py-3">
            <MapPin className="h-[18px] w-[18px] shrink-0 text-brand-green" />
            <div>
              <p className="text-[13px] font-medium text-text-heading">
                Location captured
              </p>
              <p className="text-[12px] text-text-body">
                {form.lat!.toFixed(6)}, {form.lng!.toFixed(6)}
              </p>
            </div>
          </div>
        )}
      </div>
      <SaveButton disabled={!canSave} onClick={onNext} />
    </div>
  );
}

function ProprietorForm({ form, set, onNext }: SectionProps) {
  const idReady = form.nin.length === 11 && form.bvn.length === 11;
  const canSave =
    idReady &&
    form.proprietorFirstName.trim().length > 0 &&
    form.proprietorLastName.trim().length > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name">
          <input
            className={inputCls}
            placeholder="e.g. Chidi"
            value={form.proprietorFirstName}
            onChange={(e) => set({ proprietorFirstName: e.target.value })}
          />
        </Field>
        <Field label="Last Name">
          <input
            className={inputCls}
            placeholder="e.g. Okonkwo"
            value={form.proprietorLastName}
            onChange={(e) => set({ proprietorLastName: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Middle Name (optional)">
        <input
          className={inputCls}
          placeholder="e.g. Emeka"
          value={form.proprietorMiddleName}
          onChange={(e) => set({ proprietorMiddleName: e.target.value })}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="National Identity Number (NIN)">
          <input
            className={inputCls}
            placeholder="Enter 11-digit NIN"
            maxLength={11}
            value={form.nin}
            onChange={(e) => set({ nin: e.target.value.replace(/\D/g, "") })}
          />
        </Field>
        <Field label="Bank Verification Number (BVN)">
          <input
            className={inputCls}
            placeholder="Enter 11-digit BVN"
            maxLength={11}
            value={form.bvn}
            onChange={(e) => set({ bvn: e.target.value.replace(/\D/g, "") })}
          />
        </Field>
      </div>
      <Field label="Proprietor Address (optional)">
        <input
          className={inputCls}
          placeholder="Residential address"
          value={form.proprietorAddress}
          onChange={(e) => set({ proprietorAddress: e.target.value })}
        />
      </Field>

      <div>
        <p className={labelCls}>Liveliness Check (optional)</p>
        <div className="flex items-center gap-4 rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-3">
          <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#f3f4f6]">
            <Camera className="h-[20px] w-[20px] text-[#9ca3af]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-text-heading">
              Face verification
            </p>
            <p className="text-[12px] text-text-body">
              {idReady ? "Click to start face check" : "Enter NIN & BVN first"}
            </p>
          </div>
          {form.faceDone ? (
            <span className="text-[12px] font-medium text-brand-green">
              Done ✓
            </span>
          ) : (
            <button
              type="button"
              disabled={!idReady}
              onClick={() => set({ faceDone: true })}
              className="rounded-[6px] border border-[#e5e7eb] px-4 py-1.5 text-[12px] font-medium text-text-heading transition-colors hover:border-brand-green hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start check
            </button>
          )}
        </div>
      </div>
      <SaveButton disabled={!canSave} onClick={onNext} />
    </div>
  );
}

function BusinessRegistrationForm({
  form,
  set,
  cacFile,
  setCacFile,
  onNext,
}: SectionProps & {
  cacFile: File | null;
  setCacFile: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canSave =
    !!cacFile &&
    form.bankName.trim() &&
    form.accountNumber.length === 10 &&
    form.accountName.trim();

  return (
    <div className="flex flex-col gap-5">
      <Field label="Business Name (as registered with CAC) — optional">
        <input
          className={inputCls}
          placeholder="e.g. Greenfield Academy Ltd"
          value={form.businessName}
          onChange={(e) => set({ businessName: e.target.value })}
        />
      </Field>

      <div>
        <label className={labelCls}>Certificate of Incorporation (CAC)</label>
        <div className="flex items-center justify-between rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-3">
          {cacFile ? (
            <span className="max-w-[260px] truncate text-[13px] font-medium text-brand-green">
              {cacFile.name}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 text-[13px] font-medium text-brand-green hover:underline"
            >
              <Upload className="h-[14px] w-[14px]" />
              Upload Certificate
            </button>
          )}
          {cacFile ? (
            <button
              type="button"
              onClick={() => setCacFile(null)}
              aria-label="Remove file"
            >
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
              if (f) setCacFile(f);
            }}
          />
        </div>
      </div>

      <div className="border-t border-[#e5e7eb] pt-1">
        <p className="mb-1 text-[14px] font-semibold text-text-heading">
          Settlement account
        </p>
        <p className="mb-4 text-[12px] text-text-body">
          Where parent payments are paid out.
        </p>
        <div className="flex flex-col gap-5">
          <Field label="Bank Name">
            <input
              className={inputCls}
              placeholder="e.g. GTBank"
              value={form.bankName}
              onChange={(e) => set({ bankName: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Account Number">
              <input
                className={inputCls}
                placeholder="10-digit NUBAN"
                maxLength={10}
                value={form.accountNumber}
                onChange={(e) =>
                  set({ accountNumber: e.target.value.replace(/\D/g, "") })
                }
              />
            </Field>
            <Field label="Account Name">
              <input
                className={inputCls}
                placeholder="As it appears at the bank"
                value={form.accountName}
                onChange={(e) => set({ accountName: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </div>
      <SaveButton disabled={!canSave} onClick={onNext} />
    </div>
  );
}

function SaveButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-2 h-[46px] w-full rounded-[8px] bg-brand-green text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Save & Continue
    </button>
  );
}

function ReviewForm({
  statusOf,
  allReady,
  submitting,
  onSubmit,
}: {
  statusOf: (id: SectionId) => StepStatus;
  allReady: boolean;
  submitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        {SECTION_IDS.filter((id) => id !== "review").map((id) => (
          <div
            key={id}
            className="flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-white px-5 py-4"
          >
            <span className="text-[14px] font-medium text-text-heading">
              {SECTION_LABELS[id]}
            </span>
            <StatusBadge status={statusOf(id)} />
          </div>
        ))}
      </div>

      {!allReady && (
        <div className="rounded-[10px] bg-[#fef3c7] px-5 py-4 text-[13px] text-[#92400e]">
          Complete all sections above before submitting for review.
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={!allReady || submitting}
        className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[8px] bg-brand-green text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Submitting…" : "Submit for Review"}
      </button>
    </div>
  );
}

// ─── Submitted / decided status panel ─────────────────────────────────────────

function SubmittedPanel({
  kyc,
  onResubmit,
}: {
  kyc: KycSubmission;
  onResubmit: () => void;
}) {
  if (kyc.status === "approved") {
    return (
      <Panel
        icon={<CheckCircle2 className="h-12 w-12 text-brand-green" />}
        title="Your school is verified"
        body="You can now receive parent payments and appear in search results."
      />
    );
  }
  if (kyc.status === "rejected") {
    return (
      <Panel
        icon={<XCircle className="h-12 w-12 text-destructive" />}
        title="Verification was declined"
        body={
          kyc.schoolMessage ?? "Please review your details and submit again."
        }
        action={
          <button
            onClick={onResubmit}
            className="rounded-[8px] bg-brand-green px-5 py-2.5 text-[14px] font-medium text-white hover:opacity-90"
          >
            Edit & resubmit
          </button>
        }
      />
    );
  }
  return (
    <Panel
      icon={<Clock className="h-12 w-12 text-amber-500" />}
      title="Verification in progress"
      body="We're reviewing your submission — this usually takes 1–2 business days."
      meta={
        kyc.submittedAt
          ? `Submitted ${new Date(kyc.submittedAt).toLocaleDateString()}`
          : undefined
      }
    />
  );
}

function Panel({
  icon,
  title,
  body,
  meta,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  meta?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      {icon}
      <h2 className="text-[20px] font-semibold text-text-heading">{title}</h2>
      <p className="max-w-md text-[14px] text-text-body">{body}</p>
      {meta && <p className="text-[12px] text-grey-text">{meta}</p>}
      {action}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SchoolCompliance() {
  const owner = useAppSelector((s) => s.auth.user);
  const { data: kyc, isPending: kycLoading } = useKycStatus();
  const submit = useSubmitKyc();

  const [activeId, setActiveId] = useState<SectionId>("school_profile");
  const [cacFile, setCacFile] = useState<File | null>(null);
  const [editing, setEditing] = useState(false); // resubmit after rejection

  const [form, setForm] = useState<KycForm>(() => {
    const parts = (owner?.fullName ?? "").trim().split(/\s+/).filter(Boolean);
    return {
      name: "",
      type: "",
      phone: owner?.phone ? owner.phone.replace(/^\+234/, "0") : "",
      email: owner?.email ?? "",
      address: "",
      city: "",
      state: "",
      contactName: owner?.fullName ?? "",
      position: "",
      officialEmail: owner?.email ?? "",
      contactPhone: owner?.phone ? owner.phone.replace(/^\+234/, "0") : "",
      mapsUrl: "",
      lat: null,
      lng: null,
      proprietorFirstName: parts[0] ?? "",
      proprietorMiddleName:
        parts.length > 2 ? parts.slice(1, -1).join(" ") : "",
      proprietorLastName: parts.length > 1 ? parts[parts.length - 1] : "",
      nin: "",
      bvn: "",
      proprietorAddress: "",
      faceDone: false,
      businessName: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
    };
  });

  const set = (patch: Partial<KycForm>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  // A section is "ready" when its required fields are filled (client-side wizard gate).
  const ready = useMemo(
    () => ({
      school_profile: Boolean(
        form.name.trim() &&
        form.type &&
        form.phone.trim() &&
        form.email.trim() &&
        form.address.trim() &&
        form.city.trim() &&
        form.state
      ),
      contact_setup: Boolean(
        form.contactName.trim() &&
        form.position.trim() &&
        form.officialEmail.trim() &&
        form.contactPhone.trim() &&
        form.lat !== null &&
        form.lng !== null
      ),
      proprietor: Boolean(
        form.nin.length === 11 &&
        form.bvn.length === 11 &&
        form.proprietorFirstName.trim() &&
        form.proprietorLastName.trim()
      ),
      business_registration: Boolean(
        cacFile &&
        form.bankName.trim() &&
        form.accountNumber.length === 10 &&
        form.accountName.trim()
      ),
    }),
    [form, cacFile]
  );

  const allReady =
    ready.school_profile &&
    ready.contact_setup &&
    ready.proprietor &&
    ready.business_registration;

  const locked =
    !editing && (kyc?.status === "under_review" || kyc?.status === "approved");
  const decided = !editing && kyc && kyc.status !== "not_submitted";

  const statusOf = (id: SectionId): StepStatus => {
    if (locked) return kyc?.status === "approved" ? "verified" : "pending";
    if (id === "review") return allReady ? "in_progress" : "not_started";
    return ready[id as keyof typeof ready] ? "in_progress" : "not_started";
  };

  const goNext = (from: SectionId) => {
    const idx = SECTION_IDS.indexOf(from);
    if (idx < SECTION_IDS.length - 1) setActiveId(SECTION_IDS[idx + 1]);
  };

  const handleSubmit = async () => {
    const candidate = {
      name: form.name,
      type: form.type,
      address: form.address,
      city: form.city,
      state: form.state,
      phone: form.phone,
      email: form.email,
      proprietorFirstName: form.proprietorFirstName,
      proprietorMiddleName: form.proprietorMiddleName || undefined,
      proprietorLastName: form.proprietorLastName,
      proprietorNin: form.nin,
      proprietorBvn: form.bvn,
      bankName: form.bankName,
      accountNumber: form.accountNumber,
      accountName: form.accountName,
    };
    const parsed = kycSchema.safeParse(candidate);
    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ?? "Please check your details."
      );
      return;
    }
    if (!cacFile) {
      toast.error("Upload your CAC certificate.");
      setActiveId("business_registration");
      return;
    }
    try {
      await submit.mutateAsync({ input: parsed.data, file: cacFile });
      toast.success("KYC submitted — we'll review it shortly.");
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed.");
    }
  };

  const tips = TIPS[activeId];

  const sectionTitles: Record<SectionId, { title: string; subtitle: string }> =
    {
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
        title: "Business Registration & Settlement",
        subtitle: "Upload your CAC certificate and add your payout account",
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
          {SECTION_IDS.map((id) => {
            const isActive = id === activeId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveId(id)}
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
                    {SECTION_LABELS[id]}
                  </span>
                  <StatusBadge status={statusOf(id)} />
                </div>
                <ChevronRight
                  className={`h-[16px] w-[16px] shrink-0 ${isActive ? "text-brand-green" : "text-[#9ca3af]"}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Center */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {kycLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
          </div>
        ) : decided ? (
          <SubmittedPanel kyc={kyc!} onResubmit={() => setEditing(true)} />
        ) : (
          <>
            <h2 className="text-[20px] font-semibold text-text-heading">
              {sectionTitles[activeId].title}
            </h2>
            <p className="mt-1 mb-7 text-[13px] text-text-body">
              {sectionTitles[activeId].subtitle}
            </p>

            {activeId === "school_profile" && (
              <SchoolProfileForm
                form={form}
                set={set}
                onNext={() => goNext("school_profile")}
              />
            )}
            {activeId === "contact_setup" && (
              <ContactSetupForm
                form={form}
                set={set}
                onNext={() => goNext("contact_setup")}
              />
            )}
            {activeId === "proprietor" && (
              <ProprietorForm
                form={form}
                set={set}
                onNext={() => goNext("proprietor")}
              />
            )}
            {activeId === "business_registration" && (
              <BusinessRegistrationForm
                form={form}
                set={set}
                cacFile={cacFile}
                setCacFile={setCacFile}
                onNext={() => goNext("business_registration")}
              />
            )}
            {activeId === "review" && (
              <ReviewForm
                statusOf={statusOf}
                allReady={allReady}
                submitting={submit.isPending}
                onSubmit={handleSubmit}
              />
            )}
          </>
        )}
      </div>

      {/* Right tips */}
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
