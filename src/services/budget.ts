import { supabase } from "@/lib/supabase/client";
import { firebaseAuth } from "@/lib/firebase/client";
import { Budget, CreateBudgetInput, UpdateBudgetInput, BudgetOverview, BudgetSummary } from "@/types/budget";
import { getTransactions } from "./transactions";

export async function getBudgets(periodMonth: number, periodYear: number): Promise<Budget[]> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user.uid)
    .eq("period_month", periodMonth)
    .eq("period_year", periodYear);

  if (error) {
    console.error("fetch budgets error", error);
    throw new Error("Failed to load budgets. Please try again.");
  }

  return (data || []).map(row => ({
    ...row,
    amount: Number(row.amount)
  })) as Budget[];
}

export async function createBudget(input: CreateBudgetInput): Promise<Budget> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("budgets")
    .insert({
      user_id: user.uid,
      category: input.category,
      amount: input.amount,
      period_month: input.period_month,
      period_year: input.period_year,
    })
    .select("*")
    .single();

  if (error) {
    console.error("create budget error", error);
    if (error.code === '23505') { // Postgres unique_violation
      throw new Error(`A budget for ${input.category} already exists this month.`);
    }
    throw new Error("Failed to create budget. Please try again.");
  }

  return { ...data, amount: Number(data.amount) } as Budget;
}

export async function updateBudget(input: UpdateBudgetInput): Promise<Budget> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("budgets")
    .update({ amount: input.amount })
    .eq("id", input.id)
    .eq("user_id", user.uid)
    .select("*")
    .single();

  if (error || !data) {
    console.error("update budget error", error);
    throw new Error("Failed to update budget. Please try again.");
  }

  return { ...data, amount: Number(data.amount) } as Budget;
}

export async function deleteBudget(id: number): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.uid);

  if (error) {
    console.error("delete budget error", error);
    throw new Error("Failed to delete budget. Please try again.");
  }
}

export async function getBudgetOverview(periodMonth: number, periodYear: number): Promise<{ overviews: BudgetOverview[], summary: BudgetSummary }> {
  // 1. Get budgets for period
  const budgets = await getBudgets(periodMonth, periodYear);
  
  // 2. Get real transactions for this period to calculate actual spending
  // Pad month to 2 digits
  const monthStr = periodMonth.toString().padStart(2, '0');
  
  // Calculate start and end date (Y-M-D) of the month
  const startDate = `${periodYear}-${monthStr}-01`;
  const lastDay = new Date(periodYear, periodMonth, 0).getDate();
  const endDate = `${periodYear}-${monthStr}-${lastDay}`;
  
  const transactions = await getTransactions({ from: startDate, to: endDate });
  
  // Only expense transactions count against budget
  const expenses = transactions.filter(t => t.type === "expense");

  let totalBudgeted = 0;
  let totalSpent = 0;
  let categoriesOverBudget = 0;

  const overviews: BudgetOverview[] = budgets.map(budget => {
    totalBudgeted += budget.amount;
    
    // Sum matching expenses
    const spent = expenses
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
      
    totalSpent += spent;
    
    const remaining = budget.amount - spent;
    
    let percentageUsed = 0;
    if (budget.amount > 0) {
      percentageUsed = (spent / budget.amount) * 100;
    } else if (spent > 0) {
      // 0 budget but spent money -> infinitely over budget, cap at 100%
      percentageUsed = 100;
    }
    
    let status: "on_track" | "near_limit" | "over_budget" = "on_track";
    if (remaining < 0) {
      status = "over_budget";
      categoriesOverBudget++;
    } else if (percentageUsed >= 80) {
      status = "near_limit";
    }
    
    return {
      budget,
      spent,
      remaining,
      percentageUsed,
      status
    };
  });

  return {
    overviews: overviews.sort((a, b) => b.percentageUsed - a.percentageUsed), // highest usage first
    summary: {
      totalBudgeted,
      totalSpent,
      totalRemaining: totalBudgeted - totalSpent,
      categoriesOverBudget
    }
  };
}
