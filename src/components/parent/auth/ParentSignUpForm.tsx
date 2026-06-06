"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import {
  parentSignUpSchema,
  type ParentSignUpValues,
} from "@/src/lib/validations/parentRegister";
import { registerParent } from "@/src/lib/api/parents";

interface Props {
  onSuccess: (email: string) => void;
}

export default function ParentSignUpForm({ onSuccess }: Props) {
  const form = useForm<ParentSignUpValues>({
    resolver: zodResolver(parentSignUpSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (values: ParentSignUpValues) => {
    await registerParent({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });
    onSuccess(values.email);
  };

  const AUTH_INPUT =
    "h-[46px] w-full rounded-[10px] border border-[#ccc] bg-white px-[17px] text-[14px] text-[#1b1b1b] placeholder:text-[#aaa] pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none outline-none";
  const AUTH_LABEL = "text-[14px] font-normal text-[#666]";

  return (
    <div>
      <h2 className="mb-5 text-[24px] font-medium text-[#1b1b1b]">
        Sign up as parent
      </h2>

      {/* Google sign-in */}
      <div className="mb-[13px] flex flex-col gap-[13px]">
        <button
          type="button"
          className="flex h-[58px] w-full items-center justify-center gap-[10px] rounded-[10px] border border-[#c7cad1] bg-white transition-colors hover:bg-gray-50"
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-[14px] font-normal text-[#181a25]">
            Continue with Google
          </span>
        </button>

        <p className="text-center text-[14px] text-[#5a5d66]">or</p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[13px]"
        >
          <FormInput
            name="fullName"
            label="First and last name"
            placeholder="Type it here"
            inputClassName={AUTH_INPUT}
            labelClassName={AUTH_LABEL}
          />
          <FormInput
            name="email"
            label="Email"
            placeholder="Type it here"
            type="email"
            inputClassName={AUTH_INPUT}
            labelClassName={AUTH_LABEL}
          />
          <FormInput
            name="phone"
            label="Phone number"
            placeholder="Type it here"
            type="tel"
            inputClassName={AUTH_INPUT}
            labelClassName={AUTH_LABEL}
          />
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

          {/* Terms checkbox */}
          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <label className="flex cursor-pointer items-center gap-[3px]">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 shrink-0 rounded-sm border-[#ccc] accent-brand-green"
                    />
                    <span className="text-[12px] text-[#666]">
                      {" "}
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-brand-green underline"
                      >
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/terms"
                        className="text-brand-green underline"
                      >
                        Conditions
                      </Link>
                    </span>
                  </label>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
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
                Creating account…
              </>
            ) : (
              "Create my account"
            )}
          </button>
        </form>
      </Form>
    </div>
  );
}
