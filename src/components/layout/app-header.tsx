"use client";

import { usePathname } from "next/navigation";
import { UserMenu } from "./user-menu";
import { navigationItems } from "./app-sidebar";

export function AppHeader() {
  const pathname = usePathname();
  
  // Find current route name
  const currentItem = navigationItems.find(item => item.href === pathname);
  const title = currentItem ? currentItem.name : "NIRNAY";

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border/50 bg-card/30 backdrop-blur sticky top-0 z-20">
      <div className="flex items-center">
        {/* Only show title on desktop or when no sidebar is present, but mostly just keep it clean */}
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Add notifications icon later if needed */}
        <UserMenu />
      </div>
    </header>
  );
}
