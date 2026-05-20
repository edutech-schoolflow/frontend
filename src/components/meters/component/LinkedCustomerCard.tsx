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

const LinkedCustomerCard = () => {
  const [editCustomerOpen, setEditCustomerOpen] = useState(false);

  return (
    <>
      <CardWrapper className="px-6 py-6">
        <div className="flex items-center justify-between border-b border-border-default pb-4 mb-4">
          <p className="text-base font-semibold text-dark-blue">
            Linked Customer Information
          </p>
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => setEditCustomerOpen(true)}
          >
            Edit details
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <p className="w-36 text-xs text-grey-text">Registered Name:</p>
              <p className="text-xs font-medium text-dark-blue">Musa Ibrahim</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="w-36 text-xs text-grey-text">Registered Number:</p>
              <p className="text-xs font-medium text-dark-blue">
                +234 701 239 2939
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <p className="w-36 text-xs text-grey-text">Registered Address:</p>
              <p className="text-xs font-medium text-dark-blue">
                4 Madiana Close, Kano, Nigeria
              </p>
            </div>
          </div>
        </div>
      </CardWrapper>

      <Dialog open={editCustomerOpen} onOpenChange={setEditCustomerOpen}>
        <DialogContent showCloseButton={false} className="max-w-md">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <div>
              <DialogTitle className="text-sm font-semibold text-dark-blue">
                Edit Customer Information
              </DialogTitle>
              <p className="text-xs text-grey-text">
                Update this customer&apos;s contact and profile details.
              </p>
            </div>
            <button
              onClick={() => setEditCustomerOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-grey-text hover:bg-surface-subtle"
            >
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-dark-blue">Name</p>
              <Input defaultValue="Musa" className="text-xs" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-dark-blue">Phone numbber</p>
              <div className="fle flex bg-surface-muted py-2.5 items-center gap-1 rounded-md border border-border-default px-3">
                <span className="text-xs text-grey-text">+234</span>
                <input
                  defaultValue="903 000 0000"
                  className="flex-1 bg-transparent text-xs text-dark-blue outline-none"
                />
              </div>
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <p className="text-xs text-dark-blue">Registered Address</p>
              <Input
                defaultValue="4 Madiana Crescent, Kano, Nigeria"
                className="text-xs"
              />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              className="text-xs"
              onClick={() => setEditCustomerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="text-xs"
              onClick={() => {
                setEditCustomerOpen(false);
                toast.success("Customer information updated successfully.");
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LinkedCustomerCard;
