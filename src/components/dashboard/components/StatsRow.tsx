import CardWrapper from "@/src/shared/CardWrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

const StatsRow = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-4 gap-4">
      <CardWrapper className="flex flex-col gap-1 py-3!">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-grey-text">
            Total Customers
          </span>
          <Image
            src={"/icons/user-group.svg"}
            alt="users"
            width={50}
            height={50}
          />
        </div>
        <p className="text-2xl font-bold text-dark-blue">42,318</p>
        <p className="text-[11px] text-grey-text">
          All registered users on MyKEDCO
        </p>
      </CardWrapper>

      <CardWrapper className="flex flex-col gap-1 py-3!">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-grey-text">
            Active Prepaid Meters
          </span>
          <Image src={"/icons/bulb.svg"} alt="users" width={50} height={50} />
        </div>
        <p className="text-2xl font-bold text-dark-blue">28,764</p>
        <p className="text-[11px] text-grey-text">
          Prepaid customers with active meters
        </p>
      </CardWrapper>

      <CardWrapper className="flex flex-col gap-1 py-3!">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-grey-text">
            Active Postpaid Accounts
          </span>
          <Image
            src={"/icons/bulb-v2.svg"}
            alt="users"
            width={50}
            height={50}
          />
        </div>
        <p className="text-2xl font-bold text-dark-blue">13,554</p>
        <p className="text-[11px] text-grey-text">Customers billed monthly</p>
      </CardWrapper>

      <CardWrapper className="flex flex-col gap-1 py-3!">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-grey-text">
            Unpaid Postpaid Bills
          </span>
          <Image
            src={"/icons/receipt.svg"}
            alt="users"
            width={50}
            height={50}
          />
        </div>
        <p className="text-2xl font-bold text-dark-blue">₦12,540,000</p>
        <p className="text-[11px] text-grey-text">Current billing cycle</p>
      </CardWrapper>
    </div>

    <div className="grid grid-cols-4 gap-4">
      <CardWrapper className="flex flex-col gap-1 py-3!">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-grey-text">Payments</span>
            <Popover>
              <PopoverTrigger className="flex items-center gap-1 rounded-sm border border-border-default px-2 py-2 text-[10px] text-grey-text cursor-pointer">
                Today <ChevronDown size={10} />
              </PopoverTrigger>
              <PopoverContent className="w-32 p-1">
                <div className="flex flex-col">
                  <button className="rounded px-3 py-1.5 text-left text-xs text-grey-text hover:bg-surface-subtle">
                    Today
                  </button>
                  <button className="rounded px-3 py-1.5 text-left text-xs text-grey-text hover:bg-surface-subtle">
                    This Week
                  </button>
                  <button className="rounded px-3 py-1.5 text-left text-xs text-grey-text hover:bg-surface-subtle">
                    This Month
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Image src={"/icons/money.svg"} alt="users" width={50} height={50} />
        </div>
        <p className="text-2xl font-bold text-dark-blue">24,583</p>
        <p className="text-[11px] text-grey-text">
          Total prepaid & postpaid payments
        </p>
      </CardWrapper>

      <CardWrapper className="flex flex-col gap-1 py-3!">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-grey-text">
            Active Outages
          </span>
          <Image
            src={"/icons/warning.svg"}
            alt="users"
            width={50}
            height={50}
          />
        </div>
        <p className="text-2xl font-bold text-dark-blue">6 Events</p>
        <p className="text-[11px] text-grey-text">Affecting 1,432 customers</p>
      </CardWrapper>

      <CardWrapper className="flex flex-col gap-1 py-3!">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-grey-text">
            Open Tickets
          </span>
          <Image
            src={"/icons/pen-paper.svg"}
            alt="users"
            width={50}
            height={50}
          />
        </div>
        <p className="text-2xl font-bold text-dark-blue">312</p>
        <p className="text-[11px] text-grey-text">46 new today</p>
      </CardWrapper>

      <CardWrapper className="flex flex-col gap-1 py-3!">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-grey-text">
            Total Tickets Resolved
          </span>
          <Image
            src={"/icons/checkmark.svg"}
            alt="users"
            width={50}
            height={50}
          />
        </div>
        <p className="text-2xl font-bold text-dark-blue">1,240</p>
        <p className="text-[11px] text-grey-text">
          Tickets resolved in the last 30 days.
        </p>
      </CardWrapper>
    </div>
  </div>
);

export default StatsRow;
