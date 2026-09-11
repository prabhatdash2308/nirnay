export function AppShellSkeleton() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar Skeleton */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/50">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <div className="w-24 h-6 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-muted/50 animate-pulse" />
          ))}
        </div>
        <div className="p-4 border-t border-border/50">
          <div className="h-12 rounded-xl bg-muted/50 animate-pulse" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Skeleton */}
        <header className="h-16 flex items-center px-4 sm:px-6 lg:px-8 border-b border-border/50 bg-background">
          <div className="lg:hidden w-8 h-8 rounded bg-muted animate-pulse mr-4" />
          <div className="w-32 h-6 rounded bg-muted animate-pulse" />
          <div className="ml-auto flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          </div>
        </header>

        {/* Content Skeleton */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="w-48 h-8 rounded bg-muted animate-pulse" />
            <div className="h-64 rounded-2xl bg-muted/50 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav Skeleton */}
      <div className="md:hidden h-16 border-t border-border/50 bg-background flex items-center justify-around px-4 pb-safe">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-12 h-10 rounded bg-muted/50 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
