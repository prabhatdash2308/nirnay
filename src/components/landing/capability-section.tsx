import { Search, SlidersHorizontal, Lightbulb, LayoutDashboard, ArrowRight } from "lucide-react";
import Link from "next/link";

const capabilities = [
  {
    title: "Discover",
    icon: Search,
    context: "The market contains thousands of financial products.",
    value: "Filter products against your specific profile.",
    meaning: "Find relevant products rather than overwhelming yourself with a generic catalog.",
    action: "Build your profile",
    href: "/auth",
  },
  {
    title: "Compare",
    icon: SlidersHorizontal,
    context: "Comparing by price alone hides critical details.",
    value: "Evaluate differences, costs, benefits, and limitations.",
    meaning: "Understand clear trade-offs before making a financial commitment.",
    action: "Compare options",
    href: "/auth",
  },
  {
    title: "Recommendations",
    icon: Lightbulb,
    context: "Generic advice rarely applies to specific situations.",
    value: "Receive recommendations that explain exactly WHY they fit.",
    meaning: "Make decisions based on transparent reasoning, not a blind 'Buy This' prompt.",
    action: "See recommendations",
    href: "/auth",
  },
  {
    title: "Manage",
    icon: LayoutDashboard,
    context: "Financial decisions often become scattered and forgotten.",
    value: "Track policies, SIPs, and goals in one unified dashboard.",
    meaning: "Keep your decisions organized and track important renewal actions.",
    action: "View dashboard",
    href: "/auth",
  },
];

export function CapabilitySection() {
  return (
    <section id="capabilities" className="py-24 bg-muted/30 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-primary/20" />
            <span className="text-xs font-mono text-primary tracking-widest uppercase">
              Core Capabilities
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl mb-4">
            Everything you need to decide.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            NIRNAY is designed to support the complete lifecycle of a financial decision — from initial discovery to long-term management.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Title & Icon */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-primary/5 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">{cap.title}</h3>
                </div>

                {/* Structured Content: Context -> Value -> Meaning */}
                <div className="flex-1 space-y-6 mb-8">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Context</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{cap.context}</p>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Value</div>
                    <p className="text-sm font-medium text-foreground leading-relaxed">{cap.value}</p>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Meaning</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{cap.meaning}</p>
                  </div>
                </div>

                {/* Action */}
                <div className="pt-6 border-t border-border">
                  <Link 
                    href={cap.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline transition-all group"
                  >
                    {cap.action}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
