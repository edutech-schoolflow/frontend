"use client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import { Button } from "@/src/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import CardWrapper from "@/src/shared/CardWrapper";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeactivateDialog from "./components/id/DeactivateDialog";
import EditPersonalDialog from "./components/id/EditPersonalDialog";
import KycInfoCard from "./components/id/KycInfoCard";
import MaintenanceRequestTab from "./components/id/MaintenanceRequestTab";
import OutagesTab from "./components/id/OutagesTab";
import PaymentsTab from "./components/id/PaymentsTab";
import PersonalInfoCard from "./components/id/PersonalInfoCard";
import SavedAccountsTab from "./components/id/SavedAccountsTab";
import UpdateKycDialog from "./components/id/UpdateKycDialog";

const CustomerDetail = () => {
  const router = useRouter();
  const [editPersonalOpen, setEditPersonalOpen] = useState(false);
  const [updateKycOpen, setUpdateKycOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  return (
    <div className="space-y-4">
      <CardWrapper className="space-y-4 py-6 px-6">
        <div className="flex justify-between">
          <Button
            variant={"link"}
            onClick={() => router.back()}
            className=" text-grey-text w-fit hover:text-dark-blue"
            size={"icon-sm"}
          >
            <ArrowLeft size={14} />
            Back
          </Button>
          <Button
            variant="destructive"
            className="text-xs"
            onClick={() => setDeactivateOpen(true)}
          >
            Deactivate customer
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 overflow-hidden rounded-full">
              <Image
                src="/images/png/profile-placeholder.png"
                alt="Musa Ibrahim"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-dark-blue">
                Musa Ibrahim
              </p>
              <p className="text-xs text-grey-text">Customer ID: CUS-10932</p>
            </div>
          </div>
          <StatusBadge status="Active" />
        </div>
      </CardWrapper>

      <Tabs defaultValue="Profile">
        <TabsList variant="pill">
          <TabsTrigger value="Profile">Profile</TabsTrigger>
          <TabsTrigger value="Saved accounts">Saved accounts</TabsTrigger>
          <TabsTrigger value="Payments">Payments</TabsTrigger>
          <TabsTrigger value="Outages">Outages</TabsTrigger>
          <TabsTrigger value="Maintenance Request">
            Maintenance Request
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Profile" className="space-y-4 mt-4">
          <PersonalInfoCard onEdit={() => setEditPersonalOpen(true)} />
          <KycInfoCard onUpdate={() => setUpdateKycOpen(true)} />
        </TabsContent>

        <TabsContent value="Saved accounts" className="mt-4">
          <SavedAccountsTab />
        </TabsContent>

        <TabsContent value="Payments" className="mt-4">
          <PaymentsTab />
        </TabsContent>

        <TabsContent value="Outages" className="mt-4">
          <OutagesTab />
        </TabsContent>

        <TabsContent value="Maintenance Request" className="mt-4">
          <MaintenanceRequestTab />
        </TabsContent>
      </Tabs>

      <EditPersonalDialog
        open={editPersonalOpen}
        onOpenChange={setEditPersonalOpen}
      />
      <UpdateKycDialog open={updateKycOpen} onOpenChange={setUpdateKycOpen} />
      <DeactivateDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
      />
    </div>
  );
};

export default CustomerDetail;
