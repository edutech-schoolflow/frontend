"use client";

import { Button } from "@/src/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeactivateMeterDialog = ({ open, onOpenChange }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-119.5 rounded-2xl bg-white p-10 shadow-lg">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-dark-blue">
              Deactivate this meter?
            </p>
            <p className="text-xs text-grey-text">
              Are you sure you want to deactivate this meter? Once deactivated,
              the meter will no longer be available for transactions or linked
              activities.
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 text-xs"
            onClick={() => onOpenChange(false)}
          >
            Deactivate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateMeterDialog;
