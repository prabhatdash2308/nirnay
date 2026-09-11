"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AccountSettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-6 border-b border-border mb-8 overflow-x-auto pb-px">
      <Link
        href="/settings/profile"
        className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
          pathname === "/settings/profile"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
        }`}
      >
        Financial Profile
      </Link>
      <Link
        href="/settings/account"
        className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
          pathname === "/settings/account"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
        }`}
      >
        Account Settings
      </Link>
    </nav>
  );
}
