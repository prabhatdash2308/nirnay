# NIRNAY — Member 3: Backend / Data / Financial Engine

> **Owner:** Sarvesh Dhanrale
> **Role:** Backend / Data / Financial Engine
> **Project:** NIRNAY
> **Team:** TATVAH
> **Primary Responsibility:** Database architecture, data integrity, backend logic, financial calculations, and trusted data services

---

# 1. Role Purpose

The Backend / Data / Financial Engine owner is responsible for the data and deterministic business logic that power NIRNAY.

The objective is to ensure that:

- financial data is structured correctly
- user data is isolated
- calculations are deterministic
- database changes are reproducible
- APIs have predictable contracts
- recommendation inputs are reliable
- financial information is not silently fabricated
- backend systems remain maintainable

The backend is the foundation upon which the frontend and AI layers depend.

---

# 2. Primary Ownership

The Backend / Data / Financial Engine owner owns:

```text
PostgreSQL
Supabase
Database Schema
Migrations
RLS Policies
Database Constraints
Indexes
Data Validation
Backend APIs
Financial Calculations
Comparison Logic
Recommendation Scoring
Data Normalization
Data Integrity
Backend Error Handling
Trusted Financial Data Structures
```

---

# 3. Primary Technologies

Current backend/data stack:

```text
Supabase
PostgreSQL
Supabase Data API
Next.js server-side functionality
TypeScript
SQL migrations
Firebase identity
```

The backend must remain compatible with the established NIRNAY architecture.

---

# 4. Primary Documentation

The Backend/Data owner should be familiar with:

```text
docs/PROJECT.md
docs/PRODUCT.md
docs/ARCHITECTURE.md
docs/TECH_STACK.md
docs/DATABASE.md
docs/AUTHENTICATION.md
docs/SECURITY.md
docs/TRUST_AND_DATA_POLICY.md
docs/DEVELOPMENT.md
docs/GIT_WORKFLOW.md
docs/QUALITY_STANDARDS.md
docs/TEAM.md
```

Especially:

```text
DATABASE.md
SECURITY.md
TRUST_AND_DATA_POLICY.md
QUALITY_STANDARDS.md
```

---

# 5. Current Database

The initial NIRNAY schema contains:

```text
user_profiles
financial_profiles
insurance_policies
investments
financial_goals
watchlist
alerts
financial_calendar
```

The schema is managed through:

```text
supabase/migrations/
```

Migrations are the source of truth for database structure.

---

# 6. Database Architecture

The conceptual relationship is:

```text
Firebase UID
     â”‚
     â–¼
user_profiles
     â”‚
     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ financial_profiles
     â”‚
     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ insurance_policies
     â”‚
     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ investments
     â”‚
     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ financial_goals
     â”‚
     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ watchlist
     â”‚
     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ alerts
     â”‚
     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ financial_calendar
```

User-owned records must maintain a clear ownership relationship.

---

# 7. Identity Model

The Firebase UID is the canonical user identifier.

Conceptually:

```text
Firebase UID
    ↓
Supabase JWT
    ↓
auth.jwt() ->> 'sub'
    ↓
user_id
```

Do not introduce a second unrelated user identity system without architectural review.

---

# 8. Row Level Security

RLS is mandatory for user-owned data.

The expected ownership pattern is:

```sql
user_id = (auth.jwt() ->> 'sub')
```

Policies must enforce ownership at the database layer.

Do not rely on:

```text
Frontend filtering
API assumptions
Hidden UI
```

as replacements for RLS.

---

# 9. RLS Responsibilities

For every new user-owned table, determine:

```text
Who can SELECT?
Who can INSERT?
Who can UPDATE?
Who can DELETE?
How is ownership verified?
```

Policies should be explicit.

Example:

```sql
create policy "Users can read their own records"
on public.some_table
for select
to authenticated
using (
  user_id = (auth.jwt() ->> 'sub')
);
```

---

# 10. RLS Testing

RLS must be tested conceptually with at least two identities:

```text
User A
User B
```

Expected:

```text
User A
   ✓ Own data
   âœ• User B data

User B
   ✓ Own data
   âœ• User A data
```

Cross-user access is a critical security failure.

