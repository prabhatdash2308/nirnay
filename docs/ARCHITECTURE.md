# NIRNAY — System Architecture

> **NIRNAY — Your Financial Protection & Investment Copilot**

**Document type:** Technical Architecture
**Status:** MVP / Active Development
**Audience:** Technical Lead, Frontend, Backend/Data, AI/Intelligence, AI Coding Agents
**Authority:** Technical architecture source of truth

---

# 1. Architecture Objective

NIRNAY must be built as a coherent application rather than a collection of independent pages, APIs, AI prompts, and database tables.

The architecture is designed around five principles:

1. **Clear separation of responsibilities**
2. **Secure identity and user data**
3. **Verified financial/product information**
4. **Deterministic financial intelligence**
5. **Grounded and explainable AI**

The high-level system is:

```text
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚       USER          â”‚
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚
                                    â–¼
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚    NIRNAY UI/UX     â”‚
                         â”‚ Next.js + React     â”‚
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚               â”‚               â”‚
                    â–¼               â–¼               â–¼
              Authentication    Application     Intelligence
                    â”‚              Logic             â”‚
                    â–¼               â”‚                â–¼
               Firebase             â”‚         Recommendation
               Auth                 â”‚            Engine
                    â”‚               â”‚                â”‚
                    â–¼               â–¼                â–¼
              Firebase ID      Supabase Data     AI Layer
                 Token             API               â”‚
                    â”‚               â”‚                â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â–¼
                              PostgreSQL
                              + RLS
```

---

# 2. Architecture Layers

NIRNAY is organized conceptually into the following layers:

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                 PRESENTATION               â”‚
â”‚              Next.js / React UI             â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚              APPLICATION LAYER              â”‚
â”‚        Pages / Server Routes / Actions      â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚             INTELLIGENCE LAYER              â”‚
â”‚     Calculations / Rules / Recommendations  â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                AI ASSISTANCE                â”‚
â”‚      Explanation / Conversation / Guide     â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚              DATA / FACTS LAYER             â”‚
â”‚ Product Data / User Financial Context       â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                DATA STORAGE                 â”‚
â”‚           Supabase / PostgreSQL             â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                 IDENTITY                    â”‚
â”‚             Firebase Auth                   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

The layers have different responsibilities.

---

# 3. Presentation Layer

The presentation layer is responsible for:

- displaying information
- collecting user input
- navigation
- forms
- interactions
- loading states
- empty states
- error states
- responsive behavior
- accessibility

The presentation layer should not become the source of financial business rules.

For example:

### Good

```text
UI
 ↓
Request recommendation
 ↓
Recommendation service
 ↓
Return structured result
 ↓
UI displays result
```

### Bad

```text
UI
 ↓
Hard-coded financial scoring
 ↓
Recommendation
```

Financial calculations and recommendation logic should remain centralized.

---

# 4. Next.js Application

The application is built using Next.js.

Current version:

```text
Next.js 16.3.4
```

The application uses the Next.js App Router structure.

Current conceptual structure:

```text
app/
â”œâ”€â”€ page.tsx
â”œâ”€â”€ layout.tsx
â”œâ”€â”€ globals.css
â”œâ”€â”€ auth/
â”‚   â””â”€â”€ page.tsx
â”œâ”€â”€ api/
â”‚   â””â”€â”€ auth/
â”‚       â””â”€â”€ ensure-role/
â”‚           â””â”€â”€ route.ts
â””â”€â”€ lib/
    â”œâ”€â”€ auth-client.ts
    â”œâ”€â”€ auth-role.ts
    â”œâ”€â”€ firebase-admin.ts
    â”œâ”€â”€ firebase-client.ts
    â””â”€â”€ supabase-client.ts
```

The application will grow toward:

```text
app/
â”œâ”€â”€ page.tsx
â”œâ”€â”€ layout.tsx
â”œâ”€â”€ auth/
â”‚   â””â”€â”€ page.tsx
â”œâ”€â”€ onboarding/
â”‚   â””â”€â”€ page.tsx
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ layout.tsx
â”‚   â”œâ”€â”€ page.tsx
â”‚   â”œâ”€â”€ discover/
â”‚   â”‚   â”œâ”€â”€ page.tsx
â”‚   â”‚   â”œâ”€â”€ insurance/
â”‚   â”‚   â””â”€â”€ investments/
â”‚   â”œâ”€â”€ compare/
â”‚   â”‚   â””â”€â”€ page.tsx
â”‚   â”œâ”€â”€ manage/
â”‚   â”‚   â”œâ”€â”€ page.tsx
â”‚   â”‚   â”œâ”€â”€ insurance/
â”‚   â”‚   â””â”€â”€ investments/
â”‚   â”œâ”€â”€ goals/
â”‚   â”‚   â””â”€â”€ page.tsx
â”‚   â”œâ”€â”€ calendar/
â”‚   â”‚   â””â”€â”€ page.tsx
â”‚   â”œâ”€â”€ watchlist/
â”‚   â”‚   â””â”€â”€ page.tsx
â”‚   â””â”€â”€ alerts/
â”‚       â””â”€â”€ page.tsx
â”œâ”€â”€ api/
â””â”€â”€ lib/
```

This structure may evolve as implementation progresses.

Do not create unnecessary nesting solely for theoretical architecture.

---

# 5. Client vs Server Boundary

NIRNAY must maintain a clear distinction between browser-side and server-side functionality.

## Browser-side responsibilities

Examples:

- Firebase client authentication
- UI state
- form state
- navigation
- browser interactions
- Supabase client requests using the publishable key

## Server-side responsibilities

Examples:

- Firebase Admin SDK
- service-account credentials
- privileged operations
- secret API keys
- sensitive backend processing
- server-only integrations

---

# 6. Server-Only Rule

The Firebase Admin SDK must remain server-only.

Current implementation:

```text
app/lib/firebase-admin.ts
```

This file uses:

```ts
import "server-only";
```

The Firebase Admin service-account credential must never be imported into client-side code.

Never:

```text
NEXT_PUBLIC_FIREBASE_ADMIN_...
```

Never expose:

- service-account JSON
- private keys
- Firebase Admin credentials
- Supabase secret key

---

# 7. Authentication Architecture

NIRNAY uses Firebase Authentication as the identity provider.

Supported authentication methods currently include:

- Email/password
- Google

The authentication flow is:

```text
User
 ↓
Firebase Authentication
 ↓
Firebase User
 ↓
Firebase ID Token
 ↓
NIRNAY
```

For Supabase data access:

```text
Firebase ID Token
 ↓
Supabase Firebase Third-Party Authentication
 ↓
Supabase JWT validation
 ↓
PostgreSQL
 ↓
RLS
```

---

# 8. Firebase Authentication

The browser Firebase client is responsible for:

- initializing Firebase
- authentication
- sign-up
- sign-in
- Google authentication
- logout
- retrieving the current Firebase user
- retrieving Firebase ID tokens

Current implementation:

```text
app/lib/firebase-client.ts
app/lib/auth-client.ts
app/lib/auth-role.ts
```

---

# 9. Firebase Admin SDK

The Firebase Admin SDK is responsible for trusted server-side operations.

Current use:

```text
app/api/auth/ensure-role/route.ts
```

The current flow:

```text
Client
 ↓
Firebase ID Token
 ↓
POST /api/auth/ensure-role
 ↓
Firebase Admin verifyIdToken()
 ↓
Firebase Admin getUser()
 ↓
Set custom claim
 ↓
role = authenticated
 ↓
Client refreshes ID token
```

The custom claim is required for the current Supabase third-party authentication configuration.

---

# 10. Authentication Role

Authenticated Firebase users receive:

```json
{
  "role": "authenticated"
}
```

The role is established server-side.

It must not be trusted when directly supplied by a browser.

The browser may request role establishment, but only Firebase Admin may set the custom claim.

---

# 11. Supabase Architecture

Supabase provides the application data layer.

NIRNAY uses:

```text
Supabase
    ↓
PostgreSQL
    ↓
Tables
    ↓
RLS Policies
```

The application accesses Supabase using:

```text
@supabase/supabase-js
```

Current version:

```text
2.116.0
```

---

# 12. Supabase Client

The current application uses:

```text
app/lib/supabase-client.ts
```

The browser Supabase client is configured with:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

The Firebase user's ID token is provided to Supabase through the configured access-token mechanism.

Conceptually:

