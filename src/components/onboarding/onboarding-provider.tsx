"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { OnboardingData } from "@/types/onboarding";
import { saveFinancialProfile } from "@/services/financial-profile";

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isComplete: boolean;
  completeOnboarding: () => Promise<void>;
}

const defaultData: OnboardingData = {
  displayName: "",
  currency: "INR",
  incomeAmount: null,
  incomeFrequency: null,
  fixedCommitments: {
    rent: 0,
    utilities: 0,
    other: 0,
  },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = 3;

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const completeOnboarding = async (): Promise<void> => {
    // Validation
    if (!data.displayName.trim() || !data.currency) {
      throw new Error("Missing basics data.");
    }
    
    // Save to Supabase
    await saveFinancialProfile(data);
    
    setIsComplete(true);
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        totalSteps,
        data,
        updateData,
        nextStep,
        prevStep,
        isComplete,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
