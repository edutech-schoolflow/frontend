"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import DateRangePicker from "@/src/components/ui/calendar-v2";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/src/components/ui/button";

const DateFilterPopover = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="border-[0.6px] rounded-[6px] border-neutral-strokes bg-white text-xs font-normal text-text-heading leading-[-0.12px] flex gap-1">
          <CalendarDays className="h-3.5 w-3.5" strokeWidth={1} />
          Date sent:
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DateRangePicker
          selected={dateRange}
          onSelect={setDateRange}
          fromYear={2015}
          toYear={new Date().getFullYear()}
          disabled={(val) => val > new Date() || val < new Date("2015-01-01")}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateFilterPopover;
