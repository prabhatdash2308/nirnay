# NIRNAY — Product & Engineering Roadmap

> **Status:** Active
> **Product:** NIRNAY — Your Financial Protection & Investment Copilot
> **Repository:** `nirnay`
> **Primary Goal:** Build, validate, deploy, and demonstrate a trustworthy fintech MVP within the competition timeline.

---

## 1. Purpose

This document defines the planned evolution of NIRNAY from its current foundation to a production-quality MVP and future platform.

The roadmap exists to:

- establish implementation priorities
- prevent uncontrolled feature expansion
- keep the team aligned
- provide clear ownership boundaries
- help AI coding agents understand what should and should not be built
- distinguish MVP requirements from future ideas
- preserve the product's trust, security, and financial-data principles

The roadmap is intentionally prioritized around **user value, demo impact, technical reliability, and implementation feasibility**.

---

# 2. Product Direction

NIRNAY is designed around the following continuous financial decision loop:

```text
DISCOVER
   ↓
COMPARE
   ↓
DECIDE
   ↓
MANAGE
   ↓
OPTIMIZE
   ↓
TRACK
   ↓
DETECT
   ↓
COMPARE
   â†º
```

The product should progressively move from a passive information tool toward an intelligent financial copilot.

However, every increase in intelligence must preserve:

- factual accuracy
- source transparency
- explainability
- user control
- financial safety
- privacy
- clear distinction between facts and recommendations

---

# 3. Roadmap Principles

## 3.1 Build the critical path first

The team should prioritize features required for a complete user journey before building secondary features.

A smaller, reliable end-to-end product is more valuable than a large collection of incomplete features.

---

## 3.2 Vertical slices over isolated features

Whenever practical, implement complete user journeys:

```text
UI
 ↓
Authentication
 ↓
Database
 ↓
Business Logic
 ↓
AI / Recommendation
 ↓
User-visible Result
```

Avoid building large disconnected frontend, backend, or AI layers that cannot yet work together.

---

## 3.3 Trust before intelligence

NIRNAY must never sacrifice financial trustworthiness for impressive AI behavior.

The preferred progression is:

```text
Reliable Data
     ↓
Structured Financial Logic
     ↓
Explainable Recommendations
     ↓
AI Assistance
     ↓
Continuous Optimization
```

Not:

```text
AI
 ↓
Invent Facts
 ↓
Make Financial Claims
```

---

## 3.4 Demo-critical features have priority

For the competition MVP, prioritize functionality that makes the product understandable within a short demonstration.

The evaluator should quickly understand:

1. what NIRNAY does
2. what problem it solves
3. how it compares financial products
4. how it helps a user make a decision
5. how it manages existing financial products
6. how intelligence improves the user's financial decisions

---

# 4. Current Foundation

The following foundation has already been established.

## Completed

### Application foundation

- Next.js application
- React
- TypeScript
- Tailwind CSS
- shadcn/Base UI foundation
- project structure
- linting
- production build

### Authentication

- Firebase Authentication
- Email/password authentication
- Google authentication
- Firebase Admin SDK
- server-side Firebase verification
- Firebase custom claim:
  - `role: "authenticated"`
- forced Firebase token refresh after role assignment

### Supabase

- Supabase Cloud project
- Supabase local development environment
- Supabase JavaScript client
- Firebase third-party authentication integration
- Firebase UID → Supabase JWT identity bridge
- publishable/secret key architecture

### Database

Initial schema established for:

- `user_profiles`
- `financial_profiles`
- `insurance_policies`
- `investments`
- `financial_goals`
- `watchlist`
- `alerts`
- `financial_calendar`

### Security

- `.env` files excluded from Git
- local Firebase Admin service-account file excluded from Git
- server-only Firebase Admin implementation
- Row Level Security enabled
- user-owned data policies
- migration-based schema management

### Engineering quality

- ESLint passing
- production build passing
- migration successfully applied
- Firebase → Supabase Data API verified
- authenticated user profile upsert verified
- Git workflow established
- documentation system established

