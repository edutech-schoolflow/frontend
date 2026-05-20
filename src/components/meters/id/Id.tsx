"use client";

import { Button } from "@/src/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeactivateMeterDialog from "../component/DeactivateMeterDialog";
import LinkedCustomerCard from "../component/LinkedCustomerCard";
import MeterInfoCard from "../component/MeterInfoCard";
import TokenHistoryTab from "../component/TokenHistoryTab";

const MeterDetail = () => {
  const router = useRouter();
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-grey-text hover:text-dark-blue"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <Button
            variant="destructive"
            className="text-xs"
            onClick={() => setDeactivateOpen(true)}
          >
            Deactivate meter
          </Button>
        </div>

        <Tabs defaultValue="Overview">
          <TabsList variant="pill" className="w-[20%]">
            <TabsTrigger value="Overview">Overview</TabsTrigger>
            <TabsTrigger value="Token History">Token History</TabsTrigger>
          </TabsList>

          <TabsContent value="Overview" className="space-y-4 mt-4">
            <MeterInfoCard />
            <LinkedCustomerCard />
          </TabsContent>

          <TabsContent value="Token History" className="mt-4">
            <TokenHistoryTab />
          </TabsContent>
        </Tabs>
      </div>

      <DeactivateMeterDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
      />
    </>
  );
};

export default MeterDetail;
