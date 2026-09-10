"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { loadPortfolioData } from "@/app/(app)/portfolio/actions";
import type { PortfolioData } from "@/lib/types/portfolio";
import { 
  calculateTotalCoverage, 
  calculateTotalInvested, 
  generateAttentionItems 
} from "@/lib/portfolio/calculations";
import { Loader2, ArrowRight, ShieldCheck, TrendingUp, Target, Plus, Search } from "lucide-react";
import { 
  PolicyCard, 
  InvestmentCard, 
  GoalCard, 
  AttentionItemCard 
} from "./portfolio-cards";

export function PortfolioClient() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        // We rely on middleware or a login prompt, but let's clear state securely
        setData(null);
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const portfolioData = await loadPortfolioData(token);
        setData(portfolioData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading your portfolio...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium text-foreground">Unable to load portfolio</p>
        <p className="mt-1 text-xs text-muted-foreground">Please ensure you are signed in and try again.</p>
        <Link href="/auth" className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Sign In
        </Link>
      </div>
    );
  }

  const { policies, investments, goals } = data;
  const totalCoverage = calculateTotalCoverage(policies);
  const totalInvested = calculateTotalInvested(investments);
  const attentionItems = generateAttentionItems(policies, investments, goals);

  return (
    <div className="space-y-10">
      {/* ──────────────────────────────────────────────────────── */}
      {/* Overview Metrics */}
      {/* ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="overview-heading">
        <h3 id="overview-heading" className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Portfolio Overview
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-medium">Total Coverage</span>
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              ₹{totalCoverage.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Across {policies.length} policies
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Invested Amount</span>
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              ₹{totalInvested.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Across {investments.length} holdings
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span className="text-xs font-medium">Active Goals</span>
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {goals.length}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Priorities tracked
            </p>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* Needs Attention */}
      {/* ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="attention-heading">
        <h3 id="attention-heading" className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Needs Attention
        </h3>
        {attentionItems.length > 0 ? (
          <div className="space-y-3">
            {attentionItems.map(item => (
              <AttentionItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <p className="text-sm font-medium text-foreground">Everything looks up to date.</p>
            <p className="text-xs text-muted-foreground mt-0.5">No urgent items require your attention.</p>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* Protection (Policies) */}
      {/* ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="protection-heading">
        <div className="mb-4 flex items-center justify-between">
          <h3 id="protection-heading" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Protection
          </h3>
          <Link href="/discover" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            <Plus className="h-3 w-3" />
            Find Protection
          </Link>
        </div>
        
        {policies.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {policies.map(policy => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center bg-muted/10">
            <ShieldCheck className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-foreground">No insurance policies found</p>
            <p className="mt-1 text-xs text-muted-foreground max-w-[250px]">
              Discover and add protection plans to safeguard your financial future.
            </p>
            <Link href="/discover" className="mt-4 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
              Discover Products
            </Link>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* Investments */}
      {/* ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="investments-heading">
        <div className="mb-4 flex items-center justify-between">
          <h3 id="investments-heading" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Investments
          </h3>
          <Link href="/discover" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            <Plus className="h-3 w-3" />
            New Investment
          </Link>
        </div>

        {investments.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {investments.map(investment => (
              <InvestmentCard key={investment.id} investment={investment} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center bg-muted/10">
            <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-foreground">No investments found</p>
            <p className="mt-1 text-xs text-muted-foreground max-w-[250px]">
              Start tracking your mutual funds, SIPs, and other investments here.
            </p>
            <Link href="/discover" className="mt-4 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
              Explore Investments
            </Link>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* Goals */}
      {/* ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="goals-heading">
        <div className="mb-4 flex items-center justify-between">
          <h3 id="goals-heading" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Financial Goals
          </h3>
        </div>

        {goals.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center bg-muted/10">
            <Target className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-foreground">No financial goals set</p>
            <p className="mt-1 text-xs text-muted-foreground max-w-[250px]">
              Set a target to connect your investments with what you&apos;re working toward.
            </p>
          </div>
        )}
      </section>
      
      {/* ──────────────────────────────────────────────────────── */}
      {/* Quick Actions Footer */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="pt-8 border-t border-border grid sm:grid-cols-2 gap-4">
        <Link href="/discover" className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/50 transition-colors">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Discover Products</p>
            <p className="text-xs text-muted-foreground mt-0.5">Find plans suited to your profile</p>
          </div>
        </Link>
        <Link href="/dashboard" className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/50 transition-colors">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
            <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Review Saved Decisions</p>
            <p className="text-xs text-muted-foreground mt-0.5">Return to your dashboard</p>
          </div>
        </Link>
      </div>

    </div>
  );
}
