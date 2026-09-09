# NIRNAY — Technology Stack

> **NIRNAY — Your Financial Protection & Investment Copilot**

**Document type:** Technology Stack & Engineering Standards
**Status:** MVP / Active Development
**Audience:** All developers, Technical Lead, AI Coding Agents
**Authority:** Technology reference and dependency decision guide

---

# 1. Purpose

This document defines the technologies used to build NIRNAY and establishes the rules for introducing or changing technologies.

The purpose is to prevent:

- unnecessary dependencies
- conflicting libraries
- inconsistent implementation patterns
- accidental architecture changes
- insecure configuration
- duplicated functionality
- technology decisions made only for convenience

NIRNAY is being built under a strict two-day delivery constraint.

Therefore:

> **Use the existing stack effectively before introducing anything new.**

---

# 2. Current Stack Summary

The current NIRNAY stack is:

```text
Frontend
â”œâ”€â”€ Next.js 16.3.4
â”œâ”€â”€ React 19.2.8
â”œâ”€â”€ TypeScript
â”œâ”€â”€ Tailwind CSS v4
â””â”€â”€ shadcn/ui + Base UI

Authentication
â”œâ”€â”€ Firebase Authentication
â””â”€â”€ Firebase Admin SDK 14.3.0

Database / Backend Platform
â”œâ”€â”€ Supabase
â”œâ”€â”€ PostgreSQL
â”œâ”€â”€ Supabase Data API
â””â”€â”€ Supabase Row Level Security

Database Client
â””â”€â”€ @supabase/supabase-js 2.116.0

Security / Runtime
â””â”€â”€ server-only

Development
â”œâ”€â”€ Node.js / npm
â”œâ”€â”€ Supabase CLI
â””â”€â”€ Git / GitHub
```

Additional libraries may be present in `package.json`.

**The actual repository `package.json` is authoritative for the currently installed dependency set.**

---

# 3. Technology Decision Principles

Every technology decision should satisfy the following principles:

### 3.1 Simplicity

Prefer the simplest solution that satisfies the requirement.

### 3.2 Maintainability

Another team member should understand the implementation.

### 3.3 Security

Do not introduce unnecessary attack surface.

### 3.4 Compatibility

New dependencies must work with the existing Next.js, React, TypeScript, and deployment environment.

### 3.5 Delivery Speed

The two-day deadline strongly favors technologies already installed and understood by the team.

### 3.6 Replaceability

Where practical, avoid tightly coupling the entire application to one vendor or library.

### 3.7 Production Suitability

The technology should be appropriate for a real deployable MVP rather than only a local prototype.

---

# 4. Frontend Framework

## Next.js

**Current version:**

```text
16.3.4
```

Next.js is the primary web application framework.

It provides:

- application routing
- rendering
- layouts
- server/client component boundaries
- API routes
- production builds
- deployment compatibility

NIRNAY uses the App Router architecture.

---

# 5. Next.js Usage Rules

Use Next.js features where they simplify the application.

Prefer:

- server components when client interactivity is unnecessary
- client components only when browser state/interactions require them
- route handlers for appropriate server-side APIs
- layouts for shared application structure
- loading/error states where appropriate

Avoid:

- making every component a client component
- putting secrets in client components
- duplicating server logic inside the browser
- creating unnecessary API routes
- adding abstraction solely because it sounds more scalable

---

# 6. React

**Current version:**

```text
19.2.8
```

React provides the UI component model.

Use React for:

- component composition
- UI state
- forms
- interactions
- client-side behavior

Avoid putting financial business rules directly into presentational components.

---

# 7. TypeScript

TypeScript is used throughout the application.

TypeScript should be used to improve:

- data safety
- API contracts
- component props
- database response handling
- recommendation structures
- financial calculation inputs/outputs

Avoid:

```ts
any
```

unless there is a documented reason.

Prefer explicit types.

---

# 8. Type Safety Principle

The following should have clear types where practical:

- user profile
- financial profile
- insurance policy
- investment
- financial goal
- watchlist item
- alert
- calendar event
- product
- comparison result
- recommendation
- AI context
- API response

Example:

