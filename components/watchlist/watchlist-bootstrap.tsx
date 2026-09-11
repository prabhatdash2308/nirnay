"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { loadFinancialProfile } from "@/app/(app)/settings/financial-profile/actions";
import { loadWatchlistIds } from "@/app/(app)/discover/watchlist-actions";
import { WatchlistClient } from "./watchlist-client";
import type { FinancialProfileInput } from "@/lib/types/financial-profile";

/**
 * Client bootstrap wrapper for the Watchlist page.
 *
 * This component handles Firebase auth state resolution and data loading on the client.
 * Consistent with DiscoverBootstrap and Portfolio/Goals architecture.
 */
export function WatchlistBootstrap() {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<FinancialProfileInput | null>(null);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [firebaseIdToken, setFirebaseIdToken] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setFirebaseIdToken(null);
        setProfile(null);
        setWatchlistIds([]);
        setReady(true);
        return;
      }

      setIsAuthenticated(true);
      setLoadError(null);

      try {
        const idToken = await user.getIdToken();
        setFirebaseIdToken(idToken);

        // Load profile and watchlist in parallel
        const [profileData, wlIds] = await Promise.allSettled([
          loadFinancialProfile(idToken),
          loadWatchlistIds(idToken),
        ]);

        if (profileData.status === "fulfilled" && profileData.value) {
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
        } else {
          setLoadError("Unable to load your watchlist. Please try again.");
        }
      } catch (err) {
        console.error("Watchlist bootstrap error:", err);
        setLoadError("Unable to load your watchlist. Please try again.");
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
    <WatchlistClient
      profile={profile}
      initialWatchlistIds={watchlistIds}
      isAuthenticated={isAuthenticated}
      firebaseIdToken={firebaseIdToken}
      loadError={loadError}
    />
  );
}
