# NIRNAY — Phase Status

> **Last updated:** 2026-09-10
> **Branch:** `feat/prabhat-app-shell`

---

## Completed Phases

### Phase 0 — Foundation
**Status:** COMPLETE

Repository scaffold, Next.js 16, Supabase PostgreSQL, Firebase Auth, Tailwind v4.

---

### Phase 1 — Application Shell
**Status:** COMPLETE · Commit: `15f7ea0`

App layout (sidebar, header, user menu), dashboard, auth flow, settings index.

---

### Phase 2 — Financial Profile / Onboarding
**Status:** ACCEPTED WITH NON-BLOCKING ISSUES · Commit: `8f22a0a`

Zod schema, multi-step onboarding form, server actions with Firebase Admin verification, Supabase RLS.

**Known untested (browser):** live persistence, 2-user RLS isolation, mobile layout, unauthenticated redirect.

---

### Phase 3 — Product Data Foundation + Discover
**Status:** ACCEPTED · Commit: `6563cfc`

#### Product catalogue
- `lib/types/product.ts` — strongly-typed `InsuranceProduct` / `InvestmentProduct` discriminated union with `ProductProvenance`
- `lib/catalogue/products.ts` — 11 reference products (6 insurance: 2 health, 2 motor, 2 term life; 5 investments: 4 equity funds, 1 liquid fund)
- All products carry `source`, `status`, `lastUpdated` — explicitly labelled as reference/demo data

#### Suitability engine
- `lib/suitability/engine.ts` — deterministic 4-dimension weighted model (risk 35%, budget 30%, goal 20%, experience 15%)
- Returns `score`, `band`, `reasons[]`, `disclaimer` — no LLM, no magic numbers
- 26 test cases pass (catalogue integrity, provenance, filter logic, all 5 required suitability cases)

#### Discover experience
- `/discover` — category tabs, subcategory chips, search, product grid, empty state, catalogue disclaimer
- `/discover/[productId]` — detail view (SSG, pre-rendered for all 11 products), suitability breakdown, data source section
- `/discover/[productId]` (invalid) — not-found page
- Watchlist add/remove (server actions, Firebase Admin token verify, RLS preserved)
- Compare integration hook (link to `/compare?add=productId`)

#### Validation
- `npm run lint` — 0 errors, 0 warnings
- `npm run build` — exit 0, 21 routes (11 SSG product detail pages)
- `npx tsx lib/suitability/engine.test.mts` — 26/26 pass
- `git diff --check` — exit 0

---

### Phase 4 — Compare
**Status:** ACCEPTED

#### Compare Architecture
- **URL-driven State:** `/compare?add=<id1>&add=<id2>` manages product selection. Shareable, deep-linkable, zero global state.
- **Server-Side Validation:** Server Component parses `searchParams`, resolves IDs, deduplicates, enforces 3-product max, and drops invalid IDs silently.
- **Client Hooks:** `useCompareSet` wraps `useRouter` to add/remove IDs from URL.

#### Comparison Engine
- **Data Driven:** Relies entirely on structured catalogue data. No LLM hallucinations.
- **Category Aware:** Insurance products display indicative premium and coverage; investment products display SIP and expense ratio.
- **Summary Generator:** `buildCompareSummary` synthesizes structured observations (e.g., risk spread, mixed-type warnings, cost comparisons) with clear `positive`/`caution`/`neutral` sentiments.
- **Suitability Integration:** Integrates `computeSuitability` output to highlight best matches when a profile is set.

#### UI Implementation
- **Responsive Table:** Desktop scrollable comparison matrix; adaptable for mobile views.
- **Graceful States:** Empty state (Browse CTA), 1-product state (Add Another CTA), Max-product limit warning.
- **Cross-linking:** Discover cards and product detail pages successfully pass `?add=<productId>` directly into Compare.
- **No Profile State:** Explains match is unavailable without crashing.

#### Validation
- `npm run lint` — 0 errors, 0 warnings
- `npm run build` — exit 0, 22 routes (includes `compare` dynamic server route)
- `npx tsx lib/compare/compare.test.mts` — 38/38 pass
- `git diff --check` — exit 0

---

### Phase 5 — Decide / Decision Support Foundation
**Status:** ACCEPTED

#### Decision Architecture
- **URL-driven State:** Reuses `/decide?add=<id>` mechanism from Compare. Seamless transition without global state.
- **Decision Logic:** `lib/decide/logic.ts` evaluates 1-3 products using existing suitability engine, ranks them, handles ties, and cleanly separates positive profile alignments from general limitations and cautions.
- **Deterministic & Grounded:** No LLMs used. Decision text uses safe language ("Strongest match for your profile", not "Best product").

