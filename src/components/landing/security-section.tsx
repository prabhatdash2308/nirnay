import { ShieldCheck, User, Calculator, Sparkles, Database, Clock } from "lucide-react";

const trustCategories = [
  {
    label: "User Provided",
    description: "Your financial profile, income, and stated goals.",
    icon: User,
    colorClass: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    label: "Verified",
    description: "Objective product facts like premiums, sub-limits, and waiting periods.",
    icon: ShieldCheck,
    colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    label: "Calculated",
    description: "Mathematical alignment between product facts and your profile.",
    icon: Calculator,
    colorClass: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    label: "AI Generated",
    description: "Plain-language explanations of trade-offs and recommendations.",
    icon: Sparkles,
    colorClass: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="py-24 bg-muted/30 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left side: Explanation */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
              Data Transparency
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl mb-6">
              How do you know what information you are seeing?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              In personal finance, the source of information matters. NIRNAY categorizes every piece of data so you know exactly what is a fact, what is a calculation, and what is an AI explanation.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trustCategories.map((category, idx) => {
                const Icon = category.icon;
                return (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`flex items-center justify-center size-6 rounded border ${category.colorClass}`}>
                        <Icon className="size-3.5" />
                      </div>
                      <span className="font-medium text-foreground text-sm">{category.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right side: Visual Hierarchy Demonstration */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 bg-primary/5 rounded-3xl transform -rotate-1 scale-105" />
            
            {/* The Conceptual Card */}
            <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden flex flex-col">
              
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                  Information Hierarchy
                </span>
              </div>

              <div className="p-6 space-y-4">
                
                {/* Level 1: Primary Financial Info */}
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 relative">
                  <div className="absolute top-3 right-3 text-emerald-600/50">
                    <ShieldCheck className="size-4" />
                  </div>
                  <h4 className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                    Primary Financial Information
                  </h4>
                  <p className="text-sm text-foreground font-medium">₹10L Base Cover • ₹8,500/yr Premium</p>
                </div>

                {/* Level 2: Recommendation / Action */}
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 relative">
                  <h4 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">
                    Recommendation
                  </h4>
                  <p className="text-sm text-foreground">Recommended based on your stated budget limit.</p>
                </div>

                {/* Level 3: Important Trade-offs */}
                <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 relative">
                  <div className="absolute top-3 right-3 text-indigo-600/50">
                    <Sparkles className="size-4" />
                  </div>
                  <h4 className="text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">
                    Important Trade-offs
                  </h4>
                  <p className="text-sm text-muted-foreground">Contains a room rent sub-limit.</p>
                </div>

              </div>

              {/* Level 4: Trust Metadata (Footer) */}
              <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Database className="size-3" />
                    <span>Source: Provider API</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>Updated: Today</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