---

# 5. MVP Roadmap

The MVP is organized into implementation phases rather than calendar dates.

The exact duration of each phase may change based on team velocity and competition deadlines.

---

# PHASE 1 — Foundation

## Status

**COMPLETED**

## Objective

Establish the technical foundation required for all future work.

## Deliverables

- [x] Next.js application
- [x] TypeScript
- [x] Tailwind CSS
- [x] shadcn/Base UI
- [x] Firebase project
- [x] Firebase web authentication
- [x] Firebase Admin SDK
- [x] Firebase custom authentication role
- [x] Supabase project
- [x] Supabase Firebase third-party integration
- [x] Supabase local development
- [x] Initial database schema
- [x] RLS policies
- [x] Database migrations
- [x] Git repository
- [x] Git workflow
- [x] Core documentation

## Exit Criteria

The application can:

```text
Create Firebase user
       ↓
Authenticate user
       ↓
Assign authenticated role
       ↓
Issue refreshed Firebase token
       ↓
Access Supabase Data API
       ↓
Pass RLS
       ↓
Create/read user's own database record
```

---

# PHASE 2 — Application Shell

## Status

**NEXT PRIORITY**

## Objective

Transform the technical foundation into the real NIRNAY application experience.

## Deliverables

### Global application structure

- [ ] production navigation
- [ ] authenticated application layout
- [ ] responsive sidebar/navigation
- [ ] mobile navigation
- [ ] application header
- [ ] user profile menu
- [ ] loading states
- [ ] empty states
- [ ] error states
- [ ] toast/notification system
- [ ] route protection
- [ ] consistent page transitions where appropriate

### Core routes

Recommended initial application routes:

```text
/
 /auth
 /dashboard
 /discover
 /compare
 /recommend
 /portfolio
 /goals
 /watchlist
 /alerts
 /calendar
 /profile
 /settings
```

Not every route must initially contain full functionality.

Routes should be introduced when their underlying feature is ready.

## Exit Criteria

A signed-in user can move through the core NIRNAY application without encountering placeholder navigation or broken routes.

---

# PHASE 3 — Financial Profile

## Status

**HIGH PRIORITY**

## Objective

Create the user financial context required for meaningful recommendations.

## Deliverables

### Financial profile

Capture only information necessary for the MVP.

Potential fields include:

- income
- monthly expenses
- savings
- existing insurance
- investment amount
- risk preference
- financial goals
- dependents where relevant
- preferred investment horizon

### Profile experience

- [ ] onboarding
- [ ] financial profile form
- [ ] edit profile
- [ ] profile completion indicator
- [ ] validation
- [ ] persistence to `financial_profiles`
- [ ] privacy-conscious presentation

## Important Rule

Do not collect sensitive financial information merely because it is technically possible.

Every field should have a clear product purpose.

## Exit Criteria

NIRNAY can construct a structured financial context for a user.

---

# PHASE 4 — Financial Dashboard

## Status

**HIGH PRIORITY**

## Objective

Create the user's financial command center.

## Dashboard should eventually surface

### Financial snapshot

- insurance coverage
- investment value
- active goals
- upcoming renewals
- important alerts

### Action-oriented insights

Examples:

```text
Insurance renewal approaching
        ↓
Review current policy
        ↓
Compare alternatives
```

or:

```text
Investment goal
        ↓
Current progress
        ↓
Required contribution
        ↓
Potential adjustment
```

### Dashboard principles

The dashboard should answer:

> "What should I pay attention to right now?"

rather than simply displaying data.

## Exit Criteria

A user can understand their current financial state and identify important next actions from one screen.

---

# PHASE 5 — Product Discovery

## Status

**MVP CORE**

## Objective

Allow users to discover financial products relevant to their needs.

Initial product categories:

```text
Insurance
├── Health
├── Motor
└── Life

Investments
└── Mutual Funds / SIP
```

## Deliverables

