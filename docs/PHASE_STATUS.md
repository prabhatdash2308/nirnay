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

## Current Phase

None — Phase 9 complete. Ready for Phase 10.

---

### Phase 9 — Portfolio Lifecycle & Manage
**Status:** COMPLETE

#### Database Changes
**No database migration required.**

#### Files Created
- `app/(app)/portfolio/manage-actions.ts`
- `app/(app)/portfolio/manage-actions.test.mts`
- `components/portfolio/policy-form.tsx`
- `components/portfolio/investment-form.tsx`
- `components/portfolio/goal-form.tsx`
- `components/portfolio/confirm-delete-dialog.tsx`

#### Files Modified
- `components/portfolio/portfolio-cards.tsx` — added Edit/Delete action callbacks
- `components/portfolio/portfolio-client.tsx` — full CRUD orchestration with modal state and refresh

#### CRUD
| Entity | Create | Update | Delete |
|--------|--------|--------|--------|
| Insurance Policy | ✓ | ✓ | ✓ |
| Investment | ✓ | ✓ | ✓ |
| Financial Goal | ✓ | ✓ | ✓ |

#### Security
- UID derived from verified Firebase token (never from client input)
- `.eq("user_id", uid)` defense-in-depth on all mutations alongside RLS
- Zod server-side validation on all inputs

#### Data Honesty
- No current value, CAGR, returns, or NAV added
- Investments show `amount` as invested amount only

#### Validation
- `npm run lint` — 0 errors, 0 warnings
- `npx tsc --noEmit` — passes
- `npx vitest run` — 52 tests passed (21 new in manage-actions.test.mts)
- `npm run build` — passes (25 routes)
- `git diff --check` — passes

#### Browser Testing
Not executed (browser unavailable).

---

---

### Phase 10 — Financial Calendar + Renewals + Action Center
**Status:** COMPLETE

#### Features
- **Financial Calendar Route:** `/calendar` serves as the centralized view for all upcoming financial events.
- **Deterministic Event Engine:** `lib/calendar/calculations.ts` builds calendar events from three real data sources with no fabricated data:
  - `financial_calendar` table (manually created user reminders/events)
  - `insurance_policies.renewal_date` (derived renewal events for active policies)
  - `financial_goals.target_date` (derived goal milestone events for active goals)
- **Investments excluded by design:** No reliable due-date field exists in the `investments` schema; investment events are intentionally omitted.
- **Urgency Classification:** Events are deterministically labeled: `overdue`, `today`, `this_week`, `this_month`, `upcoming`.
- **Renewal Intelligence:** Every active policy with a `renewal_date` generates a calendar event with `formatDaysLabel` ("In 12 days", "Overdue by 3 days", "Due today"), and links to `/discover` for reviewing options.
- **Action Center:** "Needs Attention" section shows overdue + today + this_week events prominently.
- **Event Deduplication:** Stable IDs (`db-{id}`, `policy-renewal-{id}`, `goal-milestone-{id}`) prevent duplicates across sources.
- **Empty State:** Dedicated empty calendar state with CTAs to Portfolio and Discover.

#### Architecture
- Server action: `app/(app)/calendar/actions.ts` — `loadCalendarData(firebaseIdToken)`
- Types: `lib/types/calendar.ts` — `CalendarEvent`, `FinancialCalendarRow`, `CalendarData`
- Calculations: `lib/calendar/calculations.ts` — pure, deterministic, fully testable
- UI: `components/calendar/calendar-client.tsx` — full auth state machine (authLoading → unauthenticated → dataError → data loading → loaded)
- Page: `app/(app)/calendar/page.tsx`

#### Authentication
- Client provides Firebase ID token only (never a user_id)
- Server calls `verifyIdToken()` before touching Supabase
- Supabase client uses explicit `Authorization: Bearer <token>` header (Phase 9 pattern)
- RLS: `user_id = (auth.jwt() ->> 'sub')` enforced on all three tables

#### Data Honesty
- No prices, savings, returns, or CAGR claimed
- No renewal cost estimates
- Action links to `/discover` only (no fake product IDs)
- No fabricated event dates — only actual `renewal_date` and `target_date` from the database

