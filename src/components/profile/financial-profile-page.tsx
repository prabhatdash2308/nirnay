"use client";

import { useState, useEffect } from "react";
import { AccountSettingsNav } from "@/components/settings/account-settings-nav";
import { ProfileSkeleton } from "./profile-skeleton";
import { getFullFinancialProfile, updateFinancialProfile } from "@/services/financial-profile";
import { FullFinancialProfile, UpdateFinancialProfileInput } from "@/types/financial-profile";
import { IncomeFrequency } from "@/types/onboarding";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function FinancialProfilePageContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const [originalData, setOriginalData] = useState<FullFinancialProfile | null>(null);
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("INR");
  const [baseIncomeAmount, setBaseIncomeAmount] = useState("");
  const [baseIncomeFrequency, setBaseIncomeFrequency] = useState<IncomeFrequency>("monthly");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFullFinancialProfile();
      setOriginalData(data);
      resetForm(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load financial profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = (data: FullFinancialProfile) => {
    setFullName(data.fullName || "");
    setBaseCurrency(data.baseCurrency || "INR");
    setBaseIncomeAmount(data.baseIncomeAmount?.toString() || "");
    setBaseIncomeFrequency(data.baseIncomeFrequency || "monthly");
    setMonthlyExpenses(data.monthlyExpenses?.toString() || "");
    setSuccess(false);
    setError(null);
  };

  const handleCancel = () => {
    if (originalData) {
      resetForm(originalData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    // Validate
    const parsedIncome = baseIncomeAmount ? parseFloat(baseIncomeAmount) : null;
    if (parsedIncome !== null && (isNaN(parsedIncome) || parsedIncome < 0)) {
      setError("Income must be a valid positive number.");
      return;
    }

    const parsedExpenses = monthlyExpenses ? parseFloat(monthlyExpenses) : null;
    if (parsedExpenses !== null && (isNaN(parsedExpenses) || parsedExpenses < 0)) {
      setError("Expenses must be a valid positive number.");
      return;
    }

    try {
      setSaving(true);
      
      const payload: UpdateFinancialProfileInput = {
        fullName: fullName.trim() || null,
        baseCurrency,
        baseIncomeAmount: parsedIncome,
        baseIncomeFrequency,
        monthlyExpenses: parsedExpenses,
      };

      await updateFinancialProfile(payload);
      
      // Update local baseline state so cancel works against the new truth
      setOriginalData({
        ...originalData!,
        ...payload,
        monthlyIncome: null // Needs recalc if used on UI directly, but we let server handle it on next load if needed
      });
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <AccountSettingsNav />
        <ProfileSkeleton />
      </div>
    );
  }

  if (error && !originalData) {
    return (
      <div className="max-w-4xl mx-auto">
        <AccountSettingsNav />
        <div className="p-8 text-center border border-border rounded-2xl bg-card">
          <AlertCircle className="size-8 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Unable to load profile</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-8">
      <AccountSettingsNav />

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Financial Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Keep your financial baseline up to date so NIRNAY can give you relevant insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        
        {/* Personal Info */}
        <section className="bg-card border border-border rounded-2xl p-5 md:p-8">
          <h2 className="text-lg font-semibold tracking-tight mb-6">Personal Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email (Managed by Provider)</label>
              <input
                type="text"
                value={originalData?.email || ""}
                disabled
                className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-sm text-muted-foreground cursor-not-allowed opacity-80"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Authentication and email are managed securely through your login provider.
              </p>
            </div>
          </div>
        </section>

        {/* Financial Baseline */}
        <section className="bg-card border border-border rounded-2xl p-5 md:p-8">
          <h2 className="text-lg font-semibold tracking-tight mb-6">Financial Baseline</h2>
          
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Base Currency</label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              >
                <option value="INR">₹ Indian Rupee (INR)</option>
                <option value="USD">$ US Dollar (USD)</option>
                <option value="EUR">€ Euro (EUR)</option>
                <option value="GBP">£ British Pound (GBP)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1.5">
                Changing currency does not convert your existing stored numerical amounts.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Income Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  {baseCurrency}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={baseIncomeAmount}
                  onChange={(e) => setBaseIncomeAmount(e.target.value)}
                  className="w-full h-11 pl-12 pr-4 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all tabular-nums"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Income Frequency</label>
              <select
                value={baseIncomeFrequency}
                onChange={(e) => setBaseIncomeFrequency(e.target.value as IncomeFrequency)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="yearly">Yearly</option>
                <option value="irregular">Irregular</option>
              </select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Baseline Monthly Expenses</label>
              <div className="relative md:max-w-[calc(50%-12px)]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  {baseCurrency}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  className="w-full h-11 pl-12 pr-4 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all tabular-nums"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Your fixed commitments like rent and utilities. Variable tracking is handled in <Link href="/budget" className="text-primary hover:underline">Budget</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Goals Info */}
        <section className="bg-card border border-border rounded-2xl p-5 md:p-8 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight mb-1">Financial Goals</h2>
            <p className="text-sm text-muted-foreground">Manage your specific targets and milestones.</p>
          </div>
          <Link 
            href="/goals" 
            className="px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-xl text-sm font-medium transition-colors"
          >
            Manage Goals
          </Link>
        </section>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-3">
            <AlertCircle className="size-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm rounded-xl flex items-center gap-3">
            <CheckCircle2 className="size-5 shrink-0" />
            <p>Your financial profile has been successfully updated.</p>
          </div>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="h-11 px-6 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="h-11 px-6 text-muted-foreground font-medium hover:text-foreground transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}
