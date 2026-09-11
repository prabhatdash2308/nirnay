"use client";

import { useState } from "react";
import { signInWithEmail } from "@/lib/auth/client";
import { mapFirebaseError } from "@/lib/auth/error-mapper";
import { getSafeRedirect } from "@/lib/auth/redirect";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function LoginForm({ onModeChange }: { onModeChange: (mode: "signup" | "forgot") => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmail(email, password);
      
      const { checkOnboardingStatus } = await import("@/services/financial-profile");
      const hasProfile = await checkOnboardingStatus();
      const defaultRedirect = hasProfile ? "/dashboard" : "/onboarding";
      
      const requestedRedirect = searchParams.get("redirect_to");
      const finalRedirect = getSafeRedirect(requestedRedirect, defaultRedirect);
      
      router.push(finalRedirect);
    } catch (err: any) {
      console.error(err);
      setError(mapFirebaseError(err));
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/50">
          {error}
        </div>
      )}
      
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className="flex h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <button
            type="button"
            onClick={() => onModeChange("forgot")}
            className="text-xs font-medium text-primary hover:underline focus:outline-none"
          >
            Forgot password?
          </button>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
          className="flex h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full h-11 text-base mt-2">
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        Sign in
      </Button>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => onModeChange("signup")}
            className="font-medium text-primary hover:underline focus:outline-none"
          >
            Create one
          </button>
        </p>
      </div>
    </form>
  );
}
