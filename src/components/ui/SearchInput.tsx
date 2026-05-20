import { cn } from "@/src/lib/utils";
import { Search } from "lucide-react";
import * as React from "react";

interface SearchInputProps extends React.ComponentProps<"input"> {
  containerClassName?: string;
}

function SearchInput({
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-3.5 py-3.5 rounded-[10px] bg-surface-muted w-75",
        containerClassName
      )}
    >
      <Search size={14} className="text-grey-text shrink-0" />
      <input
        className={cn(
          "bg-transparent outline-none text-grey-text text-xs italic placeholder:text-grey-text placeholder:italic w-full",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { SearchInput };
