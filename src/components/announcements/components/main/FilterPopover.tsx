"use client";

import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Filter } from "lucide-react";
import { useState } from "react";

const FilterPopover = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
      <PopoverTrigger asChild>
        <Button className="border-[0.6px] rounded-[6px] border-neutral-strokes bg-white text-xs font-normal text-text-heading leading-[-0.12px] flex gap-1 justify-center">
          <Filter className="h-3.5 w-3.5" strokeWidth={1} />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-dark-blue">Status</p>
            <Select>
              <SelectTrigger className="w-full text-xs text-grey-text">
                <SelectValue placeholder="-- Select status --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="drafts">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-dark-blue">Channel</p>
            <Select>
              <SelectTrigger className="w-full text-xs text-grey-text">
                <SelectValue placeholder="-- Select channel --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-app">In-App</SelectItem>
                <SelectItem value="push notification">
                  Push Notification
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-dark-blue">Audience</p>
            <Select>
              <SelectTrigger className="w-full text-xs text-grey-text">
                <SelectValue placeholder="-- Select audience --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all users">All Users</SelectItem>
                <SelectItem value="prepaid users">Prepaid Users</SelectItem>
                <SelectItem value="location-based">Location-Based</SelectItem>
                <SelectItem value="postpaid users">Postpaid Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 font-semibold text-[13px] text-text-heading"
              onClick={() => setFilterOpen(false)}
            >
              Reset
            </Button>
            <Button
              className="flex-1 font-semibold text-[13px]"
              onClick={() => setFilterOpen(false)}
            >
              Filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
