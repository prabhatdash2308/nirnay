import { Search } from "lucide-react";

export type FilterState = {
  search: string;
  type: "all" | "income" | "expense";
  sort: "newest" | "oldest" | "highest" | "lowest";
};

interface TransactionFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function TransactionFilters({ filters, onChange }: TransactionFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="size-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search transactions..."
          className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>
      
      <div className="flex gap-4">
        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value as FilterState["type"] })}
          className="h-10 px-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer min-w-[120px]"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as FilterState["sort"] })}
          className="h-10 px-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer min-w-[140px]"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest amount</option>
          <option value="lowest">Lowest amount</option>
        </select>
      </div>
    </div>
  );
}