```ts
type RecommendationResult = {
  productId: string;
  score: number;
  recommendation: string;
  reasons: string[];
  tradeoffs: string[];
};
```

The exact implementation may differ.

---

# 9. Styling

## Tailwind CSS

NIRNAY uses Tailwind CSS v4.

Tailwind is the primary styling system.

Use Tailwind for:

- layout
- spacing
- typography
- responsive behavior
- states
- component styling
- visual consistency

Avoid introducing another utility-first styling framework.

---

# 10. Styling Principles

Prefer:

```text
Design Token
    ↓
Reusable Component
    ↓
Consistent UI
```

rather than:

```text
Page
 ↓
Random custom styles
 ↓
Different visual system
```

Repeated styling patterns should be consolidated when practical.

---

# 11. Component System

## shadcn/ui

NIRNAY uses shadcn/ui as the primary reusable component foundation.

The project was initialized using the current Base UI/Nova-oriented setup.

Use the existing component system before introducing another component library.

---

# 12. Base UI

Base UI is part of the current shadcn/ui foundation.

It provides accessible primitives that can support:

- dialogs
- menus
- popovers
- forms
- interactive controls
- other UI behavior

Do not replace the existing component foundation without a strong reason.

---

# 13. Component Library Rule

Do not mix multiple unrelated UI libraries for individual pages.

Avoid situations such as:

```text
Page A → shadcn
Page B → Material UI
Page C → Chakra
Page D → random component package
```

This creates visual and behavioral inconsistency.

Preferred:

```text
shadcn/ui
   ↓
shared NIRNAY components
   ↓
application screens
```

---

# 14. Icons

The project may use Lucide icons where appropriate.

Icons should:

- have clear semantic meaning
- support the interface
- not replace important text
- remain visually consistent

Do not introduce multiple icon libraries without a reason.

---

# 15. Motion and Animation

Animation may be introduced when it improves:

- hierarchy
- transitions
- feedback
- comprehension
- perceived quality

Animation should not:

- slow down the interface
- distract from financial information
- hide important state changes
- create excessive visual noise

A fintech application should feel controlled rather than theatrical.

---

# 16. Authentication

## Firebase Authentication

Firebase Authentication is the identity provider for NIRNAY.

Current supported methods:

- Email/password
- Google

Firebase handles:

- account creation
- authentication
- identity
- session/token management
- Google authentication

---

# 17. Firebase Client SDK

The Firebase Web SDK is installed as:

```text
firebase
```

Current version:

```text
12.18.0
```

The browser Firebase client is responsible for:

- initializing Firebase
- authentication
- retrieving the current user
- obtaining ID tokens
- signing in
- signing up
- signing out

Current implementation:

```text
app/lib/firebase-client.ts
app/lib/auth-client.ts
app/lib/auth-role.ts
```

---

# 18. Firebase Admin SDK

The Firebase Admin SDK is used for trusted server-side operations.

Current version:

```text
14.3.0
```

Current implementation:

```text
app/lib/firebase-admin.ts
```

and:

```text
app/api/auth/ensure-role/route.ts
```

The Admin SDK must remain server-only.

---

# 19. Firebase Admin Security

The Firebase Admin service-account credential is stored locally under:

```text
secrets/
```

The credential must never be:

- committed
- logged
- pasted into documentation
- included in screenshots
- exposed to browser JavaScript
- placed in `NEXT_PUBLIC_*` variables

---

# 20. Server-Only Package

The project uses:

```text
server-only
```

This helps ensure server-only modules are not accidentally imported into client-side code.

Use this boundary for modules that require:

- service credentials
- privileged operations
- secret API keys
- server-only infrastructure

---

# 21. Firebase Custom Claims

NIRNAY currently uses a Firebase custom claim:

```json
{
  "role": "authenticated"
}
```

This role is established by the server through Firebase Admin.

The client must not be treated as authoritative for assigning roles.

---

# 22. Supabase

Supabase provides the application data platform.

NIRNAY uses Supabase for:

- PostgreSQL database
- Data API
- Row Level Security
- database migrations
- local development
- production database hosting

Supabase is not the primary identity provider.

