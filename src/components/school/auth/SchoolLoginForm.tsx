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
import FormCheckbox from "@/src/components/ui/formCheckbox";
import { ApiError } from "@/src/lib/api/client";
import {
  schoolLoginSchema,
  ERR_PHONE_NOT_VERIFIED,
  type SchoolLoginInput,
} from "@/src/lib/api/schoolAuth";
import { useSchoolLogin } from "@/src/lib/api/useSchoolAuth";
import PhoneVerificationStep from "./PhoneVerificationStep";

export default function SchoolLoginForm() {
  const router = useRouter();
  const login = useSchoolLogin();
  // Set when login is rejected because the phone isn't verified — switches to the OTP step.
  const [unverified, setUnverified] = useState<{
    phone: string;
    password: string;
  } | null>(null);

  const form = useForm<SchoolLoginInput>({
    resolver: zodResolver(schoolLoginSchema),
    mode: "onTouched",
    defaultValues: { phone: "", password: "", rememberMe: false },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: SchoolLoginInput) => {
    try {
      await login.mutateAsync(values);
      toast.success("Welcome back!");
      router.push("/school/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.errorCode === ERR_PHONE_NOT_VERIFIED) {
        // Take them through verification instead of a dead-end error.
        setUnverified({ phone: values.phone, password: values.password });
        return;
      }
      toast.error(err instanceof Error ? err.message : "Sign in failed.");
    }
  };

  if (unverified) {
    return (
      <PhoneVerificationStep
        phone={unverified.phone}
        password={unverified.password}
        sendOnMount
        onVerified={() => router.push("/school/dashboard")}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormInput
          name="phone"
          label="Phone number"
          placeholder="e.g. 08012345678"
          type="tel"
        />
        <FormInput
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
        />
        <div className="flex items-center justify-between">
          <FormCheckbox name="rememberMe" label="Remember me" />
          <Link
            href="/school/forgot-password"
            className="text-sm text-brand-green hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <FormButton
          text="Sign in"
          loadingText="Signing in…"
          loading={login.isPending}
          disabled={!isValid || login.isPending}
          className="mt-3! w-full bg-brand-green hover:bg-brand-green/90"
        />
      </form>

      <p className="mt-6 text-center text-sm text-text-body">
        New to Oneschoolplatform?{" "}
        <Link
          href="/school/register"
          className="font-medium text-brand-green hover:underline"
        >
          Register your school
        </Link>
      </p>
    </Form>
  );
}
