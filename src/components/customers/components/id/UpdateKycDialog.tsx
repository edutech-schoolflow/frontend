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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpdateKycDialog = ({ open, onOpenChange }: Props) => {
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
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-dark-blue">KYC Status</p>
          <Select>
            <SelectTrigger className="w-full text-xs text-grey-text">
              <SelectValue placeholder="-- Update status --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
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
              toast.success("KYC verified successfully.");
            }}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateKycDialog;
