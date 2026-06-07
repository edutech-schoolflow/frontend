"use client";

import { useEffect, useState } from "react";
import { getChildMessages } from "@/src/lib/api/parents";
import type { SchoolMessage } from "@/src/types/parent";
import Spinner from "./Spinner";

export default function MessagesTab({ studentId }: { studentId: string }) {
  const [messages, setMessages] = useState<SchoolMessage[] | undefined>(
    undefined
  );
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    getChildMessages(studentId).then(setMessages);
  }, [studentId]);

  if (messages === undefined) return <Spinner />;
  if (messages.length === 0)
    return (
      <p className="py-[48px] text-center text-[14px] text-[#888]">
        No messages from the school yet.
      </p>
    );

  return (
    <div className="flex flex-col gap-[10px]">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="cursor-pointer rounded-[10px] border border-[#e0e0e0] bg-white px-[20px] py-[16px] transition-colors hover:border-[#1ca95c]"
          onClick={() => setOpen(open === msg.id ? null : msg.id)}
        >
          <div className="flex items-start justify-between gap-[12px]">
            <div className="flex min-w-0 flex-1 items-start gap-[10px]">
              {!msg.read && (
                <span className="mt-[6px] h-[8px] w-[8px] shrink-0 rounded-full bg-[#1ca95c]" />
              )}
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-[14px] ${msg.read ? "text-[#555]" : "font-semibold text-[#1b1b1b]"}`}
                >
                  {msg.subject}
                </p>
                <p className="mt-[2px] text-[12px] text-[#888]">
                  From: {msg.from}
                </p>
              </div>
            </div>
            <p className="shrink-0 text-[12px] text-[#aaa]">
              {new Date(msg.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
          {open === msg.id && (
            <p className="mt-[14px] border-t border-[#f0f0f0] pt-[14px] text-[13px] leading-relaxed text-[#444]">
              {msg.body}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
