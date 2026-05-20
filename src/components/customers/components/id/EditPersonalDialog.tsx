"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditPersonalDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-dark-blue">
            Edit Personal Information
          </DialogTitle>
          <DialogDescription className="text-xs text-grey-text">
            Update this customer&apos;s contact and profile details.
          </DialogDescription>
        </DialogHeader>
        <div className="my-2 border-t border-border-default" />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-dark-blue">First name</p>
            <Input defaultValue="Musa" className="text-xs" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-dark-blue">Middle name</p>
            <Input defaultValue="Ahmed" className="text-xs" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-dark-blue">Last name</p>
            <Input defaultValue="Ibrahim" className="text-xs" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-dark-blue">Phone numbber</p>
            <div className="flex items-center gap-1 rounded-md border border-border-default px-3 py-2">
              <span className="text-xs text-grey-text">+234</span>
              <input
                defaultValue="903 000 0000"
                className="flex-1 bg-transparent text-xs text-dark-blue outline-none"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="text-xs"
            onClick={() => {
              onOpenChange(false);
              toast.success("Personal information updated successfully.");
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPersonalDialog;
