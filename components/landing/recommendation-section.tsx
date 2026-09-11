import { ArrowRight, CheckCircle2, AlertCircle, Info, Database } from "lucide-react";
import Link from "next/link";

export function RecommendationSection() {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left — Explanatory Text */}
          <div className="lg:pt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
              Explainable AI
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl mb-6">
              Every recommendation shows you exactly why.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              NIRNAY does not act like a black box that simply says "BUY THIS." 
              Instead, it acts as a translation layer—taking raw facts, calculating them against your profile, and using AI to explain the trade-offs in plain language.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "Clearly separates raw facts from AI explanations",
                "Explicitly states the trade-offs for every choice",
                "Shows important assumptions made during calculation",
                "Always provides alternatives for comparison",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <div className="mt-1 flex-shrink-0 size-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="size-2 rounded-full bg-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/auth">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline cursor-pointer transition-all group">
                See it in action
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          {/* Right — Structured Mockup */}
          <div className="relative">
            {/* Subtle tilt backdrop */}
            <div className="absolute inset-0 -z-10 bg-primary/5 rounded-3xl transform rotate-1 scale-105" />

            <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden flex flex-col">
              
              {/* Mockup Header */}
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                  Illustrative UI — Not a real product
                </span>
                <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded border border-border">
                  Health Insurance
                </span>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Recommendation Block */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 relative">
                  <div className="absolute -top-2.5 right-4 bg-background px-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded text-primary border border-primary/20 bg-primary/5">
                      Recommendation
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Recommended for your profile</h4>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Weighing pros &amp; cons of &quot;BimaPlus 1Cr&quot;...</div>
                  <p className="text-sm text-muted-foreground">
                    This option appears to fit your stated requirements better than the 3 alternatives reviewed.
                  </p>
                </div>

                {/* Why it fits (AI Explanation & Calculated) */}
                <div className="relative pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-mono text-foreground uppercase tracking-widest">Why it fits you</h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 bg-indigo-500/5">
                      AI Explanation
                    </span>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        <strong className="text-foreground font-medium">Budget fit:</strong> Fits entirely within your ₹15,000 annual insurance budget limit.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        <strong className="text-foreground font-medium">Coverage match:</strong> Meets your stated requirement for ₹10L base cover.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        <strong className="text-foreground font-medium">Wait period:</strong> Has a shorter pre-existing disease waiting period than the next option.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Trade-offs */}
                <div className="relative pt-2">
                  <h4 className="text-xs font-mono text-foreground uppercase tracking-widest mb-3">Trade-offs to consider</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        Higher premium than the lowest-cost alternative by ₹1,200/year.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        Includes a room rent sub-limit. Ensure this matches your expected hospital tier.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Grid for minor sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                  {/* Alternatives */}
                  <div>
                    <h4 className="text-xs font-mono text-foreground uppercase tracking-widest mb-2 flex items-center justify-between">
                      Alternatives
                    </h4>
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <Info className="size-4 mt-0.5 text-muted-foreground" />
                      <span>2 alternatives reviewed and available for side-by-side comparison.</span>
                    </p>
                  </div>
                  {/* Assumptions */}
                  <div>
                    <h4 className="text-xs font-mono text-foreground uppercase tracking-widest mb-2 flex items-center justify-between">
                      Assumptions
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 border border-blue-500/20 bg-blue-500/5">
                        Calculated
                      </span>
                    </h4>
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <Info className="size-4 mt-0.5 text-muted-foreground" />
                      <span>Assumes no unlisted pre-existing medical conditions.</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Data / Trust Footer */}
              <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="size-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Source: Provider Data</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 bg-emerald-500/5">
                    Verified Facts
                  </span>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
