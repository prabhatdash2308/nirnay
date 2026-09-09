import { redirect } from "next/navigation";

/**
 * The (app) route group root.
 *
 * In the current architecture:
 *   /           → public landing page (app/page.tsx)
 *   /(app)/     → this file — redirects to /dashboard
 *
 * This exists to ensure the (app) layout is applied to sub-pages correctly.
 * If a future auth middleware catches unauthenticated users before they
 * reach this point, this redirect becomes the first page they see after login.
 */
export default function AppRootPage() {
  redirect("/dashboard");
}
