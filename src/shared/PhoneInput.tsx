"use client";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ChangeEvent } from "react";

interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const PhoneInput = ({
  label = "Phone Number",
  value,
  onChange,
  placeholder = "801 234 5678",
  error,
}: PhoneInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    onChange(raw);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="flex">
        <div className="flex items-center gap-2 rounded-l-md border border-r-0 border-input bg-gray-50 px-3 text-sm text-grey-text">
          🇳🇬 +234
        </div>
        <Input
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={10}
          className="rounded-l-none"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PhoneInput;
