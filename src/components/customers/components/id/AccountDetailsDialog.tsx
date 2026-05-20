"use client";

import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { X } from "lucide-react";

interface SavedAccount {
  nickname: string;
  accountNumber: string;
  accountType: "Prepaid" | "Postpaid";
  address: string;
  tariff: string;
  status: "Active" | "Inactive";
  linkedOn: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: SavedAccount | null;
}

const AccountDetailsDialog = ({ open, onOpenChange, account }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-md">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-sm font-semibold text-dark-blue">
            Account Details
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-grey-text hover:bg-surface-subtle"
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Account Type:</p>
            <p className="text-xs font-medium text-dark-blue">
              {account?.accountType}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Meter Number:</p>
            <p className="text-xs font-medium text-dark-blue">
              {account?.accountNumber}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Meter Name:</p>
            <p className="text-xs font-medium text-dark-blue">Sultana Yaro</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Meter Address:</p>
            <p className="text-xs font-medium text-dark-blue">
              {account?.address}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Nickname:</p>
            <p className="text-xs font-medium text-dark-blue">
              {account?.nickname}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Notification Phone Number:</p>
            <p className="text-xs font-medium text-dark-blue">
              +234 803 456 7890
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">
              Notification Email Address:
            </p>
            <p className="text-xs font-medium text-dark-blue">--</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDetailsDialog;
