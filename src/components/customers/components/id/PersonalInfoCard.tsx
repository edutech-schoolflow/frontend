"use client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import { Button } from "@/src/components/ui/button";
import CardWrapper from "@/src/shared/CardWrapper";

interface Props {
  onEdit: () => void;
}

const PersonalInfoCard = ({ onEdit }: Props) => {
  return (
    <CardWrapper>
      <div className="flex items-center justify-between border-b border-border-default pb-4">
        <p className="text-sm font-semibold text-dark-blue">
          Personal Information
        </p>
        <Button variant="outline" className="text-xs" onClick={onEdit}>
          Edit details
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="w-32 text-xs text-grey-text">First Name:</p>
            <p className="text-xs font-medium text-dark-blue">Musa</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="w-32 text-xs text-grey-text">Last Name:</p>
            <p className="text-xs font-medium text-dark-blue">Ibrahim</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="w-32 text-xs text-grey-text">Email Address:</p>
            <p className="text-xs font-medium text-dark-blue">
              musa.ibrahim@email.com
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="w-32 text-xs text-grey-text">Middle Name:</p>
            <p className="text-xs font-medium text-dark-blue">Ahmed</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="w-32 text-xs text-grey-text">Phone Number:</p>
            <div className="">
              <input
                defaultValue="+234 903 000 0000"
                className="flex-1 bg-transparent text-xs text-dark-blue outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="w-32 text-xs text-grey-text">Customer status:</p>
            <StatusBadge status="Active" />
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export default PersonalInfoCard;
