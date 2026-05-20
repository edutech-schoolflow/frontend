"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import CardWrapper from "@/src/shared/CardWrapper";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import StatusBadge from "@/src/components/ui/StatusBadge";

const MeterInfoCard = () => {
  const [editMeterOpen, setEditMeterOpen] = useState(false);

  return (
    <>
      <CardWrapper className="px-6 py-6">
        <div className="flex items-center justify-between border-b border-border-default pb-4 mb-4">
          <p className="text-base font-semibold text-dark-blue">
            Meter Information
          </p>
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => setEditMeterOpen(true)}
          >
            Edit address
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <p className="w-36 text-xs text-grey-text">Meter Number:</p>
              <p className="text-xs font-medium text-dark-blue">3453828229</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="w-36 text-xs text-grey-text">Meter Type:</p>
              <p className="text-xs font-medium text-dark-blue">Prepaid</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="w-36 text-xs text-grey-text">Tariff:</p>
              <p className="text-xs font-medium text-dark-blue">R2</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <p className="w-36 text-xs text-grey-text">Installation Date:</p>
              <p className="text-xs font-medium text-dark-blue">
                12 October 2025
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="w-36 text-xs text-grey-text">Service Address:</p>
              <p className="text-xs font-medium text-dark-blue">
                4 Madiana Crescent, Kano, Nigeria
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="w-36 text-xs text-grey-text">Meter status:</p>
              <StatusBadge status="Active" />
            </div>
          </div>
        </div>
      </CardWrapper>

      <Dialog open={editMeterOpen} onOpenChange={setEditMeterOpen}>
        <DialogContent showCloseButton={false} className="max-w-md">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <div>
              <DialogTitle className="text-sm font-semibold text-dark-blue">
                Edit Meter Information
              </DialogTitle>
              <p className="text-xs text-grey-text">
                Update this customer&apos;s meter information.
              </p>
            </div>
            <button
              onClick={() => setEditMeterOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-grey-text hover:bg-surface-subtle"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-1.5 pt-2">
            <p className="text-xs text-dark-blue">Service Address</p>
            <Input
              defaultValue="4 Madiana Crescent, Kano, Nigeria"
              className="text-xs"
            />
          </div>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              className="text-xs"
              onClick={() => setEditMeterOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="text-xs"
              onClick={() => {
                setEditMeterOpen(false);
                toast.success("Meter information updated successfully.");
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MeterInfoCard;