Firebase remains the identity provider.

---

# 23. Supabase Authentication Integration

NIRNAY uses Supabase's Firebase third-party authentication integration.

Conceptually:

```text
Firebase Authentication
        ↓
Firebase ID Token
        ↓
Supabase Firebase Third-Party Auth
        ↓
Supabase Data API
        ↓
PostgreSQL
```

This allows Firebase identity to be used while Supabase protects user-owned database rows.

---

# 24. Supabase JavaScript Client

Package:

```text
@supabase/supabase-js
```

Current version:

```text
2.116.0
```

Current implementation:

```text
app/lib/supabase-client.ts
```

The client uses:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

and obtains the Firebase ID token for authenticated requests.

---

# 25. Supabase API Key Model

Current Supabase key terminology distinguishes:

### Publishable key

Intended for client-side application use.

Variable:

```text
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

### Secret key

Privileged server-side key.

Variable:

```text
SUPABASE_SECRET_KEY
```

The secret key must never be exposed to browser code.

---

# 26. Database

## PostgreSQL

Supabase uses PostgreSQL as the underlying relational database.

NIRNAY uses PostgreSQL for:

- user profiles
- financial profiles
- insurance policies
- investments
- financial goals
- watchlists
- alerts
- financial calendar
- future structured product data

Relational modeling is preferred for data with clear relationships and ownership.

---

# 27. Current Database Tables

The initial schema contains:

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

The schema is managed through Supabase migrations.

---

# 28. Row Level Security

RLS is a core part of the NIRNAY security architecture.

User-owned records should use authenticated identity.

The current ownership pattern is based on:

```sql
user_id = (auth.jwt() ->> 'sub')
```

Do not remove RLS simply to make a feature easier to implement.

---

# 29. Database Migrations

Migrations are stored under:

```text
supabase/migrations/
```

Current initial migration:

```text
20260909094445_initial_nirnay_schema.sql
```

Database changes should be implemented through migrations.

Never make undocumented schema changes only in a local database and assume they will exist elsewhere.

---

# 30. Supabase Local Development

Local Supabase is used during development.

Current local endpoints include:

```text
Studio
http://127.0.0.1:54323

API
http://127.0.0.1:54321

PostgreSQL
postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

These addresses are for local development only.

Do not hard-code them into production application logic.

---

# 31. Supabase CLI

The Supabase CLI is used for:

- starting local Supabase
- stopping local Supabase
- checking local status
- applying migrations
- creating migrations
- local database development

Typical commands include:

```bash
npx supabase start
```

```bash
npx supabase status
```

```bash
npx supabase migration up
```

Use the project documentation and current CLI behavior rather than relying on outdated command examples.

---

# 32. Git and GitHub

Git is the source-control system.

GitHub is the shared remote repository.

The repository is:

```text
NIRNAY
```

The main branch is:

```text
main
```

Current foundational commit:

```text
28fc7f4
feat: establish authentication and database foundation
```

The commit has been pushed to the shared repository.

---

# 33. Branching

Feature development should normally happen on branches such as:

```text
feature/frontend-dashboard
feature/backend-product-data
feature/ai-recommendation-engine
feature/auth-protection
```

Do not create excessively complicated branching structures for a four-person, two-day project.

---

# 34. Package Management

npm is the current package manager.

The repository contains:

```text
package.json
package-lock.json
```

When adding dependencies:

1. verify the package is actually needed
2. install it through npm
3. commit both package manifests when changed
4. test the application
5. document significant additions if appropriate

Never manually edit dependency versions without understanding the consequences.

---

# 35. Dependency Addition Rule

Before adding a package, ask:

### Question 1

Does the current stack already provide this functionality?

### Question 2

Can the feature be implemented cleanly without another package?

### Question 3

Will the package increase security risk?

### Question 4

Will it increase bundle size?

### Question 5

Will it complicate deployment?

### Question 6

Will another team member understand it?

### Question 7

Is it worth the remaining implementation time?

If not, do not add it.

---

# 36. Avoid Duplicate Dependencies

Do not add:

```text
another form library
another state library
another component library
another icon library
another styling framework
```

unless there is a clear technical requirement.