#### UI Implementation
- **Strongest Match Card:** Highlights the top recommended option with clear rationale (Why it matches vs. What to consider).
- **Secondary Options:** Displays other compared products beneath the recommendation.
- **Trust Elements:** Highly visible "What this does NOT mean" red warning box, plus reference data provenance disclaimer.
- **Empty & No-Profile States:** Safely handles missing products (Browse CTA) and missing profiles (prompts user to complete profile).

#### Validation
- `npm run lint` — 0 errors, 0 warnings
- `npm run build` — exit 0, 23 routes
- `npx tsc --noEmit` — passes
- `npx tsx lib/decide/decide.test.mts` — 6/6 pass

---

## Current Phase

None — Phase 6 complete. Ready for Phase 7.

---

### Phase 6 — AI Explanation Engine + Compare Fix
**Status:** ACCEPTED

#### Compare Regression Fix
- Root cause: `<Link>` navigations were overwriting URL state instead of appending.
- Fix: `createHref(basePath)` added to `useCompareSet` hook. `addProduct` button correctly appends state.
- UX Impact: Users can now navigate freely between Discover and Compare, accumulating up to 3 products correctly.
- Tests: 10 regression tests added using Vitest (`lib/compare/utils.test.mts`).

#### React Key Fix
- Root cause: Missing stable keys on mapped `Fragment` elements and nested `<tr>`/`<td>` items in `CompareClient`.
- Fix: Assigned stable semantic keys using `section.title`, `row.label`, and `product.id` respectively. Prevented generic console warnings and potential reconciler bugs during client renders.

#### AI Explanation Engine & Dual-Provider Fallback
- Architecture: API Route (`app/api/ai/explain-decision/route.ts`) handles secure LLM generation with robust provider fallback (Gemini -> Groq -> Error).
- SDK Migration: Migrated from legacy `@google/generative-ai` to Google's recommended `@google/genai` SDK.
- Primary Model: Configurable via `GEMINI_MODEL` environment variable (defaults to `gemini-3.7-flash`).
- Fallback Model: `groq-sdk` configured via `GROQ_MODEL` (defaults to `openai/gpt-oss-20b`).
- Prompting: Enforces strict structured output (JSON Schema format) natively supported by both Google GenAI and Groq, validated subsequently via `Zod` (`ExplanationResponseValidator`) to enforce deterministic UI rendering.
- Security: `GEMINI_API_KEY` and `GROQ_API_KEY` remain strictly server-side. Errors are logged securely without exposing raw secrets. No secrets are exposed to the client.
- Trust Model: LLM output acts purely as an explanation. Deterministic suitability engine scores remain 100% authoritative and override LLM interpretation.
- Free-tier Caveats: The MVP is configured for a free-tier/developer-quota-oriented provider architecture (Google Gemini API Free Tier and Groq developer API). Availability and rate limits are subject to current provider account quotas and policies.

#### Validation
- `npm run lint` — 0 errors
- `npx tsc --noEmit` — passes
- `npm run build` — passes
- `npx vitest run` — all suites pass (provider fallback tests added for Gemini error -> Groq success)
- Live Smoke Test: Confirmed both providers yield successful valid JSON without exposing keys in console.

---

### Phase 7 — Decision Execution & Storage
**Status:** ACCEPTED

#### Features
- Deterministic decision persistence via server action with RLS
- Saved decisions visible on Dashboard
- Historical Decision snapshots viewable via `/decisions/[id]`

---

## Current Phase

None — Phase 8 complete. Ready for Phase 9.

---

### Phase 8 — Portfolio Foundation
**Status:** COMPLETE

#### Features
- **Portfolio Route:** `/portfolio` serves as the centralized "Manage" surface.
- **Domain Types:** `lib/types/portfolio.ts` strictly maps to existing Supabase migration `20260909094445` (`insurance_policies`, `investments`, `financial_goals`).
- **Data Fetching:** Parallel RLS-enforced Supabase queries triggered via client-side Firebase Auth ID token and resolved by a secure Server Action (`app/(app)/portfolio/actions.ts`).
- **Calculations:** Deterministic algorithms calculate total insurance coverage, active investment holdings, and goal progress.
- **Data Honesty:** "Current Value" fields are explicitly omitted in UI if not present in the database to prevent fake metrics or performance numbers.
- **Needs Attention:** Actionable items (e.g. renewals within 30 days) dynamically generated from existing domain data.
- **UI Architecture:** `<PortfolioClient>` handles real-time auth resolution, presenting data in responsive `<PolicyCard>`, `<InvestmentCard>`, and `<GoalCard>` subcomponents with deliberate empty states.

#### Validation
- `npm run lint` — 0 errors, 4 warnings
- `npx tsc --noEmit` — passes
- `npx vitest run` — all suites pass
- `npm run build` — passes
- Browser Testing — (Not performed locally as browser was inaccessible)

---

## Next Phase

### Phase 9 — TBD
**Scope:** TBD
