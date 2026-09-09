import type { Metadata } from "next";
import {
  ShieldCheck,
  TrendingUp,
  Target,
  CalendarClock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CircleDollarSign,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

// ─────────────────────────────────────────────
// DEMO DATA NOTICE
// All values below are sample data for
// demonstration purposes only.
// They do not represent real user data.
// ─────────────────────────────────────────────

const DEMO_NOTICE = true; // flip false to hide banner once real data is wired

// Summary cards
const overviewCards = [
  {
    id: "total-protected",
    label: "Total Coverage",
    value: "₹25,00,000",
    sub: "Health + Motor",
    icon: ShieldCheck,
    accent: "text-primary",
    badge: "Protected",
  },
  {
    id: "monthly-sip",
    label: "Monthly SIP",
    value: "₹5,000",
    sub: "Active investment",
    icon: TrendingUp,
    accent: "text-primary",
    badge: "Active",
  },
  {
    id: "goal-progress",
    label: "Goal Progress",
    value: "34%",
    sub: "Emergency Fund",
    icon: Target,
    accent: "text-primary",
    badge: "On track",
  },
  {
    id: "next-renewal",
    label: "Next Renewal",
    value: "Apr 2025",
    sub: "Car insurance",
    icon: CalendarClock,
    accent: "text-primary",
    badge: "In 7 months",
  },
] as const;

// Placeholder action cards
const quickActions = [
  {
    id: "action-discover",
    label: "Discover Products",
    description: "Find insurance and investment products suited to your profile.",
    href: "/discover",
    icon: Sparkles,
  },
  {
    id: "action-compare",
    label: "Compare Options",
    description: "Place two products side-by-side to understand the difference.",
    href: "/compare",
    icon: CircleDollarSign,
  },
  {
    id: "action-goals",
    label: "Set a Goal",
    description: "Define a financial goal and track your monthly progress.",
    href: "/goals",
    icon: Target,
  },
] as const;

// Placeholder attention items
const attentionItems = [
  {
    id: "alert-renewal",
    title: "Car insurance renewal approaching",
    detail: "Due in April 2025. Compare plans before renewal to find better rates.",
    href: "/compare",
  },
  {
    id: "alert-coverage-gap",
    title: "No life insurance detected",
    detail: "Consider a term plan based on your income and dependants.",
    href: "/discover",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 lg:p-8">
      {/* Demo data notice — visible until real user data is wired */}
      {DEMO_NOTICE && (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <span className="font-medium text-foreground">Demo data</span> —
            The values shown here are sample figures for demonstration. Connect
            your financial profile to see real data.
          </p>
        </div>
      )}

      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Good evening
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Here is your financial overview.
        </p>
      </div>

      {/* Overview summary cards */}
      <section aria-labelledby="overview-heading">
        <h3
          id="overview-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Overview
        </h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {overviewCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={card.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <Icon className={`h-4 w-4 ${card.accent}`} />
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {card.badge}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-semibold tabular-nums text-foreground leading-none">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70">
                    {card.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Needs attention */}
      <section aria-labelledby="attention-heading">
        <h3
          id="attention-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Needs attention
        </h3>
        <div className="space-y-2">
          {attentionItems.map((item) => (
            <Link
              key={item.id}
              id={item.id}
              href={item.href}
              className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </div>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="actions-heading">
        <h3
          id="actions-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Get started
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.id}
                id={action.id}
                href={action.href}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {action.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  Get started
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI insight placeholder */}
      <section aria-labelledby="ai-heading">
        <h3
          id="ai-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          AI Insight
        </h3>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-4">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Complete your financial profile to unlock recommendations
            </p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              NIRNAY uses your income, coverage needs, and goals to surface
              relevant products and explain why they may suit you. No guesswork
              — every suggestion includes the reasoning and source.
            </p>
            <Link
              href="/settings"
              id="ai-insight-setup-link"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline"
            >
              Set up financial profile
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
