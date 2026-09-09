# NIRNAY — Database Documentation

> **Document:** DATABASE.md
> **Project:** NIRNAY
> **Purpose:** Define the production database architecture, schema, relationships, Row Level Security, data ownership, conventions, and database development rules.

---

# 1. Purpose

NIRNAY uses **Supabase PostgreSQL** as its primary application database.

The database is responsible for storing structured financial information required by the NIRNAY application, including:

- User profiles
- Financial profiles
- Insurance policies
- Investments
- Financial goals
- Watchlist items
- Alerts
- Financial calendar events

The database must be designed around one central principle:

> **Every user-owned financial record belongs to exactly one authenticated user and must be isolated from every other user.**

Authentication identity is provided by **Firebase Authentication**.

Database authorization is enforced by **Supabase Row Level Security (RLS)** using the Firebase JWT `sub` claim.

---

# 2. Database Architecture

The current architecture is:

```text
Firebase Authentication
        â”‚
        â”‚ Firebase ID Token
        â–¼
Firebase UID
        â”‚
        â”‚ JWT `sub`
        â–¼
Supabase Data API
        â”‚
        â–¼
PostgreSQL
        â”‚
        â”œâ”€â”€ user_profiles
        â”œâ”€â”€ financial_profiles
        â”œâ”€â”€ insurance_policies
        â”œâ”€â”€ investments
        â”œâ”€â”€ financial_goals
        â”œâ”€â”€ watchlist
        â”œâ”€â”€ alerts
        â””â”€â”€ financial_calendar
```

The important identity relationship is:

```text
Firebase UID
    =
user_profiles.user_id
    =
child_table.user_id
```

The Firebase UID is the canonical application user identifier.

---

# 3. Source of Truth for Identity

NIRNAY does **not** create a separate authentication system inside PostgreSQL.

Firebase Authentication is responsible for:

- User registration
- Email/password authentication
- Google authentication
- Identity verification
- Firebase UID generation
- ID token issuance

Supabase PostgreSQL is responsible for:

- User-owned application data
- Financial records
- Application profile data
- Authorization through RLS
- Relational integrity

The database must therefore never assume that a client-provided user ID is trustworthy.

The authenticated identity comes from:

```sql
auth.jwt() ->> 'sub'
```

---

# 4. Current Database Tables

The initial NIRNAY schema contains eight primary tables:

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

Relationship overview:

```text
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚   user_profiles  â”‚
                    â”‚                  â”‚
                    â”‚ user_id (PK)     â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                             â”‚
             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
             â”‚               â”‚                â”‚
             â–¼               â–¼                â–¼
    financial_profiles  insurance_policies  investments
             â”‚
             â”‚
             â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
             â”‚              â”‚
             â–¼              â–¼
      financial_goals    watchlist
                             â”‚
                             â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                             â–¼              â–¼
                           alerts    financial_calendar
```

The exact foreign-key structure should always be verified against the current migration file before modifying the schema.

---

# 5. `user_profiles`

## Purpose

Stores the application's user-level profile information.

This table connects Firebase authentication identity to the NIRNAY application database.

Typical information includes:

- Firebase UID
- Full name
- Email
- Avatar URL
- Timestamps

## Identity

The primary user identifier is:

```text
user_id
```

It corresponds to:

```text
Firebase Authentication UID
```

Example:

```text
Firebase UID:
abc123xyz

Database:
user_profiles.user_id = abc123xyz
```

## Ownership

A user may access only their own profile.

The RLS ownership condition is based on:

```sql
user_id = (auth.jwt() ->> 'sub')
```

---

# 6. `financial_profiles`

## Purpose

Stores financial suitability and planning information used by NIRNAY.

Potential information includes:

- Monthly income
- Monthly expenses
- Insurance budget
- Investment budget
- Risk-related preferences
- Dependents
- Financial preferences
- Other structured planning metadata

This table should contain financial-profile information required to personalize recommendations.

It should **not** be used as an unrestricted storage bucket.

If a field has a clear relational meaning, prefer a dedicated typed column.

Use JSONB only when the structure is intentionally flexible.

---

# 7. `insurance_policies`

## Purpose

Stores insurance policies associated with the authenticated user.