```text
Firebase Auth
     ↓
Firebase ID Token
     ↓
Supabase Client
     ↓
Supabase Data API
     ↓
PostgreSQL
```

---

# 13. Supabase Secret Key

The Supabase secret key must remain server-side.

It must never:

- use `NEXT_PUBLIC_`
- be included in browser code
- be committed to Git
- be pasted into documentation
- be included in screenshots
- be returned to users

The public/publishable key and secret key have different security responsibilities.

---

# 14. Database Architecture

The current database is PostgreSQL managed through Supabase.

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

The database schema is managed through migrations.

Current migration:

```text
supabase/migrations/
â””â”€â”€ 20260909094445_initial_nirnay_schema.sql
```

---

# 15. User Ownership Model

User-owned data is associated with:

```text
user_id
```

The application uses the authenticated Firebase user's UID as the user identity represented in Supabase.

Conceptually:

```text
Firebase UID
     ↓
JWT sub
     ↓
user_id
```

The same identity is used consistently across user-owned records.

---

# 16. Row Level Security

Row Level Security is a fundamental security boundary.

User-owned records should be accessible only to the authenticated user who owns them.

The current policy pattern is conceptually:

```sql
user_id = (auth.jwt() ->> 'sub')
```

This means:

```text
User A
   ↓
JWT sub = A
   ↓
Can access A's records

User B
   ↓
JWT sub = B
   ↓
Can access B's records
```

User B must not be able to read User A's private records.

---

# 17. RLS Principle

Frontend filtering is not a security mechanism.

This is insufficient:

```text
SELECT all users
↓
filter user_id in React
```

The database itself must enforce ownership.

Correct:

```text
Client request
 ↓
JWT
 ↓
PostgreSQL RLS
 ↓
Only authorized rows
```

---

# 18. Database Migration Principle

Database schema changes must be made through migrations.

Do not rely on manually editing a production database.

Preferred flow:

```text
Change required
     ↓
Create migration
     ↓
Apply locally
     ↓
Verify schema
     ↓
Test application
     ↓
Commit migration
     ↓
Deploy/apply migration
```

Migrations must be committed to Git.

---

# 19. Facts Layer

NIRNAY separates financial/product facts from intelligence.

The facts layer represents information such as:

- product name
- provider
- category
- features
- pricing information
- eligibility
- limitations
- investment metadata
- source
- source URL
- verification date
- update date

The exact schema may evolve.

---

# 20. Facts Are Not AI

The AI layer must never become the authoritative product database.

The architecture is:

```text
Verified Facts
       ↓
Structured Data
       ↓
Intelligence
       ↓
AI Explanation
```

Not:

```text
AI
 ↓
Invent facts
 ↓
Database
```

---

# 21. Intelligence Layer

The intelligence layer performs deterministic and explainable processing.

Potential responsibilities:

- budget calculations
- comparison calculations
- suitability checks
- scoring
- goal calculations
- portfolio calculations
- recommendation logic
- alert conditions

This layer should preferably use deterministic functions.

Example:

```text
calculateBudgetFit()
calculateGoalProgress()
calculateRecommendationScore()
calculateCoverageGap()
```

The exact implementation may use different names.

---

# 22. Deterministic Calculation Principle

If the same valid inputs are provided, deterministic calculations should produce the same result.

For example:

```text
income = X
budget = Y
product_cost = Z

→ budget_fit = deterministic result
```

Financial calculations should not depend on random AI output.

---

# 23. Recommendation Engine

The recommendation engine combines user context and product facts.

Conceptually:

```text
User Profile
     +
Financial Profile
     +
Goals
     +
Existing Products
     +
Verified Product Data
     ↓
Eligibility
     ↓
Budget Fit
     ↓
Requirement Fit
     ↓
Preference Fit
     ↓
Scoring
     ↓
Recommendation
```

The engine should return structured information.

Example conceptual response:

```json
{
  "productId": "example-product",
  "score": 82,
  "recommendation": "strong_fit",
  "reasons": [
    "Fits stated budget",
    "Matches selected requirement"
  ],
  "tradeoffs": [
    "Higher cost than another compared option"
  ]
}
```

This is an example structure, not a mandatory final API contract.

---

# 24. AI Layer

