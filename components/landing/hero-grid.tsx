export function HeroGrid() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Horizontal Lines */}
      <div className="absolute top-[20%] left-0 w-full h-px bg-white/[0.04] anim-grid-h" style={{ animationDelay: '800ms' }} />
      <div className="absolute top-[50%] left-0 w-full h-px bg-white/[0.04] anim-grid-h" style={{ animationDelay: '950ms' }} />
      <div className="absolute top-[80%] left-0 w-full h-px bg-white/[0.04] anim-grid-h" style={{ animationDelay: '1100ms' }} />

      {/* Vertical Lines */}
      <div className="absolute top-0 left-[15%] w-px h-full bg-white/[0.04] anim-grid-v" style={{ animationDelay: '600ms' }} />
      <div className="absolute top-0 left-[50%] w-px h-full bg-white/[0.04] anim-grid-v" style={{ animationDelay: '700ms' }} />
      <div className="absolute top-0 left-[85%] w-px h-full bg-white/[0.04] anim-grid-v" style={{ animationDelay: '800ms' }} />

      {/* Intersections (Plus marks) */}
      <div className="absolute top-[20%] left-[15%] anim-scale-in" style={{ animationDelay: '1000ms' }}>
        <div className="absolute w-[10px] h-px bg-white/70 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-px h-[10px] bg-white/70 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute top-[50%] left-[15%] anim-scale-in" style={{ animationDelay: '1080ms' }}>
        <div className="absolute w-[10px] h-px bg-white/70 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-px h-[10px] bg-white/70 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute top-[80%] left-[15%] anim-scale-in" style={{ animationDelay: '1160ms' }}>
        <div className="absolute w-[10px] h-px bg-white/70 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-px h-[10px] bg-white/70 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="absolute top-[20%] left-[50%] anim-scale-in" style={{ animationDelay: '1240ms' }}>
        <div className="absolute w-[10px] h-px bg-white/70 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-px h-[10px] bg-white/70 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute top-[50%] left-[50%] anim-scale-in" style={{ animationDelay: '1320ms' }}>
        <div className="absolute w-[10px] h-px bg-white/70 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-px h-[10px] bg-white/70 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute top-[80%] left-[50%] anim-scale-in" style={{ animationDelay: '1400ms' }}>
        <div className="absolute w-[10px] h-px bg-white/70 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-px h-[10px] bg-white/70 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="absolute top-[20%] left-[85%] anim-scale-in" style={{ animationDelay: '1480ms' }}>
        <div className="absolute w-[10px] h-px bg-white/70 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-px h-[10px] bg-white/70 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute top-[50%] left-[85%] anim-scale-in" style={{ animationDelay: '1560ms' }}>
        <div className="absolute w-[10px] h-px bg-white/70 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-px h-[10px] bg-white/70 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute top-[80%] left-[85%] anim-scale-in" style={{ animationDelay: '1640ms' }}>
        <div className="absolute w-[10px] h-px bg-white/70 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-px h-[10px] bg-white/70 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Atmospheric Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#AFDDFF]/5 via-transparent to-transparent anim-fade-in" style={{ animationDelay: '500ms' }} />
    </div>
  );
}
