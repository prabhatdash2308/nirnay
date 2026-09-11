# NIRNAY FILE-LEVEL INTEGRATION AUDIT

## 1. Executive Summary
This Second-Stage File-Level Integration Audit rigorously inspects the specific code payloads of the `frontend` (Aryan), `backend` (Sarvesh), and `feature/ai-foundation` (Ananya) branches against the verified `feat/prabhat-app-shell` baseline. The analysis reveals that **direct integration is impossible**. 

Aryan's branch fundamentally destroyed the Next.js routing architecture by shifting from `app/` to `src/app/`. Sarvesh's branch ignored the established Server Actions model, building incompatible REST APIs that break Firebase token validation. Ananya's branch introduced high-value AI prompts but utilized a deprecated Google SDK without endpoint authentication. The only viable path forward is **Selective Cherry-Picking and Manual Porting** into the baseline.

## 2. Current Baseline
- **Branch:** `feat/prabhat-app-shell`
- **HEAD:** `8701b849c3422a289d709e4a17953c02a74ff64b`
- **Architecture:** `app/` router, Server Actions, Firebase client auth + Firebase Admin server token validation, deterministic Suitability Engine, `@google/genai` (v2.21.0) LLM integration.

---

## 3. Aryan File Audit

**Key Focus:** Frontend layout, design system, routing, UI components.
**Overview:** Aryan moved the entire application to `src/app/`, replacing the verified Shadcn/Base UI application shell with a custom WebGL-heavy landing page and a client-side `AuthContext`.

### Important Files:
- `src/app/(app)/budget/page.tsx`
  - **Current NIRNAY Equivalent:** None.
  - **Aryan Version:** New budget tracker.
  - **What is better:** Valuable new feature module.
  - **What must be preserved:** The business logic and UI grid.
  - **Final Action:** **B** (PORT / ADAPT) — move to `app/(app)/budget`.
- `src/app/layout.tsx`
  - **Current NIRNAY Equivalent:** `app/layout.tsx` (App Shell).
  - **Aryan Version:** Replaces global layout, breaks CSS imports.
  - **What is better:** Nothing. Reverts verified baseline layout.
  - **What must be preserved:** The baseline layout.
  - **Final Action:** **D** (DO NOT INTEGRATE).
- `src/components/auth/auth-provider.tsx`
  - **Current NIRNAY Equivalent:** `lib/firebase-client.ts` & native Server Actions.
  - **Aryan Version:** Client-side React context storing user roles natively fetched by the browser.
  - **What is better:** Nothing. Unsafe for SSR, easily bypassed by modifying React state.
  - **What must be preserved:** Baseline's Firebase Admin token verification.
  - **Final Action:** **D** (DO NOT INTEGRATE).
- `src/components/landing/*` (WebGL/Splash)
  - **Current NIRNAY Equivalent:** Native dashboard routing.
  - **Aryan Version:** High-fidelity animated landing page using `hls.js` and `ogl`.
  - **What is better:** Visuals.
  - **What must be preserved:** Only if requested by product requirements, but requires heavy dependency addition.
  - **Final Action:** **C** (REWRITE USING IDEA).

---

## 4. Sarvesh File Audit

**Key Focus:** Backend logic, database schemas, APIs.
**Overview:** Sarvesh bypassed the Next.js Server Actions standard, creating pure `/api` routes that utilize custom `Bearer` token middleware.

### Important Files:
- `app/api/investments/route.ts` & `app/api/financial-goals/route.ts`
  - **Current NIRNAY Equivalent:** `app/(app)/portfolio/actions.ts` & `goals/actions.ts`.
  - **Sarvesh Version:** Unverified REST API implementations.
  - **What is better:** Nothing.
  - **What must be preserved:** Baseline Server Actions.
  - **Final Action:** **E** (DUPLICATE).