The AI layer sits above the intelligence and facts layers.

Its primary responsibilities are:

- explanation
- summarization
- conversational assistance
- navigation guidance
- contextual question answering
- recommendation explanation

AI should not replace deterministic business logic.

---

# 25. AI Request Flow

The preferred flow is:

```text
User
 ↓
AI Copilot
 ↓
Determine intent
 ↓
Retrieve relevant application context
 ↓
Retrieve verified facts
 ↓
Run deterministic calculations if required
 ↓
Construct grounded context
 ↓
AI model
 ↓
Explain result
 ↓
User
```

---

# 26. AI Grounding

AI responses should be grounded using:

- user context
- verified product data
- application state
- recommendation results
- deterministic calculations

AI should not be given authority to invent missing values.

---

# 27. AI Unknown-State Behavior

When required information is unavailable:

```text
Information unavailable
       ↓
Do not fabricate
       ↓
Tell user what is unavailable
       ↓
Provide useful next step
```

Example:

> "I don't have a verified current premium for this product in the available data."

This is preferable to generating a plausible-looking number.

---

# 28. AI vs Recommendation Engine

These systems have different responsibilities.

## Recommendation Engine

Answers:

> "Based on the defined rules and available information, which options appear suitable?"

## AI

Answers:

> "How can I explain this result clearly to the user?"

Therefore:

```text
Recommendation Engine
        ↓
Structured Recommendation
        ↓
AI
        ↓
Natural Language Explanation
```

---

# 29. Application Data Flow

A typical authenticated request should look like:

```text
Browser
  ↓
Firebase Authentication
  ↓
Firebase ID Token
  ↓
Next.js / Supabase Client
  ↓
Supabase Data API
  ↓
PostgreSQL
  ↓
RLS
  ↓
Authorized Data
```

For recommendation:

```text
User Request
     ↓
Application
     ↓
User Financial Context
     ↓
Product Data
     ↓
Recommendation Engine
     ↓
Structured Result
     ↓
AI Explanation
     ↓
UI
```

---

# 30. Product Discovery Flow

```text
User
 ↓
Discover
 ↓
Category
 ↓
Product Query
 ↓
Structured Product Data
 ↓
Product Cards
 ↓
Product Details
```

The UI should not contain hard-coded product facts when those facts belong in the data layer.

---

# 31. Comparison Flow

```text
User selects products
       ↓
Comparison request
       ↓
Retrieve structured product data
       ↓
Normalize relevant fields
       ↓
Compare
       ↓
Highlight differences
       ↓
Optional recommendation
```

The comparison engine should handle missing fields explicitly.

---

# 32. Management Flow

For user-owned products:

```text
User
 ↓
Manage
 ↓
Retrieve authenticated user's records
 ↓
RLS verifies ownership
 ↓
Display
 ↓
Create / Update / Delete
```

The frontend must not bypass database authorization.

---

# 33. Goals Flow

```text
User Goal
 ↓
Goal Data
 ↓
Target
 ↓
Current Progress
 ↓
Deterministic Calculation
 ↓
Dashboard / Goal UI
```

Goal calculations should be testable independently of the UI.

---

# 34. Alerts Flow

Alerts can be generated from relevant conditions.

Conceptually:

```text
Stored Financial Event
        ↓
Condition Check
        ↓
Alert
        ↓
User
```

Examples:

- renewal approaching
- goal deadline approaching
- profile incomplete
- watchlist event

Alert logic should avoid unnecessary noise.

---

# 35. Financial Calendar Flow

```text
Policy / Investment / Goal
        ↓
Important Date
        ↓
Calendar Event
        ↓
Upcoming Action
```

Calendar dates should come from structured data rather than being manually duplicated across UI screens.

---

# 36. Watchlist Flow

```text
Product
 ↓
User adds product
 ↓
Watchlist record
 ↓
User-specific RLS
 ↓
Watchlist UI
```

The watchlist should store references rather than unnecessarily duplicating entire product datasets where possible.

---

# 37. Route Architecture

The intended authenticated route structure is:

```text
/app
â”œâ”€â”€ page.tsx
â”œâ”€â”€ discover/
â”‚   â”œâ”€â”€ page.tsx
â”‚   â”œâ”€â”€ insurance/
â”‚   â””â”€â”€ investments/
â”œâ”€â”€ compare/
â”‚   â””â”€â”€ page.tsx
â”œâ”€â”€ manage/
â”‚   â”œâ”€â”€ page.tsx
â”‚   â”œâ”€â”€ insurance/
â”‚   â””â”€â”€ investments/
â”œâ”€â”€ goals/
â”‚   â””â”€â”€ page.tsx
â”œâ”€â”€ calendar/
â”‚   â””â”€â”€ page.tsx
â”œâ”€â”€ watchlist/
â”‚   â””â”€â”€ page.tsx
â””â”€â”€ alerts/
    â””â”€â”€ page.tsx
```

The exact routing implementation may evolve.

---

# 38. Authentication Boundary for Routes

Unauthenticated users should not be allowed to access private financial application areas.

Conceptually:

```text
Public
â”œâ”€â”€ /
â””â”€â”€ /auth

Authenticated
â”œâ”€â”€ /app
â”œâ”€â”€ /app/discover
â”œâ”€â”€ /app/compare
â”œâ”€â”€ /app/manage
â”œâ”€â”€ /app/goals
â”œâ”€â”€ /app/calendar
â”œâ”€â”€ /app/watchlist
â””â”€â”€ /app/alerts
```

The exact enforcement mechanism should be selected based on the current Next.js architecture.

---

# 39. Onboarding State

A new authenticated user may require onboarding before accessing the complete application experience.

Conceptually:

```text
Authenticated
     ↓
Profile exists?
     â”‚
 â”Œâ”€â”€â”€â”´â”€â”€â”€â”€â”
 No       Yes
 ↓         ↓
Onboarding App
```

The application should avoid repeatedly showing onboarding after completion.

---

# 40. User Profile vs Financial Profile

These should remain conceptually distinct.

## User Profile

Identity/application information:

- user ID
- name
- email
- avatar
- timestamps

## Financial Profile

Financial context:

- income
- insurance budget
- preferences
- relevant financial information

This separation improves clarity and future extensibility.

---

# 41. Shared Component Architecture

UI components should be reusable.

Conceptually:

```text
components/
â”œâ”€â”€ ui/
â”œâ”€â”€ layout/
â”œâ”€â”€ navigation/
â”œâ”€â”€ dashboard/
â”œâ”€â”€ insurance/
â”œâ”€â”€ investments/
â”œâ”€â”€ compare/
â”œâ”€â”€ goals/
â”œâ”€â”€ calendar/
â”œâ”€â”€ watchlist/
â”œâ”€â”€ alerts/
â””â”€â”€ ai/
```

The actual structure may evolve based on implementation.

Do not create a new component for every small visual fragment without a reuse reason.

---

# 42. Design System Boundary

The design system is a shared dependency.

Frontend contributors should prefer:

- existing shadcn/ui components
- Base UI primitives
- shared application components
- consistent design tokens

Avoid independently introducing different component libraries for individual pages.

Detailed rules are in:

