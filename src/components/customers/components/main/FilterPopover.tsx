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
      <PopoverContent align="end" className="w-72 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-dark-blue">Account Type</p>
            <Select>
              <SelectTrigger className="w-full text-xs text-grey-text">
                <SelectValue placeholder="-- Select account type --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prepaid">Prepaid</SelectItem>
                <SelectItem value="postpaid">Postpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-dark-blue">KYC Status</p>
            <Select>
              <SelectTrigger className="w-full text-xs text-grey-text">
                <SelectValue placeholder="-- Select kyc status --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-dark-blue">
              Customer Status
            </p>
            <Select>
              <SelectTrigger className="w-full text-xs text-grey-text">
                <SelectValue placeholder="-- Select customer status --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => setFilterOpen(false)}
            >
              Reset
            </Button>
            <Button
              className="flex-1 text-xs"
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
