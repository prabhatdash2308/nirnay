# NIRNAY TEAM BRANCH AUDIT

## 1. Executive Summary
This READ-ONLY engineering audit evaluates the integration readiness of four active branches within the NIRNAY repository. 
The analysis reveals **critical integration risks**, primarily stemming from severe architectural divergence. The frontend branch has completely restructured the repository (`app/` to `src/app/`), the backend branch has bypassed the established Server Actions paradigm in favor of unauthenticated API routes, and the AI branch uses a deprecated Google SDK version. 

**Recommendation:** Do NOT merge `frontend`, `backend`, or `feature/ai-foundation` directly into `main` or `feat/prabhat-app-shell`. A manual, component-by-component cherry-pick strategy is required to preserve the secure, verified baseline.

## 2. Current Baseline
**Repository:** NIRNAY
**Current Branch:** `feat/prabhat-app-shell`
**Current HEAD:** `8701b849c3422a289d709e4a17953c02a74ff64b`
**Status:** Clean, functioning correctly, and completely verified (Phases 1-11B).

## 3. Team Branches
- **Prabhat Dash (Lead):** `feat/prabhat-app-shell` (Baseline)
- **Aryan Gupta (Frontend):** `origin/frontend` (Found via `git fetch --all`)
- **Sarvesh Dhanrale (Backend):** `origin/backend` (Found via `git fetch --all`)
- **Ananya Chaudhary (AI):** `origin/feature/ai-foundation` (Found via `git fetch --all`)

## 4. Prabhat — Complete Contribution
**Branch:** `feat/prabhat-app-shell`
**Status:** Baseline (Fully Verified).
**Key Implementations:**
- App shell layout, sidebar, and dashboard UI.
- Secure Firebase Authentication (`onAuthStateChanged` → ID Token → Server Action).
- Firebase Admin integration & Supabase RLS mapping.
- Financial profile & onboarding (`/settings/financial-profile`).
- Product catalogue and deterministic Suitability engine (`/discover`).
- Product Comparison (`/compare`).
- Decision execution & storage (`/decide`, Phase 7 SQL migrations).
- AI explanation using `@google/genai` (v2.21.0) with Groq fallback.
- Portfolio CRUD and lifecycle management (`/portfolio`).
- Financial Goals CRUD (`/goals`).
- Financial Calendar with urgency calculations (`/calendar`).
- Watchlist integration (`/watchlist`).
- Real-time resolution of routing regressions and Turbopack caching bugs.

## 5. Aryan — Complete Contribution
**Branch:** `origin/frontend`
**Status:** **RED** (High Risk)
**Key Implementations:**
- Complete restructuring of Next.js `app/` router into `src/app/`.
- New unverified landing page using `hls.js` and `ogl` (WebGL splash effects).
- Rewritten authentication shell (`AuthContext`, `auth-provider.tsx`).
- New modules: Budget (`src/app/(app)/budget`) and Transactions (`src/app/(app)/transactions`).
- SQL Migrations for Onboarding, Transactions, and Budgets.
**Issue:** Destroys the baseline's Next.js directory structure and overrides verified layouts.

## 6. Sarvesh — Complete Contribution
**Branch:** `origin/backend`
**Status:** **RED** (High Risk)
**Key Implementations:**
- Massive proliferation of unverified API routes (`app/api/investments`, `app/api/financial-goals`, etc.).
- Custom authentication middleware (`app/lib/auth-server.ts`) expecting standard Bearer headers, breaking the Server Action architecture.
- Custom financial engine logic (`app/lib/financial-engine`).
- `20260910000001_product_catalog.sql` database migration.
**Issue:** Re-engineers the Server Action RLS architecture into standard API routes, duplicating logic already solved in the baseline.

## 7. Ananya — Complete Contribution
**Branch:** `origin/feature/ai-foundation`
**Status:** **YELLOW** (Moderate Risk)
**Key Implementations:**
- AI Prompts and Schemas for Intent Extraction, Explanation, and Recommendation.
- AI route handlers (`app/api/ai/recommend/route.ts`).
- Provider wrappers (`lib/ai/providers/gemini.ts` & `groq.ts`).
**Issue:** Implemented using the deprecated `@google/generative-ai` SDK package. The API routes completely lack token authentication, exposing them publicly.

## 8. Feature Matrix

| Feature | Files | Route | DB Dependency | Auth Dependency | AI Dependency | Status | Risk |
|---|---|---|---|---|---|---|---|
| **App Shell** | `app/(app)/layout.tsx` | `/*` | None | Firebase Client | None | Implemented (P) | Baseline |
| **Frontend Overhaul** | `src/app/*` | `/*` | `migrations` | `auth-provider.tsx` | None | Implemented (Ar) | **RED** |
| **Portfolio/Goals** | `app/(app)/portfolio/*` | `/portfolio`, `/goals` | `financial_goals` | Server Actions | None | Implemented (P) | Baseline |
| **Budget/Transac.** | `src/app/(app)/budget/*` | `/budget` | `add_budgets.sql` | `auth-provider.tsx` | None | Implemented (Ar) | **RED** |
| **AI Explain** | `app/api/ai/explain...` | `/api/ai/*` | None | None | `@google/genai` | Implemented (P) | Baseline |
| **AI Recommend** | `lib/ai/providers/*` | `/api/ai/*` | None | **Missing** | `@google/generative-ai` | Implemented (An) | **YELLOW** |
| **Backend APIs** | `app/api/*` | `/api/*` | `product_catalog` | `auth-server.ts` | None | Implemented (S) | **RED** |

