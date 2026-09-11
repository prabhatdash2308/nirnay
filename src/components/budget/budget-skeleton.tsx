export function BudgetSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8 animate-pulse pb-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="w-32 h-8 bg-muted rounded-md mb-2" />
          <div className="w-48 h-4 bg-muted rounded-md" />
        </div>
        <div className="w-32 h-10 bg-muted rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 h-32" />
        <div className="bg-card border border-border rounded-2xl p-6 h-32" />
        <div className="bg-card border border-border rounded-2xl p-6 h-32" />
      </div>

      <div className="space-y-4 pt-6">
        <div className="bg-card border border-border rounded-2xl p-6 h-32" />
        <div className="bg-card border border-border rounded-2xl p-6 h-32" />
        <div className="bg-card border border-border rounded-2xl p-6 h-32" />
      </div>
    </div>
  );
}
