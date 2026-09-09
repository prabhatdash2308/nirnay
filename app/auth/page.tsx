"use client";

import { useState } from "react";
import {
  logout,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/app/lib/auth-client";
import { getCurrentAuthRole } from "@/app/lib/auth-role";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { supabase } from "@/app/lib/supabase-client";

export default function AuthTestPage() {
  const [email, setEmail] = useState("your-test-email@example.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignUp() {
    try {
      setMessage("Creating account...");

      const user = await signUpWithEmail(email, password);
      const auth = await getCurrentAuthRole();

      setMessage(
        `Authenticated successfully.\nUID: ${user.uid}\nRole: ${
          auth?.role ?? "missing"
        }`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    }
  }

  async function handleSignIn() {
    try {
      setMessage("Signing in...");

      const user = await signInWithEmail(email, password);
      const auth = await getCurrentAuthRole();

      setMessage(
        `Signed in successfully.\nUID: ${user.uid}\nRole: ${
          auth?.role ?? "missing"
        }`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    }
  }

  async function handleGoogleSignIn() {
    try {
      setMessage("Signing in with Google...");

      const user = await signInWithGoogle();
      const auth = await getCurrentAuthRole();

      setMessage(
        `Google sign-in successful.\nUID: ${user.uid}\nRole: ${
          auth?.role ?? "missing"
        }`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Google authentication failed.",
      );
    }
  }

  async function handleLogout() {
    try {
      await logout();
      setMessage("Signed out.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Sign out failed.",
      );
    }
  }

  async function handleSupabaseTest() {
    try {
      setMessage("Testing Firebase -> Supabase Data API...");

      const user = firebaseAuth.currentUser;

      if (!user) {
        throw new Error("No Firebase user is currently signed in.");
      }

      const { data, error } = await supabase
        .from("auth_bridge_test")
        .insert({
          user_id: user.uid,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMessage(
        `Firebase -> Supabase Data API successful.\n\n` +
          `Firebase UID: ${user.uid}\n` +
          `Supabase row ID: ${data.id}\n` +
          `Stored user ID: ${data.user_id}\n` +
          `Message: ${data.message}`,
      );
    } catch (error) {
      if (error && typeof error === "object") {
        const supabaseError = error as {
          message?: string;
          code?: string;
          details?: string;
          hint?: string;
          status?: number;
        };

        setMessage(
          [
            "Firebase -> Supabase Data API test failed.",
            "",
            `Message: ${supabaseError.message ?? "unknown"}`,
            `Code: ${supabaseError.code ?? "none"}`,
            `Status: ${supabaseError.status ?? "none"}`,
            `Details: ${supabaseError.details ?? "none"}`,
            `Hint: ${supabaseError.hint ?? "none"}`,
          ].join("\n"),
        );
      } else {
        setMessage("Firebase -> Supabase Data API test failed.");
      }
    }
  }

  async function handleProfileTest() {
    try {
      setMessage("Testing NIRNAY user profile...");

      const user = firebaseAuth.currentUser;

      if (!user) {
        throw new Error("No Firebase user is currently signed in.");
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .upsert(
          {
            user_id: user.uid,
            full_name: user.displayName ?? "NIRNAY Test User",
            email: user.email ?? email,
            avatar_url: user.photoURL ?? null,
          },
          {
            onConflict: "user_id",
          },
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMessage(
        `NIRNAY user profile test successful.\n\n` +
          `Firebase UID: ${user.uid}\n` +
          `Profile ID: ${data.id}\n` +
          `Name: ${data.full_name}\n` +
          `Email: ${data.email}\n` +
          `Stored user ID: ${data.user_id}`,
      );
    } catch (error) {
      if (error && typeof error === "object") {
        const supabaseError = error as {
          message?: string;
          code?: string;
          details?: string;
          hint?: string;
          status?: number;
        };

        setMessage(
          [
            "NIRNAY user profile test failed.",
            "",
            `Message: ${supabaseError.message ?? "unknown"}`,
            `Code: ${supabaseError.code ?? "none"}`,
            `Status: ${supabaseError.status ?? "none"}`,
            `Details: ${supabaseError.details ?? "none"}`,
            `Hint: ${supabaseError.hint ?? "none"}`,
          ].join("\n"),
        );
      } else {
        setMessage("NIRNAY user profile test failed.");
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">NIRNAY Auth Test</h1>

          <p className="text-muted-foreground">
            Temporary authentication and database integration test.
          </p>
        </div>

        <div className="space-y-4">
          <input
            className="w-full rounded-md border p-3"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
          />

          <input
            className="w-full rounded-md border p-3"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              className="rounded-md border p-3"
              onClick={handleSignIn}
            >
              Sign in
            </button>

            <button
              className="rounded-md bg-black p-3 text-white"
              onClick={handleSignUp}
            >
              Sign up
            </button>
          </div>

          <button
            className="w-full rounded-md border p-3"
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </button>

          <button
            className="w-full rounded-md border p-3"
            onClick={handleLogout}
          >
            Sign out
          </button>

          <button
            className="w-full rounded-md border p-3"
            onClick={handleSupabaseTest}
          >
            Test Firebase -&gt; Supabase
          </button>

          <button
            className="w-full rounded-md bg-black p-3 text-white"
            onClick={handleProfileTest}
          >
            Test NIRNAY User Profile
          </button>
        </div>

        {message && (
          <pre className="whitespace-pre-wrap rounded-md border p-4 text-sm">
            {message}
          </pre>
        )}
      </div>
    </main>
  );
}