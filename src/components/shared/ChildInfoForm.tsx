"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronDown,
  Upload,
  CheckSquare2,
  Square,
  Loader2,
} from "lucide-react";
import { useClassLevels } from "@/src/lib/api/useClassLevels";
import { usePublicSchoolClasses } from "@/src/lib/api/useSchoolClassesPublic";

// ─── schema & types ───────────────────────────────────────────────────────────

export const childInfoSchema = z.object({
  firstName: z.string().min(1, "Required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Required"),
  dateOfBirth: z.string().min(1, "Required"),
  desiredClass: z.string().min(1, "Required"),
  gender: z.enum(["male", "female"]),
  previousSchool: z.string().optional(),
  medicalInfo: z.string().min(1, "Required"),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianRelationship: z.string().optional(),
});

export type ChildInfoValues = z.infer<typeof childInfoSchema>;

// ─── constants ────────────────────────────────────────────────────────────────

// Fallback only — the authoritative list comes from GET /class-levels (see useClassLevels).
const FALLBACK_CLASS_LEVELS = [
  "Nursery 1",
  "Nursery 2",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SSS 1",
  "SSS 2",
  "SSS 3",
];

export const FLD =
  "h-[46px] w-full rounded-[10px] border border-[#ccc] bg-white px-[17px] text-[14px] text-[#1b1b1b] placeholder:text-[#aaa] outline-none focus:border-[#1ca95c] transition-colors";
export const LBL = "h-[23px] flex items-center text-[14px] text-[#666]";

// ─── DropZone ─────────────────────────────────────────────────────────────────

