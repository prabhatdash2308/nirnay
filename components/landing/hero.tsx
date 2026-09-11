
import Link from "next/link";

import MetaBalls from "./metaballs";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-black text-white selection:bg-nirnay-accent/30 selection:text-white" style={{ minHeight: "100svh" }}>
      
      {/* Background Visual Layer */}
      <div className="absolute inset-0 w-full h-full object-cover anim-fade-in bg-black" aria-hidden="true">
        <MetaBalls 
          color="#AFDDFF"
          cursorBallColor="#ffffff"
          cursorBallSize={2}
          ballCount={15}
          animationSize={30}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.15}
          clumpFactor={1}
          speed={0.3}
        />
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-24 z-10 pointer-events-none">
        <div className="max-w-4xl motion-reduce:animate-none motion-reduce:opacity-100 pointer-events-auto">
          
          <div className="mb-6 inline-flex items-center gap-3 anim-fade-up" style={{ animationDelay: '300ms' }}>
            <div className="h-[1px] w-8 bg-nirnay-accent/50" />
            <span className="text-xs font-mono text-nirnay-accent tracking-widest uppercase">Financial Protection &amp; Investment Copilot</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1em] mb-8 anim-fade-up" style={{ animationDelay: '400ms' }}>
            Your Money. <br />
            <span className="text-white/60">One Clear Decision.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed mb-10 anim-fade-up" style={{ animationDelay: '500ms' }}>
            Compare insurance plans, evaluate investments, track your goals — all grounded in your actual financial context.
          </p>

          {/* Primary CTA — visible at all screen sizes */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 anim-fade-up" style={{ animationDelay: '700ms' }}>
            <Link 
              href="/auth"
              className="group relative flex h-14 w-full sm:w-auto items-center justify-center gap-4 bg-nirnay-accent px-[16px] md:px-[20px] text-black transition-colors hover:bg-[#c8e8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
            >
              <span className="text-black text-[16px] leading-none">&#10022;</span>
              <span className="font-mono text-black text-[13px] md:text-[14px] font-semibold leading-none uppercase tracking-widest">
                Get Started
              </span>
            </Link>
            <Link 
              href="#how-it-works"
              className="text-sm font-medium text-white/50 hover:text-white transition-colors uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm px-1 py-0.5"
            >
              See how it works →
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom Info Card — desktop only */}
      <div className="absolute bottom-5 md:bottom-[35px] right-5 md:right-[35px] z-20 hidden md:block anim-slide-right" style={{ animationDelay: '1100ms' }}>
        <div className="relative max-w-[280px]">
          <div className="font-mono text-black text-[13px] leading-[15.6px] bg-nirnay-accent px-[6px] py-[2px] inline-block mb-[10px] tracking-widest uppercase">
            Financial Clarity — One Place
          </div>
          <div className="relative p-[20px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 280 168" preserveAspectRatio="none">
              <polygon points="0.5,0.5 279.5,0.5 279.5,167.5 30,167.5 0.5,137.5" fill="none" className="stroke-nirnay-accent" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
            <p className="relative font-mono text-white text-[13px] leading-[18px] mb-[18px]">
              Insurance · Investments · Goals · Cash Flow — in one intelligent, personalised picture.
            </p>
            <Link href="#how-it-works" className="relative font-mono text-nirnay-accent text-[13px] leading-[15.6px] cursor-pointer hover:underline uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm px-1 -ml-1">
              Explore NIRNAY
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
