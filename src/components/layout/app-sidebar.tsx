"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowRightLeft, PieChart, Target, LineChart } from "lucide-react";

export const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { name: "Budget", href: "/budget", icon: PieChart },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Insights", href: "/insights", icon: LineChart, disabled: true },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-20 lg:w-64 flex-col border-r border-border bg-card/30 backdrop-blur">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
          <div className="size-6 lg:size-7 rounded-md bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="size-2 lg:size-2.5 rounded-full bg-primary-foreground" />
          </div>
          <span className="hidden lg:block font-semibold tracking-tight text-lg">NIRNAY</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const content = (
            <>
              <item.icon className={`size-5 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground transition-colors'}`} />
              <span className="hidden lg:block font-medium">{item.name}</span>
            </>
          );

          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground opacity-50 cursor-not-allowed"
                title={`${item.name} (Coming soon)`}
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary group ${
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              title={item.name}
            >
              {content}
            </Link>
          );
        })}
      </nav>
      
      {/* Decorative footer area for sidebar */}
      <div className="p-4 border-t border-border/50 hidden lg:block">
        <div className="rounded-xl bg-muted/40 p-4 border border-border/50 text-xs text-muted-foreground text-center">
          NIRNAY Intelligence<br />Active
        </div>
      </div>
    </aside>
  );
}