export function DropZone({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div className="flex w-[358px] shrink-0 flex-col gap-[5px]">
      <p className="flex h-[23px] items-center text-[16px] text-[#666]">
        {label}
      </p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) onChange(f);
        }}
        className={`flex cursor-pointer items-center justify-center rounded-[8px] border border-dashed bg-white transition-colors ${
          file ? "h-[87px]" : "h-[159px] flex-col gap-[7px]"
        } ${dragging ? "border-[#1ca95c] bg-[#daffeb]/30" : "border-[#ccc] hover:border-[#aaa]"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <p className="break-all px-4 text-center text-[16px] font-medium text-[#1b1b1b]">
            {file.name}
          </p>
        ) : (
          <>
            <Upload className="h-[33px] w-[33px] text-[#1ca95c]" />
            <p className="text-[14px] font-medium text-[#1b1b1b]">
              Drag or drop an image
            </p>
            <p className="text-[14px] text-[#1b1b1b]">
              or <span className="text-[#ff8d28]">browse</span> to choose a file
            </p>
            <p className="text-[12px] text-[#1b1b1b]">
              JPEG, PNG or PDF — max 1 MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ChildInfoForm ────────────────────────────────────────────────────────────

type ChildInfoFormProps = {
  submitLabel?: string;
  defaultValues?: Partial<ChildInfoValues>;
  existingPhotoUrl?: string | null;
  /** When applying to a specific school, show that school's classes instead of the full ladder. */
  schoolId?: string;
  onSubmit: (
    values: ChildInfoValues,
    photo: File | null,
    birthCert: File | null,
    medicalDoc: File | null
  ) => void | Promise<void>;
};

export default function ChildInfoForm({
  submitLabel = "Save child",
  defaultValues,
  existingPhotoUrl,
  schoolId,
  onSubmit,
}: ChildInfoFormProps) {
  const [childPhoto, setChildPhoto] = useState<File | null>(null);
  const [birthCert, setBirthCert] = useState<File | null>(null);
  const [birthCertError, setBirthCertError] = useState("");
  const [medicalDoc, setMedicalDoc] = useState<File | null>(null);
  const [medicalDocError, setMedicalDocError] = useState("");
  const [showGuardian, setShowGuardian] = useState(
    !!defaultValues?.guardianName
  );
  const changePhotoRef = useRef<HTMLInputElement>(null);

  // Desired-class options come from the backend. When applying to a specific school, use that school's
  // actual classes; otherwise the full standard ladder. Static list is only a last-resort fallback.
  const { data: classLevels } = useClassLevels();
  const { data: schoolClasses } = usePublicSchoolClasses(schoolId);
  const classOptions =
    schoolId && schoolClasses && schoolClasses.length > 0
      ? schoolClasses.map((c) => c.name)
      : classLevels && classLevels.length > 0
        ? classLevels.map((l) => l.name)
        : FALLBACK_CLASS_LEVELS;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ChildInfoValues>({
    resolver: zodResolver(childInfoSchema),
    mode: "onChange",
    defaultValues: {
      firstName: defaultValues?.firstName ?? "",
      middleName: defaultValues?.middleName ?? "",
      lastName: defaultValues?.lastName ?? "",
      dateOfBirth: defaultValues?.dateOfBirth ?? "",
      desiredClass: defaultValues?.desiredClass ?? "",
      gender: defaultValues?.gender,
      previousSchool: defaultValues?.previousSchool ?? "",
      medicalInfo: defaultValues?.medicalInfo ?? "",
      guardianName: defaultValues?.guardianName ?? "",
      guardianPhone: defaultValues?.guardianPhone ?? "",
      guardianRelationship: defaultValues?.guardianRelationship ?? "",
    },
  });

  const handleFormSubmit = async (values: ChildInfoValues) => {
    let hasError = false;
    if (!birthCert) {
      setBirthCertError("Birth certificate is required");
      hasError = true;
    }
    if (!medicalDoc) {
      setMedicalDocError("Medical / fitness record is required");
      hasError = true;
    }
    if (hasError) return;
    await onSubmit(values, childPhoto, birthCert, medicalDoc);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-[20px]"
    >
      {/* Name row */}
      <div className="flex gap-[22px]">
        <div className="flex w-[230px] flex-col gap-[3px]">
          <p className={LBL}>First name</p>
          <input
            {...register("firstName")}
            placeholder="Type it here"
            className={FLD}
          />
          {errors.firstName && (
            <p className="text-[11px] text-red-500">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="flex w-[230px] flex-col gap-[3px]">
          <p className={LBL}>Middle Name</p>
          <input
            {...register("middleName")}
            placeholder="Type it here"
            className={FLD}
          />
        </div>
        <div className="flex w-[230px] flex-col gap-[3px]">
          <p className={LBL}>Last name</p>
          <input
            {...register("lastName")}
            placeholder="Type it here"
            className={FLD}
          />
          {errors.lastName && (
            <p className="text-[11px] text-red-500">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Date of birth */}
      <div className="flex flex-col gap-[3px]">
        <p className={LBL}>Date of birth</p>
        <input
          {...register("dateOfBirth")}
          placeholder="DD/MM/YYYY"
          className={FLD}
        />
        {errors.dateOfBirth && (
          <p className="text-[11px] text-red-500">
            {errors.dateOfBirth.message}
          </p>
        )}
      </div>

      {/* Desired class */}
      <div className="flex flex-col gap-[3px]">
        <p className={LBL}>Desired class</p>
        <div className="relative">
          <select
            {...register("desiredClass")}
            defaultValue=""
            className={FLD + " appearance-none pr-10 text-[#1b1b1b]"}
          >
            <option value="" disabled className="text-[#aaa]">
              Select class level
            </option>
            {classOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-[17px] top-1/2 h-[20px] w-[20px] -translate-y-1/2 text-[#aaa]" />
        </div>
        {errors.desiredClass && (
          <p className="text-[11px] text-red-500">
            {errors.desiredClass.message}
          </p>
        )}
      </div>

      {/* Gender toggle */}
      <div className="flex flex-col gap-[3px]">
        <p className={LBL}>Gender</p>
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <div className="flex gap-[17px]">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => field.onChange(g)}
                  className="flex h-[46px] w-[358px] items-center justify-center gap-[8px] rounded-[10px] border border-[#ccc] bg-white text-[14px] transition-colors hover:border-[#aaa]"
                >
                  {field.value === g ? (
                    <CheckSquare2 className="h-[18px] w-[18px] shrink-0 text-[#1ca95c]" />
                  ) : (
                    <Square className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
                  )}
                  <span
                    className={
                      field.value === g ? "text-[#1b1b1b]" : "text-[#aaa]"
                    }
                  >
                    {g === "male" ? "Male" : "Female"}
                  </span>
                </button>
              ))}
            </div>
          )}
        />
        {errors.gender && (
          <p className="text-[11px] text-red-500">{errors.gender.message}</p>
        )}
      </div>

      {/* Previous school */}
      <div className="flex flex-col gap-[3px]">
        <p className={LBL}>Previous school (Optional)</p>
        <input
          {...register("previousSchool")}
          placeholder="Type it here"
          className={FLD}
        />
      </div>

      {/* Medical info */}
      <div className="flex flex-col gap-[5px]">
        <p className="flex h-[23px] items-center text-[16px] text-[#666]">
          Medical information
        </p>
        <textarea
          {...register("medicalInfo")}
          placeholder="List any allergies, health conditions, or special needs."
          className="h-[76px] w-full resize-none rounded-[10px] border border-[#ccc] px-[17px] py-[12px] text-[14px] text-[#1b1b1b] placeholder:text-[#aaa] outline-none focus:border-[#1ca95c] transition-colors"
        />
        {errors.medicalInfo && (
          <p className="text-[11px] text-red-500">
            {errors.medicalInfo.message}
          </p>
        )}
      </div>

      {/* File uploads */}
      <div className="flex gap-[17px]">
        <div className="flex w-[358px] shrink-0 flex-col gap-[5px]">
          {existingPhotoUrl && !childPhoto && (
            <div className="flex flex-col gap-[5px]">
              <p className="flex h-[23px] items-center text-[16px] text-[#666]">
                Upload child&apos;s photo
              </p>
              <div className="relative flex h-[87px] items-center gap-[12px] rounded-[8px] border border-dashed border-[#1ca95c] bg-[#daffeb]/20 px-[16px]">
                <input
                  ref={changePhotoRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setChildPhoto(f);
                  }}
                />
                <img
                  src={existingPhotoUrl!}
                  alt="Current photo"
                  className="h-[56px] w-[56px] rounded-full object-cover"
                />
                <div className="flex flex-col gap-[2px]">
                  <p className="text-[13px] font-medium text-[#1b1b1b]">
                    Current photo
                  </p>
                  <button
                    type="button"
                    className="text-left text-[12px] text-[#ff8d28] hover:underline"
                    onClick={() => changePhotoRef.current?.click()}
                  >
                    Change photo
                  </button>
                </div>
              </div>
            </div>
          )}
          {(!existingPhotoUrl || childPhoto) && (
            <DropZone
              label="Upload child's photo"
              file={childPhoto}
              onChange={setChildPhoto}
            />
          )}
        </div>

        {/* Birth certificate (required) */}
        <div className="flex flex-col gap-[5px]">
          <DropZone
            label="Upload child's birth certificate"
            file={birthCert}
            onChange={(f) => {
              setBirthCert(f);
              if (f) setBirthCertError("");
            }}
          />
          {birthCertError && (
            <p className="text-[11px] text-red-500">{birthCertError}</p>
          )}
        </div>
      </div>

      {/* Medical record upload (required) */}
      <div className="flex flex-col gap-[5px]">
        <DropZone
          label="Upload medical / fitness record"
          file={medicalDoc}
          onChange={(f) => {
            setMedicalDoc(f);
            if (f) setMedicalDocError("");
          }}
        />
        {medicalDocError && (
          <p className="text-[11px] text-red-500">{medicalDocError}</p>
        )}
      </div>

      {/* Add guardian toggle */}
      <button
        type="button"
        onClick={() => setShowGuardian((v) => !v)}
        className="flex items-center gap-[6px] text-left"
      >
        {showGuardian ? (
          <CheckSquare2 className="h-[20px] w-[20px] shrink-0 text-[#1ca95c]" />
        ) : (
          <Square className="h-[20px] w-[20px] shrink-0 text-[#ccc]" />
        )}
        <span className="text-[14px] text-[#666]">
          Add an additional guardian (optional)
        </span>
      </button>

      {/* Guardian fields */}
      {showGuardian && (
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[3px]">
            <p className={LBL}>First and last name</p>
            <input
              {...register("guardianName")}
              placeholder="First Name"
              className={FLD}
            />
          </div>
          <div className="flex flex-col gap-[3px]">
            <p className={LBL}>Phone number</p>
            <input
              {...register("guardianPhone")}
              placeholder="e.g. 08012345678"
              className={FLD}
            />
          </div>
          <div className="flex flex-col gap-[3px]">
            <p className={LBL}>Relationship</p>
            <input
              {...register("guardianRelationship")}
              placeholder="e.g. Mother"
              className={FLD}
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || !birthCert || !medicalDoc || isSubmitting}
        className="mx-auto flex h-[59px] w-[447px] items-center justify-center rounded-[5px] text-[20px] font-normal transition-colors disabled:cursor-not-allowed disabled:bg-[#eee] disabled:text-[#888] enabled:bg-[#1ca95c] enabled:text-white enabled:hover:opacity-90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
