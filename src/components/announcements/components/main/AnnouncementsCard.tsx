"use client";

import Image from "next/image";

const announcements = [
  {
    title: "Total Announcements",
    icon: "/icons/speaker2.svg",
    count: "128",
    message: "All announcements created",
  },
  {
    title: "Sent",
    icon: "/icons/speaker2.svg",
    count: "86",
    message: "Successfully delivered to users",
  },
  {
    title: "Scheduled",
    icon: "/icons/speaker2.svg",
    count: "24",
    message: "Pending delivery",
  },
  {
    title: "Drafts",
    icon: "/icons/folder.svg",
    count: "18",
    message: "Not yet published",
  },
];
const AnnouncementsCard = () => {
  return (
    <div className="flex gap-4 items-center">
      {announcements.map((item) => (
        <div
          key={item.title}
          className="h-30.75 flex-1 items-start bg-white p-4 rounded-[15px] border-[0.2px] border-neutral-strokes"
        >
          <div className="flex justify-between mt-2 mb-2">
            <span className="text-[13px] text-text-heading">{item.title}</span>
            <Image src={item.icon} width={16} height={16} alt={item.title} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[21px] font-semibold text-text-heading">
              {item.count}
            </span>
            <span className="text-[10px] text-neutral-input-text">
              {item.message}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementsCard;
