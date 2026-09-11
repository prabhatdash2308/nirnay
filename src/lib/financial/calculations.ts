export function calculateRemainingCashFlow(income: number | null, expenses: number | null): number | null {
  if (income === null || expenses === null) {
    return null;
  }
  return income - expenses;
}

export function formatCurrency(amount: number | null, currency: string = "INR"): string {
  if (amount === null) return "—";
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateGoalProgress(currentAmount: number, targetAmount: number): number {
  if (targetAmount <= 0) return 0;
  if (currentAmount < 0) return 0;
  
  const progress = (currentAmount / targetAmount) * 100;
  return Math.min(Math.max(progress, 0), 100);
}