*(P = Prabhat, Ar = Aryan, S = Sarvesh, An = Ananya)*

## 9. Route Matrix

| Route | Current Baseline (Prabhat) | Aryan | Sarvesh | Ananya | Conflict | Final Decision |
|---|---|---|---|---|---|---|
| `/` | Exists | Moved to `src/app/` | - | - | **Yes** | Keep Baseline |
| `/dashboard` | Exists | Moved to `src/app/` | - | - | **Yes** | Keep Baseline |
| `/discover` | Exists | - | - | - | No | Keep Baseline |
| `/portfolio` | Exists | - | - | - | No | Keep Baseline |
| `/budget` | - | `src/app/(app)/budget` | - | - | **Yes** (Src format) | Cherry-pick logic |
| `/api/investments` | - | - | `app/api/investments` | - | **Yes** (Architecture) | Reject API, use Server Actions |
| `/api/ai/recommend` | - | - | - | `app/api/ai/...` | **Yes** (Auth/Package) | Re-write to baseline standard |

## 10. Database Matrix

| Table / Migration | Current Baseline | Aryan | Sarvesh | Ananya | Conflict | Action Required |
|---|---|---|---|---|---|---|
| `..._phase_7_decision_records.sql`| Exists | - | - | - | No | Keep |
| `20260910000000_add_onboarding...`| - | Exists | - | - | No | Port cleanly |
| `20260910000001_add_transactions...`| - | Exists | - | - | **YES** | Rename sequence |
| `20260910000001_product_catalog.sql`| - | - | Exists | - | **YES** | Rename sequence |

**Critical Conflict:** Aryan and Sarvesh both created a migration numbered `20260910000001`. Git merging will break Supabase.

## 11. Authentication Matrix

| Branch | Strategy | Token Validation | Issue |
|---|---|---|---|
| **Prabhat (Baseline)** | Client Firebase → Server Action `verifyIdToken` | Firebase Admin | **Standard** |
| **Aryan** | Client `AuthContext` wrapper | None (Client-side role fetch) | Unsafe for SSR |
| **Sarvesh** | Standard API `Bearer` Token Header | `verifyIdToken` | Incompatible with Server Actions |
| **Ananya** | **None** | None | Publicly exposed endpoints |

## 12. AI Matrix
**Ananya's Branch:**
- **Features:** Intent extraction, recommendations, explanations.
- **Provider:** `@google/generative-ai` (Deprecated; Prabhat migrated to `@google/genai` v2.21.0).
- **Security:** Completely misses token verification. Anyone can spam `/api/ai/recommend/route.ts` and exhaust API quotas.
- **Action:** **REPLACE / MERGE**. Do not merge the API routes. Extract the prompt logic (`lib/ai/prompts`) and rebuild using the baseline's `@google/genai` pattern.

## 13. Frontend / UX Matrix
**Aryan's Branch:**
- **Structure:** `src/app/`
- **Visuals:** Heavy WebGL usage (`ogl`, `SplashCursor`, `hls.js`). 
- **Conflict:** Overrides the robust Shadcn/Base UI foundation Prabhat built. Integrating Aryan's branch directly will destroy the current `/portfolio`, `/goals`, and `/discover` routing tree.
- **Action:** Reject the `src/app/` restructure. Manually port `/budget` and `/transactions` UI components into the baseline's `app/(app)/` directory.

## 14. Dependency Matrix
| Dependency | Baseline | Aryan | Sarvesh | Ananya | Resolution |
|---|---|---|---|---|---|
| `@google/genai` | `^2.21.0` | - | - | - | Keep |
| `@google/generative-ai`| - | - | - | `^0.24.1` | **Reject** |
| `hls.js` | - | `^1.7.2` | - | - | Evaluate necessity |
| `ogl` | - | `^1.0.11` | - | - | Evaluate necessity |

## 15. Environment Variable Matrix
| Variable | Used By | Branch | Secret/Public | Conflict/Risk |
|---|---|---|---|---|
| `GEMINI_API_KEY` | `lib/ai/config.ts` | Ananya | Secret | Required |
| `GROQ_API_KEY` | `lib/ai/config.ts` | Ananya | Secret | Required |

## 16. Security Audit
- **Authentication Bypass:** Ananya's AI routes lack token verification.
- **RLS Disconnect:** Sarvesh's API routes bypass Next.js Server Actions, risking RLS identity context loss if the `Supabase-Client` header isn't passed perfectly.
- **Unsafe Secret:** No `.env` secrets were committed to Git.
- **Client Trust:** Aryan's `AuthContext` relies heavily on client-fetched roles, which is easily bypassed by client modification. 

