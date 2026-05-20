"use client";

// import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
// import { AuditFilterValue } from "@/src/shared/types/audit";
import { Button } from "../../ui/button";
import DateRangePicker from "@/src/components/ui/calendar-v2";
import { DateRange } from "react-day-picker";

// type AuditFilterProps = {
//   filterValue: AuditFilterValue;
//   setFilterValue: (val: AuditFilterValue) => void;
// };

const status_options = ["Failed", "Success"];
const actor_type_options = [
  "Musa Ibrahim",
  "System",
  "Fatime Sani",
  "David Chukwu",
];
const module_options = [
  "Operations",
  "Announcement",
  "Finance",
  "Customers",
  "Reports",
  "Settings",
];
const action_type_options = [
  "Create",
  "Send",
  "Export",
  "Status change",
  "Login",
  "Update",
];
const entity_type_options = [
  "Customer",
  "Billing account",
  "Meter",
  "Payment",
  "Ticket",
  "Announcement",
];

const AuditFilter = ({}) => {
  //   const [localFilter, setLocalFilter] = useState<AuditFilterValue>(filterValue);
  //   const [open, setOpen] = useState(false);

  //   const handleFilter = () => {
  //     setFilterValue(localFilter);
  //     setOpen(false);
  //   };

  //   const handleReset = () => {
  //   };

  return (
    //shadow-[0_1px_9.3px_0_rgba(0,0,0,0.10)]
    <div className="flex flex-col w-full px-4.5 py-5.5 items-start justify-center rounded-[6px] gap-6.5 bg-white ">
      <div className="flex flex-col gap-6.5 w-full">
        <div>
          <label className="text-text-heading text-[13px] font-medium tracking-[-0.13px]">
            Status
          </label>
          <Select>
            <SelectTrigger className="w-full border-neutral-strokes">
              <SelectValue placeholder="-- Select meter status --" />
            </SelectTrigger>
            <SelectContent>
              {status_options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-text-heading text-[13px] font-medium tracking-[-0.13px]">
            Actor Type
          </label>
          <Select>
            <SelectTrigger className="w-full border-neutral-strokes">
              <SelectValue placeholder="-- Select actor type --" />
            </SelectTrigger>
            <SelectContent>
              {actor_type_options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-text-heading text-[13px] font-medium tracking-[-0.13px]">
            Module
          </label>
          <Select>
            <SelectTrigger className="w-full border-neutral-strokes">
              <SelectValue placeholder="-- Select module --" />
            </SelectTrigger>
            <SelectContent>
              {module_options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-text-heading text-[13px] font-medium tracking-[-0.13px]">
            Action Type
          </label>
          <Select>
            <SelectTrigger className="w-full border-neutral-strokes">
              <SelectValue placeholder="-- Select actor type --" />
            </SelectTrigger>
            <SelectContent>
              {action_type_options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-text-heading text-[13px] font-medium tracking-[-0.13px]">
            Entity Type
          </label>
          <Select>
            <SelectTrigger className="w-full border-neutral-strokes">
              <SelectValue placeholder="-- Select entity type --" />
            </SelectTrigger>
            <SelectContent>
              {entity_type_options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-start gap-4 w-full">
        <Button
          variant="outline"
          className="px-6 text-text-heading font-semibold text-[13px] flex-1"
        >
          Reset
        </Button>
        <Button className="px-6 font-semibold text-[13px] flex-1">
          Filter
        </Button>
      </div>
    </div>
  );
};

export default AuditFilter;
