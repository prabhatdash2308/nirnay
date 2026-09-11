import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { NirnayLoopSection } from "@/components/landing/nirnay-loop-section";
import { PersonalizationSection } from "@/components/landing/personalization-section";
import { CapabilitySection } from "@/components/landing/capability-section";
import { RecommendationSection } from "@/components/landing/recommendation-section";
import { SecuritySection } from "@/components/landing/security-section";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import SplashCursor from "@/components/react-bits/SplashCursor";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* 01 — Navigation */}
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* 02 — Hero */}
        <Hero />

        <div className="relative flex flex-col flex-1">
          <SplashCursor COLOR="#9bbdf5" RAINBOW_MODE={false} />
          <div className="relative z-10 flex flex-col flex-1">
            {/* 03 — How NIRNAY works */}
            <NirnayLoopSection />

            {/* 04 — Value / complexity-to-clarity */}
            <PersonalizationSection />

            {/* 05 — Core capabilities */}
            <CapabilitySection />

            {/* 06 — Recommendation experience */}
            <RecommendationSection />

            {/* 07 — Trust */}
            <SecuritySection />

            {/* 08 — Final CTA */}
            <FinalCTA />
          </div>
        </div>
      </main>

      {/* 09 — Footer */}
      <Footer />
    </div>
  );
}