## 17. Overlap / Conflict Matrix

| Area | Prabhat | Aryan | Sarvesh | Ananya | Conflict Risk | Recommended Owner |
|---|---|---|---|---|---|---|
| **App Routing** | `app/` | `src/app/` | `app/api/` | `app/api/ai/` | **High** | Prabhat |
| **Authentication** | Server Actions | `AuthContext` | API Middleware| None | **High** | Prabhat |
| **Database** | Phase 7 | `000001` | `000001` | - | **High** | Prabhat |
| **AI SDK** | `genai` | - | - | `generative-ai`| **High** | Prabhat |

## 18. Missing Features
- Budgeting backend logic (Aryan built frontend, Sarvesh built APIs, neither connected).
- Secure AI Recommendations (Ananya built the prompt, but it lacks auth).

## 19. Duplicate Features
- Product Catalog logic (Prabhat has `lib/catalogue/products.ts`, Sarvesh added `app/api/catalog/...`).
- Compare Engine (Prabhat has deterministic `lib/compare/utils.ts`, Sarvesh added API equivalents).

## 20. Risk Classification
- **Aryan:** **RED**. The `src/` directory refactor will wipe out the working application tree.
- **Sarvesh:** **RED**. The API route architecture duplicates the verified Server Actions architecture and breaks RLS standards.
- **Ananya:** **YELLOW**. High-quality AI prompt engineering, but uses a deprecated SDK and lacks basic route security.

## 21. Recommended Integration Strategy
**DO NOT GIT MERGE.**
A direct merge or rebase will result in catastrophic architectural destruction. 

**Strategy:** 
1. Maintain `feat/prabhat-app-shell` as the indisputable source of truth.
2. Manually copy the `.sql` migrations from Aryan/Sarvesh, sequentially renaming them to `20260910194005`, `20260910194006`, etc.
3. Manually copy Ananya's `lib/ai/prompts` and adapt them to `@google/genai` Server Actions.
4. Manually port Aryan's `budget` and `transactions` components directly into the existing `app/(app)/` folder.
5. Discard Sarvesh's API routes; convert his backend logic into standard Next.js Server Actions.

## 22. Recommended Integration Order
1. **Baseline Verification** (Already complete; Phase 11B is pristine).
2. **Database Migrations** (Rename and sequentially apply Aryan/Sarvesh tables).
3. **AI Logic Integration** (Port Ananya's prompts to GenAI SDK Server Actions).
4. **Backend Engine** (Convert Sarvesh's calculations to pure utilities).
5. **Frontend Modules** (Port Aryan's Budget/Transactions UI into `app/(app)/`).
6. **Full Build & E2E Validation**.

## 23. Files Likely to Conflict
- `package.json`
- `app/layout.tsx` vs `src/app/layout.tsx`
- `app/auth/page.tsx` vs `src/app/auth/page.tsx`
- `supabase/migrations/20260910000001_...`

## 24. Files Safe to Merge
- Ananya's `lib/ai/prompts/*.ts` (pure text schemas/prompts).
- Aryan's `src/components/budget/*.tsx` (can be safely moved to `components/budget/`).
- Sarvesh's `app/lib/financial-engine/calculations.ts` (pure math).

## 25. Pre-Integration Checklist
- [ ] Rename `20260910000001` migrations.
- [ ] Uninstall `hls.js` and `ogl` if WebGL isn't critical to MVP.
- [ ] Verify `npm run lint` ignores the abandoned branches.

## 26. Final Recommendation
The team worked in silos, leading to three completely different Next.js architectural paradigms (App Router Server Actions, `src/` directory client rendering, and traditional unauthenticated API routes). 

**Execute a strict Cherry-Pick-and-Refactor integration led by the architecture lead (Prabhat).**

---

# EXECUTION SUMMARY
- **Branches Inspected:** `feat/prabhat-app-shell`, `origin/frontend`, `origin/backend`, `origin/feature/ai-foundation`, `origin/main`
- **Commits Inspected:** `007eb2d`, `5f049b1`, `5c3dab7`, `8701b84`
- **Files Inspected:** `package.json`, Auth implementations, AI route handlers, Migrations directory.
- **Migrations Inspected:** Found duplicate sequence `000001`.
- **Routes Inspected:** Identified `src/app/` vs `app/` conflict and `app/api/` auth bypasses.
- **Tests Inspected:** Verified baseline `npx vitest run` & build outputs.
- **Security Checks Performed:** Confirmed missing authentication on AI endpoints and client-trust issues in the frontend branch.
- **Conflicts Identified:** Directory structure, Database sequences, AI SDK version, Authentication patterns.
- **Files Changed by this Audit:** `docs/INTEGRATION/TEAM_BRANCH_AUDIT.md`
- **Git State Modified:** `git fetch --all` was executed (Remote references updated). **Zero local branches or working tree files were modified.**