Supported insurance categories initially include:

- Health insurance
- Motor insurance
- Life insurance

Potential information includes:

- Policy/provider information
- Policy type
- Policy number
- Premium
- Coverage amount
- Start date
- Expiry/renewal date
- Vehicle information where applicable
- Coverage metadata
- User notes
- Source information

Insurance records are user-owned financial records.

They must never be exposed to another authenticated user.

---

# 8. `investments`

## Purpose

Stores user investment records.

The initial product scope focuses on:

- SIPs
- Mutual funds
- Investment contributions
- Investment goals
- Portfolio-related tracking

Potential information includes:

- Investment name
- Fund/product identifier
- Investment type
- Amount
- Frequency
- Start date
- Current status
- Metadata
- Notes

The database stores application records.

It does **not** automatically imply that a stored value is a live market value.

Any market-linked or externally sourced value must clearly identify:

- Source
- Timestamp
- Whether the value is live, delayed, estimated, or manually entered

---

# 9. `financial_goals`

## Purpose

Stores user-defined financial goals.

Examples:

- Emergency fund
- Car purchase
- Home purchase
- Travel
- Education
- Retirement
- Insurance protection target

Potential fields include:

- Goal name
- Target amount
- Current amount
- Target date
- Priority
- Status
- Metadata

Goals belong exclusively to the authenticated user.

---

# 10. `watchlist`

## Purpose

Stores financial products or opportunities the user wants to monitor.

Watchlist records may reference:

- Insurance products
- Mutual funds
- Financial products
- Comparison candidates
- Other NIRNAY-supported entities

The watchlist is user-specific.

A product being on one user's watchlist must never make it visible as another user's private watchlist record.

---

# 11. `alerts`

## Purpose

Stores alerts generated for or configured by the user.

Examples:

- Insurance renewal reminder
- Policy expiry reminder
- SIP-related reminder
- Goal milestone
- Product change
- Recommendation update
- User-configured financial reminder

Alerts should distinguish between:

```text
Generated alert
User-created reminder
System notification
```

Where appropriate, additional metadata should identify the alert source.

---

# 12. `financial_calendar`

## Purpose

Stores financially relevant dates for the user.

Examples:

- Insurance renewal
- Policy expiry
- SIP date
- Goal deadline
- Financial review
- User-created reminder
- Other important financial events

Calendar records are user-owned.

---

# 13. Primary Identity Pattern

All user-owned tables follow the same ownership pattern:

```text
user_id text
```

The value must equal the Firebase UID.

The authorization rule is:

```sql
user_id = (auth.jwt() ->> 'sub')
```

This pattern should remain consistent across the application.

Do not introduce a second user identity system without a documented architectural reason.

---

# 14. Row Level Security

## Mandatory Rule

RLS must remain enabled on every user-owned table.

Current schema tables are protected using PostgreSQL Row Level Security.

Conceptually:

```sql
alter table public.<table_name>
enable row level security;
```

Every user-owned table must have appropriate policies for the operations the application actually requires.

---

# 15. Standard RLS Ownership Pattern

For a user-owned table:

```sql
user_id = (auth.jwt() ->> 'sub')
```

For example:

```sql
create policy "Users can read their own records"
on public.example_table
for select
to authenticated
using (
  user_id = (auth.jwt() ->> 'sub')
);
```

For inserts:

```sql
create policy "Users can insert their own records"
on public.example_table
for insert
to authenticated
with check (
  user_id = (auth.jwt() ->> 'sub')
);
```

For updates:

```sql
create policy "Users can update their own records"
on public.example_table
for update
to authenticated
using (
  user_id = (auth.jwt() ->> 'sub')
)
with check (
  user_id = (auth.jwt() ->> 'sub')
);
```

For deletes:

```sql
create policy "Users can delete their own records"
on public.example_table
for delete
to authenticated
using (
  user_id = (auth.jwt() ->> 'sub')
);
```

Use only the policies actually required by the feature.

---

# 16. Why RLS Is Mandatory

Frontend checks are not sufficient.

This is unsafe:

```ts
if (currentUser.uid === row.user_id) {
  show(row);
}
```

The client cannot be treated as a security boundary.

