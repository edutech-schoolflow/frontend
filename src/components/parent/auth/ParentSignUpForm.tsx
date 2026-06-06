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
    onSuccess(values.phone);
  };

  const AUTH_INPUT =
    "h-[46px] w-full rounded-[10px] border border-[#ccc] bg-white px-[17px] text-[14px] text-[#1b1b1b] placeholder:text-[#aaa] pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none outline-none";
  const AUTH_LABEL = "text-[14px] font-normal text-[#666]";

  return (
    <div>
      <h2 className="mb-5 text-[24px] font-medium text-[#1b1b1b]">
        Sign up as parent
      </h2>

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
            type="text"
            autoComplete="name"
            inputClassName={AUTH_INPUT}
            labelClassName={AUTH_LABEL}
          />
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
            name="email"
            label="Email address"
            placeholder="Type it here"
            type="email"
            autoComplete="email"
            inputClassName={AUTH_INPUT}
            labelClassName={AUTH_LABEL}
          />
          <FormInput
            name="password"
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
