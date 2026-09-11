import { Sparkles } from "lucide-react";

export function IntelligencePreview() {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <Sparkles className="size-24 text-primary" />
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="size-5 text-primary" />
        <h3 className="text-base font-medium tracking-tight text-primary">NIRNAY Intelligence</h3>
      </div>
      
      <p className="text-sm text-foreground/80 mb-6 leading-relaxed relative z-10">
        Personalized financial insights will appear here as NIRNAY learns from your financial activity.
      </p>
      
      <div className="mt-auto space-y-3 relative z-10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 border border-primary/10 text-sm text-muted-foreground backdrop-blur-sm">
          <div className="size-1.5 rounded-full bg-primary/40" />
          Cash-flow observations
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 border border-primary/10 text-sm text-muted-foreground backdrop-blur-sm">
          <div className="size-1.5 rounded-full bg-primary/40" />
          Spending anomalies
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 border border-primary/10 text-sm text-muted-foreground backdrop-blur-sm">
          <div className="size-1.5 rounded-full bg-primary/40" />
          Savings opportunities
        </div>
      </div>
    </div>
  );
}
