"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { onAuthStateChanged } from "firebase/auth";
import { loadFinancialProfile } from "@/app/(app)/settings/financial-profile/actions";
import { FinancialProfileForm } from "@/components/financial-profile/onboarding-form";
import type { FinancialProfileRow } from "@/lib/types/financial-profile";

/**
 * Client wrapper that:
 * 1. Waits for Firebase auth to resolve.
 * 2. Loads any existing financial profile from Supabase.
 * 3. Passes it as initialData to the form (so editing pre-populates fields).
 *
 * This separation keeps the form itself unaware of the auth/load lifecycle.
 */
export function FinancialProfileLoader() {
  type LoadState = "loading" | "unauthenticated" | "ready" | "error";

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [existingProfile, setExistingProfile] =
    useState<FinancialProfileRow | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // onAuthStateChanged resolves the initial auth state without a network call.
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setLoadState("unauthenticated");
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const profile = await loadFinancialProfile(idToken);
        setExistingProfile(profile);
        setLoadState("ready");
      } catch (err) {
        console.error("[FinancialProfileLoader]", err);
        setLoadError(
          err instanceof Error
            ? err.message
            : "Unable to load your financial profile."
        );
        setLoadState("error");
      }
    });

    return () => unsubscribe();
  }, []);

  if (loadState === "loading") {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (loadState === "unauthenticated") {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-sm font-medium text-foreground">
          You need to be signed in
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Sign in to set up your financial profile.
        </p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-sm font-medium text-destructive">
          Unable to load your profile
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {loadError ?? "An unexpected error occurred. Please try again."}
        </p>
      </div>
    );
  }

  return <FinancialProfileForm initialData={existingProfile} />;
}