The goal is a coherent stack.

---

# 37. State Management

The application should prefer the simplest state mechanism appropriate to the feature.

Use:

- React state for local UI state
- URL state for navigational/filter state where appropriate
- server/database state for persistent data

Do not introduce a global state library simply because the application contains multiple pages.

Introduce one only when actual complexity justifies it.

---

# 38. Data Fetching

Data fetching should be designed around the source of truth.

For persistent financial data:

```text
Supabase
```

For recommendation calculations:

```text
Recommendation / Intelligence Layer
```

For AI:

```text
AI service using grounded context
```

Avoid duplicating the same data into multiple client-side stores without a reason.

---

# 39. Forms

Forms should:

- validate user input
- display understandable errors
- prevent invalid submissions
- provide loading states
- avoid accidental duplicate submissions
- maintain accessibility

Validation should exist at appropriate application boundaries.

Do not trust browser validation alone for sensitive operations.

---

# 40. API and Server Logic

Server-side APIs should be used when operations require:

- secrets
- privileged access
- trusted calculations
- external API keys
- server-side validation
- protected integrations

Do not expose secret credentials through client-side code.

---

# 41. Financial Calculations

Financial calculations should be implemented as deterministic application logic.

Examples:

```text
budget fit
goal progress
recommendation scoring
allocation calculations
comparison calculations
```

AI should not perform critical arithmetic when deterministic code can do it.

---

# 42. Financial Precision

Financial calculations should explicitly consider:

- currency
- rounding
- decimal precision
- percentages
- integer vs decimal storage
- user-facing formatting

Do not rely on uncontrolled floating-point arithmetic for important financial calculations.

Where appropriate, represent monetary values in the database using suitable numeric/decimal types or integer minor units.

The exact approach should be consistent within each financial domain.

---

# 43. Product Data

Product data should be structured rather than buried inside UI components.

Conceptually:

```text
Product
â”œâ”€â”€ identity
â”œâ”€â”€ category
â”œâ”€â”€ provider
â”œâ”€â”€ features
â”œâ”€â”€ pricing
â”œâ”€â”€ eligibility
â”œâ”€â”€ limitations
â”œâ”€â”€ source
â”œâ”€â”€ source_url
â”œâ”€â”€ last_verified_at
â””â”€â”€ data_updated_at
```

The exact schema may evolve.

---

# 44. Product Data Provenance

Where product information originates externally, preserve provenance when practical.

Preferred metadata:

```text
source
source_url
last_verified_at
data_updated_at
```

This is especially important for financial information.

---

# 45. AI Technology

The AI provider is an implementation detail of the AI application layer.

NIRNAY should avoid making the financial intelligence engine dependent on a specific AI provider.

Conceptually:

```text
NIRNAY AI Layer
      ↓
Provider Adapter
      ↓
AI Model
```

Potential providers may include:

- Gemini
- Claude
- OpenAI
- other suitable providers

The final provider used for the MVP may be selected based on:

- availability
- cost
- latency
- quality
- competition requirements
- API access
- implementation speed

---

# 46. AI Provider Rule

The AI provider must not become the source of financial truth.

Bad:

```text
AI
 ↓
Invent product facts
 ↓
Display them
```

Good:

```text
Verified Data
 ↓
Recommendation Engine
 ↓
AI
 ↓
Explanation
```

---

# 47. AI Context

AI should receive relevant structured context.

Potential context:

```text
User Financial Profile
Product Data
Comparison Result
Recommendation Result
Relevant Goals
Relevant Policies
Relevant Investments
```

AI should not receive unrestricted access to the entire database.

---

# 48. AI Failure Handling

The application must handle:

- API failures
- rate limits
- timeout
- unavailable model
- malformed output
- incomplete context
- invalid structured response

The application should degrade gracefully.

For example:

> "The AI Copilot is temporarily unavailable. You can still review the comparison and recommendation."

---

# 49. AI Output Validation

Where AI returns structured data, validate it before using it in application logic.

Do not blindly trust AI-generated JSON.

For important outputs:

```text
AI output
 ↓
Schema validation
 ↓
Business validation
 ↓
UI
```

