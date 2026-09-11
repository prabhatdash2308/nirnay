import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AppHeader } from "@/components/layout/app-header";

export const metadata: Metadata = {
  title: {
    template: "%s | NIRNAY",
    default: "NIRNAY — Financial Protection & Investment Copilot",
  },
  description:
    "NIRNAY is your AI-powered financial copilot. Compare, decide, manage, and optimize your insurance and investments in one intelligent platform.",
};

/**
 * Authenticated application shell.
 *
 * Provides the persistent sidebar, top header, and content region for all
 * routes in the (app) route group. Mobile navigation is handled separately
 * via MobileNav so the sidebar can remain server-safe on desktop.
 *
 * Authentication enforcement will be added here once the middleware
 * architecture is agreed upon — without disrupting the existing Firebase
 * token/Supabase integration.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-screen flex-col bg-background lg:flex-row">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* Right of sidebar: header + content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top nav bar — hidden on desktop */}
        <MobileNav />

        {/* Desktop contextual header — hidden on mobile (mobile uses its own bar) */}
        <div className="hidden lg:block">
          <AppHeader />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
