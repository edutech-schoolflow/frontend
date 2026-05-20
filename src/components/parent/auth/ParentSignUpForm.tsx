"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import { parentSignUpSchema, type ParentSignUpValues } from "@/src/lib/validations/parentRegister";
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

  return (
    <div>
      <h2 className="mb-5 text-lg font-semibold text-text-heading">
        Sign up as parent
      </h2>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.25">
          <FormInput
            name="fullName"
            label="First and last name"
            placeholder="Type it here"
          />
          <FormInput
            name="email"
            label="Email"
            placeholder="Type it here"
            type="email"
          />
          <FormInput
            name="phone"
            label="Phone number"
            placeholder="Type it here"
            type="tel"
          />
          <FormInput
            name="password"
            label="Set your password"
            placeholder="Type it here"
            type="password"
          />
          <FormInput
            name="confirmPassword"
            label="Retype your password"
            placeholder="Type it here"
            type="password"
          />

          {/* Terms checkbox */}
          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <label className="flex cursor-pointer items-start gap-2">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-0.5 h-4 w-4 rounded border-border-default accent-brand-green"
                    />
                    <span className="text-xs text-text-body">
                      I agree to the{" "}
                      <Link href="/terms" className="text-brand-green underline">
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" className="text-brand-green underline">
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
            className="mt-2 flex w-full items-center justify-center rounded-lg py-3 text-sm font-semibold transition-colors
              disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400
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