---

# 11. Database Migrations

All schema changes should be represented through migrations.

Preferred workflow:

```text
Requirement
    ↓
Schema Design
    ↓
Migration
    ↓
Apply Locally
    ↓
Test
    ↓
Review
    ↓
Commit
    ↓
Production
```

Never rely on undocumented manual production changes.

---

# 12. Migration Naming

Migration files should use the established Supabase migration convention.

Example:

```text
supabase/migrations/20260909094445_initial_nirnay_schema.sql
```

Migration names should communicate purpose.

---

# 13. Migration Safety

Before creating or modifying a migration, consider:

- existing data
- constraints
- foreign keys
- indexes
- RLS
- policies
- triggers
- nullable vs required fields
- backward compatibility
- production impact

Avoid destructive schema changes during the competition unless absolutely necessary.

---

# 14. Database Constraints

Prefer database constraints for important invariants.

Examples:

```text
NOT NULL
CHECK
UNIQUE
FOREIGN KEY
PRIMARY KEY
```

If a rule must always be true, consider enforcing it at the database level rather than relying only on frontend validation.

---

# 15. Indexes

Indexes should support actual query patterns.

Consider indexes for:

- `user_id`
- dates used for filtering
- frequently queried foreign keys
- watchlist lookups
- alerts
- financial calendar events

Do not create indexes without a reason.

---

# 16. Timestamps

User-owned records should maintain appropriate timestamps.

Typical fields:

```text
created_at
updated_at
```

Where useful, maintain update timestamps consistently.

---

# 17. Financial Data Types

Financial amounts should use appropriate numeric/decimal database types.

Avoid floating-point database types for values where financial precision matters.

The representation should support:

```text
₹
decimal amounts
premiums
contributions
investment values
goal amounts
```

without unintended precision loss.

---

# 18. Financial Data Ownership

Every financial record must clearly belong to a user.

Examples:

```text
insurance_policies.user_id
investments.user_id
financial_goals.user_id
watchlist.user_id
alerts.user_id
financial_calendar.user_id
```

The ownership relationship must be enforced.

---

# 19. User Profile

`user_profiles` represents application-level user information.

Potential information includes:

```text
Firebase UID
Name
Email
Avatar
Timestamps
```

Do not store unnecessary personal information.

---

# 20. Financial Profile

`financial_profiles` contains information required to personalize NIRNAY.

Potential categories include:

```text
Income
Expenses
Savings
Insurance context
Investment context
Risk preference
Financial horizon
```

Only store fields that have a clear product purpose.

---

# 21. Insurance Policies

`insurance_policies` stores existing user policies.

Potential information:

```text
Policy
Provider
Type
Premium
Coverage
Renewal Date
Status
Metadata
```

The exact schema must remain aligned with `DATABASE.md`.

Do not invent additional fields casually.

---

# 22. Investments

`investments` stores user investment information.

Potential information:

```text
Investment
Type
Amount
Frequency
Date
Current Value where available
Goal association
Metadata
```

Investment records must not imply guaranteed future performance.

---

# 23. Financial Goals

`financial_goals` represents user-defined objectives.

Potential information:

```text
Goal
Target Amount
Target Date
Current Progress
Status
```

Goal calculations should be deterministic where possible.

---

# 24. Watchlist

`watchlist` stores products that users want to revisit.

The backend should ensure:

- ownership
- duplicate handling
- valid product references
- appropriate timestamps

---

# 25. Alerts

`alerts` stores user-specific notifications.

Potential alert categories:

```text
Renewal
Goal
Investment
Product
System
```

The backend should not generate duplicate alerts unnecessarily.

---

# 26. Financial Calendar

`financial_calendar` stores important user-specific events.

Examples:

```text
Insurance Renewal
SIP Date
Goal Milestone
User Reminder
Financial Review
```

Dates must be stored and interpreted consistently.

---

# 27. Data Classification

The backend should help preserve the distinction between:

```text
VERIFIED
USER PROVIDED
CALCULATED
AI GENERATED
```

The database should not silently make AI-generated information appear to be verified source data.

---

# 28. Source Metadata

Where external product information is stored, preserve relevant provenance.

