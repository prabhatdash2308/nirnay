"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-black/90 backdrop-blur-md border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto w-full px-6 md:px-12 lg:px-24">
          <div className="flex h-20 items-center justify-between">
            
            {/* Left: Brand & Nav */}
            <div className="flex items-center gap-[40px]">
              <Link 
                href="/" 
                className="text-white text-[18px] md:text-[21px] leading-[21px] font-medium tracking-widest uppercase hover:text-white/80 transition-colors z-50 relative whitespace-nowrap anim-fade-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm px-1 -ml-1"
                style={{ animationDelay: '200ms' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                NIRNAY
              </Link>
              
              <nav className="hidden lg:flex items-center gap-[40px]">
                <Link href="#how-it-works" className="flex items-center gap-[3px] anim-fade-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm px-1 py-0.5 -mx-1" style={{ animationDelay: '350ms' }}>
                  <span className="font-mono text-nirnay-accent/80 text-[13px] leading-[15.6px]">01.</span>
                  <span className="font-mono text-white text-[13px] leading-[15.6px] hover:text-nirnay-accent transition-colors uppercase">How It Works</span>
                </Link>
                <Link href="#capabilities" className="flex items-center gap-[3px] anim-fade-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm px-1 py-0.5 -mx-1" style={{ animationDelay: '450ms' }}>
                  <span className="font-mono text-nirnay-accent/80 text-[13px] leading-[15.6px]">02.</span>
                  <span className="font-mono text-white text-[13px] leading-[15.6px] hover:text-nirnay-accent transition-colors uppercase">Products</span>
                </Link>
                <Link href="#security" className="flex items-center gap-[3px] anim-fade-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm px-1 py-0.5 -mx-1" style={{ animationDelay: '550ms' }}>
                  <span className="font-mono text-nirnay-accent/80 text-[13px] leading-[15.6px]">03.</span>
                  <span className="font-mono text-white text-[13px] leading-[15.6px] hover:text-nirnay-accent transition-colors uppercase">Security</span>
                </Link>
              </nav>
            </div>

            {/* Right: Auth CTAs */}
            <div className="hidden lg:flex items-center gap-[12px] ml-auto anim-slide-right" style={{ animationDelay: '600ms' }}>
              <Link href="/auth" className="font-mono text-white text-[13px] leading-[15.6px] hover:text-nirnay-accent transition-colors uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm px-1 py-0.5">
                Log In
              </Link>
              <Link 
                href="/auth" 
                className="font-mono bg-nirnay-accent px-[5px] py-[2px] text-black text-[13px] leading-[15.6px] transition-transform hover:scale-[1.02] active:scale-[0.98] uppercase ml-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="lg:hidden ml-auto relative w-[40px] h-[40px] flex items-center justify-center anim-fade-in" style={{ animationDelay: '400ms' }}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full h-full flex items-center justify-center text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className={`absolute transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${!isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"}`}>
                  <Menu className="w-[22px] h-[22px]" strokeWidth={1.5} />
                </span>
                <span className={`absolute transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}>
                  <X className="w-[22px] h-[22px]" strokeWidth={1.5} />
                </span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu Overlay */}
      <div 
        id="mobile-menu"
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-0 z-40 bg-black backdrop-blur-xl transition-all duration-500 flex flex-col justify-center px-8 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent pointer-events-none" />
        
        <nav className="flex flex-col gap-8 relative z-10">
          <Link
            href="#how-it-works"
            className="text-3xl font-light text-white tracking-tight hover:text-nirnay-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="#capabilities"
            className="text-3xl font-light text-white tracking-tight hover:text-nirnay-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            href="#security"
            className="text-3xl font-light text-white tracking-tight hover:text-nirnay-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Security
          </Link>
          
          <div className="w-full h-px bg-white/10 my-4" />
          
          <Link
            href="/auth"
            className="text-xl font-light text-white tracking-tight hover:text-nirnay-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm inline-block px-1 -ml-1 w-max"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Log In
          </Link>
          <Link
            href="/auth"
            className="flex h-14 w-full items-center justify-center bg-nirnay-accent text-black font-medium tracking-widest uppercase transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </nav>
      </div>
    </>
  );
}
