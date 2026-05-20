"use client";

import { Button } from "@/src/components/ui/button";
import { SearchInput } from "@/src/components/ui/SearchInput";
import CardWrapper from "@/src/shared/CardWrapper";
import { Download } from "lucide-react";
import CustomersTable from "./components/main/CustomersTable";
import DateFilterPopover from "./components/main/DateFilterPopover";
import FilterPopover from "./components/main/FilterPopover";

const Customers = () => {
  return (
    <CardWrapper>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <SearchInput placeholder="Search by name, phone or email" />

          <div className="flex items-center gap-2">
            <FilterPopover />
            <DateFilterPopover />
            <Button className="flex items-center gap-1.5 text-xs">
              <Download size={13} />
              Export CSV
            </Button>
          </div>
        </div>

        <CustomersTable />
      </div>
    </CardWrapper>
  );
};

export default Customers;
