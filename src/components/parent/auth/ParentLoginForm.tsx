"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import {
  parentLoginSchema,
  ERR_PHONE_NOT_VERIFIED,
  type ParentLoginInput,
} from "@/src/lib/api/parentAuth";
import {
  useParentLogin,
  useResendParentOtp,
} from "@/src/lib/api/useParentAuth";
import { ApiError } from "@/src/lib/api/client";
import ParentVerifyEmail from "./ParentVerifyEmail";

export default function ParentLoginForm() {
  const router = useRouter();
  const login = useParentLogin();
  const resend = useResendParentOtp();
  const [verifyPhone, setVerifyPhone] = useState<string | null>(null);

  const form = useForm<ParentLoginInput>({
    resolver: zodResolver(parentLoginSchema),
    mode: "onTouched",
    defaultValues: { phone: "", password: "" },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: ParentLoginInput) => {
    try {
      await login.mutateAsync(values);
      router.push("/parent/dashboard");
    } catch (err) {
      // Not verified yet → send a fresh code and drop into the OTP step inline.
      if (err instanceof ApiError && err.errorCode === ERR_PHONE_NOT_VERIFIED) {
        const message = await resend.mutateAsync(values.phone).catch(() => "");
        if (message) toast.info(message);
        setVerifyPhone(values.phone);
        return;
      }
      toast.error(err instanceof Error ? err.message : "Could not log in.");
    }
  };

  if (verifyPhone) {
    // Already on the login page — after verifying, drop back to the login form
    // (their phone/password are still filled) so they can sign in.
    return (
      <ParentVerifyEmail
        phone={verifyPhone}
        onVerified={() => setVerifyPhone(null)}
      />
    );
  }

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
            disabled={!isValid || login.isPending}
            className="flex h-[59px] w-full items-center justify-center rounded-[5px] text-[20px] font-normal transition-colors
              disabled:cursor-not-allowed disabled:bg-[#eee] disabled:text-[#888]
              enabled:bg-brand-green enabled:text-white enabled:hover:opacity-90"
          >
            {login.isPending ? (
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