- [ ] product categories
- [ ] search
- [ ] filters
- [ ] structured product cards
- [ ] product detail page
- [ ] eligibility information where available
- [ ] coverage/features
- [ ] pricing/premium information where verified
- [ ] important exclusions
- [ ] source
- [ ] last updated timestamp

## Trust Requirement

Product information must have a clear provenance.

NIRNAY should distinguish:

```text
Verified Source Data
User-Provided Data
Calculated Data
AI-Generated Explanation
```

These categories must never be silently mixed.

## Exit Criteria

A user can discover a relevant product and understand its important characteristics.

---

# PHASE 6 — Product Comparison Engine

## Status

**MVP CORE**

## Objective

Turn raw product information into a meaningful comparison.

## Comparison dimensions

Depending on product type:

### Insurance

- premium
- coverage
- deductible
- exclusions
- waiting period
- claim-related information
- add-ons
- limits
- renewal information

### Investments

- category
- investment objective
- risk indicators
- expense-related information
- historical information where legally/technically appropriate
- minimum investment
- SIP availability
- relevant fund characteristics

## Comparison UX

The interface should allow:

```text
Product A
vs
Product B
vs
Product C
```

with:

- side-by-side comparison
- important differences highlighted
- missing information clearly marked
- source attribution
- freshness indicators

## Exit Criteria

A user can compare multiple products and identify meaningful differences.

---

# PHASE 7 — Recommendation Engine

## Status

**MVP CORE**

## Objective

Provide suitability-oriented recommendations based on user context and structured product information.

## Recommendation pipeline

```text
User Financial Profile
        ↓
User Need
        ↓
Eligibility / Constraints
        ↓
Product Data
        ↓
Deterministic Scoring
        ↓
AI Explanation
        ↓
Recommendation
```

## Recommendation output

The system should explain:

### Recommendation

> Which option appears most suitable?

### Why

> Which user factors influenced the result?

### Trade-offs

> What does the user give up or accept?

### Alternatives

> What other options may make sense?

### Confidence / data quality

> How complete and recent is the underlying information?

## Critical Rule

AI should explain and assist the decision.

AI must not fabricate product facts.

## Exit Criteria

A recommendation can be reproduced from identifiable inputs and explained to the user.

---

# PHASE 8 — Insurance Management

## Status

**MVP CORE**

## Objective

Move beyond discovery into management of existing policies.

## Deliverables

- [ ] add policy
- [ ] edit policy
- [ ] delete/archive policy
- [ ] policy details
- [ ] premium information
- [ ] renewal date
- [ ] insurer/product information
- [ ] coverage information
- [ ] policy status

Stored in:

```text
insurance_policies
```

## Renewal workflow

```text
Policy
 ↓
Renewal date detected
 ↓
Alert
 ↓
Review current policy
 ↓
Compare alternatives
 ↓
Decision
```

## Exit Criteria

A user can store and manage an existing insurance policy and receive useful renewal-related actions.

---

# PHASE 9 — Investment & SIP Tracking

## Status

**MVP CORE**

## Objective

Allow users to track investments and goals.

## Deliverables

- [ ] add investment
- [ ] edit investment
- [ ] investment overview
- [ ] SIP amount
- [ ] investment frequency
- [ ] investment date
- [ ] current value where supported
- [ ] goal association
- [ ] contribution tracking

Stored in:

```text
investments
```

## Important Rule

Do not imply guaranteed investment returns.

Historical performance must not be presented as guaranteed future performance.

## Exit Criteria

A user can understand their investment activity and its relationship to their financial goals.

---

# PHASE 10 — Financial Goals

## Status

**MVP**

## Objective

Connect financial decisions to user-defined goals.

Examples:

```text
Emergency Fund
Car
Home
Education
Travel
Retirement
```

## Deliverables

- [ ] create goal
- [ ] edit goal
- [ ] archive goal
- [ ] target amount
- [ ] target date
- [ ] current progress
- [ ] linked investments
- [ ] progress visualization
- [ ] contribution guidance

Stored in:

```text
financial_goals
```

## Exit Criteria

A user can create a financial goal and understand progress toward it.

