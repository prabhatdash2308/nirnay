import Link from "next/link";
import CursorGrid from "@/components/react-bits/CursorGrid";

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-border overflow-hidden">
      <CursorGrid color="#9bbdf5">
        <div className="pt-16 pb-8 relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <span className="text-lg font-semibold tracking-widest uppercase text-foreground">NIRNAY</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed pr-4">
                Intelligence-driven personal finance. Understand your money, plan with purpose, and act with clarity.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link></li>
                <li><Link href="#capabilities" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Core Capabilities</Link></li>
                <li><Link href="#security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-4">Account</h4>
              <ul className="space-y-3">
                <li><Link href="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign in</Link></li>
                <li><Link href="/auth" className="text-sm text-primary font-medium hover:underline transition-colors">Get started</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} NIRNAY. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Designed for financial clarity.
            </p>
          </div>
        </div>
      </CursorGrid>
    </footer>
  );
}