#### Database Changes
**No migration required.** All existing tables (`financial_calendar`, `insurance_policies`, `financial_goals`) were sufficient. The existing RLS policies for `financial_calendar` were already present in migration `20260909094445`.

#### Files Created
- `lib/types/calendar.ts`
- `lib/calendar/calculations.ts`
- `lib/calendar/calculations.test.mts`
- `app/(app)/calendar/actions.ts`
- `app/(app)/calendar/actions.test.mts`
- `app/(app)/calendar/page.tsx`
- `components/calendar/calendar-client.tsx`

#### Files Modified
- `docs/PHASE_STATUS.md` (this file)

#### Validation
- `npm run lint` — 0 errors, 1 pre-existing warning (scratch file, not production)
- `npx tsc --noEmit` — passes perfectly
- `npx vitest run` — 100 tests passed (38 new calculations tests + 10 new action tests)
- `npm run build` — passes, 26 routes including `/calendar`
- `git diff --check` — passes, no whitespace errors

#### Browser Testing
Not executed (browser subagent unavailable due to capacity limitations).

#### Security
- No SUPABASE_SECRET_KEY in any client code
- No Firebase service-account data exposed
- No token or password logging
- No public RLS policies added
- No client-provided UID trusted

---

## Current Phase

None — Phase 10 complete. Ready for Phase 11.

---

### Phase 11A — Goals Management Experience
**Status:** COMPLETE

#### Features
- **Goals Route:** `/goals` serves as the centralized interface for managing financial priorities.
- **Goal Calculations:** `lib/goals/calculations.ts` provides pure, deterministic math to clamp progress (`0-100%`) and aggregate summary metrics (total saved, total target, active count, needs attention).
- **CRUD Reuse:** The UI orchestrates existing Phase 9 Portfolio server actions (`addFinancialGoal`, `updateFinancialGoal`, `deleteFinancialGoal`) to manage goals with exactly zero duplicated backend logic.
- **Calendar Integration:** `components/goals/goal-card.tsx` natively reuses Calendar phase logic (`calcDaysFromToday`, `calcUrgency`, `formatDaysLabel`) to deterministically style and label urgent target dates exactly identically to the `/calendar` view.
- **Delete Confirmation:** Leverages `components/portfolio/confirm-delete-dialog.tsx` to safely prevent accidental 1-click deletions within the edit flow.

#### Database Changes
**No migration required.** Reused `financial_goals` table precisely.

#### Files Created
- `app/(app)/goals/actions.ts`
- `app/(app)/goals/actions.test.mts`
- `app/(app)/goals/page.tsx`
- `components/goals/goals-client.tsx`
- `components/goals/goal-card.tsx`
- `lib/goals/calculations.ts`
- `lib/goals/calculations.test.mts`

#### Files Modified
- `components/portfolio/goal-form.tsx` (Added optional `onDelete` to reuse layout)
- `components/portfolio/portfolio-cards.tsx` (Extracted `formatCurrency` to lib)
- `lib/portfolio/calculations.ts` (Exported `formatCurrency`)
- `docs/PHASE_STATUS.md`

#### Validation
- `npm run lint` — 0 errors, 0 warnings
- `npx tsc --noEmit` — passes perfectly
- `npx vitest run` — 114 tests passed (12 new in `lib/goals/calculations.test.mts`, 2 new in `app/(app)/goals/actions.test.mts`)
- `npm run build` — passes, 27 routes including `/goals`
- `git diff --check` — passes cleanly

#### Browser Testing
Tested fully via browser subagent:
- Verified `/goals` redirects unauthenticated users to `/auth`.
- Logged in, verified empty state.
- Created "Emergency Fund Test", verified 30% progress bar, and summary recalculation.
- Edited goal and canceled out.
- Initiated Delete, verified `ConfirmDeleteDialog` safeguard appeared.
- Confirmed Deletion, verified goal disappeared and state persisted.

#### Security
- Route requires valid Firebase ID token.
- `loadGoalsData` natively verifies token server-side before attaching `Authorization: Bearer <token>` to the Supabase client.
- No client-provided UID trusted.
- `SUPABASE_SECRET_KEY` remains isolated server-side.

---

## Next Phase

### Phase 11B — TBD
**Scope:** TBD

