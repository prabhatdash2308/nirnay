"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { checkOnboardingStatus } from "@/services/financial-profile";
import { AppShellSkeleton } from "./app-shell-skeleton";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { MobileBottomNav } from "./mobile-bottom-nav";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function checkAuthAndOnboarding() {
      // If auth is still loading, wait
      if (loading) return;

      // 1. Unauthenticated -> Login
      if (!user) {
        router.push(`/auth?redirect_to=${encodeURIComponent(pathname)}`);
        return;
      }

      // 2. Authenticated -> Check onboarding
      try {
        const isComplete = await checkOnboardingStatus();
        
        if (!isComplete) {
          router.push("/onboarding");
          return;
        }

        // 3. Authenticated + Onboarded -> Ready
        setIsInitializing(false);
      } catch (error) {
        console.error("Failed to verify onboarding status", error);
        // Fallback for unexpected error
        router.push("/auth");
      }
    }

    checkAuthAndOnboarding();
  }, [user, loading, router, pathname]);

  if (loading || isInitializing) {
    return <AppShellSkeleton />;
  }

  // Authenticated + Onboarded layout
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">
          <div className="mx-auto max-w-6xl w-full animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