The database itself must reject unauthorized access.

The security model therefore is:

```text
Client
  ↓
Firebase Authentication
  ↓
Firebase ID Token
  ↓
Supabase Data API
  ↓
JWT claims
  ↓
PostgreSQL RLS
  ↓
Authorized rows only
```

---

# 17. Firebase → Supabase Authorization

NIRNAY uses Firebase Authentication as the identity provider for Supabase.

The Firebase JWT contains the authenticated user's identity.

The important claim is:

```text
sub
```

Supabase maps the Firebase identity to the authenticated database role.

The application also establishes:

```text
role = authenticated
```

as a Firebase custom claim.

This allows Supabase RLS policies using:

```sql
to authenticated
```

to operate correctly.

---

# 18. Important Token Behavior

Firebase custom claims are included in newly issued ID tokens.

After establishing or changing the `authenticated` role claim, the application refreshes the user's token.

The application currently uses:

```ts
await user.getIdToken(true);
```

This ensures the client receives a newly issued token containing the latest claims.

Do not assume a previously issued Firebase token immediately contains newly assigned custom claims.

---

# 19. Foreign Keys

Child records should reference the authenticated user's profile where appropriate.

The intended conceptual relationship is:

```text
user_profiles.user_id
        â”‚
        â”œâ”€â”€ financial_profiles.user_id
        â”œâ”€â”€ insurance_policies.user_id
        â”œâ”€â”€ investments.user_id
        â”œâ”€â”€ financial_goals.user_id
        â”œâ”€â”€ watchlist.user_id
        â”œâ”€â”€ alerts.user_id
        â””â”€â”€ financial_calendar.user_id
```

Foreign keys protect relational integrity.

Do not bypass foreign-key relationships simply to make a feature easier to implement.

---

# 20. Database Constraints

Database constraints should enforce invariants that must always be true.

Examples include:

- Required ownership
- Valid status values
- Positive monetary values where appropriate
- Valid date relationships where practical
- Required fields
- Foreign-key integrity

Application validation improves UX.

Database constraints provide the final integrity boundary.

Both are required.

---

# 21. Monetary Values

Financial amounts must be handled carefully.

Avoid using JavaScript floating-point numbers as the source of truth for persisted financial amounts.

Prefer PostgreSQL numeric/decimal types for monetary values where exact decimal representation is required.

Example:

```sql
numeric(14,2)
```

The exact precision should be chosen according to the expected business range.

Do not silently convert financial values to binary floating-point representations and assume they are exact.

---

# 22. INR Formatting

NIRNAY is primarily designed for Indian financial users.

The UI should display Indian currency using:

```text
₹
```

and Indian number grouping where appropriate.

Example:

```text
₹15,000
₹1,25,000
₹12,50,000
```

Database values should remain machine-readable numeric values.

Formatting belongs to the application layer.

Do not store:

```text
"₹15,000"
```

as the canonical numeric value.

Prefer:

```text
15000
```

and format it at presentation time.

---

# 23. Dates and Times

Use PostgreSQL timestamp/date types rather than formatted strings.

Prefer:

```text
timestamptz
```

for timestamps representing an absolute point in time.

Prefer:

```text
date
```

for calendar dates where time-of-day is not meaningful.

Examples:

```text
Policy expiry:
date

Alert created:
timestamptz
```

The UI may format dates for users.

The database should store normalized values.

---

# 24. Timestamps

Tables should generally include:

```text
created_at
updated_at
```

where appropriate.

The schema includes an update timestamp mechanism through:

```text
public.set_updated_at()
```

Do not manually update `updated_at` throughout application code if the database trigger already handles it.

---

# 25. JSONB Usage

JSONB is useful for flexible metadata.

Appropriate examples:

```text
source metadata
provider-specific metadata
AI explanation metadata
external product metadata
integration metadata
```

However, JSONB must not become a substitute for relational schema design.

Bad:

```json
{
  "everything": {
    "name": "...",
    "email": "...",
    "premium": "...",
    "expiry": "..."
  }
}
```

Better:

```text
full_name
email
premium
expiry_date
metadata
```

Use typed columns for fields that the application:

- Filters
- Sorts
- Aggregates
- Joins
- Validates
- Frequently displays

