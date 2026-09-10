import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { ArrowRight, User, ShieldCheck, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings",
};

interface SettingsSection {
  id: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  cta: string;
  disabled?: boolean;
}

const settingsSections: SettingsSection[] = [
  {
    id: "settings-financial-profile",
    href: "/settings/financial-profile",
    icon: User,
    title: "Financial profile",
    description:
      "Set your income, budget, risk preference, and goals so NIRNAY can personalise your experience.",
    cta: "Set up profile",
  },
  {
    id: "settings-account",
    href: "/settings/account",
    icon: ShieldCheck,
    title: "Account",
    description: "Manage your name, email, and authentication settings.",
    cta: "Manage",
    disabled: true,
  },
  {
    id: "settings-notifications",
    href: "/settings/notifications",
    icon: Bell,
    title: "Notifications",
    description: "Control which alerts and reminders NIRNAY sends to you.",
    cta: "Manage",
    disabled: true,
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 lg:p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and personalisation preferences.
        </p>
      </div>

      <div className="space-y-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;

          if (section.disabled) {
            return (
              <div
                key={section.id}
                id={section.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card px-4 py-4 opacity-50"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {section.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
                <span className="mt-1 shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Coming soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={section.id}
              id={section.id}
              href={section.href}
              className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {section.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </div>
              <div className="mt-1 flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                {section.cta}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
