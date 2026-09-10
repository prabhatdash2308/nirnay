"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import {
  logout,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/app/lib/auth-client";
import { getCurrentAuthRole } from "@/app/lib/auth-role";
import { Loader2, ShieldCheck } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setMessage("Signed in successfully. Redirecting…");
    setIsError(false);
    // Brief pause so the user sees the success message before navigating
    await new Promise<void>((r) => setTimeout(r, 300));
    router.replace("/dashboard");
  }

  // ── Handlers ────────────────────────────────────────────────────────────
  async function handleSignIn() {
    if (!email || !password) {
      setMessage("Please enter your email and password.");
      setIsError(true);
      return;
    }
    setBusy(true);
    setIsError(false);
    setMessage("Signing in…");
    try {
      await signInWithEmail(email, password);
      await getCurrentAuthRole();
      await afterAuth();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Sign-in failed.");
      setIsError(true);
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp() {
    if (!email || !password) {
      setMessage("Please enter your email and password.");
      setIsError(true);
      return;
    }
    setBusy(true);
    setIsError(false);
    setMessage("Creating account…");
    try {
      await signUpWithEmail(email, password);
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
    setMessage("Signing in with Google…");
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

  async function handleLogout() {
    setBusy(true);
    try {
      await logout();
      setMessage("Signed out.");
      setIsError(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Sign-out failed.");
      setIsError(true);
    } finally {
      setBusy(false);
    }
  }

  // ── Auth loading state ──────────────────────────────────────────────────
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Sign-in form ────────────────────────────────────────────────────────
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            NIRNAY
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your financial copilot
          </p>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <input
            id="auth-email"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            disabled={busy}
            autoComplete="email"
          />
          <input
            id="auth-password"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={busy}
            autoComplete="current-password"
            onKeyDown={(e) => { if (e.key === "Enter") handleSignIn(); }}
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              id="auth-signin-btn"
              onClick={handleSignIn}
              disabled={busy}
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Sign in
            </button>
            <button
              id="auth-signup-btn"
              onClick={handleSignUp}
              disabled={busy}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Sign up
            </button>
          </div>

          <button
            id="auth-google-btn"
            onClick={handleGoogleSignIn}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Continue with Google
          </button>

          <button
            id="auth-signout-btn"
            onClick={handleLogout}
            disabled={busy}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors disabled:opacity-60"
          >
            Sign out
          </button>
        </div>

        {/* Status message */}
        {message && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              isError
                ? "border border-destructive/20 bg-destructive/10 text-destructive"
                : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}