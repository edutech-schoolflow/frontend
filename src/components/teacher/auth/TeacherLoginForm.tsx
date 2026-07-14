"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import FormButton from "@/src/components/ui/formButton";
import FormCheckbox from "@/src/components/ui/formCheckbox";
import {
  loginFormSchema,
  type loginFormType,
} from "@/src/lib/validations/login";

export default function StaffLoginForm() {
  const router = useRouter();

  const form = useForm<loginFormType>({
    resolver: zodResolver(loginFormSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = async (_values: loginFormType) => {
    // TODO: call staff login API
    router.push("/select-context");
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormInput
          name="email"
          label="Email address"
          placeholder="Enter your email address"
          type="email"
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
            href="/staff/forgot-password"
            className="text-sm text-brand-green hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <FormButton
          text="Sign in"
          loadingText="Signing in…"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          className="mt-3! w-full bg-brand-green hover:bg-brand-green/90"
        />
      </form>

      <p className="mt-6 text-center text-sm text-text-body">
        Don&apos;t have an account?{" "}
        <Link
          href="/staff/register"
          className="font-medium text-brand-green hover:underline"
        >
          Create one free
        </Link>
      </p>
    </Form>
  );
}
