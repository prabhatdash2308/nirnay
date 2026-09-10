"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { loadPortfolioData } from "@/app/(app)/portfolio/actions";
import {
  addInsurancePolicy,
  updateInsurancePolicy,
  deleteInsurancePolicy,
  addInvestment,
  updateInvestment,
  deleteInvestment,
  addFinancialGoal,
  updateFinancialGoal,
  deleteFinancialGoal,
  type AddPolicyInput,
  type AddInvestmentInput,
  type AddGoalInput,
} from "@/app/(app)/portfolio/manage-actions";
import type { PortfolioData, InsurancePolicy, Investment, FinancialGoal } from "@/lib/types/portfolio";
import {
  calculateTotalCoverage,
  calculateTotalInvested,
  generateAttentionItems,
} from "@/lib/portfolio/calculations";
import { Loader2, ArrowRight, ShieldCheck, TrendingUp, Target, Plus, Search } from "lucide-react";
import { PolicyCard, InvestmentCard, GoalCard, AttentionItemCard } from "./portfolio-cards";
import { PolicyForm } from "./policy-form";
import { InvestmentForm } from "./investment-form";
import { GoalForm } from "./goal-form";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";

// ─────────────────────────────────────────────────────────────────────────────
// Modal state types
// ─────────────────────────────────────────────────────────────────────────────
type PolicyModal =
  | { type: "add-policy" }
  | { type: "edit-policy"; policy: InsurancePolicy }
  | { type: "delete-policy"; policy: InsurancePolicy }
  | null;

type InvestmentModal =
  | { type: "add-investment" }
  | { type: "edit-investment"; investment: Investment }
  | { type: "delete-investment"; investment: Investment }
  | null;

