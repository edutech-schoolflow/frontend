"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/src/components/ui/Logo";
import { Loader2, X } from "lucide-react";
import { z } from "zod";

import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import { resetPassword } from "@/src/lib/api/parents";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please retype your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

const AUTH_INPUT =
  "h-[46px] w-full rounded-[10px] border border-[#ccc] bg-white px-[17px] text-[14px] text-[#1b1b1b] placeholder:text-[#aaa] pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none outline-none";
const AUTH_LABEL = "text-[14px] font-normal text-[#666]";

export default function ParentResetPassword() {
  const router = useRouter();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (values: Values) => {
    await resetPassword({ token: "", password: values.password });
    router.push("/parent/login");
  };

  return (
    <div
      className="h-screen"
      style={{ display: "grid", gridTemplateColumns: "710px 1fr" }}
    >
      {/* Left — green photo panel */}
      <div className="relative overflow-hidden bg-brand-green">
        <Link href="/" className="absolute left-[80px] top-[57px] z-10">
          <Logo size={30} textColor="white" />
        </Link>
        <Image
          src="/images/svg/parentchildscreen.svg"
          alt="Parent and child"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Right — white panel */}
      <div className="relative overflow-y-auto bg-white">
        {/* Close */}
        <button
          onClick={() => router.push("/")}
          className="absolute right-8 top-8 flex h-8 w-8 items-center justify-center rounded-full text-text-body transition-colors hover:bg-surface-subtle"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className="flex flex-col gap-[49px] pt-[94px]"
          style={{ paddingLeft: "105px", paddingRight: "99px" }}
        >
          {/* Header + fields */}
          <div className="flex flex-col gap-[18px]">
            <h2 className="text-[24px] font-medium text-[#1b1b1b]">
              Forgot password
            </h2>

            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-[17px]"
              >
                <p className="text-[16px] font-medium text-[#1b1b1b]">
                  Update your password
                </p>

                <FormInput
                  name="password"
                  label="Set your password"
                  placeholder="Type it here"
                  type="password"
                  inputClassName={AUTH_INPUT}
                  labelClassName={AUTH_LABEL}
                />

                <FormInput
                  name="confirmPassword"
                  label="Retype your password"
                  placeholder="Type it here"
                  type="password"
                  inputClassName={AUTH_INPUT}
                  labelClassName={AUTH_LABEL}
                />

                {/* Continue button — inside form so Enter submits */}
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="mt-[32px] flex h-[59px] w-full items-center justify-center rounded-[5px] text-[20px] font-normal transition-colors
                    disabled:cursor-not-allowed disabled:bg-[#eee] disabled:text-[#888]
                    enabled:bg-brand-green enabled:text-white enabled:hover:opacity-90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
