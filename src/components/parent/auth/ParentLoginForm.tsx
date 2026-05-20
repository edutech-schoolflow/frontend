"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import { loginParent } from "@/src/lib/api/parents";
import { useAuth } from "@/src/context/AuthContext";

const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type Values = z.infer<typeof schema>;

export default function ParentLoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const { handleSubmit, formState: { isSubmitting, isValid } } = form;

  const onSubmit = async (values: Values) => {
    const user = await loginParent({ email: values.email, password: values.password });
    setUser(user);
    router.push("/parent/dashboard");
  };

  return (
    <div>
      <h2 className="mb-5 text-lg font-semibold text-text-heading">
        Login as parent
      </h2>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
          <FormInput
            name="email"
            label="Email"
            placeholder="Type it here"
            type="email"
          />

          <div className="flex flex-col gap-1">
            <FormInput
              name="password"
              label="Password"
              placeholder="Type it here"
              type="password"
            />
            <div className="flex justify-end">
              <Link
                href="/parent/forgot-password"
                className="text-xs text-brand-green hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="mt-2 flex w-full items-center justify-center rounded-lg py-3 text-sm font-semibold transition-colors
              disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400
              enabled:bg-brand-green enabled:text-white enabled:hover:opacity-90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in…
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </Form>
    </div>
  );
}
