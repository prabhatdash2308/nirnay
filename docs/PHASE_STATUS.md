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

## Current Phase

None — Phase 4 complete. Ready for Phase 5.

---

## Next Phase

### Phase 5 — Decide / Decision Support Foundation
**Scope:**
- User decision flows
- Watchlist management views
- Portfolio projection/goals visualization

### Future Phases
- Phase 6 — AI Explanation Engine (structured LLM grounded on catalogue data)
- Phase 7 — Calendar, Alerts, Renewal tracking
