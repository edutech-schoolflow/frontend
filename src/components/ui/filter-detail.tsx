"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { XCircle } from "lucide-react";

import { useState } from "react";
import { AuditFilterValue } from "@/src/shared/types/audit";

//props for the filter details
type FilterDetailProps = {
  filterValue: AuditFilterValue;
  setFilterValue: (val: AuditFilterValue) => void;
};

const FilterDetail = ({ filterValue, setFilterValue }: FilterDetailProps) => {
  const [filterPopover, setFilterPopover] = useState(false);

  //deriving active filters
  const filterValuesData = Object.entries(filterValue).filter(
    ([key, val]) => val !== undefined
  );

  const removeFilter = (key: string) => {
    setFilterValue({ ...filterValue, [key]: undefined });
  };

  const clearFilters = () => {
    setFilterValue({
      status: undefined,
      actor_type: undefined,
      module: undefined,
      action_type: undefined,
      entity_type: undefined,
    });
  };

  return (
    <div
      className="ml-2 flex items-center gap-1.5"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {filterValuesData.slice(0, 2).map(([key, value]) => (
        <div
          key={key}
          className="flex items-center gap-1 rounded-2xl border border-primary-foreground bg-white px-2 text-primary-foreground"
        >
          <span
            className="cursor-pointer py-2"
            onClick={() => removeFilter(key)}
          >
            <XCircle />
          </span>
          <span className="capitalize">{key.replaceAll("_", " ")}:</span>
          <span>{value}</span>
        </div>
      ))}

      {filterValuesData.length > 2 && (
        <Popover open={filterPopover} onOpenChange={setFilterPopover}>
          <PopoverTrigger asChild>
            <div className="font-bold text-primary-foreground">
              +{filterValuesData.length - 2} more
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="items-start flex flex-col text-start">
              <h5 className="pb-4 font-semibold">Filtered By</h5>
              <div className="flex flex-col gap-5.5 border-y py-4">
                {filterValuesData.map(([key, value]) => (
                  <div className="flex items-center justify-between" key={key}>
                    <p className="max-w-57.5 overflow-hidden text-ellipsis capitalize">
                      {key.replaceAll("_", " ")}:{" "}
                      <span className="font-semibold">{value}</span>
                    </p>
                    <p onClick={() => removeFilter(key)}>
                      <XCircle />
                    </p>
                  </div>
                ))}
              </div>
              <p
                onClick={clearFilters}
                className="pt-4 text-primary-foreground"
              >
                Clear Filters
              </p>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default FilterDetail;
