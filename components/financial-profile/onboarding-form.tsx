"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { saveFinancialProfile } from "@/app/(app)/settings/financial-profile/actions";
import {
  PRIMARY_GOAL_OPTIONS,
  type FinancialProfileInput,
  type FinancialProfileRow,
  type RiskProfile,
  type FinancialExperience,
} from "@/lib/types/financial-profile";
import { cn } from "cn";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4 | 5;

const TOTAL_STEPS = 5;

const STEP_LABELS: Record<Step, string> = {
  1: "Financial snapshot",
  2: "Experience",
  3: "Risk appetite",
  4: "Your goals",
  5: "Review",
};

// ─────────────────────────────────────────────────────────────
// Currency input component
// ─────────────────────────────────────────────────────────────

function CurrencyInput({
  id,
  label,
  description,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  description?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground select-none">
          ₹
        </span>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min="0"
          step="100"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className={cn(
            "w-full rounded-lg border bg-background py-2.5 pl-7 pr-3 text-sm text-foreground",
            "placeholder:text-muted-foreground/50",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            "transition-colors",
            error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border"
          )}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Selection card component
// ─────────────────────────────────────────────────────────────

function SelectionCard({
  id,
  label,
  description,
  selected,
  onSelect,
}: {
  id: string;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border p-4 text-left transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div
          className={cn(
            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border"
          )}
        >
          {selected && <Check className="h-2.5 w-2.5" />}
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Goal toggle chip component
// ─────────────────────────────────────────────────────────────

function GoalChip({
  label,
  selected,
  onToggle,
}: {
  value: string;
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        selected
          ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {selected && <Check className="h-3 w-3 shrink-0" />}
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Review row component
// ─────────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Format helpers
// ─────────────────────────────────────────────────────────────

function formatRupee(val: string): string {
  const n = parseFloat(val);
  if (isNaN(n)) return "Not provided";
  return `₹${n.toLocaleString("en-IN")}`;
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─────────────────────────────────────────────────────────────
// Main onboarding form
// ─────────────────────────────────────────────────────────────

interface Props {
  /** Pre-populated when editing an existing profile */
  initialData?: FinancialProfileRow | null;
}

export function FinancialProfileForm({ initialData }: Props) {
  const router = useRouter();

  // ── Form state ──────────────────────────────────────────────
  const [step, setStep] = useState<Step>(1);

  const [monthlyIncome, setMonthlyIncome] = useState(
    initialData?.monthly_income?.toString() ?? ""
  );
  const [monthlyExpenses, setMonthlyExpenses] = useState(
    initialData?.monthly_expenses?.toString() ?? ""
  );
  const [monthlyInvestment, setMonthlyInvestment] = useState(
    initialData?.monthly_investment_budget?.toString() ?? ""
  );
  const [annualInsurance, setAnnualInsurance] = useState(
    initialData?.annual_insurance_budget?.toString() ?? ""
  );

  const [experience, setExperience] = useState<FinancialExperience | "">(
    initialData?.financial_experience ?? ""
  );
  const [riskProfile, setRiskProfile] = useState<RiskProfile | "">(
    initialData?.risk_profile ?? ""
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    initialData?.primary_goals ?? []
  );

  // ── UI state ─────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // ── Goal toggle ───────────────────────────────────────────────
  const toggleGoal = useCallback((value: string) => {
    setSelectedGoals((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
    );
  }, []);

  // ── Step validation ───────────────────────────────────────────
  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      const income = parseFloat(monthlyIncome);
      const expenses = parseFloat(monthlyExpenses);
      const investment = parseFloat(monthlyInvestment);
      const insurance = parseFloat(annualInsurance);

      if (monthlyIncome && (isNaN(income) || income < 0)) {
        newErrors.monthlyIncome = "Enter a valid non-negative amount";
      }
      if (monthlyExpenses && (isNaN(expenses) || expenses < 0)) {
        newErrors.monthlyExpenses = "Enter a valid non-negative amount";
      }
      if (monthlyInvestment && (isNaN(investment) || investment < 0)) {
        newErrors.monthlyInvestment = "Enter a valid non-negative amount";
      }
      if (annualInsurance && (isNaN(insurance) || insurance < 0)) {
        newErrors.annualInsurance = "Enter a valid non-negative amount";
      }
    }

    if (step === 2 && !experience) {
      newErrors.experience = "Please select your financial experience level";
    }
    if (step === 3 && !riskProfile) {
      newErrors.riskProfile = "Please select your risk preference";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Navigation ────────────────────────────────────────────────
  function goNext() {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) setStep((s) => (s + 1) as Step);
  }

  function goBack() {
    if (step > 1) setStep((s) => (s - 1) as Step);
  }

  // ── Save ──────────────────────────────────────────────────────
  async function handleSave() {
    setSaveError(null);
    setSaving(true);

    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        setSaveError("You must be signed in to save your financial profile.");
        setSaving(false);
        return;
      }

      const idToken = await user.getIdToken();

      const payload: FinancialProfileInput = {
        monthly_income: monthlyIncome ? parseFloat(monthlyIncome) : null,
        monthly_expenses: monthlyExpenses ? parseFloat(monthlyExpenses) : null,
        monthly_investment_budget: monthlyInvestment
          ? parseFloat(monthlyInvestment)
          : null,
        annual_insurance_budget: annualInsurance
          ? parseFloat(annualInsurance)
          : null,
        financial_experience: (experience as FinancialExperience) || null,
        risk_profile: (riskProfile as RiskProfile) || null,
        primary_goals: selectedGoals,
      };

      await saveFinancialProfile(idToken, payload);
      setSaved(true);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setSaving(false);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Success screen
  // ─────────────────────────────────────────────────────────────

  if (saved) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
          <Check className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Financial profile saved
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            NIRNAY will use this context to personalise your experience.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            id="fp-go-dashboard"
            onClick={() => router.push("/dashboard")}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Continue to dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setSaved(false)}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Edit profile
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Progress indicator
  // ─────────────────────────────────────────────────────────────

  const progressPct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Progress header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Step {step} of {TOTAL_STEPS}
          </p>
          <p className="text-xs text-muted-foreground">{STEP_LABELS[step]}</p>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="space-y-6">
        {/* ── STEP 1: Financial snapshot ─────────────────────── */}
        {step === 1 && (
          <>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Your financial snapshot
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                These figures help NIRNAY understand your budget and capacity.
                All fields are optional — enter what you know.
              </p>
            </div>
            <div className="space-y-4">
              <CurrencyInput
                id="fp-monthly-income"
                label="Monthly income"
                description="Your take-home income per month"
                value={monthlyIncome}
                onChange={setMonthlyIncome}
                error={errors.monthlyIncome}
              />
              <CurrencyInput
                id="fp-monthly-expenses"
                label="Monthly expenses"
                description="Fixed costs — rent, utilities, EMIs, etc."
                value={monthlyExpenses}
                onChange={setMonthlyExpenses}
                error={errors.monthlyExpenses}
              />
              <CurrencyInput
                id="fp-investment-budget"
                label="Monthly investment budget"
                description="How much you can invest each month"
                value={monthlyInvestment}
                onChange={setMonthlyInvestment}
                error={errors.monthlyInvestment}
              />
              <CurrencyInput
                id="fp-insurance-budget"
                label="Annual insurance budget"
                description="Total you're comfortable spending on insurance per year"
                value={annualInsurance}
                onChange={setAnnualInsurance}
                error={errors.annualInsurance}
              />
            </div>
          </>
        )}

        {/* ── STEP 2: Financial experience ───────────────────── */}
        {step === 2 && (
          <>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Your financial experience
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This helps NIRNAY explain products at the right level of detail.
              </p>
            </div>
            <div className="space-y-2.5">
              {(
                [
                  {
                    value: "beginner",
                    label: "Beginner",
                    description:
                      "New to investing or insurance. Prefer simple explanations.",
                  },
                  {
                    value: "intermediate",
                    label: "Intermediate",
                    description:
                      "Have some investment or insurance experience. Comfortable with key terms.",
                  },
                  {
                    value: "advanced",
                    label: "Advanced",
                    description:
                      "Experienced with financial products. Happy to read technical detail.",
                  },
                ] as const
              ).map((opt) => (
                <SelectionCard
                  key={opt.value}
                  id={`fp-experience-${opt.value}`}
                  label={opt.label}
                  description={opt.description}
                  selected={experience === opt.value}
                  onSelect={() => setExperience(opt.value)}
                />
              ))}
            </div>
            {errors.experience && (
              <p className="text-xs text-destructive">{errors.experience}</p>
            )}
          </>
        )}

        {/* ── STEP 3: Risk preference ────────────────────────── */}
        {step === 3 && (
          <>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Your risk preference
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                How comfortable are you with your investments going up and down
                in the short term?
              </p>
            </div>
            <div className="space-y-2.5">
              {(
                [
                  {
                    value: "conservative",
                    label: "Conservative",
                    description:
                      "I prioritise protecting my money. Low returns are fine if the risk is low.",
                  },
                  {
                    value: "moderate",
                    label: "Moderate",
                    description:
                      "I can accept some fluctuation for better long-term growth.",
                  },
                  {
                    value: "aggressive",
                    label: "Aggressive",
                    description:
                      "I'm comfortable with higher risk for the potential of higher returns.",
                  },
                ] as const
              ).map((opt) => (
                <SelectionCard
                  key={opt.value}
                  id={`fp-risk-${opt.value}`}
                  label={opt.label}
                  description={opt.description}
                  selected={riskProfile === opt.value}
                  onSelect={() => setRiskProfile(opt.value)}
                />
              ))}
            </div>
            {errors.riskProfile && (
              <p className="text-xs text-destructive">{errors.riskProfile}</p>
            )}
          </>
        )}

        {/* ── STEP 4: Primary goals ───────────────────────────── */}
        {step === 4 && (
          <>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                What are you working towards?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select all that apply. You can update these anytime.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRIMARY_GOAL_OPTIONS.map((opt) => (
                <GoalChip
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  selected={selectedGoals.includes(opt.value)}
                  onToggle={() => toggleGoal(opt.value)}
                />
              ))}
            </div>
            {selectedGoals.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Tip: Selecting at least one goal helps NIRNAY surface relevant products.
              </p>
            )}
          </>
        )}

        {/* ── STEP 5: Review ──────────────────────────────────── */}
        {step === 5 && (
          <>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Review your profile
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Check the details below. Go back to make any changes before saving.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-1">
              <ReviewRow
                label="Monthly income"
                value={formatRupee(monthlyIncome)}
              />
              <ReviewRow
                label="Monthly expenses"
                value={formatRupee(monthlyExpenses)}
              />
              <ReviewRow
                label="Monthly investment"
                value={formatRupee(monthlyInvestment)}
              />
              <ReviewRow
                label="Annual insurance budget"
                value={formatRupee(annualInsurance)}
              />
              <ReviewRow
                label="Financial experience"
                value={experience ? capitalise(experience) : "Not provided"}
              />
              <ReviewRow
                label="Risk preference"
                value={riskProfile ? capitalise(riskProfile) : "Not provided"}
              />
              <ReviewRow
                label="Primary goals"
                value={
                  selectedGoals.length > 0
                    ? selectedGoals
                        .map(
                          (g) =>
                            PRIMARY_GOAL_OPTIONS.find((o) => o.value === g)
                              ?.label ?? g
                        )
                        .join(", ")
                    : "None selected"
                }
              />
            </div>

            {saveError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {saveError}
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          id="fp-back"
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors",
            step === 1
              ? "pointer-events-none opacity-40"
              : "hover:bg-muted"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {step < TOTAL_STEPS ? (
          <button
            id="fp-next"
            type="button"
            onClick={goNext}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            id="fp-save"
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save profile
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