If the AI response is invalid, fail safely.

---

# 50. AI and Financial Arithmetic

AI should not be used as the authoritative calculator for:

- premiums
- percentages
- goal calculations
- investment amounts
- recommendation scores
- portfolio totals

Use deterministic application logic.

AI can explain the result.

---

# 51. Deployment Platform

The preferred production deployment architecture is:

```text
Vercel
   +
Supabase Cloud
   +
Firebase
```

### Vercel

Used for:

- Next.js application
- frontend
- Next.js server functionality
- deployment

### Supabase Cloud

Used for:

- PostgreSQL
- Data API
- RLS
- production database

### Firebase

Used for:

- authentication
- Google authentication
- identity
- Firebase Admin functionality

---

# 52. Why Vercel Is Preferred for the MVP

The project is built with Next.js.

Vercel provides a natural deployment environment for Next.js and reduces deployment complexity under the two-day deadline.

This does not mean Vercel is permanently required.

The architecture should remain portable where practical.

---

# 53. Production Environment Variables

Production environment variables should be configured through the deployment platform.

They should include only the variables required by the application.

Examples include:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Server-only variables may include:

```text
SUPABASE_SECRET_KEY
```

and other future secret integrations.

**Actual values must never be placed in this document.**

---

# 54. Environment File Rules

Local environment files may include:

```text
.env
.env.local
```

These must remain ignored by Git.

Never commit:

```text
.env
.env.local
```

unless a file is explicitly designed as a safe template such as:

```text
.env.example
```

---

# 55. Environment Template

`.env.example` should contain variable names but not real credentials.

Example:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

SUPABASE_SECRET_KEY=
```

Only include variables actually required by the application.

---

# 56. Secrets Directory

The repository contains a local:

```text
secrets/
```

directory.

This directory is intentionally ignored by Git.

It may contain:

```text
firebase-service-account.json
```

The file must never be committed.

---

# 57. Security Dependencies

Technology choices should preserve:

- Firebase authentication
- Firebase Admin verification
- Supabase authentication integration
- PostgreSQL RLS
- server-only boundaries
- environment variable separation

A dependency or implementation shortcut that weakens these boundaries should not be accepted merely because it is faster.

---

# 58. Testing and Validation

The minimum validation commands currently include:

```bash
npm run lint
```

and:

```bash
npm run build
```

Both have been successfully validated against the current foundation.

Additional testing should be introduced where business logic becomes significant.

---

# 59. Build Principle

A successful development server is not sufficient evidence that the application is production-ready.

At minimum, before integration:

```text
Code
 ↓
Lint
 ↓
Build
 ↓
Feature verification
 ↓
Integration
```

---

# 60. Browser Verification

Important user flows should be tested in an actual browser.

Examples:

- signup
- login
- Google authentication
- profile creation
- dashboard navigation
- database operations
- recommendation flow
- AI Copilot

Do not rely exclusively on static code inspection.

---

# 61. Local vs Production

The team must distinguish:

### Local

```text
Local Next.js
+
Local Supabase
+
Development Firebase configuration
```

### Production

```text
Deployed Next.js
+
Supabase Cloud
+
Production Firebase configuration
```

Do not accidentally connect production users to local infrastructure.

---

# 62. Current Local Verification

The authentication/database foundation has been verified locally.

The validated flow is:

```text
Firebase user
     ↓
Firebase ID token
     ↓
Supabase client
     ↓
Supabase Data API
     ↓
PostgreSQL
     ↓
RLS
     ↓
user_profiles
```

A real authenticated user profile was successfully persisted through this flow.

---

# 63. Current Known Infrastructure Notes

The local Supabase environment may show optional services as stopped.

Examples may include:

- image proxy
- pooler

These are not automatically blockers for the current MVP.

Do not enable additional infrastructure merely because a service appears available.

---

# 64. Dependency Security

Do not run aggressive automated dependency upgrades during the final delivery window without evaluating their impact.

In particular, avoid:

```bash
npm audit fix --force
```

unless there is a specific, understood reason.

A forced upgrade can introduce breaking changes at the worst possible time.

---

# 65. Technology Change Process

If someone proposes changing a major technology:

```text
Proposal
 ↓
