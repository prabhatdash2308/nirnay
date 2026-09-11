"use client";

import { useState } from "react";
import { AccountSettingsNav } from "./account-settings-nav";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/auth/client";
import { LogOut, KeyRound, Mail, UserX, AlertTriangle } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

export function AccountSettingsPageContent() {
  const { user } = useAuth();
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (err) {
      console.error(err);
      setIsLoggingOut(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      setResetError(null);
      await sendPasswordResetEmail(firebaseAuth, user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err: any) {
      console.error(err);
      setResetError(err.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-8">
      <AccountSettingsNav />

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="space-y-6 md:space-y-8">
        
        {/* Account Info */}
        <section className="bg-card border border-border rounded-2xl p-5 md:p-8">
          <h2 className="text-lg font-semibold tracking-tight mb-6">Account Information</h2>
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary font-medium text-lg">
                {user?.email?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <Mail className="size-3.5" />
                Authenticated via Identity Provider
              </p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="bg-card border border-border rounded-2xl p-5 md:p-8">
          <h2 className="text-lg font-semibold tracking-tight mb-6">Security</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/50">
              <div>
                <h3 className="font-medium mb-1">Password Reset</h3>
                <p className="text-sm text-muted-foreground">
                  Send a password reset link to your email address.
                </p>
                {resetSent && (
                  <p className="text-sm text-emerald-600 mt-2 font-medium">
                    Password reset email sent! Check your inbox.
                  </p>
                )}
                {resetError && (
                  <p className="text-sm text-destructive mt-2 font-medium">
                    {resetError}
                  </p>
                )}
              </div>
              <button 
                onClick={handlePasswordReset}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-xl text-sm font-medium transition-colors shrink-0"
              >
                <KeyRound className="size-4" />
                Reset Password
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium mb-1">Active Session</h3>
                <p className="text-sm text-muted-foreground">
                  Sign out of your current session on this device.
                </p>
              </div>
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-xl text-sm font-medium transition-colors shrink-0 disabled:opacity-50"
              >
                <LogOut className="size-4" />
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="border border-destructive/20 rounded-2xl p-5 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-destructive/5 pointer-events-none" />
          <h2 className="text-lg font-semibold tracking-tight text-destructive mb-6 flex items-center gap-2 relative z-10">
            <AlertTriangle className="size-5" />
            Danger Zone
          </h2>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <h3 className="font-medium mb-1">Delete Account</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Permanently delete your account and all associated financial data. This action cannot be undone.
              </p>
            </div>
            <button 
              disabled
              className="flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-medium opacity-50 cursor-not-allowed shrink-0"
            >
              <UserX className="size-4" />
              Delete Account
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-4 relative z-10">
            Account deletion functionality is currently under construction to ensure secure data removal.
          </p>
        </section>
      </div>
    </div>
  );
}