---

# 26. Source and Trust Metadata

Because NIRNAY is a financial decision-support product, externally sourced information must preserve provenance where applicable.

Relevant records may need:

```text
source
source_url
last_updated_at
retrieved_at
```

or structured equivalents.

The purpose is to make important financial information traceable.

The system must avoid presenting externally sourced product facts as if they were timeless or guaranteed.

---

# 27. Product Data vs User Data

This distinction is critical.

## User data

Examples:

```text
User profile
Financial profile
Policies
Investments
Goals
Watchlist
Alerts
Calendar
```

This data belongs to the user.

RLS must isolate it.

## Product/reference data

Examples:

```text
Insurance products
Fund metadata
Provider information
Coverage details
Product features
Market/reference information
```

This may eventually become shared application data.

Shared reference data should not automatically be placed into user-owned tables.

When product catalog functionality is implemented, evaluate whether dedicated public/reference tables are required.

---

# 28. AI-Generated Data

AI output must not automatically become trusted database truth.

Examples of AI-generated information:

- Recommendations
- Summaries
- Explanations
- Categorization
- Suitability reasoning
- Product comparisons

AI-generated information should be clearly distinguishable from verified source data.

For important recommendations, preserve enough metadata to explain:

```text
What was recommended
Why it was recommended
Which inputs were considered
Which source/product facts were used
When the recommendation was generated
```

AI should not fabricate database facts.

---

# 29. Recommendation Data

Recommendations should ideally be reproducible or explainable from stored inputs and source information.

A future recommendation record may include concepts such as:

```text
recommendation_id
user_id
product_id
recommendation_type
reasoning_summary
input_snapshot
source_snapshot
generated_at
model_metadata
```

This is a future design direction.

Do not introduce a recommendation table without first updating:

```text
DATABASE.md
ARCHITECTURE.md
PRODUCT.md
```

and the relevant migration.

---

# 30. Database Migrations

All schema changes must be represented through migrations.

Current migration directory:

```text
supabase/migrations/
```

The initial schema migration is:

```text
20260909094445_initial_nirnay_schema.sql
```

Migrations are the canonical record of database evolution.

Do not treat manual edits in Supabase Studio as the production source of truth.

---

# 31. Migration Rules

Every schema change should follow:

```text
Design
  ↓
Migration
  ↓
Local test
  ↓
Application test
  ↓
Review
  ↓
Production migration
```

Examples of schema changes requiring migrations:

- New table
- New column
- Column type change
- New index
- New foreign key
- New constraint
- RLS policy change
- Trigger change
- Function change

---

# 32. Never Rewrite Applied Migrations

Once a migration has been committed and applied as part of a shared environment, do not silently rewrite its historical meaning.

Instead:

```text
Existing migration
        ↓
New corrective migration
```

This preserves database history.

During early local development, destructive resets may be acceptable when explicitly intended.

Before production, migration history must be treated as permanent.

---

# 33. Local Supabase Development

Local development uses the Supabase CLI.

Current local services include:

```text
Studio:
http://127.0.0.1:54323

API:
http://127.0.0.1:54321

REST:
http://127.0.0.1:54321/rest/v1

Database:
postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

These addresses are development-only.

Do not hard-code them into application production configuration.

---

# 34. Local vs Production

The application has separate configuration for:

```text
Local Supabase
Production Supabase Cloud
```

Local development must not accidentally point at production data.

Production deployment must use production Supabase credentials.

Environment variables must determine the active backend.

Never commit environment secrets into Git.

---

# 35. Supabase Keys

The current Supabase key model uses:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
```

The publishable key is appropriate for browser-side use when protected by RLS.

The secret key is server-only.

Never expose:

```text
SUPABASE_SECRET_KEY
```

to browser code.

Never prefix it with:

```text
NEXT_PUBLIC_
```

---

# 36. Database Client Rules

Browser-side application access should use the Supabase publishable key.

Example:

```ts
createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  ...
);
```

The Firebase ID token is supplied through the Supabase client's authentication integration.

Do not bypass RLS from the browser.

---

# 37. Server-Side Database Access

Privileged database operations may require a server-side Supabase client using the secret key.