Why is current stack insufficient?
 ↓
Impact assessment
 ↓
Security assessment
 ↓
Deadline assessment
 ↓
Technical Lead review
 ↓
Decision
 ↓
Documentation update
```

Do not replace technologies casually.

---

# 66. Major Technology Changes

The following require Technical Lead coordination:

- changing authentication provider
- changing database
- changing deployment platform
- replacing Next.js
- replacing the component system
- introducing a major state-management framework
- changing the AI architecture
- changing the database migration strategy
- changing the RLS model

---

# 67. Minor Technology Changes

These may generally be handled by the relevant owner:

- adding a small utility package
- adding a UI component through the existing component system
- adding a small development helper
- adding a narrowly scoped library required for a feature

Even then, avoid unnecessary dependencies.

---

# 68. Production-Grade Does Not Mean Maximum Complexity

NIRNAY should not introduce:

- microservices
- Kubernetes
- message brokers
- event buses
- distributed caches
- unnecessary queues
- complex state-management frameworks

unless the actual MVP requires them.

A production-grade MVP can be simple.

---

# 69. Preferred Architecture

The current preferred technology architecture is:

```text
                    NIRNAY

              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
              â”‚   Next.js     â”‚
              â”‚ React + TS    â”‚
              â””â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜
                      â”‚
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚             â”‚              â”‚
        â–¼             â–¼              â–¼
   Firebase       Supabase       Intelligence
      Auth          Client           Layer
        â”‚             â”‚              â”‚
        â–¼             â–¼              â–¼
 Firebase ID      Supabase        Recommendation
    Token          Data API          Engine
                      â”‚              â”‚
                      â–¼              â–¼
                 PostgreSQL          AI
                      â”‚
                      â–¼
                     RLS
```

---

# 70. Technology Ownership

| Technology / Area | Primary Owner |
|---|---|
| Next.js architecture | Technical Lead |
| React UI | Frontend |
| Tailwind / Design System | Frontend |
| shadcn/ui | Frontend |
| Firebase Auth | Technical Lead |
| Firebase Admin | Technical Lead |
| Supabase configuration | Technical Lead |
| PostgreSQL schema | Backend/Data |
| RLS | Backend/Data + Technical Lead |
| Product Data | Backend/Data |
| Financial calculations | Backend/Data |
| Recommendation engine | AI/Intelligence + Backend/Data |
| AI provider | AI/Intelligence |
| Deployment | Technical Lead |

---

# 71. Technology Ownership Does Not Mean Isolation

Owners are responsible for maintaining quality and coordinating changes.

They are not the only people allowed to contribute.

For example:

```text
Backend developer
    +
AI developer
    ↓
Recommendation contract
```

should be collaboratively designed.

Similarly:

```text
Frontend
    +
Backend
    ↓
API contract
```

should be coordinated.

---

# 72. Shared Contract Principle

When two team areas interact, define a clear contract.

Examples:

```text
Frontend â†” Backend
Backend â†” Recommendation Engine
Recommendation Engine â†” AI
Firebase â†” Supabase
Database â†” Application
```

Contracts should define:

- input
- output
- errors
- authentication requirements
- ownership
- assumptions

---

# 73. API Contract Principle

Do not let the frontend guess backend response structures.

Bad:

```text
Frontend assumes:
response.data.magicValue
```

Good:

```text
Defined response shape
      ↓
Typed interface
      ↓