---

# PHASE 11 — Watchlist

## Status

**MVP**

## Objective

Allow users to save products they want to revisit.

## Deliverables

- [ ] add product to watchlist
- [ ] remove product
- [ ] view saved products
- [ ] compare saved products
- [ ] attach notes where useful

Stored in:

```text
watchlist
```

## Exit Criteria

Users can save and revisit products without repeating discovery.

---

# PHASE 12 — Alerts & Financial Calendar

## Status

**MVP**

## Objective

Turn NIRNAY into a proactive assistant.

## Alerts

Examples:

```text
Policy renewal
Goal milestone
Scheduled SIP
Important financial action
Data freshness issue
```

## Financial calendar

Potential events:

- insurance renewals
- SIP dates
- financial goal milestones
- planned reviews
- user-created reminders

Stored in:

```text
alerts
financial_calendar
```

## Exit Criteria

Users can see important upcoming financial actions in one place.

---

# PHASE 13 — AI Copilot

## Status

**MVP / HIGH IMPACT**

## Objective

Add conversational intelligence without allowing uncontrolled AI behavior.

## AI capabilities

The copilot may help with:

- explaining financial terminology
- explaining product differences
- summarizing structured data
- explaining recommendation reasoning
- answering questions about the user's own financial dashboard
- suggesting actions based on available data
- helping users understand trade-offs

## AI architecture

Preferred pattern:

```text
User
 ↓
AI Interface
 ↓
Intent / Task Detection
 ↓
Trusted Application Data
 ↓
Financial Logic / Tools
 ↓
AI Reasoning
 ↓
Structured Response
 ↓
Trust / Safety Validation
 ↓
User
```

## AI should NOT independently invent:

- premiums
- coverage
- returns
- eligibility
- insurer terms
- fund characteristics
- regulatory claims
- partnerships
- discounts
- guarantees

## Exit Criteria

The AI can answer useful financial-product questions using trusted application context while clearly communicating uncertainty.

---

# PHASE 14 — Trust & Explainability Layer

## Status

**MVP-CRITICAL**

## Objective

Make every important financial result understandable and auditable.

## Required metadata

Where applicable:

```text
Source
Last Updated
Data Type
Calculation Method
Confidence / Completeness
```

## Result classification

Every important result should conceptually belong to one of:

```text
VERIFIED
USER PROVIDED
CALCULATED
AI GENERATED
```

## Explainability

Recommendations should answer:

```text
Why this?
Why not the alternative?
What assumptions were used?
What information is missing?
What should the user verify?
```

## Exit Criteria

A user can understand where important information came from and why NIRNAY reached a recommendation.

---

# PHASE 15 — Quality, Security & Reliability

## Status

**ONGOING**

This phase runs throughout the entire project.

## Required checks

### Code quality

- [ ] lint passes
- [ ] production build passes
- [ ] TypeScript errors resolved
- [ ] no unnecessary duplication
- [ ] no dead code
- [ ] no debug logs in production

### Security

- [ ] no secrets committed
- [ ] RLS verified
- [ ] authentication verified
- [ ] authorization verified
- [ ] server-only secrets protected
- [ ] input validation
- [ ] safe error handling
- [ ] AI prompt/data boundaries reviewed

### Data integrity

- [ ] financial amounts validated
- [ ] dates validated
- [ ] user ownership enforced
- [ ] database constraints enforced
- [ ] migrations reproducible

### UX

- [ ] loading states
- [ ] empty states
- [ ] errors
- [ ] mobile responsiveness
- [ ] keyboard accessibility
- [ ] readable financial numbers
- [ ] clear calls to action

---

# 6. Competition Demo Path

The competition demonstration should use a single coherent user journey.

Recommended flow:

```text
Landing Page
     ↓
Sign In
     ↓
Financial Profile
     ↓
Dashboard
     ↓
Discover
     ↓
Compare
     ↓
AI Recommendation
     ↓
Decision
     ↓
Add / Manage Product
     ↓
Renewal / Goal Tracking
     ↓
Alert
     ↓
Dashboard
```

