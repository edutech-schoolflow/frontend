"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserRound } from "lucide-react";
import { getParentChildren } from "@/src/lib/api/parents";
import type { ParentChild } from "@/src/types/parent";
import FeesTab from "./tabs/FeesTab";
import ResultsTab from "./tabs/ResultsTab";
import AttendanceTab from "./tabs/AttendanceTab";
import MessagesTab from "./tabs/MessagesTab";

type Tab = "fees" | "results" | "attendance" | "messages";

const TABS: { id: Tab; label: string }[] = [
  { id: "fees", label: "Fees" },
  { id: "results", label: "Results" },
  { id: "attendance", label: "Attendance" },
  { id: "messages", label: "Messages" },
];

export default function ChildDetail() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [child, setChild] = useState<ParentChild | null | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<Tab>("fees");

  useEffect(() => {
    getParentChildren().then((children) => {
      setChild(children.find((c) => c.studentId === studentId) ?? null);
    });
  }, [studentId]);

  if (child === undefined)
    return (
      <div className="flex justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-2 border-[#eee] border-t-[#1ca95c]" />
      </div>
    );

  if (!child)
    return (
      <div className="px-[88px] py-[60px]">
        <p className="text-[14px] text-[#888]">Child not found.</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-[10px] text-[14px] text-[#1ca95c] underline"
        >
          Go back
        </button>
      </div>
    );

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-[24px] flex items-center gap-[8px] text-[14px] text-[#666] transition-colors hover:text-[#1b1b1b]"
      >
        <ArrowLeft className="h-[16px] w-[16px]" />
        Back
      </button>

      <div className="mb-[28px] flex items-center gap-[16px]">
        <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-[#e8f5ee]">
          <UserRound className="h-[28px] w-[28px] text-[#1ca95c]" />
        </div>
        <div>
          <h1 className="text-[22px] font-semibold text-[#1b1b1b]">
            {child.studentName}
          </h1>
          <p className="text-[13px] text-[#888]">
            {child.className} · {child.schoolName}
          </p>
        </div>
      </div>

      <div className="mb-[28px] flex gap-[4px] border-b border-[#e0e0e0]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-[20px] py-[10px] text-[14px] transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-[#1ca95c] font-medium text-[#1ca95c]"
                : "text-[#888] hover:text-[#555]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "fees" && <FeesTab studentId={studentId} />}
      {activeTab === "results" && <ResultsTab studentId={studentId} />}
      {activeTab === "attendance" && <AttendanceTab studentId={studentId} />}
      {activeTab === "messages" && <MessagesTab studentId={studentId} />}
    </div>
  );
}