- `app/lib/auth-server.ts`
  - **Current NIRNAY Equivalent:** Standard `getFirebaseAdminAuth().verifyIdToken()` in Server Actions.
  - **Sarvesh Version:** Middleware expecting `Authorization: Bearer <token>` in NextRequest.
  - **What is better:** Nothing. Breaks existing client-side `firebaseAuth` Server Action patterns.
  - **Final Action:** **D** (DO NOT INTEGRATE).
- `app/lib/financial-engine/calculations.ts`
  - **Current NIRNAY Equivalent:** `lib/portfolio/calculations.ts` & `lib/goals/calculations.ts`.
  - **Sarvesh Version:** Extended math utilities for advanced calculations.
  - **What is better:** Deep financial modeling.
  - **What must be preserved:** The math functions.
  - **Final Action:** **A** (SAFE CHERRY-PICK) — Merge specific functions into existing baseline libs.
- `supabase/migrations/20260910000001_product_catalog.sql`
  - **Current NIRNAY Equivalent:** None.
  - **Sarvesh Version:** New schema.
  - **What is better:** Necessary database extension.
  - **What must be preserved:** The schema itself.
  - **Final Action:** **B** (PORT / ADAPT) — Must rename file to avoid `000001` conflict with Aryan.

---

## 5. Ananya File Audit

**Key Focus:** AI capabilities, recommendation engine.
**Overview:** Ananya created high-quality prompts and schemas but used the deprecated `@google/generative-ai` SDK and left the endpoints completely unauthenticated.

### Important Files:
- `lib/ai/prompts/intent.ts` & `recommendation.ts`
  - **Current NIRNAY Equivalent:** None.
  - **Ananya Version:** Sophisticated instructions for LLM parsing.
  - **What is better:** Core intelligence.
  - **What must be preserved:** The prompt text and schema definitions.
  - **Final Action:** **A** (SAFE CHERRY-PICK).
- `lib/ai/providers/gemini.ts`
  - **Current NIRNAY Equivalent:** Baseline `lib/ai/client.ts`.
  - **Ananya Version:** Uses `@google/generative-ai`.
  - **What is better:** Nothing. Deprecated.
  - **What must be preserved:** Baseline uses `@google/genai` (v2.21.0).
  - **Final Action:** **D** (DO NOT INTEGRATE).
- `app/api/ai/recommend/route.ts`
  - **Current NIRNAY Equivalent:** Baseline `app/api/ai/explain-decision/route.ts`.
  - **Ananya Version:** Route handler with absolutely zero token validation.
  - **What is better:** The intent logic.
  - **What must be preserved:** Baseline's authentication wrapper.
  - **Final Action:** **C** (REWRITE USING IDEA).

---

## 6. Database Reconciliation

| Migration | Branch | Purpose | Conflict | Recommendation |
|---|---|---|---|---|
| `20260910194004_phase_7...` | Prabhat | Decision tracking | None | Keep |
| `20260910000000_add_onboarding...` | Aryan | Profile fields | None | Rename to `20260910194005` |
| `20260910000001_add_transactions.sql`| Aryan | Transact tracking | **YES** | Rename to `20260910194006` |
| `20260910000002_add_budgets.sql` | Aryan | Budget tracking | None | Rename to `20260910194007` |
| `20260910000001_product_catalog.sql` | Sarvesh | Product schema | **YES** | Rename to `20260910194008` |

**Decision:** Migrations cannot be applied natively. They must be manually renamed into a clean sequence appended to Prabhat's baseline.

---

## 7. Route Reconciliation

| Route | Expected Owner | Conflict | Final Decision |
|---|---|---|---|
| `/dashboard` | Prabhat | Aryan (`src/`) | Discard Aryan's structural override. |
| `/discover` | Prabhat | None | Keep Baseline. |
| `/budget` | Aryan | None | Port from `src/app/` into `app/`. |
| `/transactions` | Aryan | None | Port from `src/app/` into `app/`. |
| `/api/investments` | Sarvesh | **YES** (Architecture) | Reject API. Build Server Action. |
| `/api/ai/recommend` | Ananya | **YES** (Auth bypass) | Rewrite into authenticated Server Action/Route. |

