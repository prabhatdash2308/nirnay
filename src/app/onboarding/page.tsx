"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { OnboardingProvider, useOnboarding } from "@/components/onboarding/onboarding-provider";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { BasicsStep } from "@/components/onboarding/basics-step";
import { IncomeStep } from "@/components/onboarding/income-step";
import { CommitmentsStep } from "@/components/onboarding/commitments-step";
import { checkOnboardingStatus } from "@/services/financial-profile";
import { Loader2 } from "lucide-react";

function OnboardingWizard() {
  const { currentStep } = useOnboarding();

  return (
    <OnboardingShell>
      {currentStep === 1 && <BasicsStep />}
      {currentStep === 2 && <IncomeStep />}
      {currentStep === 3 && <CommitmentsStep />}
    </OnboardingShell>
  );
}

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [alreadyOnboarded, setAlreadyOnboarded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth?redirect_to=/onboarding");
    }
  }, [loading, user, router]);

  useEffect(() => {
    async function checkStatus() {
      if (user) {
        try {
          const status = await checkOnboardingStatus();
          setAlreadyOnboarded(status);
        } catch (e) {
          console.error(e);
        } finally {
          setIsCheckingProfile(false);
        }
      }
    }

    if (!loading && user) {
      checkStatus();
    }
  }, [loading, user]);

  // Avoid hydration mismatch and guard rendering
  if (!mounted || loading || !user || isCheckingProfile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (alreadyOnboarded) {
    // Phase 7: Redirect to dashboard since it now exists
    router.replace("/dashboard");
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <OnboardingProvider>
      <OnboardingWizard />
    </OnboardingProvider>
  );
}