Useful metadata:

```text
source
source_url where appropriate
last_updated
data_type
```

The exact schema should follow `DATABASE.md`.

---

# 29. Data Freshness

Financial-product information can change.

Where applicable, data should carry freshness metadata.

The backend should avoid presenting stale information as current without qualification.

---

# 30. Product Data Quality

Before product information reaches recommendation logic, check:

```text
Is the data present?
Is it structurally valid?
Is the source known?
Is it current enough?
Are required fields missing?
```

Missing information should remain missing.

Do not manufacture values to fill gaps.

---

# 31. Backend API Design

APIs should be predictable.

A typical flow:

```text
Request
  ↓
Authentication
  ↓
Validation
  ↓
Authorization
  ↓
Business Logic
  ↓
Database
  ↓
Response
```

Do not trust client-provided ownership information.

---

# 32. API Input Validation

Validate:

- required fields
- data types
- ranges
- dates
- IDs
- enum values
- financial amounts

Validation should happen at the appropriate backend boundary even if frontend validation already exists.

---

# 33. API Error Handling

APIs should return appropriate status codes.

Conceptually:

```text
400 → Invalid input
401 → Unauthenticated
403 → Unauthorized
404 → Resource not found
409 → Conflict
500 → Server failure
```

The exact implementation may vary.

Do not expose database internals to users.

---

# 34. Backend Response Design

Responses should contain only the information required by the caller.

Avoid returning unnecessary sensitive fields.

Prefer structured responses.

Example:

```json
{
  "success": true,
  "data": {}
}
```

The exact project convention may evolve.

---

# 35. Financial Engine

The Financial Engine contains deterministic logic used to transform financial/product data into useful results.

Examples:

```text
Comparison
Scoring
Budget calculations
Goal progress
Contribution calculations
Suitability factors
```

The engine should be deterministic wherever practical.

---

# 36. Deterministic vs AI Logic

Use deterministic code for:

```text
Arithmetic
Validation
Thresholds
Sorting
Scoring
Known business rules
Date calculations
```

Use AI for:

```text
Explanation
Summarization
Natural-language interaction
Contextual assistance
Reasoning over structured information
```

Do not use AI where a deterministic calculation is more reliable.

---

# 37. Comparison Engine

The comparison engine should transform structured product data into meaningful differences.

Conceptually:

```text
Product A
Product B
Product C
     ↓
Normalize
     ↓
Compare
     ↓
Score / Highlight Differences
     ↓
Structured Result
```

The frontend should consume the structured result.

---

# 38. Recommendation Scoring

Recommendation scoring should be based on identifiable inputs.

Potential factors:

```text
User needs
Budget
Risk preference
Time horizon
Coverage needs
Product characteristics
Constraints
```

The exact scoring model must be documented when sufficiently mature.

---

# 39. Recommendation Explainability

The backend should provide enough structured information for the AI layer to explain recommendations.

Example:

```json
{
  "productId": "example",
  "score": 82,
  "matchedFactors": [
    "budget",
    "coverage"
  ],
  "tradeoffs": [
    "higher deductible"
  ]
}
```

AI can then transform this into natural language.

AI should not invent the underlying scoring factors.

---

# 40. Financial Calculations

Calculations should define:

```text
Inputs
Formula
Assumptions
Output
Precision
```

Example:

```text
Goal Progress =
Current Amount / Target Amount Ã— 100
```

The exact calculation should be implemented in code rather than generated by AI.

---

# 41. Calculation Precision

Avoid unnecessary precision.

If the user needs:

```text
67.4%
```

do not display:

```text
67.3847291847%
```

unless the additional precision has a legitimate purpose.

---

# 42. Missing Data

If a calculation requires missing information:

Do not guess.

Instead:

```text
Required input missing
        ↓
Mark result incomplete
        ↓
Ask for required information
```

Example:

```text
We need your target date to calculate this goal projection.
```

---

# 43. Data Normalization

External or manually entered product data may use inconsistent formats.

Normalize where appropriate:

```text
Currency
Dates
Categories
Provider names
Product identifiers
Frequency
Units
```

Normalization should not destroy the original source meaning.

---

# 44. Backend Security

The backend must preserve:

- authentication
- authorization
- RLS
- input validation
- least privilege
- safe errors
- secret protection

Never assume the frontend has already secured the request.

---

# 45. Secret Handling

Backend code must never expose:

```text
Supabase secret key
AI API keys
Firebase service-account private key
Database passwords
```

Never log them.

Never return them through an API.

Never commit them.

---

# 46. Firebase Integration

The backend relies on Firebase identity.

Where server-side Firebase verification is required, use the established Firebase Admin implementation.

Do not create competing authentication verification mechanisms.

---

# 47. Supabase Client Usage

Use the appropriate Supabase client for the context.

Normal authenticated application access should use the user's Firebase-backed authentication context and RLS.

Elevated secret-key access should be rare and server-only.

---

# 48. Avoiding RLS Bypass

Do not use privileged credentials simply because an RLS policy makes development inconvenient.

If a legitimate operation fails because of RLS:

1. inspect the ownership model
2. inspect the policy
3. inspect the JWT
4. correct the architecture/policy
5. retest

Security should not be weakened for convenience.

---

# 49. Backend Logging

Logs should contain useful diagnostic information without sensitive data.

Avoid logging:

```text
Passwords
Tokens
Private keys
Complete financial profiles
Sensitive user information
AI secrets
Database credentials
```

Prefer concise operational context.

---

# 50. Backend Testing

Critical backend functionality should be tested.

At minimum verify:

```text
Authentication
Authorization
RLS
CRUD
Validation
Financial calculations
Comparison logic
Recommendation scoring
Error handling
```

---

# 51. Two-User Security Test

Before considering a user-owned feature complete:

```text
Create User A
Create User B

Create data as User A
Read as User A
Attempt read as User B

Update as User A
Attempt update as User B

Delete as User A
Attempt delete as User B
```

Expected:

```text
User A → own data only
User B → own data only
```

---

# 52. Database Testing

After a schema change:

```text
[ ] Migration applies
[ ] Tables exist
[ ] Constraints work
[ ] Foreign keys work
[ ] RLS works
[ ] Policies work
[ ] Expected queries work
```

---

# 53. Migration Conflict Prevention

Before creating a migration:

```text
Check branch
Check recent migrations
Check teammate work
```

If another teammate is modifying the same database area:

- coordinate
- avoid duplicate migrations
- agree on final schema

---

# 54. Frontend Collaboration

The frontend owner is Aryan.

Sarvesh should provide clear backend contracts.

Example:

```text
Endpoint:
GET /api/insurance-policies

Returns:
policy[]
```

If a response changes, communicate before merging.

---

# 55. AI Collaboration

The AI owner is Ananya.

Sarvesh provides:

- structured data
- trusted context
- deterministic scores
- product attributes
- financial calculations
- relevant source metadata

Ananya should not need to reconstruct financial facts from arbitrary raw database queries.

---

# 56. Technical Lead Collaboration

The Technical Lead is Prabhat.

Coordinate with Prabhat for:

- schema changes affecting architecture
- authentication
- server/client boundaries
- API architecture
- production migrations
- security
- deployment
- major dependencies

---

# 57. Backend Branch Strategy

Use feature branches.

Examples:

```text
feature/financial-profile-api
feature/product-data
feature/comparison-engine
feature/recommendation-scoring
feature/policy-management
feature/investment-management
```

Follow:

```text
docs/GIT_WORKFLOW.md
```

---

# 58. Backend Commit Standards

Prefer focused commits.

Examples:

```text
feat: add financial profile persistence
feat: add insurance policy CRUD
feat: implement product comparison scoring
feat: add recommendation factors
fix: enforce policy ownership in query
fix: validate financial goal amount
```

---

# 59. Backend Pull Request Checklist

Before opening a PR:

```text
[ ] Schema reviewed
[ ] Migration included where required
[ ] RLS reviewed
[ ] API validated
[ ] Ownership verified
[ ] Financial calculations tested
[ ] Error handling added
[ ] No secrets
[ ] No unrelated changes
[ ] npm run lint passes
[ ] npm run build passes
```

---

# 60. Data Contract Handoff

When handing backend work to frontend:

```text
FEATURE:
What was implemented?

ENDPOINT / DATA:
What does the frontend consume?

INPUT:
Required fields.

OUTPUT:
Response structure.

ERRORS:
Possible failure states.

AUTH:
Who can access it?

TESTED:
What was verified?

KNOWN LIMITATIONS:
What remains?
```

---

# 61. Financial Engine Handoff

When handing recommendation logic to AI:

```text
INPUTS:
...

CALCULATION:
...

SCORE:
...

MATCHED FACTORS:
...

TRADE-OFFS:
...

MISSING DATA:
...

SOURCE:
...

AI MAY:
Explain
Summarize
Clarify

AI MUST NOT:
Invent
Override
Guarantee
```

---

# 62. Data Integrity Rules

Never silently:

- overwrite user records
- change financial amounts
- change policy dates
- change investment values
- convert currencies without explicit handling
- discard source metadata

When transforming data, preserve meaning.

---

# 63. User-Provided Data

User-provided information should remain distinguishable from externally verified information.

Example:

```text
User entered:
₹15,000 annual premium
```

should not automatically become:

```text
Verified market premium
```

without actual verification.

---

# 64. Calculated Data

Calculated information should be reproducible.

For example:

```text
Current amount
+
Target amount
+
Formula
=
Goal progress
```

The calculation should be understandable to the application and, where relevant, the user.

---

# 65. AI-Generated Data

AI-generated explanations should not be written back as verified financial facts.

If AI-generated content is stored, preserve its classification appropriately.

---

# 66. Data Freshness

When product data can become outdated, the backend should preserve:

```text
Source
Last Updated
```

If freshness cannot be established, do not imply that the data is current.

---

# 67. Competition Priority

During the two-day sprint, prioritize:

```text
1. Database Stability
2. Authentication Integration
3. User Profile / Financial Profile
4. Product Data
5. Comparison Engine
6. Recommendation Scoring
7. Policy / Investment CRUD
8. Goals
9. Watchlist / Alerts
10. Backend Polish
```

Do not spend most of the remaining time building speculative backend infrastructure.

---

# 68. Backend Scope Control

Avoid introducing unnecessary:

- microservices
- queues
- event buses
- complex caching
- distributed systems
- custom database layers
- elaborate orchestration

unless the current MVP genuinely requires them.

For the competition:

> Prefer a reliable modular backend over premature distributed architecture.

---

# 69. Performance

Backend performance should focus on:

- efficient queries
- appropriate indexes
- avoiding duplicate requests
- reasonable payload sizes
- avoiding unnecessary database round trips

Do not prematurely optimize without evidence.

---

# 70. Backend Definition of Done

A backend feature is complete when:

```text
Schema
+
Migration
+
RLS
+
Validation
+
Authorization
+
Business Logic
+
API
+
Error Handling
+
Testing
+
Lint
+
Build
```

are appropriately addressed.

---

# 71. Backend Anti-Patterns

Avoid:

### RLS bypass

Using privileged credentials to avoid fixing ownership.

### Business logic in SQL/UI without reason

Important logic should have a clear home.

### AI arithmetic

Using an LLM for deterministic financial calculations.

### Unvalidated inputs

Trusting frontend validation alone.

### Fake data

Presenting sample data as verified financial information.

### Giant API handlers

Putting validation, database logic, calculations, and AI orchestration into one uncontrolled function.

### Manual production schema edits

Changing production without a migration.

---

# 72. Backend Success Criteria

The backend succeeds when:

```text
Data is correct
      ↓
Ownership is enforced
      ↓
Calculations are deterministic
      ↓
APIs are predictable
      ↓
AI receives trusted context
      ↓
Frontend receives usable results
```

---

# 73. Final Backend Principle

The backend is the trust foundation of NIRNAY.

The most important question is not:

> "Can the backend return an answer?"

It is:

> **"Can NIRNAY trust the data and logic behind that answer?"**

Build the data layer so that:

```text
Correct Data
+
Strong Ownership
+
Deterministic Logic
+
Clear Contracts
+
Verified Provenance
```

become the foundation for every financial decision NIRNAY helps the user make.

**Protect the data. Protect the logic. Protect the user.**
```
