"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { useAuth } from "@/hooks/use-auth";
import { getSafeRedirect } from "@/lib/auth/redirect";
import { Loader2, LogOut, ArrowRight, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { firebaseAuth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import { checkOnboardingStatus } from "@/services/financial-profile";

type AuthMode = "login" | "signup" | "forgot";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isContinuing, setIsContinuing] = useState(false);
  
  // Read mode from query param, default to login
  const queryMode = searchParams.get("mode");
  const initialMode: AuthMode = 
    queryMode === "signup" ? "signup" : 
    queryMode === "forgot" ? "forgot" : "login";
    
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Update URL silently when mode changes
  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    const params = new URLSearchParams(searchParams.toString());
    if (newMode === "login") {
      params.delete("mode");
    } else {
      params.set("mode", newMode);
    }
    const newPath = params.toString() ? `/auth?${params.toString()}` : "/auth";
    window.history.replaceState(null, "", newPath);
  };

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleContinue = async () => {
    setIsContinuing(true);
    try {
      const hasProfile = await checkOnboardingStatus();
      if (hasProfile) {
        const requestedRedirect = searchParams.get("redirect_to");
        const finalRedirect = getSafeRedirect(requestedRedirect, "/dashboard");
        router.push(finalRedirect);
      } else {
        router.push("/onboarding");
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setIsContinuing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Authenticated State UI
  if (user) {
    const displayName = user.displayName || user.email?.split('@')[0] || "User";
    const email = user.email || "";
    
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            You're already signed in
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Continue as the current user or sign out.
          </p>
        </div>
        
        <div className="flex flex-col items-center mb-8 p-6 bg-card border border-border rounded-xl w-full max-w-sm shadow-sm">
          <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-4 overflow-hidden relative">
            {user.photoURL ? (
              <img src={user.photoURL} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-10 w-10 text-primary" />
            )}
          </div>
          <h3 className="text-lg font-medium text-foreground">{displayName}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        <div className="flex flex-col w-full max-w-sm gap-3">
          <Button 
            onClick={handleContinue} 
            disabled={isContinuing}
            className="w-full h-11"
          >
            {isContinuing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ArrowRight className="h-4 w-4 mr-2" />
            )}
            Continue to NIRNAY
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={isContinuing}
            className="w-full h-11"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {mode === "login" && "Welcome back"}
          {mode === "signup" && "Create an account"}
          {mode === "forgot" && "Reset password"}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {mode === "login" && "Enter your credentials to access your account."}
          {mode === "signup" && "Start your journey to financial clarity today."}
        </p>
      </div>

      {mode !== "forgot" && (
        <>
          <GoogleAuthButton actionText={mode === "login" ? "Sign in with Google" : "Sign up with Google"} />
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        </>
      )}

      {mode === "login" && <LoginForm onModeChange={handleModeChange} />}
      {mode === "signup" && <SignupForm onModeChange={handleModeChange} />}
      {mode === "forgot" && <ForgotPasswordForm onBack={() => handleModeChange("login")} />}
    </>
  );
}

export default function AuthPage() {
  return (
    <AuthShell>
      <Suspense fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }>
        <AuthContent />
      </Suspense>
    </AuthShell>
  );
}