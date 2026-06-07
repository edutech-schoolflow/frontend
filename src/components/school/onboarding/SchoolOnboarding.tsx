"use client";

import { useState } from "react";
import MultiStepForm from "@/src/shared/MultiStepForm";
import {
  uploadLogo,
  saveOnboardingClasses,
  saveAcademicCalendar,
} from "@/src/lib/api/schools";
import Step1Logo from "./Step1Logo";
import Step2Classes from "./Step2Classes";
import Step3Calendar from "./Step3Calendar";
import Step4Proprietor from "./Step4Proprietor";
import Step5Summary from "./Step5Summary";

const STEPS = [
  { label: "Logo" },
  { label: "Classes" },
  { label: "Calendar" },
  { label: "Proprietor" },
  { label: "Summary" },
];

type WizardData = {
  logoFile: File | null;
  logoPreviewUrl: string | null;
  selectedLevels: string[];
  academicYear: string;
  currentTerm: "first" | "second" | "third";
  termStart: string;
  termEnd: string;
  proprietorName: string;
  proprietorEmail: string;
  proprietorPhone: string;
  proprietorInvited: boolean;
};

const INITIAL: WizardData = {
  logoFile: null,
  logoPreviewUrl: null,
  selectedLevels: [],
  academicYear: "2024/2025",
  currentTerm: "second",
  termStart: "",
  termEnd: "",
  proprietorName: "",
  proprietorEmail: "",
  proprietorPhone: "",
  proprietorInvited: false,
};

export default function SchoolOnboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL);

  const update = (partial: Partial<WizardData>) =>
    setData((d) => ({ ...d, ...partial }));
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  async function handleLogoNext() {
    if (data.logoFile) await uploadLogo(data.logoFile);
    next();
  }

  async function handleClassesNext() {
    await saveOnboardingClasses(data.selectedLevels);
    next();
  }

  async function handleCalendarNext() {
    await saveAcademicCalendar({
      academicYear: data.academicYear,
      term: data.currentTerm,
      startDate: data.termStart,
      endDate: data.termEnd,
    });
    next();
  }

  return (
    <div className="min-h-screen bg-surface-muted px-4 py-12">
      <MultiStepForm steps={STEPS} currentStep={step}>
        {step === 0 && (
          <Step1Logo
            logoFile={data.logoFile}
            logoPreviewUrl={data.logoPreviewUrl}
            onChange={(file, url) =>
              update({ logoFile: file, logoPreviewUrl: url })
            }
            onNext={handleLogoNext}
            onSkip={next}
          />
        )}
        {step === 1 && (
          <Step2Classes
            selected={data.selectedLevels}
            onChange={(levels) => update({ selectedLevels: levels })}
            onNext={handleClassesNext}
            onBack={back}
          />
        )}
        {step === 2 && (
          <Step3Calendar
            academicYear={data.academicYear}
            currentTerm={data.currentTerm}
            termStart={data.termStart}
            termEnd={data.termEnd}
            onChange={update}
            onNext={handleCalendarNext}
            onBack={back}
          />
        )}
        {step === 3 && (
          <Step4Proprietor
            name={data.proprietorName}
            email={data.proprietorEmail}
            phone={data.proprietorPhone}
            invited={data.proprietorInvited}
            onChange={update}
            onInvited={() => update({ proprietorInvited: true })}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 4 && (
          <Step5Summary
            logoUploaded={!!data.logoPreviewUrl}
            classesConfigured={data.selectedLevels.length > 0}
            calendarSet={!!data.termStart && !!data.termEnd}
            proprietorInvited={data.proprietorInvited}
          />
        )}
      </MultiStepForm>
    </div>
  );
}