Such operations must:

- Live on the server
- Never expose the secret key
- Validate the Firebase user
- Explicitly authorize the requested action
- Minimize privileged access
- Avoid becoming a generic client-controlled database proxy

The existence of a secret key does not justify using it everywhere.

---

# 38. Service-Role / Secret-Key Principle

The privileged key is a bypass mechanism.

Therefore:

```text
More privilege
    =
More responsibility
```

If a normal RLS-protected Data API operation can perform the job safely, prefer the normal path.

Use privileged server-side access only when the feature genuinely requires it.

---

# 39. Database Access Pattern

Preferred browser flow:

```text
React / Next.js Client
        â”‚
        â–¼
Firebase Auth
        â”‚
        â–¼
Firebase ID Token
        â”‚
        â–¼
Supabase Client
        â”‚
        â–¼
Supabase Data API
        â”‚
        â–¼
PostgreSQL RLS
```

Avoid:

```text
Browser
   â”‚
   â–¼
Secret key
   â”‚
   â–¼
Database
```

This is prohibited.

---

# 40. User Profile Creation

The first authenticated application flow creates or updates the user's NIRNAY profile.

Conceptually:

```text
Firebase user
      ↓
Firebase UID
      ↓
user_profiles.upsert(...)
      ↓
RLS validates user_id
      ↓
Profile stored
```

The ownership field must come from the authenticated Firebase user.

Do not allow arbitrary user IDs entered by the client to determine ownership.

---

# 41. Upsert Pattern

Where a resource is uniquely owned by a user, an upsert may be appropriate.

Example:

```ts
await supabase
  .from("user_profiles")
  .upsert(
    {
      user_id: user.uid,
      full_name: user.displayName,
      email: user.email,
    },
    {
      onConflict: "user_id",
    },
  );
```

The actual implementation should match the current schema and product requirements.

---

# 42. Query Design

Queries should retrieve only the data required by the feature.

Prefer:

```ts
.select("id, name, premium, expiry_date")
```

when those are the only required fields.

Avoid unnecessary:

```ts
.select("*")
```

especially for large records or sensitive data.

Benefits:

- Lower payload size
- Clearer contracts
- Better maintainability
- Reduced accidental data exposure

---

# 43. Indexing

Indexes should be added based on real query patterns.

Likely indexing dimensions include:

```text
user_id
expiry_date
created_at
updated_at
status
product identifiers
```

Do not blindly index every column.

Indexes have costs:

- Storage
- Write overhead
- Maintenance
- Query planning complexity

Add indexes where they support meaningful access patterns.

---

# 44. User Ownership Indexing

Because almost every user-owned query filters by:

```text
user_id
```

user-owned tables should have appropriate indexing for user-scoped access.

Typical pattern:

```text
WHERE user_id = ...
```

This is particularly important as the dataset grows.

---

# 45. Financial Data Integrity

Financial data must be treated as high-integrity application data.

Never silently:

- Round values
- Change currencies
- Replace dates
- Overwrite policy identifiers
- Replace investment amounts
- Alter user-entered values
- Convert verified facts into AI-generated guesses

If normalization is required, it must be explicit and documented.

---

# 46. Delete Behavior

Deletion behavior must be intentional.

Before introducing:

```text
ON DELETE CASCADE
```

consider the consequences.

For example:

```text
Deleting user profile
        ↓
Policies?
Investments?
Goals?
Alerts?
Calendar?
```

Financial records may require retention or explicit confirmation depending on product requirements.

Do not add cascading deletion merely to solve foreign-key errors.

---

# 47. Soft Delete

Soft deletion may be appropriate for some financial records where history is useful.

Possible pattern:

```text
deleted_at
```

However, soft deletion should not be introduced everywhere automatically.

Use it when there is a product or audit requirement.

If soft deletion is introduced, every affected query must correctly exclude deleted records unless historical access is intentional.

---

# 48. Auditability

Financial applications benefit from auditability.

For important future workflows, consider recording:

```text
created_at
updated_at
created_by
updated_by
source
```

and, where appropriate:

```text
change history
```

Do not build a complex audit system prematurely.

Prioritize it for actions where historical traceability materially affects trust.

---

