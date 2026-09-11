"use client";

import { ReactNode } from "react";
import { useOnboarding } from "./onboarding-provider";
import { Check } from "lucide-react";

export function OnboardingShell({ children }: { children: ReactNode }) {
  const { currentStep, totalSteps, isComplete } = useOnboarding();

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-3xl border border-border text-center shadow-sm">
          <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
            <Check className="size-8" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Profile Complete</h2>
          <p className="text-muted-foreground mb-8">
            Your financial foundation is ready. You're ready to start using NIRNAY.
          </p>
          <div className="p-4 bg-muted/50 rounded-xl text-sm text-muted-foreground border border-border">
            (The authenticated dashboard architecture will be implemented in the next phase. Your data is currently stored in active memory.)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-primary flex items-center justify-center">
              <div className="size-2 rounded-full bg-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">NIRNAY</span>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-xl px-4 sm:px-6 py-12 md:py-20">
          <div className="bg-card rounded-3xl border border-border p-6 md:p-10 shadow-sm">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