The demo should demonstrate the product's **continuous value**, not just individual screens.

---

# 7. Demo Persona

The current fictional demo persona is:

```text
Name: Rahul
Age: 27
Monthly Income: ₹60,000
Insurance Budget: ₹15,000/year
Needs:
- Health insurance
- Car insurance
- Monthly SIP
- Car insurance renewal in April
```

This persona should be treated as **demo data**, not as a real customer.

Do not present fictional information as real market/user statistics.

---

# 8. MVP Priority Matrix

| Feature | Priority | Demo Importance | MVP |
|---|---|---:|---:|
| Authentication | P0 | High | Yes |
| User Profile | P0 | High | Yes |
| Financial Profile | P0 | High | Yes |
| Dashboard | P0 | Very High | Yes |
| Product Discovery | P0 | Very High | Yes |
| Product Comparison | P0 | Very High | Yes |
| Recommendation Engine | P0 | Very High | Yes |
| AI Explanation | P0 | Very High | Yes |
| Insurance Management | P1 | High | Yes |
| Investment Tracking | P1 | High | Yes |
| Financial Goals | P1 | High | Yes |
| Watchlist | P1 | Medium | Yes |
| Alerts | P1 | High | Yes |
| Financial Calendar | P1 | Medium | Yes |
| Advanced AI Copilot | P1 | High | Limited MVP |
| Automated external data ingestion | P2 | Medium | No |
| Advanced portfolio optimization | P2 | Medium | No |
| Automated financial transactions | P3 | High risk | No |
| Autonomous financial decisions | P3 | High risk | No |

---

# 9. Explicitly Out of MVP Scope

To protect the 2-day implementation window, the following should not become blockers.

## Not required for competition MVP

- direct insurance purchasing
- direct investment execution
- bank account linking
- payment processing
- autonomous money movement
- autonomous portfolio trading
- guaranteed savings claims
- guaranteed investment returns
- full financial advisory automation
- complex tax planning
- complex estate planning
- complete KYC workflow
- production-grade OCR pipeline
- nationwide real-time product ingestion
- enterprise-scale analytics
- advanced fraud detection
- complex financial forecasting
- unrestricted autonomous AI agents

These may become future roadmap items.

---

# 10. Future Roadmap

After the competition MVP, NIRNAY can evolve into a broader financial intelligence platform.

---

## Phase F1 — Verified Financial Data Platform

Potential capabilities:

- official product feeds
- structured insurer data
- mutual fund data integrations
- automated source updates
- source versioning
- data freshness monitoring
- change detection

Architecture:

```text
Official Sources
      ↓
Data Ingestion
      ↓
Validation
      ↓
Normalization
      ↓
Versioning
      ↓
NIRNAY Data Layer
```

---

## Phase F2 — Advanced Personalization

Potential capabilities:

- deeper financial profiling
- household-level planning
- personalized product ranking
- goal prioritization
- financial health scoring
- adaptive recommendations

All personalization must remain explainable.

---

## Phase F3 — Intelligent Monitoring

Potential capabilities:

```text
Monitor
 ↓
Detect Change
 ↓
Assess Impact
 ↓
Compare Alternatives
 ↓
Recommend Action
 ↓
User Approval
```

Examples:

- insurance premium change
- product feature change
- renewal approaching
- investment goal deviation
- important product update

---

## Phase F4 — Advanced Financial Planning

Potential capabilities:

- multi-goal planning
- emergency-fund planning
- insurance adequacy analysis
- long-term investment planning
- scenario analysis
- retirement planning
- education planning
- major-purchase planning

These features require additional financial safeguards and should not be rushed into the MVP.

---

## Phase F5 — Action Layer

Long-term vision:

```text
Discover
   ↓
Compare
   ↓
Recommend
   ↓
User Approves
   ↓
Execute / Redirect
   ↓
Track
```

Potential future integrations could allow users to act on decisions.

Any execution feature must require appropriate authorization and user confirmation.

---

