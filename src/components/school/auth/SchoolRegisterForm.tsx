"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import FormButton from "@/src/components/ui/formButton";
import {
  schoolRegisterSchema,
  type SchoolRegisterInput,
} from "@/src/lib/api/schoolAuth";
import { useSchoolRegister } from "@/src/lib/api/useSchoolAuth";
import PhoneVerificationStep from "./PhoneVerificationStep";

export default function SchoolRegisterForm() {
  const router = useRouter();
  const register = useSchoolRegister();

  // Hold the credentials so we can auto-login after the phone is verified.
  const [pending, setPending] = useState<{
    phone: string;
    password: string;
  } | null>(null);

  const form = useForm<SchoolRegisterInput>({
    resolver: zodResolver(schoolRegisterSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: SchoolRegisterInput) => {
    try {
      await register.mutateAsync(values);
      setPending({ phone: values.phone, password: values.password });
      toast.success("We sent a 6-digit code to your phone.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed.");
    }
  };

  if (pending) {
    return (
      <PhoneVerificationStep
        phone={pending.phone}
        password={pending.password}
        onVerified={() => router.push("/select-context")}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="firstName"
            label="First name"
            placeholder="e.g. Chidi"
          />
          <FormInput
            name="lastName"
            label="Last name"
            placeholder="e.g. Okonkwo"
          />
        </div>
        <FormInput
          name="middleName"
          label="Middle name (optional)"
          placeholder="e.g. Emeka"
        />
        <FormInput
          name="phone"
          label="Phone number"
          placeholder="e.g. 08012345678"
          type="tel"
        />
        <FormInput
          name="email"
          label="Email address (optional)"
          placeholder="e.g. chidi@greenfield.com"
          type="email"
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

        <FormButton
          text="Create school account"
          loadingText="Creating account…"
          loading={register.isPending}
          disabled={!isValid || register.isPending}
          className="mt-3! w-full bg-brand-green hover:bg-brand-green/90"
        />
      </form>

      <p className="mt-6 text-center text-sm text-text-body">
        Already have an account?{" "}
        <Link
          href="/school/login"
          className="font-medium text-brand-green hover:underline"
        >
          Sign in
        </Link>
      </p>
    </Form>
  );
}
