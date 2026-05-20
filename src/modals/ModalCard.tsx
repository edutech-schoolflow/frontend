"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { cn } from "@/src/lib/utils";

interface ModalCardProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  closeButtonClassName?: string;
}

const ModalCard = ({
  open,
  onClose,
  children,
  className,
  closeButtonClassName,
}: ModalCardProps) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 flex h-screen max-h-screen w-125 flex-col overflow-hidden rounded-2xl bg-white shadow-xl",
          className
        )}
      >
        <button
          onClick={onClose}
          className={cn(
            "absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-border-default bg-white text-grey-text hover:bg-surface-subtle cursor-pointer",
            closeButtonClassName
          )}
        >
          <X size={14} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalCard;
