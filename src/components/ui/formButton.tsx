import { cn } from "@/src/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, Fragment } from "react";
import { Button } from "./button";

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  loadingText: string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  size?: "default" | "icon" | "lg" | "sm" | null;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null;
}

const FormButton = ({
  text,
  loadingText,
  className,
  loading,
  disabled,
  variant,
  size = "lg",
  ...props
}: FormButtonProps) => {
  return (
    <Button
      aria-disabled={loading}
      className={cn(
        "mt-8! h-12.5 w-full rounded-[9px] px-4  disabled:text-white",
        className
      )}
      disabled={loading || disabled}
      size={size}
      type="submit"
      variant={variant}
      {...props}
    >
      {loading ? (
        <Fragment>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </Fragment>
      ) : (
        text
      )}
    </Button>
  );
};

export default FormButton;
