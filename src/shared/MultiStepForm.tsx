"use client";

import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface Step {
  label: string;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  children: ReactNode;
}

const MultiStepForm = ({
  steps,
  currentStep,
  children,
}: MultiStepFormProps) => (
  <div className="w-full max-w-xl mx-auto">
    {/* Step indicator */}
    <div className="flex items-center mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        return (
          <div
            key={step.label}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isCompleted && "bg-green-500 text-white",
                  isActive && "bg-brand-green text-white",
                  !isCompleted && !isActive && "bg-gray-200 text-gray-500"
                )}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span
                className={cn(
                  "mt-1 text-[10px] text-center w-16",
                  isActive ? "text-brand-green font-medium" : "text-grey-text"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mb-4",
                  index < currentStep ? "bg-green-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>

    {/* Step content */}
    <div>{children}</div>
  </div>
);

export default MultiStepForm;
