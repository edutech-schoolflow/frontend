"use client";

import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/components/ui/form";

interface FormCheckboxProps {
  name: string;
  label: string | React.ReactNode;
}

const FormCheckbox = ({ name, label }: FormCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center gap-2 space-y-0 py-1 cursor-pointer">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="h-4.5 w-4.5"
            />
          </FormControl>
          <FormLabel className="text-[0.875rem] font-normal leading-4.5 tracking-[-0.14px] text-grey-text cursor-pointer">
            {label}
          </FormLabel>
        </FormItem>
      )}
    />
  );
};

export default FormCheckbox;
