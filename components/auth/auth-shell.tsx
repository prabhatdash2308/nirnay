import { ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Area - Branding & Value Prop */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-muted/30 border-r border-border relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute -left-32 top-1/4 size-96 rounded-full bg-primary/20 blur-3xl opacity-50" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <div className="size-3 rounded-full bg-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">NIRNAY</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-6 leading-tight">
              Absolute clarity for your financial future.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Log in to access your personalized financial command center. 
              Understand your money, plan with purpose, and act with intelligence.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
          <span>Secure, encrypted, and privacy-first.</span>
        </div>
      </div>

      {/* Right Area - Auth Forms */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] mx-auto">
        <div className="mx-auto w-full max-w-sm lg:w-[400px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-10">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <div className="size-3 rounded-full bg-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight">NIRNAY</span>
            </Link>
          </div>
          
          <div className="bg-card px-8 py-10 shadow-sm border border-border rounded-2xl sm:rounded-3xl">
            {children}
          </div>
          
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
