"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Logo from "@/src/components/ui/Logo";
import Image from "next/image";
import Link from "next/link";
import ParentSignUpForm from "./ParentSignUpForm";
import ParentLoginForm from "./ParentLoginForm";
import ParentVerifyEmail from "./ParentVerifyEmail";

type Tab = "signup" | "login";
type Step = "form" | "verify";

interface Props {
  initialTab?: Tab;
}

export default function ParentAuthCard({ initialTab = "signup" }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [step, setStep] = useState<Step>("form");
  const [verifyPhone, setVerifyPhone] = useState("");

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setStep("form");
  };

  return (
    /*
     * Figma: 1440×919 frame
     * Left  W:710  → col 1
     * Right W:730  → col 2  (1440 − 710)
     * Form  W:526, at X:815 → ml:105px from right panel left edge
     */
    <div
      className="h-screen"
      style={{ display: "grid", gridTemplateColumns: "710px 1fr" }}
    >
      {/* ── Left: green photo panel ──────────────────────────────────── */}
      <div className="relative overflow-hidden bg-brand-green">
        <Link href="/" className="absolute left-[80px] top-[57px] z-10">
          <Logo size={30} textColor="white" />
        </Link>
        <Image
          src="/images/svg/parentchildscreen.svg"
          alt="Parent and child"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* ── Right: white panel ───────────────────────────────────────── */}
      <div className="relative overflow-y-auto bg-white">
        {/* Close — top-right of right panel */}
        <button
          onClick={() => router.push("/")}
          className="absolute right-8 top-8 flex h-8 w-8 items-center justify-center rounded-full text-text-body transition-colors hover:bg-surface-subtle"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/*
         * Padding constrains form to 526px at the Figma viewport (1440px):
         * right panel (730px) − pl(105px) − pr(99px) = 526px ✓
         * At wider viewports the form grows proportionally — no dead space.
         */}
        <div
          className="flex flex-col py-14"
          style={{ paddingLeft: "105px", paddingRight: "99px" }}
        >
          {/* Tabs */}
          <div className="mb-8 flex gap-[22px]">
            <button
              onClick={() => handleTabChange("signup")}
              className={`w-[251px] rounded-[10px] p-[10px] text-[16px] font-normal transition-colors ${
                activeTab === "signup"
                  ? "bg-brand-green text-white"
                  : "bg-[#eee] text-[#1b1b1b] hover:bg-neutral-200"
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => handleTabChange("login")}
              className={`w-[251px] rounded-[10px] p-[10px] text-[16px] font-normal transition-colors ${
                activeTab === "login"
                  ? "bg-brand-green text-white"
                  : "bg-[#eee] text-[#1b1b1b] hover:bg-neutral-200"
              }`}
            >
              Login
            </button>
          </div>

          {activeTab === "signup" && step === "form" && (
            <ParentSignUpForm
              onSuccess={(phone) => {
                setVerifyPhone(phone);
                setStep("verify");
              }}
            />
          )}

          {activeTab === "signup" && step === "verify" && (
            <ParentVerifyEmail
              phone={verifyPhone}
              onVerified={() => {
                // Stay on this page but flip to the login tab — reliable, unlike a
                // same-shell route push which left the verify step mounted.
                setVerifyPhone("");
                setStep("form");
                setActiveTab("login");
              }}
            />
          )}

          {activeTab === "login" && <ParentLoginForm />}
        </div>
      </div>
    </div>
  );
}
