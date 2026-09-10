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

## Current Phase

None — Phase 3 complete. Ready for Phase 4.

---

## Next Phase

### Phase 4 — Compare
**Scope:**
- `/compare` page — side-by-side comparison of 2–3 products
- Comparison table: key attributes, cost, suitability, provenance
- Add-to-compare from Discover card (the `?add=productId` hook is already wired)
- Clear comparison, swap products

### Future Phases
- Phase 5 — Watchlist, Portfolio, Goals pages
- Phase 6 — AI Explanation Engine (structured LLM grounded on catalogue data)
- Phase 7 — Calendar, Alerts, Renewal tracking
