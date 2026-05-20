"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import FormButton from "@/src/components/ui/formButton";
import FormCheckbox from "@/src/components/ui/formCheckbox";
import { loginFormSchema, type loginFormType } from "@/src/lib/validations/login";
import { loginStaff } from "@/src/lib/api/auth";
import { useAuth } from "@/src/context/AuthContext";

export default function SchoolLoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();

  const form = useForm<loginFormType>({
    resolver: zodResolver(loginFormSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const { handleSubmit, formState: { isValid, isSubmitting } } = form;

  const onSubmit = async (values: loginFormType) => {
    const user = await loginStaff({ email: values.email, password: values.password });
    setUser(user);
    router.push("/school/dashboard");
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
            href="/school/forgot-password"
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
        New to SchoolFlow?{" "}
        <Link href="/school/register" className="font-medium text-brand-green hover:underline">
          Register your school
        </Link>
      </p>
    </Form>
  );
}
