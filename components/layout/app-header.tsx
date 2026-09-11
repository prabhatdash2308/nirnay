"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { UserMenu } from "./user-menu";

// Map route prefixes to human-readable page titles
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/discover": "Discover",
  "/compare": "Compare",
  "/portfolio": "Portfolio",
  "/goals": "Goals",
  "/watchlist": "Watchlist",
  "/calendar": "Calendar",
  "/settings": "Settings",
};

function resolvePageTitle(pathname: string): string {
  // Exact match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  // Prefix match (handles sub-routes)
  const prefix = Object.keys(PAGE_TITLES).find(
    (key) => key !== "/" && pathname.startsWith(key)
  );

  return prefix ? PAGE_TITLES[prefix] : "NIRNAY";
}

export function AppHeader() {
  const pathname = usePathname();
  const title = resolvePageTitle(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-5">
      {/* Page title */}
      <div>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Notifications — placeholder until alerts module is built */}
        <button
          id="app-header-notifications"
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}
