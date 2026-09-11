"use client";

import { useState } from "react";

const steps = [
  {
    verb: "DISCOVER",
    description: "Find relevant financial products and opportunities.",
  },
  {
    verb: "COMPARE",
    description: "Understand meaningful differences, costs, benefits and limitations.",
  },
  {
    verb: "DECIDE",
    description: "Understand why an option may fit your financial situation.",
  },
  {
    verb: "MANAGE",
    description: "Keep financial decisions organized.",
  },
  {
    verb: "OPTIMIZE",
    description: "Continuously improve financial decisions as circumstances change.",
  },
];

export function NirnayLoopSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section
      id="how-it-works"
      className="py-24 bg-white text-black border-t border-black/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-blue-600/50" />
            <span className="text-xs font-mono text-blue-600 tracking-widest uppercase">
              The NIRNAY Journey
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-black mb-4">
            From scattered decisions to financial clarity.
          </h2>
          <p className="text-lg text-black/60 max-w-2xl font-light leading-relaxed">
            Every step in NIRNAY is connected. Your profile informs your
            recommendations. Your decisions become your managed portfolio. Your
            portfolio generates your next insight.
          </p>
        </div>

        {/* Desktop: horizontal flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Background connector */}
            <div className="absolute top-[23px] left-[10%] right-[10%] h-px bg-black/10" />

            <div className="grid grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative group cursor-default"
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <div className="mb-8 flex items-center justify-center">
                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ${
                        activeStep === index
                          ? "border-blue-600 bg-blue-600/10 shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                          : "border-black/15 bg-white"
                      }`}
                    >
                      <span className="font-mono text-xs text-black/50">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`font-mono text-[11px] tracking-[0.25em] uppercase mb-3 transition-colors duration-300 ${
                        activeStep === index
                          ? "text-blue-600"
                          : "text-black/70"
                      }`}
                    >
                      {step.verb}
                    </div>
                    <p
                      className={`text-sm font-light leading-relaxed transition-colors duration-300 ${
                        activeStep === index
                          ? "text-black/65"
                          : "text-black/40"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical flow */}
        <div className="lg:hidden space-y-0">
          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-6 pb-10 last:pb-0">
              {index < steps.length - 1 && (
                <div className="absolute left-4 top-9 bottom-0 w-px bg-black/10" />
              )}
              <div className="relative flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full border border-black/20 bg-white">
                <span className="font-mono text-xs text-black/50">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="pt-1">
                <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-blue-600 mb-2">
                  {step.verb}
                </div>
                <p className="text-sm text-black/60 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bridge statement */}
        <div className="mt-16 pt-8 border-t border-black/10 text-center">
          <p className="font-mono text-sm text-black/50 tracking-wide">
            Every step is personalised to your financial context — not generic
            advice for everyone.
          </p>
        </div>
      </div>
    </section>
  );
}
