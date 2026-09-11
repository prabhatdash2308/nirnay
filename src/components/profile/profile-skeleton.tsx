export function ProfileSkeleton() {
  return (
    <div className="space-y-8 animate-pulse pb-8">
      <div>
        <div className="w-48 h-8 bg-muted rounded-md mb-2" />
        <div className="w-72 h-4 bg-muted rounded-md" />
      </div>

      <div className="border-b border-muted mt-6" />

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="w-32 h-6 bg-muted rounded-md mb-6" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="w-24 h-4 bg-muted rounded-md" />
              <div className="w-full h-11 bg-muted rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-muted rounded-md" />
              <div className="w-full h-11 bg-muted rounded-xl" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="w-32 h-6 bg-muted rounded-md mb-6" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="w-24 h-4 bg-muted rounded-md" />
              <div className="w-full h-11 bg-muted rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-muted rounded-md" />
              <div className="w-full h-11 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
