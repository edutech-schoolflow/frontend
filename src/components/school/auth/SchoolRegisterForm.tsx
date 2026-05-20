"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import FormButton from "@/src/components/ui/formButton";
import MultiStepForm from "@/src/shared/MultiStepForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

import {
  schoolInfoSchema,
  adminAccountSchema,
  subdomainSchema,
  type SchoolInfoValues,
  type AdminAccountValues,
  type SubdomainValues,
} from "@/src/lib/validations/register";
import { registerSchool, checkSubdomain } from "@/src/lib/api/auth";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const SCHOOL_TYPES = [
  { value: "nursery", label: "Nursery / Creche" },
  { value: "primary", label: "Primary School" },
  { value: "secondary", label: "Secondary School" },
  { value: "combined", label: "Combined (Nursery–Secondary)" },
];

const STEPS = [
  { label: "School Info" },
  { label: "Admin Account" },
  { label: "Subdomain" },
];

type AllFormData = Partial<SchoolInfoValues & AdminAccountValues & SubdomainValues>;

export default function SchoolRegisterForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AllFormData>({});
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const step1Form = useForm<SchoolInfoValues>({
    resolver: zodResolver(schoolInfoSchema),
    mode: "onTouched",
    defaultValues: {
      schoolName: formData.schoolName ?? "",
      schoolType: formData.schoolType,
      address: formData.address ?? "",
      city: formData.city ?? "",
      state: formData.state ?? "",
      phone: formData.phone ?? "",
      email: formData.email ?? "",
    },
  });

  // Step 2
  const step2Form = useForm<AdminAccountValues>({
    resolver: zodResolver(adminAccountSchema),
    mode: "onTouched",
    defaultValues: {
      adminName: formData.adminName ?? "",
      position: formData.position ?? "",
      adminEmail: formData.adminEmail ?? "",
      adminPhone: formData.adminPhone ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  // Step 3
  const step3Form = useForm<SubdomainValues>({
    resolver: zodResolver(subdomainSchema),
    mode: "onTouched",
    defaultValues: {
      subdomain: formData.subdomain ?? "",
    },
  });

  const handleStep1 = step1Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(1);
  });

  const handleStep2 = step2Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  });

  const handleSubdomainCheck = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) return;
    setCheckingSubdomain(true);
    setSubdomainAvailable(null);
    try {
      const available = await checkSubdomain(subdomain);
      setSubdomainAvailable(available);
    } finally {
      setCheckingSubdomain(false);
    }
  };

  const handleStep3 = step3Form.handleSubmit(async (data) => {
    const finalData = { ...formData, ...data };
    await registerSchool(finalData);
    setSubmitted(true);
  });

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle2 className="h-14 w-14 text-brand-green" />
        <h2 className="text-xl font-semibold text-text-heading">Check your email</h2>
        <p className="text-sm text-text-body">
          We sent a verification link to{" "}
          <span className="font-medium text-text-heading">{formData.adminEmail}</span>.
          Click it to activate your school account.
        </p>
        <Link
          href="/school/login"
          className="mt-2 text-sm font-medium text-brand-green hover:underline"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <MultiStepForm steps={STEPS} currentStep={currentStep}>
        {/* ── Step 1: School Info ───────────────────────────────────── */}
        {currentStep === 0 && (
          <Form {...step1Form}>
            <form onSubmit={handleStep1} className="flex flex-col gap-4">
              <FormInput
                name="schoolName"
                label="School name"
                placeholder="e.g. Greenfield Academy"
              />

              {/* School type select */}
              <FormField
                control={step1Form.control}
                name="schoolType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[0.875rem] font-normal text-text-heading">
                      School type
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12.5 rounded-[7px] bg-surface-muted border-0 text-[13px] text-text-body">
                          <SelectValue placeholder="Select school type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SCHOOL_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormInput
                name="address"
                label="School address"
                placeholder="e.g. 12 Adeola Odeku Street, Victoria Island"
              />

              <div className="grid grid-cols-2 gap-3">
                <FormInput name="city" label="City" placeholder="e.g. Lagos" />

                {/* State select */}
                <FormField
                  control={step1Form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[0.875rem] font-normal text-text-heading">
                        State
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12.5 rounded-[7px] bg-surface-muted border-0 text-[13px] text-text-body">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {NIGERIAN_STATES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormInput
                name="phone"
                label="School phone"
                placeholder="e.g. 08012345678"
                type="tel"
              />
              <FormInput
                name="email"
                label="School email"
                placeholder="e.g. info@greenfieldacademy.com"
                type="email"
              />

              <FormButton
                text="Continue"
                loadingText="Saving..."
                loading={step1Form.formState.isSubmitting}
                disabled={false}
                className="mt-2! bg-brand-green hover:bg-brand-green/90"
              />
            </form>
          </Form>
        )}

        {/* ── Step 2: Admin Account ─────────────────────────────────── */}
        {currentStep === 1 && (
          <Form {...step2Form}>
            <form onSubmit={handleStep2} className="flex flex-col gap-4">
              <FormInput
                name="adminName"
                label="Your full name"
                placeholder="e.g. Chukwuemeka Okonkwo"
              />
              <FormInput
                name="position"
                label="Your position / title"
                placeholder="e.g. Principal, Head Admin"
              />
              <FormInput
                name="adminEmail"
                label="Your email address"
                placeholder="e.g. emeka@greenfieldacademy.com"
                type="email"
              />
              <FormInput
                name="adminPhone"
                label="Your phone number"
                placeholder="e.g. 08012345678"
                type="tel"
              />
              <FormInput
                name="password"
                label="Password"
                placeholder="At least 8 characters"
                type="password"
              />
              <FormInput
                name="confirmPassword"
                label="Confirm password"
                placeholder="Re-enter your password"
                type="password"
              />

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="flex-1 h-12.5 rounded-[9px] border border-border-default text-sm font-medium text-text-body hover:bg-surface-subtle transition-colors"
                >
                  Back
                </button>
                <FormButton
                  text="Continue"
                  loadingText="Saving..."
                  loading={step2Form.formState.isSubmitting}
                  disabled={false}
                  className="mt-0! flex-1 bg-brand-green hover:bg-brand-green/90"
                />
              </div>
            </form>
          </Form>
        )}

        {/* ── Step 3: Subdomain ─────────────────────────────────────── */}
        {currentStep === 2 && (
          <Form {...step3Form}>
            <form onSubmit={handleStep3} className="flex flex-col gap-4">
              <p className="text-sm text-text-body">
                Choose a unique subdomain for your school portal. This cannot be changed later.
              </p>

              <FormField
                control={step3Form.control}
                name="subdomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[0.875rem] font-normal text-text-heading">
                      Subdomain
                    </FormLabel>
                    <FormControl>
                      <div className="flex h-12.5 overflow-hidden rounded-[7px] bg-surface-muted">
                        <input
                          {...field}
                          placeholder="greenfield"
                          className="flex-1 bg-transparent px-3.75 text-[13px] text-text-body placeholder:text-neutral-400 outline-none"
                          onChange={(e) => {
                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                            field.onChange(val);
                            setSubdomainAvailable(null);
                          }}
                          onBlur={() => handleSubdomainCheck(field.value)}
                        />
                        <span className="flex items-center bg-surface-subtle px-3 text-xs text-text-body border-l border-border-default">
                          .schoolflow.com
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                    {checkingSubdomain && (
                      <p className="flex items-center gap-1 text-xs text-text-body">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Checking availability…
                      </p>
                    )}
                    {!checkingSubdomain && subdomainAvailable === true && (
                      <p className="text-xs text-brand-green font-medium">
                        ✓ Available
                      </p>
                    )}
                    {!checkingSubdomain && subdomainAvailable === false && (
                      <p className="text-xs text-red-500">
                        This subdomain is already taken. Try another.
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 h-12.5 rounded-[9px] border border-border-default text-sm font-medium text-text-body hover:bg-surface-subtle transition-colors"
                >
                  Back
                </button>
                <FormButton
                  text="Create school"
                  loadingText="Creating…"
                  loading={step3Form.formState.isSubmitting}
                  disabled={step3Form.formState.isSubmitting}
                  className="mt-0! flex-1 bg-brand-green hover:bg-brand-green/90"
                />
              </div>
            </form>
          </Form>
        )}
      </MultiStepForm>

      <p className="mt-6 text-center text-sm text-text-body">
        Already have an account?{" "}
        <Link href="/school/login" className="font-medium text-brand-green hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
