"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeactivateDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-md">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-dark-blue">
              Deactivate this customer?
            </p>
            <p className="text-xs text-grey-text">
              Are you sure you want to deactivate this customer? They will not
              be able to access certain features.
            </p>
          </div>
        </div>
        <DialogFooter className="mt-2">
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
            onClick={() => {
              onOpenChange(false);
              toast.success("Customer deactivated successfully.");
            }}
          >
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateDialog;