# 49. Privacy

The database contains potentially sensitive financial information.

Therefore:

- Use least privilege
- Enforce RLS
- Avoid unnecessary data collection
- Avoid unnecessary data duplication
- Avoid logging sensitive financial information
- Never expose private records in client-side errors
- Never put secrets in database rows
- Never put authentication credentials in application tables

---

# 50. Logging Rules

Never log:

```text
Firebase private keys
Supabase secret keys
Passwords
Full authentication tokens
Sensitive financial records
Unnecessary personal information
```

Safe development logging should prefer:

```text
Operation succeeded
Record ID
Non-sensitive status
Error category
```

When debugging, redact sensitive fields.

---

# 51. Error Handling

Database errors should not be blindly shown to end users.

Bad:

```text
PostgrestError:
duplicate key value violates unique constraint ...
```

Better:

```text
We couldn't save your policy right now.
Please try again.
```

Detailed technical errors belong in development/server logs where appropriate.

---

# 52. Database Testing

Every new user-owned feature should test:

### Positive case

```text
User A
  ↓
Create record
  ↓
Can read own record
```

### Isolation case

```text
User B
  ↓
Attempts to read User A's record
  ↓
Denied
```

### Update case

```text
User A
  ↓
Updates own record
  ↓
Allowed
```

### Cross-user update case

```text
User B
  ↓
Attempts to update User A's record
  ↓
Denied
```

### Delete case

```text
User B
  ↓
Attempts to delete User A's record
  ↓
Denied
```

Not every table needs every operation, but every permitted operation must be tested.

---

# 53. RLS Testing Checklist

For every new table:

```text
[ ] RLS enabled
[ ] SELECT policy reviewed
[ ] INSERT policy reviewed
[ ] UPDATE policy reviewed
[ ] DELETE policy reviewed
[ ] Cross-user access tested
[ ] user_id cannot be spoofed
[ ] Foreign keys reviewed
[ ] Constraints reviewed
[ ] Indexes reviewed
```

---

# 54. Schema Change Checklist

Before merging a database change:

```text
[ ] Migration created
[ ] Migration naming is correct
[ ] Local migration succeeds
[ ] Existing migrations remain intact
[ ] RLS reviewed
[ ] Constraints reviewed
[ ] Foreign keys reviewed
[ ] Indexes reviewed
[ ] Type choices reviewed
[ ] Application queries updated
[ ] TypeScript types updated if required
[ ] Lint passes
[ ] Build passes
[ ] Relevant feature tested
```

---

# 55. Database Naming Conventions

Use:

```text
snake_case
```

for PostgreSQL objects.

Examples:

```text
user_profiles
financial_profiles
insurance_policies
created_at
updated_at
expiry_date
```

Avoid:

```text
UserProfiles
userProfiles
CreatedAt
```

---

# 56. IDs

IDs should be selected based on the entity's requirements.

The Firebase UID is the canonical identity for users.

Other entities may use PostgreSQL-generated identifiers.

Do not expose internal IDs as a security mechanism.

An ID being difficult to guess is not a substitute for RLS.

---

# 57. Security Principle

This is one of the most important database rules in NIRNAY:

> **Authorization must never depend on an identifier being secret.**

For example:

```text
Policy ID = 123
```

does not mean the user should be allowed to access policy 123.

Authorization must still be evaluated through ownership and RLS.

---

# 58. Data Validation Layers

NIRNAY uses multiple validation layers:

```text
UI validation
      ↓
Application validation
      ↓
Database constraints
      ↓
RLS authorization
```

Each layer has a different purpose.

### UI

Provides fast feedback.

### Application

Provides business-rule validation.

### Database

Protects structural integrity.

### RLS

Protects ownership and authorization.

---

# 59. Financial Recommendation Safety

Database architecture must support trustworthy recommendations.

The system should distinguish between:

```text
Verified product fact
User-provided fact
Calculated value
AI-generated explanation
AI-generated recommendation
```

These are not interchangeable.

A recommendation must never overwrite the underlying verified product information.

---

# 60. External Product Data

When NIRNAY later integrates external financial product data, avoid storing an external response blindly.

Instead:

