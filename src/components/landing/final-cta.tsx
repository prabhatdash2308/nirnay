import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-primary/5" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
          Ready to make your next financial decision with more clarity?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Build your financial profile in minutes and begin exploring relevant insurance, investments, and goals tailored to your exact situation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth">
            <Button size="lg" className="h-14 px-10 text-lg w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link href="/auth">
            <Button variant="outline" size="lg" className="h-14 px-10 text-lg w-full sm:w-auto">
              Sign in
            </Button>
          </Link>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          NIRNAY provides decision support. It does not provide certified financial advice.
        </p>
      </div>
    </section>
  );
}
