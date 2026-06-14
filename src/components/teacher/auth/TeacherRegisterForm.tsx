"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";

import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import FormButton from "@/src/components/ui/formButton";

const schema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    phone: z
      .string()
      .min(10, "Enter a valid phone number")
      .max(15, "Enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function StaffRegisterForm() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = async (_values: FormValues) => {
    // TODO: call staff registration API
    router.push("/staff/dashboard");
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormInput
          name="fullName"
          label="Full name"
          placeholder="e.g. Amaka Okonkwo"
        />
        <FormInput
          name="email"
          label="Email address"
          placeholder="Enter your email address"
          type="email"
        />
        <FormInput
          name="phone"
          label="Phone number"
          placeholder="e.g. 08012345678"
          type="tel"
        />
        <FormInput
          name="password"
          label="Password"
          placeholder="Create a password (min. 6 characters)"
          type="password"
        />
        <FormInput
          name="confirmPassword"
          label="Confirm password"
          placeholder="Repeat your password"
          type="password"
        />
        <FormButton
          text="Create account"
          loadingText="Creating account…"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          className="mt-3! w-full bg-brand-green hover:bg-brand-green/90"
        />
      </form>

      <p className="mt-6 text-center text-sm text-text-body">
        Already have an account?{" "}
        <Link
          href="/staff/login"
          className="font-medium text-brand-green hover:underline"
        >
          Sign in
        </Link>
      </p>
    </Form>
  );
}
