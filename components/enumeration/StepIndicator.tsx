"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { id: 1, title: "Household Base", subtitle: "Premises & Ownership" },
  { id: 2, title: "Housing & Amenities", subtitle: "Water, Power, Latrine" },
  { id: 3, title: "Household Assets", subtitle: "Phones, Internet, Vehicles" },
  { id: 4, title: "Family Members Roster", subtitle: "Demographics & Caste" },
  { id: 5, title: "Review & QR Pass", subtitle: "Audit & Local Pass" },
];

export function StepIndicator({
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
      {/* Mobile step bar */}
      <div className="flex items-center justify-between sm:hidden mb-2">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-xs font-semibold text-foreground">
          {STEPS[currentStep - 1]?.title}
        </span>
      </div>

      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-border -z-10" />
        {/* Active progress line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-300 -z-10"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                if (step.id <= currentStep) {
                  onStepClick(step.id);
                }
              }}
              className="flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              <div
                className={cn(
                  "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all shadow-xs",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                    ? "border-saffron bg-background text-saffron-dark ring-4 ring-saffron/20 scale-105"
                    : "border-border bg-card text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "mt-1.5 hidden text-center sm:block text-[11px] font-semibold transition-colors max-w-[100px]",
                  isCurrent
                    ? "text-primary"
                    : isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
