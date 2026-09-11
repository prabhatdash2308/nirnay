export function TransactionSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="w-32 h-8 bg-muted rounded-md mb-2" />
          <div className="w-48 h-4 bg-muted rounded-md" />
        </div>
        <div className="w-32 h-10 bg-muted rounded-md" />
      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-64 h-10 bg-muted rounded-md" />
        <div className="w-32 h-10 bg-muted rounded-md" />
        <div className="w-32 h-10 bg-muted rounded-md" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-border/50 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="size-10 bg-muted rounded-full" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-muted rounded-md" />
                <div className="w-24 h-3 bg-muted rounded-md" />
              </div>
            </div>
            <div className="flex gap-8 items-center">
              <div className="w-24 h-4 bg-muted rounded-md" />
              <div className="w-8 h-8 bg-muted rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
