"use client";

import { ChangeEvent, HTMLInputTypeAttribute, HTMLProps, memo } from "react";
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps extends Omit<HTMLProps<HTMLInputElement>, "ref"> {
  name: string;
  label?: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  formatAsCurrency?: boolean;
  className?: string;
}

const FormInput = ({
  label,
  name,
  placeholder,
  type,
  formatAsCurrency,
  className,
  ...rest
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const handleNumericCurrencyFormat = (value: string) => {
    const rawValue = value.replace(/[^\d.]/g, "");
    const decimalIndex = rawValue.indexOf(".");

    if (decimalIndex !== -1) {
      const integerPart = rawValue.slice(0, decimalIndex);
      let decimalPart = rawValue.slice(decimalIndex + 1, decimalIndex + 3);

      if (decimalPart.length > 2) {
        decimalPart = decimalPart.slice(0, 2);
      }

      return `${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${decimalPart}`;
    } else {
      return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  };

  const handleNumericInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (formatAsCurrency) {
      return handleNumericCurrencyFormat(e.target.value.trim());
    } else {
      return e.target.value.trim().replace(/(?!^\+|\d)\D/g, "");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    const value = type === "tel" ? handleNumericInput(e) : e.target.value;

    field.onChange(value);
  };

  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="text-[0.875rem] font-normal leading-4.5 tracking-[-0.14px] text-text-heading">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Input
                placeholder={placeholder}
                type={isPassword ? (showPassword ? "text" : "password") : type}
                {...field}
                onChange={(e) => handleChange(e, field)}
                {...rest}
                className="h-12.5 rounded-[7px] bg-surface-muted px-3.75 py-4 border-0 pr-10 placeholder:text-neutral-input-text placeholder:text-[13px] placeholder:tracking-[-0.13px] outline-none text-[13px] text-neutral-input-text tracking-[-0.13px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? (
                    <Eye className="h-4.5 w-4.5" />
                  ) : (
                    <EyeOff className="h-4.5 w-4.5" />
                  )}
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default memo(FormInput);