```text
External source
      ↓
Validation / normalization
      ↓
Structured database representation
      ↓
Source metadata
      ↓
Application
```

Where useful, retain:

```text
source
retrieved_at
last_updated_at
external_id
```

This helps maintain provenance.

---

# 61. Database as a Trust Boundary

The database is not simply storage.

It is a security boundary.

It protects:

```text
Identity ownership
Financial records
Data integrity
Relational consistency
Authorization
```

Every new feature must respect this boundary.

---

# 62. AI Agent Database Rules

AI coding agents working on NIRNAY must follow these rules:

1. Never disable RLS to make a feature work.
2. Never expose the Supabase secret key.
3. Never add `NEXT_PUBLIC_` to a secret.
4. Never hard-code production credentials.
5. Never manually edit production schema without a migration plan.
6. Never silently rewrite an applied migration.
7. Always inspect existing schema before adding a new table.
8. Reuse existing ownership patterns.
9. Preserve `user_id = auth.jwt() ->> 'sub'`.
10. Test cross-user isolation.
11. Update documentation when schema architecture changes.
12. Do not store formatted currency strings as canonical financial values.
13. Do not store passwords.
14. Do not store Firebase service-account credentials in PostgreSQL.
15. Do not use AI output as unquestioned financial truth.

---

# 63. Common Database Mistakes

## Mistake 1 — Disabling RLS

Never do this simply because queries fail.

Find the policy or authentication problem.

---

## Mistake 2 — Using the secret key in the browser

Prohibited.

---

## Mistake 3 — Trusting `user_id` from request body

Unsafe.

The authenticated identity must come from the Firebase JWT.

---

## Mistake 4 — Creating duplicate user identity columns

Avoid multiple competing identities such as:

```text
firebase_uid
supabase_uid
user_uuid
auth_user_id
```

unless there is a documented architectural reason.

---

## Mistake 5 — Putting everything in JSONB

Use relational columns for frequently queried structured data.

---

## Mistake 6 — Storing formatted currency

Avoid:

```text
"₹1,25,000"
```

Store numeric data.

---

## Mistake 7 — Using text for dates

Avoid:

```text
"April 12, 2027"
```

Prefer PostgreSQL date/timestamp types.

---

## Mistake 8 — Using `select("*")` everywhere

Select only what the feature needs.

---

## Mistake 9 — Skipping migrations

Every shared schema change should be reproducible.

---

## Mistake 10 — Assuming frontend filtering is security

It is not.

RLS is the security boundary.

---

# 64. Current Database Status

The current foundation has been validated locally.

Verified capabilities include:

```text
Firebase authentication
        ↓
Firebase custom role claim
        ↓
Supabase third-party Firebase authentication
        ↓
Supabase Data API
        ↓
PostgreSQL RLS
        ↓
NIRNAY user profile
```

The application has successfully demonstrated:

```text
Firebase UID
      ↓
user_profiles.user_id
```

with the authenticated user's own profile being created through the Supabase Data API.

The initial NIRNAY schema has also been applied locally.

---

# 65. Production Database Principle

Before production deployment:

```text
Local schema
      ↓
Migration review
      ↓
Production Supabase project
      ↓
Production migration
      ↓
RLS verification
      ↓
Application integration test
```

Never assume that a successful local application build means the production database is correctly configured.

---

# 66. Definition of Database Done

A database feature is complete only when:

```text
[ ] Schema is correct
[ ] Migration exists
[ ] Ownership is defined
[ ] RLS is enabled
[ ] Policies are correct
[ ] Foreign keys are correct
[ ] Constraints are correct
[ ] Indexes are appropriate
[ ] Application queries work
[ ] Cross-user isolation is verified
[ ] Errors are handled
[ ] Sensitive data is protected
[ ] Documentation is updated
[ ] Local build passes
[ ] Production migration path is clear
```

---

# 67. Final Database Principle

NIRNAY is a financial decision-support product.

The database must therefore optimize for:

```text
Correctness
Security
Traceability
Ownership
Consistency
Explainability
Maintainability
```

The guiding rule is:

> **If a user owns the data, the database must enforce that ownership. If the data influences a financial decision, its source and meaning must remain clear.**

---

**End of DATABASE.md**
```

---
