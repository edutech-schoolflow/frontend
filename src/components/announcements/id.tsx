"use client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import { Button } from "@/src/components/ui/button";
import CardWrapper from "@/src/shared/CardWrapper";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const AnnouncementDetail = () => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Button
        variant="link"
        onClick={() => router.back()}
        className="text-grey-text w-fit hover:text-dark-blue"
        size="icon-sm"
      >
        <ArrowLeft size={14} />
        Back
      </Button>

      <CardWrapper>
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <hr className="mb-4" />
        <div className="grid grid-cols-2 gap-y-6">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <span className="text-grey-text text-sm">Title:</span>
              <span className="font-semibold text-sm">Meter Price Update</span>
            </div>
            <div className="flex gap-4">
              <span className="text-grey-text text-sm">Channel:</span>
              <span className="font-semibold text-sm">In-App</span>
            </div>
            <div className="flex gap-4">
              <span className="text-grey-text text-sm">Status:</span>
              <StatusBadge status="Sent" />
            </div>
            <div className="flex gap-4">
              <span className="text-grey-text text-sm">Audience:</span>
              <span className="font-semibold text-sm">Postpaid Users</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <span className="text-grey-text text-sm">Created By:</span>
              <span className="font-semibold text-sm">Kabiru Yusuf</span>
            </div>
            <div className="flex gap-4">
              <span className="text-grey-text text-sm">Created On:</span>
              <span className="text-sm">12/01/2025</span>
            </div>
            <div className="flex gap-4">
              <span className="text-grey-text text-sm">Scheduled Date:</span>
              <span className="font-semibold text-sm">4:00 PM, 15/01/2025</span>
            </div>
            <div className="flex gap-4">
              <span className="text-grey-text text-sm">Sent On:</span>
              <span className="text-sm">---</span>
            </div>
          </div>
        </div>
      </CardWrapper>

      <CardWrapper>
        <h2 className="text-xl font-semibold mb-4">Announcement Information</h2>
        <hr className="mb-4" />
        <div className="flex gap-4">
          <span className="text-grey-text text-sm shrink-0">Message Body:</span>
          <p className="text-sm leading-relaxed text-dark-blue">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </p>
        </div>
      </CardWrapper>

      <CardWrapper>
        <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
        <hr className="mb-4" />
        <div className="grid grid-cols-2 gap-y-6">
          <div className="flex gap-4">
            <span className="text-grey-text text-sm">Total Recipients:</span>
            <span className="font-semibold text-sm">5000</span>
          </div>
          <div className="flex gap-4">
            <span className="text-grey-text text-sm">Failed:</span>
            <span className="font-semibold text-sm">171</span>
          </div>
          <div className="flex gap-4">
            <span className="text-grey-text text-sm">Delivered:</span>
            <span className="font-semibold text-sm">4829</span>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
};

export default AnnouncementDetail;
