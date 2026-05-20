/* eslint-disable react/display-name */
import { cn } from "@/src/lib/utils";
import { HTMLAttributes, ReactNode, forwardRef } from "react";

interface CardWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardWrapper = forwardRef<HTMLDivElement, CardWrapperProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border-default bg-white px-6 py-8",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export default CardWrapper;