# 11. AI Evolution Roadmap

NIRNAY's AI should evolve gradually.

## Level 1 — Explanation

```text
Explain this product.
Explain this comparison.
Explain this recommendation.
```

## Level 2 — Contextual Assistance

```text
Based on my profile, explain what matters.
```

## Level 3 — Recommendation Assistance

```text
Which options appear most suitable and why?
```

## Level 4 — Continuous Intelligence

```text
Detect important changes
and tell me what I should review.
```

## Level 5 — Agentic Assistance

```text
Research
→ Compare
→ Prepare recommendation
→ Request approval
→ Execute authorized action
→ Track outcome
```

The final level should only be introduced with strong authorization, auditability, and safety controls.

---

# 12. Engineering Evolution

The technical architecture should evolve only when justified by product requirements.

## Current

```text
Next.js
Firebase Auth
Supabase
PostgreSQL
AI services
```

## Future possibilities

- background jobs
- scheduled workers
- data ingestion services
- event-driven architecture
- caching
- observability
- analytics
- vector search
- document processing
- dedicated AI orchestration
- external financial data providers

Do not introduce infrastructure merely because it is technically interesting.

---

# 13. Definition of Roadmap Completion

A roadmap item is not complete merely because its UI exists.

A feature is considered complete when:

```text
UI
+
Validation
+
Business Logic
+
Database
+
Authorization
+
Error Handling
+
Loading State
+
Empty State
+
Trust Metadata
+
Testing
+
Production Build
```

are addressed to the degree appropriate for that feature.

---

# 14. Feature Readiness Levels

Every feature can be classified as:

### L0 — Idea

Only conceptual.

### L1 — Designed

UX and technical approach defined.

### L2 — Implemented

Code exists.

### L3 — Integrated

Frontend, backend, database, and required services work together.

### L4 — Verified

Feature has been tested and important failure paths handled.

### L5 — Demo Ready

Feature is stable enough for competition demonstration.

### L6 — Production Ready

Feature meets the project's security, reliability, trust, and maintainability standards.

---

# 15. Roadmap Change Policy

The roadmap is allowed to change.

However, changes should be intentional.

Before adding a new feature, ask:

1. Does it solve an important user problem?
2. Is it required for the current milestone?
3. Does it improve the competition demo?
4. Does it introduce significant technical risk?
5. Can the team finish it within the deadline?
6. Does it affect the existing architecture?
7. Does it introduce new security/privacy concerns?
8. Does it require new external services?
9. Does it weaken trust or explainability?
10. What existing task must be deprioritized if this is added?

If a feature is added, something else may need to move down the priority list.

---

# 16. Two-Day Competition Execution Strategy

Given the compressed implementation timeline, the team should follow this order.

## Stage 1 — Stabilize Foundation

- authentication
- database
- RLS
- environment configuration
- Git
- documentation

**Status: Completed**

---

## Stage 2 — Build the Main Experience

Priority:

```text
Application Shell
        ↓
Financial Profile
        ↓
Dashboard
```

---

## Stage 3 — Build the Differentiating Feature

Priority:

```text
Discover
   ↓
Compare
   ↓
Recommend
```

This is the central product experience.

---

## Stage 4 — Add Intelligence

Priority:

```text
Structured Recommendation
        ↓
AI Explanation
        ↓
AI Copilot
```

Do not start with an unrestricted chatbot.

---

## Stage 5 — Add Management

Priority:

```text
Insurance Policies
Investments
Goals
Watchlist
Alerts
```

---

## Stage 6 — Polish

- responsive design
- loading states
- empty states
- error handling
- animations where valuable
- typography
- spacing
- visual hierarchy
- demo data
- trust labels
- final navigation

---

## Stage 7 — Deploy

Target architecture:

```text
                    â”Œ───────────────â”
                    │    Vercel     │
                    │   Next.js     │
                    └───────┬───────┘
                            │
              â”Œ─────────────┼─────────────â”
              ↓             ↓             ↓
        Firebase Auth   Supabase DB    AI APIs
              │             │             │
              └─────────────┼─────────────┘
                            ↓
                         NIRNAY
```

