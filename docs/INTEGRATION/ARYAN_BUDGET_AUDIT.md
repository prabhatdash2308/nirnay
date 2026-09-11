# Aryan Budgeting Audit

## Executive Summary
Aryan's branch introduces a complete Personal Finance Management (PFM) module, including monthly categorical budgeting and transaction tracking. While visually polished, this feature significantly diverges from NIRNAY's core value proposition as an AI-powered financial protection and investment copilot. Furthermore, the implementation relies heavily on client-side data fetching and the deprecated `src/app` architecture, violating current architectural standards. Due to the high complexity (requiring transaction management) and low MVP alignment, this feature is recommended for rejection.

## Files Audited

| File | Purpose | Classification | Reason |
|------|---------|----------------|--------|
| `src/app/(app)/budget/page.tsx` | Budget Page Route | REJECT | Uses `src/app` and client-side fetching. |
| `src/components/budget/*` | Budget UI Components | REJECT | Tied to rejected data models and features. |
| `src/services/budget.ts` | Budget Data Fetching | REJECT | Uses client-side Supabase queries and direct Firebase Auth. |
| `src/types/budget.ts` | Budget Types | REJECT | Unnecessary domain types. |
| `supabase/migrations/*_add_budgets.sql` | DB Migration | REJECT | Unnecessary table for MVP. |
| `src/app/(app)/transactions/*` | Transactions Feature | REJECT | Hidden dependency for budgets; out of scope. |

## Product Value
**Low MVP Value.** NIRNAY is an AI copilot for buying/managing insurance and investments. Categorical expense tracking is a different product vertical (PFM). It does not improve the "Discover → Compare → Decide" loop. 

## UX/UI Assessment
High quality, but unnecessary. It includes robust loading states, empty states, and forms, but the entire domain is out of scope.

## Architecture Assessment
**Conflicts with NIRNAY standards.** 
- Built in `src/app`.
- Data fetching occurs on the client (`useEffect` + `src/services/budget.ts`).
- Bypasses Server Actions.
- Relies on direct `firebaseAuth.currentUser` references instead of secure server-side session management.

## Security Assessment
Relies on RLS (`auth.jwt() ->> 'sub'`), which functions properly with the auth bridge, but exposing full CRUD operations directly to the client is against NIRNAY's server-authoritative architecture.

## Data Model Assessment
Introduces `budgets` and `transactions` tables. These add significant schema bloat for features that do not support the core financial engine.

## Financial Calculation Assessment
`getBudgetOverview` in `budget.ts` correctly calculates percentages and statuses (`on_track`, `over_budget`), but it depends entirely on a separate `transactions` module to calculate `spent`. This creates a cascading dependency of out-of-scope features.

## Dependency Assessment
No dangerous packages introduced, but the domain dependencies (budget depends on transactions) are heavy.

## Existing NIRNAY Overlap
NIRNAY already captures overall "Insurance Budget" and "Investment Budget" in the `financial_profiles` table. This is sufficient for the AI engine to make suitability recommendations. A full monthly expense tracker is duplicate/competing logic.

## P0/P1/P2/P3 Priorities
**P3 = Reject.** Building and maintaining a transaction/budgeting engine is a massive undertaking that distracts from the core MVP.

## Recommended Architecture
**Do not integrate.** Rely exclusively on the existing `financial_profiles.insurance_budget` and `financial_profiles.investment_budget` for affordability calculations.

## What Should Be Reused
None.

## What Should Be Ported
None.

## What Should Be Rewritten
None.

## What Should Be Rejected
The entire `budget` and `transactions` modules (pages, components, services, types, migrations).

## Exact Next Implementation Steps
1. Do not merge or port any budget/transaction files.
2. Ensure the existing `financial_profiles` table remains the sole source of budget data.
3. Proceed to the next stage of the project.

## Risks
N/A (Rejection avoids risks).

## Final Recommendation
**REJECT.** The budgeting feature is a massive scope creep into personal finance management and violates current architectural patterns.
