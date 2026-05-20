"use client";

import CardWrapper from "@/src/shared/CardWrapper";
import AnnouncementsCard from "./components/main/AnnouncementsCard";
import AnnouncementsTable from "./components/main/AnnouncementsTable";
import { SearchInput } from "../ui/SearchInput";
import { Button } from "../ui/button";
import FilterPopover from "./components/main/FilterPopover";
import DateFilterPopover from "./components/main/DateFilterPopover";
import CreateAnnouncement from "./components/id/CreateAnnouncement";
import { useState } from "react";

const Announcements = () => {
  const [openCreate, setOpenCreate] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <AnnouncementsCard />
      <CardWrapper>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <SearchInput placeholder="Search by title" />

            <div className="flex items-center gap-2">
              <FilterPopover />
              <DateFilterPopover />
              <Button
                className="flex items-center gap-1.5 text-xs"
                onClick={() => setOpenCreate(true)}
              >
                Create Announcement
              </Button>
            </div>
          </div>

          <AnnouncementsTable />
        </div>
      </CardWrapper>
      <CreateAnnouncement open={openCreate} onOpenChange={setOpenCreate} />
    </div>
  );
};

export default Announcements;