Frontend consumes contract
```

The exact contract may evolve during implementation.

---

# 74. Financial Data Contract

Financial data should have predictable semantics.

For example:

```text
amount
currency
frequency
date
status
source
verification state
```

Avoid ambiguous fields such as:

```text
value
amount2
data
misc
```

unless their meaning is explicitly documented.

---

# 75. Date and Time

Financial dates should be represented consistently.

Examples:

- policy start date
- renewal date
- goal target date
- SIP date
- alert date

Avoid silently mixing:

- local browser time
- UTC
- database timestamps

Date/time semantics should be explicit.

---

# 76. Currency

The initial product is primarily designed around Indian financial use cases.

The default display currency is:

```text
INR (₹)
```

Financial calculations should preserve currency information where appropriate.

Do not assume that all future products will necessarily use INR.

---

# 77. Internationalization

Full internationalization is not an MVP requirement.

Do not build a large i18n framework unless required.

However, avoid hard-coding architecture in ways that make future localization impossible.

---

# 78. Logging

Logs should help diagnose:

- authentication errors
- API failures
- database failures
- recommendation failures
- AI failures

Do not log:

- passwords
- Firebase tokens
- service-account JSON
- private keys
- Supabase secret keys
- unnecessary sensitive financial information

---

# 79. Error Handling

Application errors should be converted into understandable user-facing messages.

Do not expose raw infrastructure details to users.

For example:

Bad:

```text
PGRST205: Could not find table public.example
```

Better:

```text
We couldn't load this information right now.
Please try again.
```

Developer logs may contain the technical cause.

---

# 80. Performance

The MVP should prioritize:

- fast initial rendering
- efficient data fetching
- minimal unnecessary JavaScript
- responsive UI
- reasonable image usage
- avoiding redundant requests

Do not prematurely introduce:

- complex caching systems
- distributed infrastructure
- advanced optimization frameworks

---

# 81. Accessibility

The technology stack must support accessible UI.

Frontend implementations should prioritize:

- semantic HTML
- keyboard interaction
- focus management
- accessible labels
- sufficient contrast
- screen-reader-friendly controls

---

# 82. Browser Compatibility

The MVP should work in modern browsers.

Primary development/testing should use a current Chromium-based browser, while avoiding unnecessary browser-specific hacks.

---

# 83. AI Agent Technology Rules

AI coding agents must:

1. inspect `package.json`
2. inspect the existing code
3. inspect relevant documentation
4. reuse existing dependencies
5. avoid adding packages unnecessarily
6. never expose secrets
7. never replace architecture without justification
8. run validation after changes
9. report dependency changes explicitly

An AI agent must not install a package simply because it is familiar with it.

---

# 84. AI Agent Package Installation Protocol

Before installing a dependency, an AI agent should determine:

```text
Is it already installed?
        ↓
Can existing tools solve it?
        ↓
Is it necessary?
        ↓
Is it compatible?
        ↓
Is it safe?
        ↓
Is it worth the deadline cost?
```

Only then should the package be added.

---

# 85. Current Dependency Baseline

The current foundation has already established the core dependencies required for:

- Next.js
- React
- TypeScript
- Tailwind
- shadcn/ui
- Firebase
- Firebase Admin
- Supabase

Agents should inspect the actual `package.json` before adding anything.

This document does not replace the package manifest.

---

# 86. Technology Documentation Rule

When a major technology is introduced, update:

- `TECH_STACK.md`
- `ARCHITECTURE.md`
- relevant security documentation
- relevant development documentation

when appropriate.

---

# 87. Technology Freeze During Final Hours

As the project approaches submission:

> **Freeze major technology changes.**

Avoid:

- replacing frameworks
- migrating databases
- switching authentication providers
- replacing the component system
- changing deployment architecture

during the final integration period unless the current system is genuinely blocked.

---

# 88. Preferred MVP Technology Architecture

The intended MVP stack is:

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                 USER                    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â”‚
                     â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚               VERCEL                    â”‚
â”‚        Next.js + React + TypeScript     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                â”‚           â”‚
                â”‚           â–¼
                â”‚     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                â”‚     â”‚  AI Provider â”‚
                â”‚     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                â”‚
                â–¼
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚     Firebase     â”‚
        â”‚      Auth        â”‚
        â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                 â”‚
                 â”‚ Firebase ID Token
                 â–¼
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚     Supabase     â”‚
        â”‚ Data API + RLS   â”‚
        â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                 â”‚
                 â–¼
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚   PostgreSQL     â”‚
        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

# 89. Final Technology Principle

NIRNAY should use technology as an enabler, not as the product.

The stack should remain:

> **Modern, secure, understandable, maintainable, and fast enough to ship.**

The goal is not to use the most technologies.

The goal is to build the best coherent MVP possible within the available time.

---
