"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/src/components/ui/Logo";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import { resetParentPassword } from "@/src/lib/api/parentAuth";

const schema = z
  .object({
    code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please retype your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

const AUTH_INPUT =
  "h-[46px] w-full rounded-[10px] border border-[#ccc] bg-white px-[17px] text-[14px] text-[#1b1b1b] placeholder:text-[#aaa] pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none outline-none";
const AUTH_LABEL = "text-[14px] font-normal text-[#666]";

export default function ParentResetPassword() {
  const router = useRouter();
  const phone = useSearchParams().get("phone") ?? "";

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { code: "", newPassword: "", confirmPassword: "" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (values: Values) => {
    if (!phone) {
      toast.error("Start again — we don't know which number to reset.");
      router.push("/parent/forgot-password");
      return;
    }
    try {
      const message = await resetParentPassword({
        phone,
        code: values.code,
        newPassword: values.newPassword,
      });
      toast.success(message);
      router.push("/parent/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reset your password.");
    }
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
          <div className="flex flex-col gap-[18px]">
            <h2 className="text-[24px] font-medium text-[#1b1b1b]">
              Reset your password
            </h2>

            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-[17px]"
              >
                <p className="text-[16px] font-medium text-[#1b1b1b]">
                  Enter the code we sent{phone ? ` to ${phone}` : ""} and choose a
                  new password.
                </p>

                <FormInput
                  name="code"
                  label="Verification code"
                  placeholder="6-digit code"
                  type="text"
                  inputMode="numeric"
                  inputClassName={AUTH_INPUT}
                  labelClassName={AUTH_LABEL}
                />

                <FormInput
                  name="newPassword"
                  label="Set your password"
                  placeholder="Type it here"
                  type="password"
                  autoComplete="new-password"
                  inputClassName={AUTH_INPUT}
                  labelClassName={AUTH_LABEL}
                />

                <FormInput
                  name="confirmPassword"
                  label="Retype your password"
                  placeholder="Type it here"
                  type="password"
                  autoComplete="new-password"
                  inputClassName={AUTH_INPUT}
                  labelClassName={AUTH_LABEL}
                />

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
                    "Reset password"
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