Deployment must be validated before the final demo.

---

# 17. Final Demo Readiness Checklist

Before presenting NIRNAY:

## Application

- [ ] production URL works
- [ ] authentication works
- [ ] Google login works
- [ ] email login works
- [ ] dashboard loads
- [ ] core navigation works
- [ ] no broken links
- [ ] no visible debug UI

## Financial flow

- [ ] profile works
- [ ] discovery works
- [ ] comparison works
- [ ] recommendation works
- [ ] management works
- [ ] alerts/calendar work where demonstrated

## AI

- [ ] AI responses are useful
- [ ] AI uses trusted application context
- [ ] no fabricated product facts
- [ ] no guaranteed financial claims
- [ ] recommendation reasoning is understandable
- [ ] errors are handled gracefully

## Security

- [ ] no secrets in repository
- [ ] production environment variables configured
- [ ] RLS enabled
- [ ] user data isolation verified
- [ ] service account private key protected

## UX

- [ ] desktop experience polished
- [ ] mobile experience acceptable
- [ ] loading states present
- [ ] empty states present
- [ ] error states present
- [ ] financial numbers formatted correctly
- [ ] important actions obvious

## Demo

- [ ] demo account/data ready
- [ ] demo persona consistent
- [ ] demo flow rehearsed
- [ ] backup demo path available
- [ ] production deployment tested
- [ ] screenshots/video backup available

---

# 18. Roadmap Ownership

Ownership follows the team structure defined in `docs/TEAM.md`.

### Member 1 — Technical Lead / Architecture

Primary responsibility:

- architecture
- integration
- infrastructure
- technical quality
- deployment
- cross-team blockers

### Member 2 — Frontend / Product UX

Primary responsibility:

- UI
- UX
- application shell
- dashboards
- discovery
- comparison experience
- responsive design

### Member 3 — Backend / Data / Financial Engine

Primary responsibility:

- database
- migrations
- RLS
- financial data structures
- business logic
- comparison calculations
- recommendation scoring inputs

### Member 4 — AI / Intelligence

Primary responsibility:

- AI architecture
- prompts
- structured outputs
- recommendation explanation
- AI tools
- context retrieval
- AI safety
- hallucination prevention

Ownership does not remove the requirement for team-wide review of shared architecture.

---

# 19. AI Agent Roadmap Rules

AI coding agents must follow the current roadmap.

An AI agent must:

1. identify the current roadmap phase
2. confirm the requested task belongs to that phase
3. inspect existing implementation
4. avoid rebuilding completed foundation
5. avoid introducing unnecessary infrastructure
6. preserve security controls
7. preserve RLS
8. preserve trust metadata
9. avoid fabricating financial information
10. report exactly what changed

AI agents must not independently redefine the product roadmap.

If a requested task conflicts with the roadmap, the agent should explain the conflict before making large architectural changes.

---

# 20. What Success Looks Like

The short-term definition of success is not:

> "NIRNAY has many features."

It is:

> "A user can give NIRNAY their financial context, discover relevant products, compare meaningful differences, understand an explainable recommendation, manage existing financial decisions, and receive useful follow-up guidance — all through a trustworthy experience."

The long-term definition of success is:

> "NIRNAY becomes a continuously useful financial decision copilot that helps people make better-informed financial decisions without pretending to replace professional judgment or user control."

---

# 21. Final Roadmap Principle

Build the smallest system that demonstrates the complete NIRNAY vision.

Then improve it systematically.

```text
FOUNDATION
    ↓
PROFILE
    ↓
DASHBOARD
    ↓
DISCOVER
    ↓
COMPARE
    ↓
RECOMMEND
    ↓
MANAGE
    ↓
TRACK
    ↓
DETECT
    ↓
OPTIMIZE
```

Every future feature should strengthen this loop.

**Do not build features merely because they are possible. Build them because they make the user's financial decision journey better, safer, clearer, or more actionable.**
```

---
