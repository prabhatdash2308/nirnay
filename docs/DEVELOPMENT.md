# NIRNAY — Development Guide

> **Document:** DEVELOPMENT.md
> **Project:** NIRNAY
> **Purpose:** Define the standard development environment, setup process, local services, environment configuration, database workflow, testing workflow, debugging process, coding conventions, and feature-development lifecycle for all NIRNAY contributors and AI coding agents.

---

# 1. Purpose

This document is the practical development manual for NIRNAY.

It defines how contributors should:

- Set up the project
- Run the application
- Configure Firebase
- Configure Supabase
- Work with the local database
- Create migrations
- Develop features
- Test authentication
- Test database access
- Run lint and builds
- Debug failures
- Work safely with environment variables
- Prepare changes for Git
- Collaborate with the team
- Work with AI coding agents

The goal is:

> **Every contributor should be able to clone the repository and understand how to safely develop NIRNAY without rediscovering the architecture.**

---

# 2. Development Philosophy

NIRNAY development follows:

```text
Understand
    ↓
Plan
    ↓
Implement
    ↓
Test
    ↓
Review
    ↓
Lint
    ↓
Build
    ↓
Commit
```

Do not optimize for:

```text
"Make it work as quickly as possible."
```

Optimize for:

```text
Correct
Secure
Maintainable
Consistent
Demo-ready
```

---

# 3. Technology Stack

Current core stack:

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Base UI
Firebase Authentication
Firebase Admin SDK
Supabase
PostgreSQL
Supabase RLS
Git
GitHub
```

The exact package versions should be checked from:

```text
package.json
package-lock.json
```

rather than duplicated manually throughout documentation.

---

# 4. Required Software

A contributor should have:

```text
Node.js
npm
Git
A modern browser
VS Code or equivalent editor
```

For database development:

```text
Supabase CLI
Docker
```

are required for the local Supabase environment.

---

# 5. Repository Setup

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project:

```bash
cd nirnay
```

Install dependencies:

```bash
npm install
```

Do not manually install random packages without first checking whether an existing dependency already solves the requirement.

---

# 6. Verify Installation

After installation:

```bash
npm run lint
```

Then:

```bash
npm run build
```

Both should pass before beginning substantial development.

If they fail immediately after cloning, resolve the environment/setup issue before modifying application code.

---

# 7. Development Server

Start Next.js:

```bash
npm run dev
```

The application normally runs at:

```text
http://localhost:3000
```

The exact port may change if another process is using the default port.

---

# 8. Local Supabase

NIRNAY uses a local Supabase environment during database development.

Start the local Supabase stack with:

```bash
npx supabase start
```

Check status:

```bash
npx supabase status
```

---

# 9. Local Supabase Services

Current local development endpoints include:

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

These are development endpoints.

They must not be used as production configuration.

---

# 10. Stop Local Supabase

To stop local services:

```bash
npx supabase stop
```

To restart:

```bash
npx supabase start
```

If local database state is intentionally disposable, follow the Supabase reset workflow described below.

---

# 11. Supabase Reset

When local schema state needs to be recreated from migrations:

```bash
npx supabase db reset
```

This is destructive to the local database.

Do not use destructive reset commands against production.

Before resetting:

```text
Confirm:
- The database is local.
- Important local test data is disposable.
- Required schema changes exist as migrations.
```

---

# 12. Local Environment Variables

NIRNAY uses environment variables for configuration.

Typical files:

```text
.env
.env.local
.env.example
```

Real environment files must not be committed.

---

# 13. Firebase Environment Variables

The client Firebase configuration uses:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

These are public Firebase web configuration values.

They are not substitutes for Firebase Admin credentials.

---

# 14. Supabase Environment Variables

The application uses:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
```

The first two may be used by browser-side code.

The secret key is server-only.

---

# 15. Local Supabase Configuration

When developing against local Supabase, the local environment should point to:

```text
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
```

and the local Supabase publishable key.

Do not mix local URLs with production keys without understanding the consequences.

---

# 16. Environment Separation

NIRNAY must maintain clear separation between:

```text
Local
Staging / Demo
Production
```

Conceptually:

```text
Local
 ↓
Local Firebase/Supabase configuration

Production
 ↓
Production Firebase/Supabase configuration
```

Do not accidentally point local development at production data.

---