[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

---

# 43. API Architecture

Application APIs should have clear responsibilities.

Examples:

```text
/api/auth/*
/api/products/*
/api/recommendations/*
/api/ai/*
/api/financial/*
```

Do not create an API route simply because it is technically possible.

Prefer clear domain boundaries.

---

# 44. API Validation

API boundaries should validate:

- authentication
- input types
- required fields
- ownership
- expected data shape
- failure states

Never trust browser-provided:

- user identity
- role
- ownership
- recommendation score
- financial calculation result

where these can be derived securely on the server.

---

# 45. Data Ownership

Each domain should have a clear owner.

| Domain | Primary Owner |
|---|---|
| UI / UX | Frontend |
| Authentication | Technical Lead |
| Database | Backend/Data |
| Product Data | Backend/Data |
| Financial Calculations | Backend/Data |
| Recommendation Logic | AI/Intelligence + Backend/Data |
| AI Copilot | AI/Intelligence |
| Integration | Technical Lead |
| Deployment | Technical Lead |

Ownership does not prevent collaboration.

---

# 46. Four-Member Architecture

The team operates as:

```text
                    TECHNICAL LEAD
                          â”‚
             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
             â”‚            â”‚            â”‚
             â–¼            â–¼            â–¼
         FRONTEND      BACKEND        AI
           /UX          /DATA     /INTELLIGENCE
             â”‚            â”‚            â”‚
             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                          â–¼
                    INTEGRATED MVP
```

---

# 47. Member 1 — Technical Lead Boundary

Primary responsibilities:

- architecture
- integration
- authentication
- security
- infrastructure
- deployment
- shared engineering standards
- final integration

The Technical Lead should avoid becoming the sole implementer of every feature.

---

# 48. Member 2 — Frontend Boundary

Primary responsibilities:

- application shell
- navigation
- pages
- reusable UI
- responsive behavior
- UX
- loading/empty/error states
- visual polish

The frontend should consume backend/intelligence contracts rather than reimplementing business logic.

---

# 49. Member 3 — Backend/Data Boundary

Primary responsibilities:

- database
- migrations
- product catalog
- data structures
- product facts
- provenance
- APIs
- deterministic financial calculations

Backend should provide structured data and predictable interfaces.

---

# 50. Member 4 — AI/Intelligence Boundary

Primary responsibilities:

- recommendation logic
- suitability logic
- explainability
- AI Copilot
- prompt design
- AI integration
- AI grounding
- AI safety

AI must consume trusted application context.

---

# 51. Shared Infrastructure Changes

Changes involving any of the following require coordination:

- Firebase
- Supabase configuration
- environment variables
- RLS
- database migrations affecting multiple domains
- shared UI primitives
- application shell
- routing architecture
- deployment configuration
- AI provider configuration

Do not silently modify these areas during unrelated work.

---

# 52. Environment Architecture

Development should use environment-specific configuration.

Conceptually:

```text
Local
 ↓
.env / .env.local

Production
 ↓
Deployment platform environment variables
```

Environment files must not be committed.

---

# 53. Local Development Architecture

Current local Supabase development uses:

```text
Supabase Studio
http://127.0.0.1:54323

Supabase API
http://127.0.0.1:54321

PostgreSQL
postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

These are local development endpoints.

They must not be treated as production infrastructure.

---

# 54. Production Architecture

The preferred MVP production architecture is:

```text
                    USER
                     â”‚
                     â–¼
               Vercel / Next.js
                     â”‚
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚                         â”‚
        â–¼                         â–¼
 Firebase Auth             Supabase Cloud
        â”‚                         â”‚
        â”‚                         â–¼
        â”‚                    PostgreSQL
        â”‚                         â”‚
        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â”‚
                     â–¼
              NIRNAY Application
```

The final deployment configuration is documented in:

[`DEPLOYMENT.md`](./DEPLOYMENT.md)

---

# 55. Production Environment Principle

Production should use:

- production Firebase project
- production Supabase project
- production environment variables
- production database migrations
- secure deployment secrets

Local credentials must not accidentally be deployed.

---

# 56. Observability

The MVP should provide enough logging to diagnose failures.

Important failures include:

- authentication failure
- Firebase Admin failure
- database failure
- API failure
- AI provider failure
- recommendation failure

Do not log:

- passwords
- private keys
- service-account credentials
- secret API keys
- sensitive financial information unnecessarily
- full authentication tokens

---

# 57. Error Architecture

Errors should be categorized.

Conceptually:

```text
Authentication Error
Data Error
Validation Error
Authorization Error
Recommendation Error
AI Error
Infrastructure Error
```

The user should receive a safe, understandable message.

Developers should receive enough technical context through logs.

---

# 58. Performance Principles

The MVP should avoid unnecessary complexity.

Priorities:

- fast initial load
- avoid excessive client-side JavaScript
- avoid unnecessary network requests
- avoid duplicate data fetching
- use loading states
- use server-side processing where appropriate
- keep components focused

Performance optimization should not prematurely complicate the architecture.

---

# 59. Security Architecture

Security is enforced through multiple layers:

```text
Firebase Authentication
        ↓
Firebase ID Token
        ↓
Supabase Authentication
        ↓
PostgreSQL RLS
        ↓
Application Authorization
```

No single UI check should be considered sufficient.

See:

[`SECURITY.md`](./SECURITY.md)

---

# 60. Trust Architecture

Financial trust is enforced through:

```text
Source
  ↓
Structured Fact
  ↓
Verification Metadata
  ↓
Application Logic
  ↓
Recommendation
  ↓
AI Explanation
```

The further information moves from the source, the more clearly the system should distinguish:

- fact
- calculation
- recommendation
- explanation

---

# 61. Data Provenance

Where product information comes from external sources, the preferred data model contains:

```text
source
source_url
last_verified_at
data_updated_at
```

These fields allow NIRNAY to communicate the freshness and origin of important information.

---

# 62. No Hallucinated Data Architecture

The architecture must make hallucination harder.

Bad:

```text
AI
 ↓
Generate product information
 ↓
Display as fact
```

Good:

```text
Product Database
 ↓
Verified Data
 ↓
Recommendation / Calculation
 ↓
AI Explanation
```

---

# 63. Demo Data Architecture

During MVP development, demo data may be used where production data integrations are not yet implemented.

Demo data should be:

- deterministic
- clearly controlled
- internally consistent
- separated from actual production claims
- easy to replace later

Do not label arbitrary mock values as verified external facts.

---

# 64. Dependency Philosophy

Every dependency should have a reason.

Before adding a package, ask:

1. Is the functionality already available?
2. Is an existing project dependency sufficient?
3. Does the dependency materially reduce implementation complexity?
4. Is it maintained?
5. Does it increase security or bundle risk?
6. Can the team support it under the deadline?

Avoid adding libraries simply for convenience.

---

# 65. AI Provider Abstraction

The application should avoid coupling the entire product architecture to one AI model provider.

Conceptually:

```text
AI Application Layer
        ↓
Provider Adapter
        ↓
AI Provider
```

This allows future replacement of:

- Gemini
- Claude
- OpenAI
- other supported providers

without rewriting the product's core financial intelligence.

The MVP may use one provider, but the architecture should avoid unnecessary provider lock-in.

---

# 66. Financial Intelligence Must Be Provider-Independent

Recommendation logic should not depend on an AI provider.

Bad:

```text
Gemini decides score
```

Good:

```text
Recommendation Engine
        ↓
Structured Result
        ↓
Any AI provider explains result
```

This makes the financial logic testable and portable.

---

# 67. AI Context Contract

AI should receive structured context where possible.

Conceptually:

```json
{
  "userContext": {},
  "financialProfile": {},
  "products": [],
  "comparison": {},
  "recommendation": {},
  "relevantFacts": []
}
```

The exact schema will be defined when the AI system is implemented.

The important principle is that AI receives relevant, bounded context rather than unrestricted database access.

---

# 68. AI Access Principle

AI should not receive unrestricted access to the entire database.

Instead:

```text
User Request
 ↓
Determine required context
 ↓
Retrieve allowed information
 ↓
Construct context
 ↓
AI
```

This reduces:

- unnecessary data exposure
- hallucination risk
- accidental leakage
- irrelevant context

---

# 69. Domain Separation

NIRNAY should conceptually separate:

```text
Identity
Financial Profile
Products
Policies
Investments
Goals
Alerts
Calendar
Watchlist
Recommendations
AI Conversations
```

This allows each domain to evolve independently.

---

# 70. Current vs Future Architecture

Not every theoretical system should be implemented immediately.

### Current MVP

Focus on:

- authentication
- profile
- database
- core UI
- product data
- comparison
- recommendation
- AI explanation
- management
- deployment

### Future

Potential additions:

- external financial integrations
- richer market data
- automated ingestion
- notifications infrastructure
- advanced analytics
- sophisticated recommendation models
- multi-provider AI routing
- event-driven architecture

Do not build future infrastructure prematurely unless required by the MVP.

---

# 71. Architecture Evolution Rule

Architecture should evolve from real requirements.

Do not create:

- microservices
- event buses
- complex queues
- distributed systems
- unnecessary abstraction layers

simply because they sound production-grade.

For the current MVP, a well-structured Next.js application with Supabase and Firebase is sufficient.

---

# 72. Testing Architecture

Important business logic should be testable independently.

Priority areas:

- authentication
- RLS
- financial calculations
- recommendation scoring
- data validation
- critical API behavior
- AI grounding behavior

UI testing should focus on critical user journeys.

---

# 73. Build Validation

Before integration, contributors should run at minimum:

```bash
npm run lint
npm run build
```

Where applicable, additional tests should be run.

A feature is not considered integrated merely because the developer says it works.

---

# 74. Git Architecture

Git is the collaboration layer.

Conceptually:

```text
main
 â”‚
 â”œâ”€â”€ feature/frontend-...
 â”œâ”€â”€ feature/backend-...
 â”œâ”€â”€ feature/ai-...
 â””â”€â”€ feature/infrastructure-...
```

Contributors should avoid directly committing unrelated work to `main`.

See:

[`GIT_WORKFLOW.md`](./GIT_WORKFLOW.md)

---

# 75. Integration Strategy

The Technical Lead coordinates integration.

Preferred process:

```text
Member builds feature
        ↓
Local validation
        ↓
Commit
        ↓
Push branch
        ↓
Review
        ↓
Merge
        ↓
Integration validation
```

The integrated application must be tested after major merges.

---

# 76. Conflict Management

If two contributors need to modify the same shared file:

1. Communicate first.
2. Decide ownership.
3. Split responsibilities if possible.
4. Avoid parallel destructive edits.
5. Integrate deliberately.

Typical high-conflict files include:

- `app/layout.tsx`
- global CSS
- shared navigation
- shared UI components
- database migrations
- environment configuration
- package files

---

# 77. Documentation Architecture

Documentation itself is part of the architecture.

Important architectural changes should update the relevant document.

For example:

```text
Database change
 ↓
Migration
 ↓
DATABASE.md update

Auth change
 ↓
Implementation
 ↓
AUTHENTICATION.md update

Architecture change
 ↓
Implementation
 ↓
ARCHITECTURE.md update
```

---

# 78. Architecture Decision Rule

Before introducing a major architectural change, ask:

1. What problem does it solve?
2. Is the problem real in the current MVP?
3. Is there a simpler solution?
4. Does it affect security?
5. Does it affect another team member?
6. Does it affect deployment?
7. Does it increase implementation time?
8. Can the team explain it during the demo?

If the answer is unclear, do not introduce the complexity immediately.

---

# 79. Current Architecture Snapshot

At the current project checkpoint:

```text
Frontend
â”œâ”€â”€ Next.js 16.3.4
â”œâ”€â”€ React 19.2.8
â”œâ”€â”€ TypeScript
â”œâ”€â”€ Tailwind CSS v4
â””â”€â”€ shadcn/ui / Base UI

Authentication
â”œâ”€â”€ Firebase Authentication
â”œâ”€â”€ Firebase Admin SDK
â””â”€â”€ Firebase custom claims

Database
â”œâ”€â”€ Supabase
â”œâ”€â”€ PostgreSQL
â”œâ”€â”€ Supabase Data API
â””â”€â”€ Row Level Security

Application
â”œâ”€â”€ User profiles
â”œâ”€â”€ Financial profiles
â”œâ”€â”€ Insurance policies
â”œâ”€â”€ Investments
â”œâ”€â”€ Financial goals
â”œâ”€â”€ Watchlist
â”œâ”€â”€ Alerts
â””â”€â”€ Financial calendar
```

The current foundation has been validated locally through an authenticated Firebase → Supabase Data API → PostgreSQL/RLS flow.

---

# 80. Architecture North Star

The architecture should make this flow possible:

```text
                    USER
                     â”‚
                     â–¼
              NIRNAY EXPERIENCE
                     â”‚
                     â–¼
             PERSONAL CONTEXT
                     â”‚
                     â–¼
            VERIFIED INFORMATION
                     â”‚
                     â–¼
             INTELLIGENCE ENGINE
                     â”‚
                     â–¼
              RECOMMENDATION
                     â”‚
                     â–¼
              EXPLAINABLE AI
                     â”‚
                     â–¼
                 DECISION
                     â”‚
                     â–¼
                 MANAGEMENT
                     â”‚
                     â–¼
                  TRACKING
                     â”‚
                     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                     â–¼
                                  REVIEW
```

---

# 81. Final Architecture Principle

NIRNAY should remain:

> **Simple enough to ship, structured enough to maintain, secure enough to trust, and intelligent enough to demonstrate meaningful AI value.**

The architecture is not an academic exercise.

Every architectural decision must serve the product and the two-day delivery objective.

---
