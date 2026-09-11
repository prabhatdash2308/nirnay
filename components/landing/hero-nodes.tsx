export function HeroNodes() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block">
      
      {/* Node 1: CORE_ENTITY (Cash Flow) */}
      <div className="absolute top-[27%] left-[60%] w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] border border-white/80 anim-scale-in" style={{ animationDelay: '1500ms' }} />
      <div className="absolute top-[11%] left-[26%] anim-slide-left" style={{ animationDelay: '1100ms' }}>
        <span className="font-mono text-white text-[13px] leading-[15.6px] whitespace-nowrap">[ CASH FLOW ]</span>
        <p className="font-mono text-white/50 text-[11px] leading-[14px] mt-[4px] max-w-[160px]">Tracks income, spending and remaining cash.</p>
      </div>

      {/* Node 2: LUMINOUS_INSIGHT (Financial Health) */}
      <div className="absolute top-[58%] left-[32%] w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] border border-white/80 anim-scale-in" style={{ animationDelay: '1800ms' }} />
      <div className="absolute top-[76%] left-[3%] anim-slide-left" style={{ animationDelay: '1400ms' }}>
        <span className="font-mono text-[#AFDDFF] text-[13px] leading-[15.6px] whitespace-nowrap">[ FINANCIAL HEALTH ]</span>
        <p className="font-mono text-white/50 text-[11px] leading-[14px] mt-[4px] max-w-[160px]">Connects your financial baseline into a clear picture.</p>
      </div>

      {/* Node 3: CONNECTIVITY (Intelligence) */}
      <div className="absolute top-[63%] left-[50%] w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] border border-white/80 anim-scale-in" style={{ animationDelay: '2100ms' }} />
      <div className="absolute top-[50%] left-[78%] anim-slide-right" style={{ animationDelay: '1700ms' }}>
        <span className="font-mono text-white text-[13px] leading-[15.6px] whitespace-nowrap">[ NIRNAY INTELLIGENCE ]</span>
        <p className="font-mono text-white/50 text-[11px] leading-[14px] mt-[4px] max-w-[180px]">Surfaces patterns and actionable financial observations.</p>
      </div>

      {/* Connectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none anim-fade-in" style={{ animationDelay: '1200ms' }}>
        <line x1="38%" y1="14%" x2="52%" y2="14%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" className="anim-draw-line" style={{ animationDelay: '1200ms' }} />
      </svg>
      <svg className="absolute inset-0 w-full h-full pointer-events-none anim-fade-in" style={{ animationDelay: '1400ms' }}>
        <line x1="52%" y1="14%" x2="60%" y2="27%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" className="anim-draw-line" style={{ animationDelay: '1400ms' }} />
      </svg>
      <svg className="absolute inset-0 w-full h-full pointer-events-none anim-fade-in" style={{ animationDelay: '1500ms' }}>
        <line x1="32%" y1="58%" x2="20%" y2="74%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" className="anim-draw-line" style={{ animationDelay: '1500ms' }} />
      </svg>
      <svg className="absolute inset-0 w-full h-full pointer-events-none anim-fade-in" style={{ animationDelay: '1700ms' }}>
        <line x1="20%" y1="74%" x2="6%" y2="74%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" className="anim-draw-line" style={{ animationDelay: '1700ms' }} />
      </svg>
      <svg className="absolute inset-0 w-full h-full pointer-events-none anim-fade-in" style={{ animationDelay: '1800ms' }}>
        <line x1="78%" y1="53%" x2="63%" y2="53%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" className="anim-draw-line" style={{ animationDelay: '1800ms' }} />
      </svg>
      <svg className="absolute inset-0 w-full h-full pointer-events-none anim-fade-in" style={{ animationDelay: '2000ms' }}>
        <line x1="63%" y1="53%" x2="50%" y2="63%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" className="anim-draw-line" style={{ animationDelay: '2000ms' }} />
      </svg>
    </div>
  );
}