# 17. Firebase Admin Credentials

Local Firebase Admin development requires the Firebase service-account credentials.

The current development location is:

```text
secrets/firebase-service-account.json
```

This file is ignored by Git.

Never commit it.

---

# 18. Environment Safety

Never paste complete environment files into:

```text
GitHub
Issues
Pull requests
Public chat
Screenshots
Documentation
```

If debugging requires sharing configuration, redact:

```text
API secrets
Private keys
Tokens
Passwords
Secret keys
```

---

# 19. Source of Truth for Environment Variables

Use:

```text
.env.example
```

to document which variables are required.

Do not put real credentials into `.env.example`.

---

# 20. Development Startup Sequence

Recommended startup sequence:

```text
1. Open repository
2. Verify dependencies
3. Verify environment variables
4. Start local Supabase if database work is required
5. Verify Supabase status
6. Start Next.js
7. Open application
8. Test authentication if relevant
```

---

# 21. Standard Daily Workflow

A normal development session:

```text
git pull
    ↓
npm install (only when dependencies changed)
    ↓
Start required services
    ↓
npm run dev
    ↓
Develop
    ↓
Test
    ↓
npm run lint
    ↓
npm run build
    ↓
Review Git diff
    ↓
Commit
    ↓
Push
```

---

# 22. Before Starting Work

Always check:

```bash
git status
```

Then:

```bash
git pull
```

before beginning work if other teammates may have pushed changes.

Do not blindly overwrite another contributor's changes.

---

# 23. Inspect Existing Code First

Before implementing a feature:

```text
1. Find the relevant route.
2. Find related components.
3. Find existing utilities.
4. Find existing database tables.
5. Find existing API routes.
6. Read relevant documentation.
7. Reuse existing patterns.
```

Do not create a duplicate implementation without checking first.

---

# 24. Documentation-First Development

For meaningful features, read:

```text
docs/PROJECT.md
docs/PRODUCT.md
docs/ARCHITECTURE.md
docs/TECH_STACK.md
docs/DESIGN_SYSTEM.md
docs/DATABASE.md
docs/AUTHENTICATION.md
docs/SECURITY.md
docs/TRUST_AND_DATA_POLICY.md
```

Then read the relevant team/member documentation.

AI agents should follow the same process.

---

# 25. Feature Development Flow

Use:

```text
Requirement
   ↓
Architecture check
   ↓
Data-model check
   ↓
Security check
   ↓
UX/design check
   ↓
Implementation
   ↓
Testing
   ↓
Documentation
```

---

# 26. Smallest Safe Change

Prefer the smallest change that completely solves the requirement.

Avoid unrelated refactoring during feature implementation.

Bad:

```text
Feature request
+
Entire folder restructure
+
Dependency upgrades
+
Unrelated styling rewrite
```

Better:

```text
Feature request
↓
Focused implementation
↓
Required supporting changes only
```

---

# 27. Component Reuse

Before creating a new component, search for an existing reusable component.

Reuse:

```text
Buttons
Cards
Inputs
Dialogs
Tables
Badges
Navigation
Form patterns
Loading states
Empty states
```

when appropriate.

Do not create visually inconsistent one-off components.

---

# 28. Styling Workflow

Follow:

```text
docs/DESIGN_SYSTEM.md
```

for visual decisions.

Prefer the existing:

```text
Tailwind
shadcn/ui
Base UI
```

foundation.

Do not introduce a completely different component library without architectural approval.

---

# 29. No Frankenstein UI

Do not mix arbitrary UI systems simply because they are convenient.

Avoid:

```text
shadcn component
+
random component library
+
custom CSS framework
+
copied component
+
AI-generated visual system
```

without a deliberate reason.

The interface should feel like one product.

---

# 30. TypeScript

Prefer strongly typed code.

Avoid unnecessary:

```ts
any
```

If `any` is genuinely required:

```text
Document why.
```

Prefer:

```text
Interfaces
Types
Generics
Typed API responses
Validated schemas
```

where useful.

---

# 31. Naming Conventions

Use descriptive names.

React components:

```text
PascalCase
```

Examples:

```text
PolicyCard
ComparisonTable
RecommendationPanel
```

Functions and variables:

```text
camelCase
```

Examples:

```text
getUserProfile
calculateGoalProgress
insurancePolicies
```

Database objects:

```text
snake_case
```