type GoalModal =
  | { type: "add-goal" }
  | { type: "edit-goal"; goal: FinancialGoal }
  | { type: "delete-goal"; goal: FinancialGoal }
  | null;

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export function PortfolioClient() {
  // Distinct states:
  //   authLoading: true  → Firebase still resolving initial auth state
  //   idToken: null, authLoading: false → user is unauthenticated
  //   dataError: true  → user is authenticated but the portfolio fetch failed
  const [data, setData] = useState<PortfolioData | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);

  const [policyModal, setPolicyModal] = useState<PolicyModal>(null);
  const [investmentModal, setInvestmentModal] = useState<InvestmentModal>(null);
  const [goalModal, setGoalModal] = useState<GoalModal>(null);

  // Refresh portfolio data using the stored token
  const refresh = useCallback(async (token: string) => {
    const portfolioData = await loadPortfolioData(token);
    setData(portfolioData);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      // Auth state is now known — stop showing the auth-loading spinner
      setAuthLoading(false);

      if (!user) {
        setData(null);
        setIdToken(null);
        return;
      }

      try {
        const token = await user.getIdToken();
        setIdToken(token);
        const portfolioData = await loadPortfolioData(token);
        setData(portfolioData);
      } catch (err) {
        // Authenticated but data fetch failed — keep idToken so refresh works
        console.error("[portfolio] Data load error:", err);
        setDataError(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  async function handleSavePolicy(input: AddPolicyInput) {
    if (!idToken) throw new Error("Not authenticated.");
    if (policyModal?.type === "edit-policy") {
      await updateInsurancePolicy(idToken, policyModal.policy.id, input);
    } else {
      await addInsurancePolicy(idToken, input);
    }
    setPolicyModal(null);
    await refresh(idToken);
  }

  async function handleDeletePolicy(policyId: number) {
    if (!idToken) throw new Error("Not authenticated.");
    await deleteInsurancePolicy(idToken, policyId);
    setPolicyModal(null);
    await refresh(idToken);
  }

  async function handleSaveInvestment(input: AddInvestmentInput) {
    if (!idToken) throw new Error("Not authenticated.");
    if (investmentModal?.type === "edit-investment") {
      await updateInvestment(idToken, investmentModal.investment.id, input);
    } else {
      await addInvestment(idToken, input);
    }
    setInvestmentModal(null);
    await refresh(idToken);
  }

  async function handleDeleteInvestment(investmentId: number) {
    if (!idToken) throw new Error("Not authenticated.");
    await deleteInvestment(idToken, investmentId);
    setInvestmentModal(null);
    await refresh(idToken);
  }

  async function handleSaveGoal(input: AddGoalInput) {
    if (!idToken) throw new Error("Not authenticated.");
    if (goalModal?.type === "edit-goal") {
      await updateFinancialGoal(idToken, goalModal.goal.id, input);
    } else {
      await addFinancialGoal(idToken, input);
    }
    setGoalModal(null);
    await refresh(idToken);
  }

  async function handleDeleteGoal(goalId: number) {
    if (!idToken) throw new Error("Not authenticated.");
    await deleteFinancialGoal(idToken, goalId);
    setGoalModal(null);
    await refresh(idToken);
  }

  // ─── Loading / Error ──────────────────────────────────────────────────────

  // 1. Firebase is still resolving the initial auth state — show a neutral spinner
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading your portfolio...</p>
      </div>
    );
  }

  // 2. Auth state is known but no user — unauthenticated
  if (!idToken) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium text-foreground">Sign in to view your portfolio</p>
        <p className="mt-1 text-xs text-muted-foreground">Your financial data is private and requires authentication.</p>
        <Link
          href="/auth"
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // 3. Authenticated but the portfolio data request failed
  if (dataError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium text-foreground">Unable to load portfolio</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Something went wrong while loading your financial data. Please try again.
        </p>
        <button
          onClick={async () => {
            setDataError(false);
            if (idToken) {
              try {
                const portfolioData = await loadPortfolioData(idToken);
                setData(portfolioData);
              } catch (err) {
                console.error("[portfolio] Retry failed:", err);
                setDataError(true);
              }
            }
          }}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 4. Data hasn't loaded yet (spinner while fetch is in-flight after auth confirmed)
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading your portfolio...</p>
      </div>
    );
  }

  const { policies, investments, goals } = data;
  const totalCoverage = calculateTotalCoverage(policies);
  const totalInvested = calculateTotalInvested(investments);
  const attentionItems = generateAttentionItems(policies, investments, goals);

  return (
    <>
      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {(policyModal?.type === "add-policy" || policyModal?.type === "edit-policy") && (
        <PolicyForm
          title={policyModal.type === "add-policy" ? "Add Insurance Policy" : "Edit Policy"}
          initial={policyModal.type === "edit-policy" ? policyModal.policy : undefined}
          onSave={handleSavePolicy}
          onCancel={() => setPolicyModal(null)}
        />
      )}
      {policyModal?.type === "delete-policy" && (
        <ConfirmDeleteDialog
          title="Delete Policy"
          description={`Are you sure you want to delete "${policyModal.policy.policy_name}"? This action cannot be undone.`}
          onConfirm={() => handleDeletePolicy(policyModal.policy.id)}
          onCancel={() => setPolicyModal(null)}
        />
      )}

      {(investmentModal?.type === "add-investment" || investmentModal?.type === "edit-investment") && (
        <InvestmentForm
          title={investmentModal.type === "add-investment" ? "Add Investment" : "Edit Investment"}
          initial={investmentModal.type === "edit-investment" ? investmentModal.investment : undefined}
          onSave={handleSaveInvestment}
          onCancel={() => setInvestmentModal(null)}
        />
      )}
      {investmentModal?.type === "delete-investment" && (
        <ConfirmDeleteDialog
          title="Delete Investment"
          description={`Are you sure you want to delete "${investmentModal.investment.scheme_name}"? This action cannot be undone.`}
          onConfirm={() => handleDeleteInvestment(investmentModal.investment.id)}
          onCancel={() => setInvestmentModal(null)}
        />
      )}

      {(goalModal?.type === "add-goal" || goalModal?.type === "edit-goal") && (
        <GoalForm
          title={goalModal.type === "add-goal" ? "Create Financial Goal" : "Edit Goal"}
          initial={goalModal.type === "edit-goal" ? goalModal.goal : undefined}
          onSave={handleSaveGoal}
          onCancel={() => setGoalModal(null)}
        />
      )}
      {goalModal?.type === "delete-goal" && (
        <ConfirmDeleteDialog
          title="Delete Goal"
          description={`Are you sure you want to delete "${goalModal.goal.name}"? This action cannot be undone.`}
          onConfirm={() => handleDeleteGoal(goalModal.goal.id)}
          onCancel={() => setGoalModal(null)}
        />
      )}

      <div className="space-y-10">
        {/* ── Overview Metrics ────────────────────────────────────────────── */}
        <section aria-labelledby="overview-heading">
          <h3
            id="overview-heading"
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
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
                Across {policies.length} {policies.length === 1 ? "policy" : "policies"}
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
                Across {investments.length} {investments.length === 1 ? "holding" : "holdings"}
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="h-4 w-4" />
                <span className="text-xs font-medium">Active Goals</span>
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground">{goals.length}</p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Priorities tracked
              </p>
            </div>
          </div>
        </section>

        {/* ── Needs Attention ─────────────────────────────────────────────── */}
        <section aria-labelledby="attention-heading">
          <h3
            id="attention-heading"
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Needs Attention
          </h3>
          {attentionItems.length > 0 ? (
            <div className="space-y-3">
              {attentionItems.map((item) => (
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

        {/* ── Protection ──────────────────────────────────────────────────── */}
        <section aria-labelledby="protection-heading">
          <div className="mb-4 flex items-center justify-between">
            <h3
              id="protection-heading"
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Protection
            </h3>
            <button
              onClick={() => setPolicyModal({ type: "add-policy" })}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="h-3 w-3" />
              Add Policy
            </button>
          </div>

          {policies.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {policies.map((policy) => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  onEdit={() => setPolicyModal({ type: "edit-policy", policy })}
                  onDelete={() => setPolicyModal({ type: "delete-policy", policy })}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center bg-muted/10">
              <ShieldCheck className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium text-foreground">No insurance policies yet</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-[280px]">
                Add your existing protection to keep renewals and coverage in one place.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setPolicyModal({ type: "add-policy" })}
                  className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Add Policy
                </button>
                <Link
                  href="/discover"
                  className="rounded-full bg-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors"
                >
                  Discover Products
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── Investments ─────────────────────────────────────────────────── */}
        <section aria-labelledby="investments-heading">
          <div className="mb-4 flex items-center justify-between">
            <h3
              id="investments-heading"
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Investments
            </h3>
            <button
              onClick={() => setInvestmentModal({ type: "add-investment" })}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="h-3 w-3" />
              Add Investment
            </button>
          </div>

          {investments.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {investments.map((investment) => (
                <InvestmentCard
                  key={investment.id}
                  investment={investment}
                  onEdit={() => setInvestmentModal({ type: "edit-investment", investment })}
                  onDelete={() => setInvestmentModal({ type: "delete-investment", investment })}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center bg-muted/10">
              <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium text-foreground">No investments added yet</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-[280px]">
                Add your SIPs or investments to start tracking them here.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setInvestmentModal({ type: "add-investment" })}
                  className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Add Investment
                </button>
                <Link
                  href="/discover"
                  className="rounded-full bg-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors"
                >
                  Explore Products
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── Goals ───────────────────────────────────────────────────────── */}
        <section aria-labelledby="goals-heading">
          <div className="mb-4 flex items-center justify-between">
            <h3
              id="goals-heading"
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Financial Goals
            </h3>
            <button
              onClick={() => setGoalModal({ type: "add-goal" })}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="h-3 w-3" />
              Create Goal
            </button>
          </div>

          {goals.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={() => setGoalModal({ type: "edit-goal", goal })}
                  onDelete={() => setGoalModal({ type: "delete-goal", goal })}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center bg-muted/10">
              <Target className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium text-foreground">No financial goals yet</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-[280px]">
                Set a goal to connect your investments with what you&apos;re working toward.
              </p>
              <button
                onClick={() => setGoalModal({ type: "add-goal" })}
                className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Create Goal
              </button>
            </div>
          )}
        </section>

        {/* ── Quick Actions Footer ─────────────────────────────────────────── */}
        <div className="pt-8 border-t border-border grid sm:grid-cols-2 gap-4">
          <Link
            href="/discover"
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Discover Products</p>
              <p className="text-xs text-muted-foreground mt-0.5">Find plans suited to your profile</p>
            </div>
          </Link>
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/50 transition-colors"
          >
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
    </>
  );
}
