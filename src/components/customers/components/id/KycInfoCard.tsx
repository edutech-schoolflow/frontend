"use client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import { Button } from "@/src/components/ui/button";
import CardWrapper from "@/src/shared/CardWrapper";
import { Eye } from "lucide-react";

interface Props {
  onUpdate: () => void;
}

const KycInfoCard = ({ onUpdate }: Props) => {
  return (
    <CardWrapper>
      <div className="flex items-center justify-between border-b border-border-default pb-4">
        <p className="text-sm font-semibold text-dark-blue">KYC Information</p>
        <Button variant="outline" className="text-xs" onClick={onUpdate}>
          Update status
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="w-32 text-xs text-grey-text">KYC status:</p>
            <StatusBadge status="Pending" />
          </div>
          <div className="flex items-center gap-2">
            <p className="w-32 text-xs text-grey-text">NIN</p>
            <p className="text-xs font-medium text-dark-blue">12345678901</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="w-32 text-xs text-grey-text">Verification date:</p>
            <p className="text-xs font-medium text-dark-blue">12 Oct 2025</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="w-32 text-xs text-grey-text">Mode of ID:</p>
            <p className="text-xs font-medium text-dark-blue">
              National ID card
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="w-32 text-xs text-grey-text">Uploaded Document</p>
            <button className="flex items-center gap-1 text-xs text-primary hover:underline">
              <Eye size={12} />
              View Document
            </button>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export default KycInfoCard;
