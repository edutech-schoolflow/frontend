"use client";

import CardWrapper from "@/src/shared/CardWrapper";
import ModalCard from "@/src/modals/ModalCard";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const activityItems = [
  {
    id: 1,
    icon: (
      <Image src={"/icons/user-v1.svg"} alt="users" width={40} height={40} />
    ),
    title: "Payment ₦42,000 received - Meter 0239845209",
    desc: "Transaction was successful and credited to the customer's account.",
    time: "2h ago",
  },
  {
    id: 2,
    icon: (
      <Image
        src={"/icons/user-shield.svg"}
        alt="users"
        width={40}
        height={40}
      />
    ),
    title: "Ticket #4921 has been assigned to Mary U.",
    desc: "Customer complaint is now under review by the support team.",
    time: "2h ago",
  },
  {
    id: 3,
    icon: <Image src={"/icons/chip.svg"} alt="users" width={40} height={40} />,
    title: "6,124 postpaid bills were generated for the Novem...",
    desc: "Customers will receive notifications and can now view their bills.",
    time: "2h ago",
  },
  {
    id: 4,
    icon: <Image src={"/icons/chip.svg"} alt="users" width={40} height={40} />,
    title: "6,124 postpaid bills were generated for the Novem...",
    desc: "Customers will receive notifications and can now view their bills.",
    time: "2h ago",
  },
];
const ModalActivityItems = [
  {
    id: 1,
    icon: (
      <Image src={"/icons/user-v1.svg"} alt="users" width={40} height={40} />
    ),
    title: "Payment ₦42,000 received - Meter 0239845209",
    desc: "Transaction was successful and credited to the customer's account.",
    time: "2h ago",
  },
  {
    id: 2,
    icon: (
      <Image
        src={"/icons/user-shield.svg"}
        alt="users"
        width={40}
        height={40}
      />
    ),
    title: "Ticket #4921 has been assigned to Mary U.",
    desc: "Customer complaint is now under review by the support team.",
    time: "2h ago",
  },
  {
    id: 3,
    icon: <Image src={"/icons/chip.svg"} alt="users" width={40} height={40} />,
    title: "6,124 postpaid bills were generated for the Novem...",
    desc: "Customers will receive notifications and can now view their bills.",
    time: "2h ago",
  },
  {
    id: 4,
    icon: <Image src={"/icons/chip.svg"} alt="users" width={40} height={40} />,
    title: "6,124 postpaid bills were generated for the Novem...",
    desc: "Customers will receive notifications and can now view their bills.",
    time: "2h ago",
  },
  {
    id: 5,
    icon: <Image src={"/icons/chip.svg"} alt="users" width={40} height={40} />,
    title: "6,124 postpaid bills were generated for the Novem...",
    desc: "Customers will receive notifications and can now view their bills.",
    time: "2h ago",
  },
  {
    id: 6,
    icon: <Image src={"/icons/chip.svg"} alt="users" width={40} height={40} />,
    title: "6,124 postpaid bills were generated for the Novem...",
    desc: "Customers will receive notifications and can now view their bills.",
    time: "2h ago",
  },
  {
    id: 7,
    icon: <Image src={"/icons/chip.svg"} alt="users" width={40} height={40} />,
    title: "6,124 postpaid bills were generated for the Novem...",
    desc: "Customers will receive notifications and can now view their bills.",
    time: "2h ago",
  },
  {
    id: 8,
    icon: <Image src={"/icons/chip.svg"} alt="users" width={40} height={40} />,
    title: "6,124 postpaid bills were generated for the Novem...",
    desc: "Customers will receive notifications and can now view their bills.",
    time: "2h ago",
  },
];

const RecentActivity = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CardWrapper className="w-[50%]">
        <div className="flex flex-col w-full gap-3 pb-3 justify-between border-b border-border-default">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-dark-blue">
              Recent Activity
            </h2>
            <button
              onClick={() => setOpen(true)}
              className="flex cursor-pointer items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <p className="text-[11px] text-grey-text">
            Latest actions from users, admins, and system events.
          </p>
        </div>

        <div className="divide-y divide-border-default">
          {activityItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3 py-6">
              {item.icon}
              <div className="flex-1">
                <p className="text-xs font-medium text-dark-blue">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] text-grey-text">{item.desc}</p>
              </div>
              <span className="shrink-0 text-[10px] text-grey-text">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </CardWrapper>

      <ModalCard
        open={open}
        onClose={() => setOpen(false)}
        className="absolute right-4 h-[95%]"
        closeButtonClassName="rounded-md"
      >
        <div className="flex flex-col gap-1 border-b border-border-default mx-6 py-5 pr-12">
          <h2 className="text-sm font-semibold text-dark-blue">
            Recent Activity
          </h2>
          <p className="text-[11px] text-grey-text">
            Latest actions from users, admins, and system events.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border-default px-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">
          {ModalActivityItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3 py-5">
              {item.icon}
              <div className="flex-1">
                <p className="text-xs font-medium text-dark-blue">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] text-grey-text">{item.desc}</p>
              </div>
              <span className="shrink-0 text-[10px] text-grey-text">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </ModalCard>
    </>
  );
};

export default RecentActivity;
