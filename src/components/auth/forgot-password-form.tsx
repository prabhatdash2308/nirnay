"use client";

import { useState } from "react";
import { sendPasswordReset } from "@/lib/auth/client";
import { mapFirebaseError } from "@/lib/auth/error-mapper";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await sendPasswordReset(email);
      // We don't expose if the email exists for security reasons
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(mapFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-8" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Check your email</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If an account exists for {email}, you'll receive a password reset link shortly.
          </p>
        </div>
        <Button onClick={onBack} variant="outline" className="w-full">
          Return to sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4 focus:outline-none"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to sign in
        </button>
        <p className="text-sm text-muted-foreground">
          Enter the email address associated with your account, and we'll send you a link to reset your password.
        </p>
      </div>

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

      <Button type="submit" disabled={isLoading} className="w-full h-11 text-base mt-4">
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        Send reset link
      </Button>
    </form>
  );
}
