import { ArrowRight, Database, LayoutList, SlidersHorizontal, Lightbulb, CheckCircle2 } from "lucide-react";

const flowSteps = [
  {
    label: "Complex Financial Data",
    description: "Fragmented products, varying terms, and disconnected goals.",
    icon: Database,
  },
  {
    label: "Clear Information",
    description: "Your financial reality organized into a unified, readable profile.",
    icon: LayoutList,
  },
  {
    label: "Meaningful Comparison",
    description: "Apples-to-apples evaluation based on your specific requirements.",
    icon: SlidersHorizontal,
  },
  {
    label: "Understandable Recommendation",
    description: "Transparent reasoning showing exactly why an option fits.",
    icon: Lightbulb,
  },
  {
    label: "Confident User Action",
    description: "Proceed with certainty, fully aware of any trade-offs.",
    icon: CheckCircle2,
  },
];

export function PersonalizationSection() {
  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl mb-6">
            From financial noise to clear decisions.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            NIRNAY acts as a translation layer between the complex financial industry
            and your personal life. It takes raw, overwhelming data and processes it
            into actionable clarity.
          </p>
        </div>

        {/* Transformation Flow Visualization */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative z-10">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              const isFirst = index === 0;
              const isLast = index === flowSteps.length - 1;
              
              return (
                <div key={index} className="relative group">
                  {/* Mobile connecting line */}
                  {!isLast && (
                    <div className="lg:hidden absolute left-[31px] top-16 bottom-[-16px] w-0.5 bg-muted z-0" />
                  )}
                  
                  <div className={`relative z-10 flex flex-row lg:flex-col items-start lg:items-center p-5 rounded-2xl border transition-all duration-300 bg-card hover:shadow-md
                    ${isFirst ? "border-border bg-muted/10" : ""}
                    ${isLast ? "border-primary/20 bg-primary/5" : ""}
                    ${!isFirst && !isLast ? "border-border" : ""}
                  `}>
                    
                    {/* Icon Container */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-0 lg:mb-5 shrink-0 transition-colors duration-300
                      ${isFirst ? "bg-muted text-muted-foreground" : ""}
                      ${isLast ? "bg-primary text-primary-foreground" : ""}
                      ${!isFirst && !isLast ? "bg-muted/50 text-foreground group-hover:bg-primary/10 group-hover:text-primary" : ""}
                    `}>
                      <Icon className="size-5" />
                    </div>

                    {/* Text Content */}
                    <div className="ml-4 lg:ml-0 lg:text-center flex-1">
                      <h3 className="text-sm font-semibold text-foreground mb-2">
                        {step.label}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                  </div>

                  {/* Desktop Arrow Indicator */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-20 items-center justify-center w-6 h-6 rounded-full bg-background border border-border text-muted-foreground">
                      <ArrowRight className="size-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
