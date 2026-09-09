"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  GitCompare,
  Briefcase,
  Target,
  Bookmark,
  CalendarDays,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "cn";

const primaryNav = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your finances",
  },
  {
    label: "Discover",
    href: "/discover",
    icon: Compass,
    description: "Find financial products",
  },
  {
    label: "Compare",
    href: "/compare",
    icon: GitCompare,
    description: "Side-by-side comparison",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: Briefcase,
    description: "Your holdings",
  },
  {
    label: "Goals",
    href: "/goals",
    icon: Target,
    description: "Financial goals",
  },
  {
    label: "Watchlist",
    href: "/watchlist",
    icon: Bookmark,
    description: "Saved products",
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
    description: "Renewals & events",
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-card">
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
          <ShieldCheck className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-foreground leading-none">
            NIRNAY
          </span>
          <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
            Financial Copilot
          </span>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        <div className="px-2.5 space-y-0.5">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            // Active if on this route or a sub-route
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom — Settings */}
      <div className="shrink-0 border-t border-border p-2.5">
        <Link
          href="/settings"
          className={cn(
            "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
            pathname.startsWith("/settings")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings
            className={cn(
              "h-4 w-4 shrink-0",
              pathname.startsWith("/settings")
                ? "text-primary-foreground"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          />
          Settings
        </Link>
      </div>
    </aside>
  );
}
