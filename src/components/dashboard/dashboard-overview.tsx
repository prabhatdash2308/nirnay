"use client";

import { useEffect, useState } from "react";
import { getDashboardData } from "@/services/financial-profile";
import { getTransactions } from "@/services/transactions";
import { getBudgetOverview } from "@/services/budget";
import { DashboardData } from "@/types/dashboard";
import { FinancialSnapshot } from "./financial-snapshot";
import { CashFlowOverview } from "./cash-flow-overview";
import { GoalsOverview } from "./goals-overview";
import { IntelligencePreview } from "./intelligence-preview";
import { RecentActivity } from "./recent-activity";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { RefreshCcw } from "lucide-react";

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // 1-12
      const startOfMonth = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endOfMonth = new Date(year, month, 0).toISOString().split('T')[0];

      const [dashboardData, transactions, budgetStatus] = await Promise.all([
        getDashboardData(),
        getTransactions({ from: startOfMonth, to: endOfMonth }).catch(() => []),
        getBudgetOverview(month, year).catch(() => null)
      ]);

      setData({
        ...dashboardData,
        transactions,
        budgetStatus
      });
    } catch (err: unknown) {
      console.error("Error fetching dashboard data", err);
      setError("We couldn't load your financial data right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-3xl bg-card min-h-[400px]">
        <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <span className="text-destructive font-bold text-xl">!</span>
        </div>
        <h3 className="text-lg font-medium mb-2">Unable to load dashboard</h3>
        <p className="text-muted-foreground text-sm max-w-sm mb-6">{error}</p>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <RefreshCcw className="size-4" />
          Retry
        </button>
      </div>
    );
  }

  const greeting = data.fullName 
    ? `Good morning, ${data.fullName.split(' ')[0]}` 
    : "Good morning";

  return (
    <div className="space-y-6 md:space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{greeting}</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Here's your current financial picture.</p>
      </div>

      {/* Main Snapshot */}
      <FinancialSnapshot data={data} />

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CashFlowOverview data={data} />
          <RecentActivity data={data} />
        </div>
        
        <div className="space-y-6 flex flex-col">
          <div className="flex-1 min-h-[300px]">
            <GoalsOverview data={data} />
          </div>
          <div className="flex-1 min-h-[250px]">
            <IntelligencePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