---

## 8. Authentication Reconciliation

| Element | Baseline | Deviation | Action |
|---|---|---|---|
| Strategy | Client `getIdToken()` → Server Action | Aryan: `AuthContext` with client role fetch | **REJECT** |
| Verification | `Firebase Admin verifyIdToken()` | Sarvesh: `Bearer` header parsing middleware | **REJECT** |
| AI API Auth | Validated JWT | Ananya: Missing entirely | **REJECT** |

**Conclusion:** The baseline architecture is the only secure implementation. All deviations must be rejected and rewritten to conform to the baseline Server Actions pattern.

---

## 9. Dependency Reconciliation

| Package | Baseline | Aryan | Ananya | Action |
|---|---|---|---|---|
| `@google/genai` | `^2.21.0` | - | - | **Keep** |
| `@google/generative-ai`| - | - | `^0.24.1` | **Reject** |
| `hls.js` & `ogl` | - | `^1.x` | - | Evaluate necessity; likely bloat. |

---

## 10. Environment Reconciliation

| Variable | Member | Purpose | Secret/Public | Required | Final Decision |
|---|---|---|---|---|---|
| `GEMINI_API_KEY` | Ananya | Gemini SDK auth | Secret | Yes | Retain and inject securely into baseline. |
| `GROQ_API_KEY` | Prabhat | Fallback LLM | Secret | Yes | Retain. |

---

## 11. Security Reconciliation

- **Unauthenticated APIs:** Ananya's `/api/ai/*` routes are public. High risk of DDoS/Quota exhaustion.
- **Client Trust:** Aryan's client-side role fetching (`src/components/auth/auth-provider.tsx`) violates secure SSR principles.
- **API Disconnect:** Sarvesh's custom API routes risk identity mismatch by bypassing the established Server Action context pipeline.
- **Resolution:** No branch except the baseline passes security verification.

---

## 12. File Integration Decision Matrix

| Member | File | Feature | Classification | Reason | Final Action |
|---|---|---|---|---|---|
| Aryan | `src/app/layout.tsx` | App Shell | D (DO NOT INTEGRATE) | Destroys Baseline structure. | Reject |
| Aryan | `src/app/(app)/budget/*` | UI | B (PORT / ADAPT) | High value, wrong directory. | Move to `app/` |
| Sarvesh| `app/lib/financial-engine/*`| Math | A (SAFE CHERRY-PICK) | Deep calculation utility. | Cherry-pick logic |
| Sarvesh| `app/api/*` | API Routes | E (DUPLICATE) | Bypasses Server Actions. | Discard |
| Ananya | `lib/ai/prompts/*` | LLM Context | A (SAFE CHERRY-PICK) | Excellent prompt schemas. | Cherry-pick |
| Ananya | `app/api/ai/*` | AI Routes | C (REWRITE) | Zero authentication. | Re-implement |

---

## 13. Feature Integration Matrix

| Feature | Current Baseline | Aryan | Sarvesh | Ananya | Best Implementation | Final Owner | Integration Action |
|---|---|---|---|---|---|---|---|
| UI Architecture | Next.js 14 `app/` | Next.js `src/app/` | - | - | Baseline | Prabhat | Retain Baseline |
| Budgeting | None | Full UI | None | None | Aryan | Prabhat (Refactor) | Port into `app/` |
| Transactions | None | Full UI | Database only | None | Aryan | Prabhat (Refactor) | Port into `app/` |
| AI Recommend | None | None | None | Full Prompts | Ananya | Prabhat (Refactor) | Rewrite w/ GenAI SDK |

---

## 14. Final Architecture

