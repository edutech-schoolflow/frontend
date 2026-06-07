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
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(1, "Password is required"),
});

type Values = z.infer<typeof schema>;

export default function ParentLoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { phone: "", password: "" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (values: Values) => {
    const user = await loginParent({
      phone: values.phone,
      password: values.password,
    });
    setUser(user);
    router.push("/parent/dashboard");
  };

  const AUTH_INPUT =
    "h-[46px] w-full rounded-[10px] border border-[#ccc] bg-white px-[17px] text-[14px] text-[#1b1b1b] placeholder:text-[#aaa] pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none outline-none";
  const AUTH_LABEL = "text-[14px] font-normal text-[#666]";

  return (
    <div>
      <h2 className="mb-5 text-[24px] font-medium text-[#1b1b1b]">
        Login as parent
      </h2>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[12px]"
        >
          <FormInput
            name="phone"
            label="Phone number"
            placeholder="e.g. 08012345678"
            type="tel"
            autoComplete="tel"
            inputClassName={AUTH_INPUT}
            labelClassName={AUTH_LABEL}
          />

          <FormInput
            name="password"
            label="Password"
            placeholder="Type it here"
            type="password"
            autoComplete="current-password"
            inputClassName={AUTH_INPUT}
            labelClassName={AUTH_LABEL}
          />

          <div className="flex justify-center">
            <Link
              href="/parent/forgot-password"
              className="text-[14px] text-brand-green underline hover:opacity-80"
            >
              I&apos;ve forgotten my password
            </Link>
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex h-[59px] w-full items-center justify-center rounded-[5px] text-[20px] font-normal transition-colors
              disabled:cursor-not-allowed disabled:bg-[#eee] disabled:text-[#888]
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
