"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import { logout } from "@/app/lib/auth-client";
import { cn } from "cn";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="relative">
      <button
        id="user-menu-trigger"
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-md border border-transparent px-2 text-sm font-medium transition-colors",
          open
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {/* Avatar placeholder */}
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          U
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <>
          {/* Click-outside dismiss */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full z-20 mt-1.5 w-48 rounded-lg border border-border bg-card shadow-lg">
            <div className="p-1">
              <button
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => {
                  setOpen(false);
                  router.push("/settings");
                }}
              >
                <User className="h-4 w-4" />
                Profile
              </button>

              <button
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => {
                  setOpen(false);
                  router.push("/settings");
                }}
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>

              <div className="my-1 h-px bg-border" />

              <button
                id="user-menu-logout"
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
