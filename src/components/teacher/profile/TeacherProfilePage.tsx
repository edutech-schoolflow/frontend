"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Pencil,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";
import {
  getTeacherProfile,
  updateTeacherProfile,
} from "@/src/lib/api/teacherProfile";
import { useAuth } from "@/src/context/AuthContext";
import type { TeacherProfile } from "@/src/lib/api/teacherProfile";

function Avatar({ name, size = 72 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-[#1ca95c] font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {initials}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5">
      <div className="mt-0.5 flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#f3f4f6]">
        <Icon className="h-[15px] w-[15px] text-[#6b7280]" />
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#9ca3af]">
          {label}
        </p>
        <p className="mt-0.5 text-[14px] text-text-heading">{value}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-medium text-text-body">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[42px] w-full rounded-[8px] border px-3.5 text-[14px] text-text-heading focus:outline-none ${
          error
            ? "border-[#dc2626] focus:border-[#dc2626]"
            : "border-[#e5e7eb] focus:border-brand-green"
        }`}
      />
      {error && <p className="mt-1 text-[11px] text-[#dc2626]">{error}</p>}
    </div>
  );
}

export default function TeacherProfilePage() {
  const { user, setUser } = useAuth();

  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    getTeacherProfile(user?.id).then((p) => {
      if (cancelled) return;
      setProfile(p);
      if (p) {
        setFirstName(p.firstName);
        setLastName(p.lastName);
      }
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const openEdit = () => {
    if (!profile) return;
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Required";
    if (!lastName.trim()) e.lastName = "Required";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setSaving(true);
    const updated = await updateTeacherProfile(user?.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: profile!.email,
      phone: profile!.phone,
    });
    setProfile(updated);
    setUser({
      ...user!,
      name: `${updated.firstName} ${updated.lastName}`,
      email: updated.email,
      phone: updated.phone,
    });
    setEditing(false);
    setSaving(false);
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-[30px]">
        <p className="text-[14px] text-text-body">Profile not found.</p>
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const joinedDate = new Date(profile.joinedAt).toLocaleDateString("en-NG", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-[30px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          My Profile
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          Your personal and professional details.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left: identity card ─────────────────────────────────────── */}
        <div className="flex flex-col items-center rounded-[16px] border border-[#e5e7eb] bg-white px-6 py-8 text-center">
          <Avatar name={fullName} size={80} />
          <p className="mt-4 text-[18px] font-semibold text-text-heading">
            {fullName}
          </p>
          <p className="mt-1 text-[13px] text-text-body">{profile.position}</p>

          <span className="mt-3 rounded-full bg-[#f0fdf4] px-3 py-1 text-[12px] font-semibold text-[#16a34a]">
            Active
          </span>

          <div className="mt-6 w-full divide-y divide-[#f3f4f6] text-left">
            <InfoRow
              icon={Building2}
              label="School"
              value={profile.schoolName}
            />
            <InfoRow icon={User} label="Position" value={profile.position} />
            <InfoRow
              icon={ShieldCheck}
              label="Member since"
              value={joinedDate}
            />
          </div>
        </div>

        {/* ── Right: details + edit ────────────────────────────────────── */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          {/* Contact details card */}
          <div className="rounded-[16px] border border-[#e5e7eb] bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-text-heading">
                Personal information
              </h2>
              {!editing && (
                <button
                  onClick={openEdit}
                  className="flex items-center gap-1.5 rounded-[8px] border border-[#e5e7eb] px-4 py-2 text-[13px] font-medium text-text-body hover:border-brand-green hover:text-brand-green transition-colors"
                >
                  <Pencil className="h-[13px] w-[13px]" />
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="First name"
                    value={firstName}
                    onChange={setFirstName}
                    error={errors.firstName}
                  />
                  <Field
                    label="Last name"
                    value={lastName}
                    onChange={setLastName}
                    error={errors.lastName}
                  />
                </div>
                <div className="divide-y divide-[#f3f4f6]">
                  <InfoRow
                    icon={Mail}
                    label="Email address"
                    value={profile.email}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Phone number"
                    value={profile.phone}
                  />
                </div>
                <p className="text-[12px] text-[#9ca3af]">
                  Contact details can only be updated by your school
                  administrator.
                </p>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-[8px] bg-brand-green px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
                  >
                    <Check className="h-[14px] w-[14px]" />
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-[8px] border border-[#e5e7eb] px-5 py-2.5 text-[13px] font-medium text-text-body hover:border-[#dc2626] hover:text-[#dc2626] transition-colors"
                  >
                    <X className="h-[14px] w-[14px]" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#f3f4f6]">
                <InfoRow icon={User} label="Full name" value={fullName} />
                <InfoRow
                  icon={Mail}
                  label="Email address"
                  value={profile.email}
                />
                <InfoRow
                  icon={Phone}
                  label="Phone number"
                  value={profile.phone}
                />
              </div>
            )}
          </div>

          {/* Assigned classes card */}
          <div className="rounded-[16px] border border-[#e5e7eb] bg-white p-6">
            <h2 className="mb-4 text-[15px] font-semibold text-text-heading">
              Assigned classes
            </h2>
            {profile.assignedArms.length === 0 ? (
              <p className="text-[13px] text-text-body">
                No classes assigned yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.assignedArms.map((arm) => (
                  <div
                    key={arm}
                    className="flex items-center gap-2 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-2.5"
                  >
                    <BookOpen className="h-[14px] w-[14px] text-brand-green" />
                    <span className="text-[13px] font-medium text-text-heading">
                      {arm}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
