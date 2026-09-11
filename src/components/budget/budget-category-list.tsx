import { BudgetOverview } from "@/types/budget";
import { BudgetCategoryCard } from "./budget-category-card";

interface BudgetCategoryListProps {
  overviews: BudgetOverview[];
  baseCurrency: string;
  onEdit: (b: BudgetOverview["budget"]) => void;
  onDelete: (b: BudgetOverview["budget"]) => void;
}

export function BudgetCategoryList({ overviews, baseCurrency, onEdit, onDelete }: BudgetCategoryListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
      {overviews.map(overview => (
        <BudgetCategoryCard 
          key={overview.budget.id}
          overview={overview}
          baseCurrency={baseCurrency}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
