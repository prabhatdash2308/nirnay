"use client";

import { useState } from "react";
import { logout } from "@/lib/auth/client";
import { User, LogOut, Settings, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export function UserMenu() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // The auth observer in useAuth will redirect to /auth automatically.
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.displayName || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-primary/20 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium border border-primary/20">
          {initial}
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)} 
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-border/50">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <div className="py-1">
              <Link 
                href="/settings/profile" 
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Wallet className="mr-2 size-4" />
                Financial Profile
              </Link>
              <Link 
                href="/settings/account" 
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="mr-2 size-4" />
                Account Settings
              </Link>
            </div>
            <div className="py-1 border-t border-border/50">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="mr-2 size-4" />
                {isLoggingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