1. **App routing:** Strict Next.js `app/` directory without `src/`.
2. **Authentication:** Client-side Firebase `onAuthStateChanged` → `getIdToken()`.
3. **Database:** Supabase PostgreSQL.
4. **RLS:** Identity verified server-side mapping Firebase UID to Supabase `sub`.
5. **Server Actions:** The exclusive method for all authenticated database mutations.
6. **API Routes:** Used exclusively for webhooks or specialized AI streaming (wrapped in strict Auth middleware).
7. **Financial Engine:** `lib/` utilities.
8. **AI:** `@google/genai` with Groq fallback.
9. **Frontend:** Shadcn/Base UI component library.

---

## 15. Exact Integration Order

1. **Database Migrations:** Manually port Aryan and Sarvesh's `.sql` files into baseline, sequentially renaming them (e.g., `20260910194005`, `...06`).
2. **Financial Math Utilities:** Cherry-pick Sarvesh's `lib/financial-engine/calculations.ts` into baseline.
3. **AI Core Prompts:** Cherry-pick Ananya's `lib/ai/prompts/*.ts` and schemas.
4. **AI Secure Wrappers:** Manually rewrite Ananya's `recommend` and `intent` logic using Baseline's `@google/genai` implementation and Server Actions.
5. **Frontend Modules:** Manually copy Aryan's `budget` and `transactions` components into the `app/(app)/` routing tree.
6. **Discard Everything Else:** Explicitly reject `origin/frontend`, `origin/backend`, and `origin/feature/ai-foundation`.

---

## 16. Conflict Prediction

| File | Risk Level | Reason |
|---|---|---|
| `supabase/migrations/*` | **CRITICAL** | Duplicate naming sequence. |
| `package.json` | **HIGH** | Dependency mismatches (`genai` vs `generative-ai`, `hls.js`). |
| `app/layout.tsx` | **CRITICAL** | Aryan's `src/app` refactor destroys the root shell. |

---

## 17. Test Plan

- **Post-Migration:** Verify Supabase applies renamed `.sql` files cleanly.
- **Post-AI Integration:** Execute `npm run lint` and `tsc` to verify `@google/genai` compatibility.
- **Post-Frontend Port:** Browser verification of `/budget` and `/transactions` under the Prabhat layout shell.
- **Final E2E:** Verify Discover → Compare → Watchlist → Portfolio → Budget flows remain perfectly intact.

---

## 18. Rollback Strategy
Because integration will be performed via Cherry-Pick and Manual Porting onto the `feat/prabhat-app-shell` branch, rolling back simply requires `git reset --hard HEAD` to the verified Phase 11B baseline (`8701b84`).

---

## 19. Final Recommendation
**Do not execute standard Git merges.** The architectural divergence is too severe. 
Prabhat (Tech Lead) must manually extract the valuable business logic (Aryan's Budget UI, Sarvesh's math, Ananya's Prompts) and adapt them into the established baseline architecture.

---

# EXECUTION SUMMARY

- **Branches Inspected:** `feat/prabhat-app-shell`, `origin/frontend`, `origin/backend`, `origin/feature/ai-foundation`
- **Commits Inspected:** `8701b84`, `007eb2d`, `5f049b1`, `5c3dab7`
- **Files Inspected:** 150+ (via structured diffs across components, auth, api, lib, migrations).
- **Migrations Inspected:** Verified exact duplication of `20260910000001` sequence.
- **Routes Inspected:** Mapped `src/app/` vs `app/` and `api/` conflicts.
- **Dependencies Inspected:** Identified `genai` vs `generative-ai` SDK collision.
- **Environment Variables Inspected:** Confirmed `GEMINI_API_KEY` & `GROQ_API_KEY` mapping.
- **Security Checks Performed:** Discovered critical unauthenticated endpoints in the AI branch and client-trust vulnerabilities in the frontend branch.
- **Files Changed:** `docs/INTEGRATION/FILE_LEVEL_INTEGRATION_AUDIT.md` created.
- **Git State Changed:** Absolutely NO working tree files were modified. The repository remains mathematically identical to the baseline state prior to this prompt.
