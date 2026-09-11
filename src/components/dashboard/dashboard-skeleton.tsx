export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="w-48 h-8 bg-muted rounded-md mb-8" />
      
      {/* Financial Snapshot Skeleton */}
      <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 h-48">
        <div className="w-32 h-6 bg-muted rounded-md mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="space-y-2">
            <div className="w-24 h-4 bg-muted rounded-md" />
            <div className="w-32 h-8 bg-muted rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="w-24 h-4 bg-muted rounded-md" />
            <div className="w-32 h-8 bg-muted rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="w-32 h-4 bg-muted rounded-md" />
            <div className="w-32 h-8 bg-muted rounded-md" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Cash Flow Skeleton */}
          <div className="bg-card border border-border rounded-2xl p-6 h-64">
            <div className="w-40 h-6 bg-muted rounded-md mb-6" />
            <div className="space-y-4">
              <div className="w-full h-12 bg-muted rounded-xl" />
              <div className="w-full h-12 bg-muted rounded-xl" />
            </div>
          </div>
          {/* Recent Activity Skeleton */}
          <div className="bg-card border border-border rounded-2xl p-6 h-64">
            <div className="w-32 h-6 bg-muted rounded-md mb-6" />
            <div className="w-full h-32 bg-muted rounded-xl" />
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Goals Skeleton */}
          <div className="bg-card border border-border rounded-2xl p-6 h-64">
            <div className="w-24 h-6 bg-muted rounded-md mb-6" />
            <div className="space-y-4">
              <div className="w-full h-16 bg-muted rounded-xl" />
              <div className="w-full h-16 bg-muted rounded-xl" />
            </div>
          </div>
          {/* Intelligence Skeleton */}
          <div className="bg-card border border-border rounded-2xl p-6 h-64">
            <div className="w-40 h-6 bg-muted rounded-md mb-4" />
            <div className="w-full h-12 bg-muted rounded-xl mb-3" />
            <div className="w-full h-12 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
