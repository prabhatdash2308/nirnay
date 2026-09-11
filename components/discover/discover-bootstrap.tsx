"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { loadFinancialProfile } from "@/app/(app)/settings/financial-profile/actions";
import { loadWatchlistIds } from "@/app/(app)/discover/watchlist-actions";
import { DiscoverClient } from "@/components/discover/discover-client";
import type { FinancialProfileInput } from "@/lib/types/financial-profile";

/**
 * Client bootstrap wrapper for the Discover page.
 *
 * Until Next.js middleware / server-side auth is finalised, this component
 * handles the Firebase auth state resolution and data loading on the client.
 * This is consistent with the FinancialProfileLoader pattern from Phase 2.
 *
 * Rendering is not blocked — the DiscoverClient renders immediately with
 * available data; profile and watchlist IDs are passed down once loaded.
 */
export function DiscoverBootstrap() {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<FinancialProfileInput | null>(null);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setProfile(null);
        setWatchlistIds([]);
        setReady(true);
        return;
      }

      setIsAuthenticated(true);

      try {
        const idToken = await user.getIdToken();

        // Load profile and watchlist in parallel
        const [profileData, wlIds] = await Promise.allSettled([
          loadFinancialProfile(idToken),
          loadWatchlistIds(idToken),
        ]);

        if (profileData.status === "fulfilled" && profileData.value) {
          // Extract only FinancialProfileInput fields — omit DB-only fields
          const row = profileData.value;
          setProfile({
            monthly_income: row.monthly_income,
            monthly_expenses: row.monthly_expenses,
            monthly_investment_budget: row.monthly_investment_budget,
            annual_insurance_budget: row.annual_insurance_budget,
            financial_experience: row.financial_experience,
            risk_profile: row.risk_profile,
            primary_goals: row.primary_goals,
          });
        }

        if (wlIds.status === "fulfilled") {
          setWatchlistIds(wlIds.value);
        }
      } catch {
        // Non-blocking — Discover works without profile/watchlist
      } finally {
        setReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <DiscoverClient
      profile={profile}
      watchlistIds={watchlistIds}
      isAuthenticated={isAuthenticated}
    />
  );
}
