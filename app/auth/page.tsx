"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/app/lib/auth-client";
import { getCurrentAuthRole } from "@/app/lib/auth-role";
import { loadFinancialProfile } from "@/app/(app)/settings/financial-profile/actions";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);

  // ── If already authenticated, redirect to /dashboard (no loop) ──────────
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // Already signed in — go to dashboard without leaving /auth in history
        router.replace("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // ── Post-auth navigation ─────────────────────────────────────────────────
  async function afterAuth() {
    setMessage("Authentication successful. Redirecting…");
    setIsError(false);
    
    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        router.replace("/");
        return;
      }
      const idToken = await user.getIdToken();
      
      const profile = await loadFinancialProfile(idToken);
      
      // Brief pause so the user sees the success message before navigating
      await new Promise<void>((r) => setTimeout(r, 300));
      
      if (profile) {
        router.replace("/dashboard");
      } else {
        router.replace("/settings/financial-profile");
      }
    } catch (err) {
      console.error("Error loading profile during auth:", err);
      // Fallback to dashboard if profile fetch fails
      router.replace("/dashboard");
    }
  }

  // ── Handlers ────────────────────────────────────────────────────────────
  async function handleSignIn(email: string, pass: string) {
    setBusy(true);
    setIsError(false);
    setMessage("");
    try {
      await signInWithEmail(email, pass);
      await getCurrentAuthRole();
      await afterAuth();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Sign-in failed.");
      setIsError(true);
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp(email: string, pass: string) {
    setBusy(true);
    setIsError(false);
    setMessage("");
    try {
      await signUpWithEmail(email, pass);
      await getCurrentAuthRole();
      await afterAuth();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Sign-up failed.");
      setIsError(true);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    setBusy(true);
    setIsError(false);
    setMessage("");
    try {
      await signInWithGoogle();
      await getCurrentAuthRole();
      await afterAuth();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Google sign-in failed.");
      setIsError(true);
    } finally {
      setBusy(false);
    }
  }

  // ── Auth loading state ──────────────────────────────────────────────────
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Auth UI ─────────────────────────────────────────────────────────────
  return (
    <AuthShell>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {mode === "login" && "Welcome back"}
          {mode === "signup" && "Create an account"}
          {mode === "forgot" && "Reset password"}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {mode === "login" && "Enter your credentials to access your account."}
          {mode === "signup" && "Sign up to start planning your financial future."}
          {mode === "forgot" && "We don't support password reset yet. Please go back."}
        </p>
      </div>

      {mode === "login" && (
        <LoginForm
          onModeChange={setMode}
          onSubmit={handleSignIn}
          busy={busy}
          error={isError ? message : null}
        />
      )}
      
      {mode === "signup" && (
        <SignupForm
          onModeChange={setMode}
          onSubmit={handleSignUp}
          busy={busy}
          error={isError ? message : null}
        />
      )}
      
      {mode === "forgot" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Contact support to reset your password.
          </p>
          <button
            onClick={() => setMode("login")}
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to sign in
          </button>
        </div>
      )}

      {(mode === "login" || mode === "signup") && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleAuthButton
            onClick={handleGoogleSignIn}
            busy={busy}
            error={null}
          />
        </>
      )}

      {!isError && message && (
        <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
          {message}
        </div>
      )}
    </AuthShell>
  );
}