---

# 32. File Organization

Follow the existing project structure.

Current important areas:

```text
app/
components/
lib/
public/
supabase/
docs/
```

Before creating a new directory, determine whether an existing location is appropriate.

---

# 33. Client vs Server Components

Next.js supports server and client components.

Use client components when the feature requires:

```text
Browser interaction
React state
Event handlers
Browser APIs
Firebase client authentication
```

Avoid turning entire page trees into client components unnecessarily.

---

# 34. Firebase Client Boundary

Firebase browser authentication belongs in client-side code.

Current client utilities include:

```text
app/lib/firebase-client.ts
app/lib/auth-client.ts
app/lib/auth-role.ts
```

Reuse these instead of creating additional Firebase initialization code.

---

# 35. Firebase Admin Boundary

Firebase Admin belongs on the server.

Current implementation:

```text
app/lib/firebase-admin.ts
```

Never import it into a client component.

---

# 36. Supabase Client Boundary

Browser-side Supabase access uses:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

and the Firebase token integration.

Do not expose:

```text
SUPABASE_SECRET_KEY
```

to client code.

---

# 37. Database Development

Database changes must use migrations.

Migration directory:

```text
supabase/migrations/
```

Never make a shared schema change only through Studio and leave the repository unchanged.

---

# 38. Creating a Migration

Create a migration using the Supabase CLI.

For example:

```bash
npx supabase migration new add_example_feature
```

This creates a new migration file.

Write the SQL there.

---

# 39. Applying Migrations Locally

Apply pending migrations with:

```bash
npx supabase migration up
```

Then verify:

```bash
npx supabase status
```

and inspect the database through Studio when useful.

---

# 40. Migration Naming

Use descriptive migration names.

Good:

```text
add_financial_goal_indexes
add_policy_source_metadata
add_recommendation_table
```

Bad:

```text
fix
update
test
new
change
```

A future developer should understand what the migration changed.

---

# 41. Migration Safety

Before applying a migration, review:

```text
Tables affected
Columns affected
Indexes
Foreign keys
Constraints
RLS
Policies
Triggers
Functions
```

Think about existing data.

---

# 42. Never Disable RLS for Convenience

If a query fails:

```text
Do not immediately disable RLS.
```

Instead investigate:

```text
Authentication
JWT claims
Policy
Ownership field
Supabase configuration
```

---

# 43. Database Query Testing

For a new database feature test:

```text
Authenticated user
    ↓
Create record
    ↓
Read own record
    ↓
Update own record
    ↓
Delete own record if allowed
```

Then test:

```text
Second authenticated user
    ↓
Attempt access
    ↓
Must be blocked
```

---

# 44. Authentication Testing

For authentication changes:

```text
Email sign-up
Email sign-in
Google sign-in
Role claim
Token refresh
Supabase access
Logout
```

Test the affected provider(s), not just the UI.

---

# 45. Current Authentication Bridge Test

The core bridge has already been validated locally:

```text
Firebase
   ↓
Firebase UID
   ↓
authenticated claim
   ↓
fresh token
   ↓
Supabase Data API
   ↓
RLS
   ↓
user_profiles
```

When modifying authentication, preserve this behavior.

---

# 46. Profile Testing

A successful authenticated profile operation should establish:

```text
Firebase UID
=
user_profiles.user_id
```

The stored user ID must correspond to the authenticated user.

---

# 47. API Testing

For every new API route test:

```text
Valid request
Missing authentication
Invalid authentication
Malformed input
Unauthorized resource
Valid authorized request
```

The exact matrix depends on the endpoint.

---

# 48. UI Testing

At minimum test:

```text
Loading
Success
Empty state
Error state
Validation failure
Network failure
Authenticated state
Unauthenticated state
Mobile layout
Desktop layout
```

---

# 49. Financial Feature Testing

For financial functionality also test:

```text
Zero values
Large values
Decimal values
Invalid values
Negative values where invalid
Missing values
Date boundaries
Currency formatting
Calculation precision
```

---

# 50. Calculation Testing

Financial calculations should be tested with known expected values.

Example:

```text
Input:
Monthly contribution = ₹5,000

Expected:
Annual contribution = ₹60,000
```

Do not rely only on visual inspection.

---

# 51. Projection Testing

For investment projections:

```text
[ ] Contribution amount
[ ] Frequency
[ ] Duration
[ ] Assumed return
[ ] Compounding
[ ] Rounding
```

must be tested.

The UI should clearly identify assumptions.

---

# 52. Trust Testing

For financial product features verify:

```text
[ ] Source displayed where required
[ ] Last updated displayed where required
[ ] Missing information handled honestly
[ ] Estimates labeled
[ ] AI output not presented as fact
[ ] No guaranteed claims
[ ] Trade-offs visible
```

---

# 53. AI Feature Testing

AI features should test:

```text
Normal input
Missing context
Ambiguous input
Malformed model output
Unexpected model output
External-data injection
Prompt injection
Unavailable source data
```

The application should fail safely.

---

# 54. AI Output Validation

Never assume the model returns the exact format requested.

If structured output is expected:

```text
Validate it.
```

If validation fails:

```text
Reject or safely recover.
```

Do not insert malformed AI output directly into critical database fields.

---

# 55. AI Hallucination Testing

Ask:

```text
What happens when the source does not contain the answer?
```

Expected:

```text
The system says the information could not be verified.
```

Not:

```text
The AI guesses.
```

---

# 56. Loading States

Every asynchronous feature should have an appropriate loading state.

Avoid freezing the interface.

Examples:

```text
Skeleton
Spinner
Progress indicator
Disabled submit state
Loading text
```

Use the design system consistently.

---

# 57. Error States

Every important asynchronous feature should have a recoverable error state.

Example:

```text
We couldn't load your policies.
Try again.
```

Avoid exposing raw infrastructure errors to users.

---

# 58. Empty States

Empty states should explain:

```text
What is empty?
Why is it empty?
What can the user do next?
```

Example:

```text
No policies added yet.

Add your first policy to start tracking renewals and coverage.
```

---

# 59. Forms

Forms should provide:

```text
Labels
Validation
Helpful descriptions
Required-field indicators where appropriate
Loading state
Success feedback
Error feedback
```

Do not rely exclusively on placeholder text as a field label.

---

# 60. Validation

Validation should exist at the appropriate layers:

```text
UI
Application
Database
```

Never rely only on browser validation for security.

---

# 61. Error Debugging Process

When something fails:

```text
1. Reproduce the issue.
2. Read the exact error.
3. Identify the layer.
4. Check recent changes.
5. Inspect relevant source.
6. Check environment variables without exposing secrets.
7. Test the smallest failing operation.
8. Fix root cause.
9. Re-run tests.
```

Do not randomly change multiple unrelated files.

---

# 62. Layer Identification

Use this mental model:

```text
UI problem
→ Component / styling / state

Auth problem
→ Firebase / token / claims

Data problem
→ Supabase / query / RLS

Schema problem
→ Migration / PostgreSQL

Server problem
→ Next.js API / server code

AI problem
→ Prompt / model / validation / source data
```

---

# 63. Environment Debugging

When environment configuration is suspected, inspect only safe metadata.

Example:

```text
Configured: yes/no
```

Do not print the actual credential value.

---

# 64. Restart After Environment Changes

After modifying:

```text
.env
.env.local
```

restart the Next.js development server.

Environment changes are not always picked up by an already-running process.

---

# 65. Build Verification

Run:

```bash
npm run build
```

before considering a major feature complete.

A feature that works in development but breaks during production build is not done.

---

# 66. Lint Verification

Run:

```bash
npm run lint
```

before committing.

Resolve lint errors instead of ignoring them.

---

# 67. Git Diff Review

Before committing:

```bash
git status
```

Then:

```bash
git diff
```

For staged changes:

```bash
git diff --cached
```

Review:

```text
Unexpected files
Debug code
Secrets
Large accidental changes
Unrelated modifications
Temporary components
```

---

# 68. Check for Secrets

Before commit:

```bash
git status --ignored
```

If necessary:

```bash
git check-ignore -v <file>
```

Confirm sensitive files remain ignored.

---

# 69. Commit Workflow

Recommended:

```bash
git add <specific-files>
```

Then:

```bash
git diff --cached --check
```

Then:

```bash
git commit -m "feat: add <feature>"
```

Avoid staging everything blindly with:

```bash
git add .
```

when unrelated work may exist.

---

# 70. Commit Message Format

Use conventional-style messages.

Examples:

```text
feat: add policy dashboard
fix: correct goal progress calculation
refactor: simplify comparison logic
docs: update database architecture
style: refine dashboard spacing
chore: update dependencies
```

Keep commits focused.

---

# 71. Push Workflow

After committing:

```bash
git push origin main
```

if the team workflow currently uses direct main pushes.

If the team transitions to pull requests, follow the team's PR workflow documented in:

```text
docs/GIT_WORKFLOW.md
```

---

# 72. Avoid Force Push

Do not use:

```bash
git push --force
```

on shared branches unless the team explicitly agrees and understands the consequences.

---

# 73. Avoid Destructive Git Commands

Be careful with:

```bash
git reset --hard
git clean -fd
git push --force
```

These can destroy work.

Before using destructive commands, confirm what will be removed.

---

# 74. Dependency Changes

Before installing a dependency:

```text
1. Check package.json.
2. Search existing dependencies.
3. Check whether the requirement can be solved with current tools.
4. Evaluate bundle/runtime impact.
5. Install only if justified.
```

---

# 75. Installing Packages

Example:

```bash
npm install <package>
```

For development-only tooling:

```bash
npm install -D <package>
```

After dependency changes:

```bash
npm run lint
npm run build
```

---

# 76. Avoid Unnecessary Dependencies

Every package adds:

```text
Maintenance
Security surface
Bundle impact
Compatibility risk
```

Do not add packages merely because an AI agent recommends them.

---

# 77. Package Lockfile

Commit:

```text
package.json
package-lock.json
```

together when dependencies change.

Do not manually edit `package-lock.json` unless there is a specific reason.

---

# 78. Browser Console

During development, inspect:

```text
Console
Network
Application
```

for relevant errors.

Never copy sensitive authentication headers or tokens into issues or public messages.

---

# 79. Network Debugging

When an API/data request fails, inspect:

```text
Request URL
HTTP method
Status code
Safe request metadata
Response error
```

Do not expose:

```text
Authorization header
Secret keys
Passwords
Private data
```

---

# 80. Database Debugging

For database issues inspect:

```text
Table
Query
RLS policy
JWT identity
user_id
Foreign keys
Constraints
Indexes
```

Do not disable security controls just to inspect data.

---

# 81. RLS Debugging

If a user cannot access their own data:

```text
Check:
1. Firebase user exists
2. Firebase UID is correct
3. Token contains required claims
4. Token was refreshed
5. Supabase client receives the token
6. RLS is enabled
7. Policy uses correct claim
8. Row user_id matches Firebase UID
```

---

# 82. Common RLS Failure

Symptom:

```text
Insert/query returns no rows or is denied.
```

Possible cause:

```text
user_id != auth.jwt() ->> 'sub'
```

Check identity first.

Do not immediately modify the policy.

---

# 83. Common Firebase Failure

Symptom:

```text
auth/api-key-not-valid
```

Check:

```text
Firebase environment variables
Firebase project ID
Firebase web app configuration
Environment file formatting
Development server restart
```

---

# 84. Common Supabase Failure

Symptom:

```text
relation/table not found
```

Check:

```text
Supabase URL
Local vs hosted environment
Migration state
Table name
Schema
```

A common development mistake is pointing the application at hosted Supabase while testing a table that exists only in local Supabase.

---

# 85. Common Token Failure

Symptom:

```text
Role missing
RLS authentication fails
```

Check:

```text
Firebase custom claim
Token refresh
Current Firebase user
Supabase token integration
```

Remember:

```ts
await user.getIdToken(true);
```

may be required after changing claims.

---

# 86. Production Build vs Development

Development mode can hide problems.

Always verify:

```bash
npm run build
```

before deployment.

Pay attention to:

```text
Server/client boundary errors
Environment variables
Dynamic routes
Type errors
Import errors
```

---

# 87. Feature Branching

If the team uses feature branches:

```bash
git checkout -b feature/<name>
```

Example:

```bash
git checkout -b feature/policy-dashboard
```

Keep feature branches focused.

---

# 88. Parallel Team Development

Because four contributors may work simultaneously:

```text
Member 1
Architecture

Member 2
Frontend / UX

Member 3
Backend / Data

Member 4
AI / Intelligence
```

Avoid changing another member's core area without coordination.

---

# 89. Ownership Boundaries

The team should generally follow:

```text
Technical Lead
→ architecture, integration, infrastructure

Frontend / Product UX
→ UI, UX, components, responsive behavior

Backend / Data
→ database, APIs, calculations, data pipelines

AI / Intelligence
→ prompts, recommendation logic, AI orchestration
```

Cross-cutting changes should be communicated.

---

# 90. Shared Files

Some files affect everyone:

```text
package.json
package-lock.json
app/globals.css
docs/*
supabase/config.toml
supabase/migrations/*
```

Coordinate changes carefully.

---

# 91. AI Agent Development

AI agents must read the relevant documentation before modifying code.

At minimum:

```text
PROJECT.md
ARCHITECTURE.md
TECH_STACK.md
DESIGN_SYSTEM.md
DATABASE.md
AUTHENTICATION.md
SECURITY.md
TRUST_AND_DATA_POLICY.md
```

Then read the relevant task-specific documentation.

---

# 92. AI Agent Scope

An AI agent should receive:

```text
Goal
Relevant files
Constraints
Expected behavior
Acceptance criteria
```

Avoid vague instructions such as:

```text
"Make the app better."
```

---

# 93. AI Agent Change Discipline

AI agents should:

```text
Inspect
Plan
Change
Test
Report
```

They should not:

```text
Rewrite unrelated code
Replace architecture
Install unnecessary libraries
Delete working functionality
Disable security
```

---

# 94. AI Agent Verification

After AI-generated code:

```bash
npm run lint
npm run build
```

Then manually test the relevant feature.

Never assume generated code is correct simply because it compiles.

---

# 95. AI Agent Secrets

AI agents must never be given:

```text
Firebase service-account JSON
SUPABASE_SECRET_KEY
Database passwords
Authentication tokens
Other privileged credentials
```

Use environment configuration locally where the tool can safely access it without exposing the values.

---

# 96. Documentation Updates

When architecture changes, update documentation.

Examples:

```text
Database change
→ DATABASE.md

Authentication change
→ AUTHENTICATION.md

Security change
→ SECURITY.md

Product behavior change
→ PRODUCT.md

Architecture change
→ ARCHITECTURE.md
```

Do not allow code and documentation to diverge.

---

# 97. Definition of Done

A feature is development-complete when:

```text
[ ] Requirement understood
[ ] Existing implementation inspected
[ ] Architecture respected
[ ] Design system followed
[ ] Security reviewed
[ ] Database reviewed if applicable
[ ] Authentication reviewed if applicable
[ ] Implementation complete
[ ] Loading state handled
[ ] Error state handled
[ ] Empty state handled
[ ] Relevant edge cases tested
[ ] Lint passes
[ ] Build passes
[ ] Git diff reviewed
[ ] Documentation updated if needed
```

---

# 98. Pre-Commit Checklist

Before commit:

```text
[ ] Feature works
[ ] No console debugging left
[ ] No secrets
[ ] No accidental files
[ ] No temporary test code
[ ] Lint passes
[ ] Build passes
[ ] Git diff reviewed
[ ] Commit message is clear
```

---

# 99. Pre-Push Checklist

Before pushing:

```text
[ ] Correct branch
[ ] Latest team changes incorporated where required
[ ] Tests pass
[ ] Lint passes
[ ] Build passes
[ ] No secrets
[ ] No unrelated changes
```

---

# 100. Emergency Debugging Rule

When under time pressure:

```text
Do not remove security.
Do not expose secrets.
Do not bypass RLS.
Do not fabricate data.
Do not silently break architecture.
```

A temporary workaround must still be safe.

---

# 101. Production Readiness

Before production deployment:

```text
[ ] Production Firebase configured
[ ] Production Supabase configured
[ ] Production environment variables configured
[ ] Local URLs removed from production
[ ] Secrets stored securely
[ ] Migrations applied
[ ] RLS verified
[ ] Authentication tested
[ ] Critical user flows tested
[ ] Build passes
[ ] Error states tested
[ ] Demo data separated from production data
```

---

# 102. Final Development Principle

NIRNAY development should remain:

```text
Fast
but not reckless.

Ambitious
but not fragile.

AI-assisted
but human-reviewed.

Polished
but not superficial.

Innovative
but trustworthy.
```

The core development rule is:

> **Make the smallest correct change, verify it at the layer where correctness matters, and leave the codebase clearer than you found it.**

---
