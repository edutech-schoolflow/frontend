"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import FormButton from "@/src/components/ui/formButton";
import { registerSchool } from "@/src/lib/api/auth";

const schema = z
  .object({
    adminName: z.string().min(2, "Your name is required"),
    adminEmail: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function SchoolRegisterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      adminName: "",
      adminEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = async (values: FormValues) => {
    await registerSchool({
      adminName: values.adminName,
      adminEmail: values.adminEmail,
      password: values.password,
    });
    setAdminEmail(values.adminEmail);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle2 className="h-14 w-14 text-brand-green" />
        <h2 className="text-xl font-semibold text-text-heading">
          Account created!
        </h2>
        <p className="text-sm text-text-body">
          We sent a verification link to{" "}
          <span className="font-medium text-text-heading">{adminEmail}</span>.
          Click it to activate your account, then complete your school&apos;s
          compliance profile inside the dashboard.
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
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormInput
          name="adminName"
          label="Your full name"
          placeholder="e.g. Chukwuemeka Okonkwo"
        />
        <FormInput
          name="adminEmail"
          label="Email address"
          placeholder="e.g. emeka@greenfield.com"
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
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
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
