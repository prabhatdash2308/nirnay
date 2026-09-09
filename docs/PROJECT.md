# NIRNAY — Project Definition

> **NIRNAY — Your Financial Protection & Investment Copilot**

**Status:** MVP in active development
**Delivery horizon:** 2 days from the current project checkpoint
**Project type:** Fintech / Financial Protection / Investment Intelligence
**Primary objective:** Build, integrate, deploy, and ship a coherent production-oriented MVP.

---

# 1. Executive Summary

NIRNAY is an AI-powered financial protection and investment copilot designed to help users make better-informed financial decisions.

The product brings several activities that are normally fragmented across insurance websites, investment platforms, comparison websites, spreadsheets, financial applications, and personal notes into one user-centric experience.

NIRNAY's initial focus is:

- Health insurance
- Motor insurance
- Life insurance
- SIPs
- Mutual funds

The product is built around a simple progression:

> **Discover → Compare → Decide → Manage → Optimize**

Over time, this becomes a continuous financial management loop:

> **Track → Detect → Compare → Recommend → Act → Track**

NIRNAY is not intended to blindly automate financial decisions.

Instead, the system combines:

1. Verified financial/product information
2. Deterministic calculations and business rules
3. Suitability-oriented recommendation logic
4. Explainable AI
5. A unified personal financial context

The result should feel like a financial decision-support system rather than a generic chatbot.

---

# 2. The Problem

Financial products are often difficult for ordinary users to evaluate.

A user may have to:

- search across multiple providers
- understand unfamiliar terminology
- compare plans manually
- identify important exclusions and conditions
- determine whether a product fits their budget
- track existing policies separately
- remember renewal dates
- monitor investments separately
- evaluate whether their current financial decisions still fit their goals
- repeatedly perform the same research when circumstances change

The problem is not simply a lack of financial information.

There is often **too much information, fragmented across too many places**, with different terminology, levels of detail, and update cycles.

This creates several problems.

## 2.1 Information Fragmentation

Important financial information may be distributed across:

- insurer websites
- fund/provider websites
- policy documents
- product brochures
- comparison platforms
- investment platforms
- financial applications
- personal records

Users must assemble the information themselves.

---

## 2.2 Comparison Difficulty

Two products may appear similar while differing in important details.

Users may struggle to compare:

- coverage
- exclusions
- limits
- premiums
- fees
- eligibility
- benefits
- terms
- risk
- suitability
- investment characteristics

A comparison interface must therefore do more than place two product names next to each other.

---

## 2.3 Decision Difficulty

Even after collecting information, the user still has to answer:

> "Which option actually makes sense for me?"

This requires considering the user's own context.

Examples include:

- income
- budget
- existing coverage
- existing investments
- financial goals
- time horizon
- risk preferences
- current obligations

---

## 2.4 Management Difficulty

Buying a product is only one part of the financial journey.

After purchase, users still need to:

- track policies
- remember renewals
- monitor investments
- review goals
- track important dates
- identify actions that may need attention

NIRNAY therefore includes a management layer rather than stopping at discovery and comparison.

---

# 3. The NIRNAY Solution

NIRNAY combines discovery, comparison, decision support, and management into a single financial workspace.

The core concept is:

```text
User Context
     ↓
Discover
     ↓
Compare
     ↓
Evaluate Suitability
     ↓
Explain Recommendation
     ↓
Decide
     ↓
Manage
     ↓
Track
     ↓
Detect Changes
     ↓
Recommend Again
```

This creates a continuous relationship between the user and their financial decisions.

---

# 4. Product Philosophy

NIRNAY follows five major principles.

## 4.1 Understand Before Recommending

The system should understand relevant user context before making suitability-oriented recommendations.

A recommendation should not be based only on:

- popularity
- arbitrary ranking
- product name
- generic AI reasoning

It should consider relevant user inputs and verified product information.

---

## 4.2 Facts Before AI

The system architecture follows:

```text
Verified Facts
      ↓
Calculations / Rules
      ↓
Recommendation
      ↓
AI Explanation
```

AI is not the source of financial truth.

AI should operate on information that the system can ground and explain.

---

## 4.3 Explain Decisions

When NIRNAY recommends something, users should be able to understand:

- what was considered
- why the option was selected
- what alternatives exist
- which user inputs influenced the result
- which product characteristics mattered
- what limitations or caveats apply

A recommendation without an understandable reason is not sufficient for the NIRNAY experience.

---

## 4.4 Continuous Management

NIRNAY should not treat the user's financial decision as finished after purchase.

The system should support:

- tracking
- reminders
- renewals
- goals
- watchlists
- alerts
- portfolio context
- future recommendations

---

## 4.5 Trust Over Hype

NIRNAY must prioritize accuracy and transparency over impressive-looking but unsupported claims.

The product must never manufacture:

- financial statistics
- product benefits
- premiums
- returns
- fees
- offers
- partnerships
- customer numbers
- performance claims
- regulatory claims

If information is unknown, unavailable, stale, or uncertain, the product should communicate that clearly.

---

# 5. Target Users

The initial product is designed for users who need help navigating personal financial protection and investments without wanting to manually manage information across many different platforms.

A representative initial user may be:

- a young working professional
- earning a regular monthly income
- managing insurance and investments independently
- interested in financial planning
- comfortable using digital applications
- looking for clarity rather than financial jargon

The product should remain understandable to users who are not financial experts.

---

# 6. Representative Demo Persona

For product demonstrations and initial UX development, the team may use the following fictional persona.

> **Important:** This is a fictional demo persona and must not be represented as a real NIRNAY customer.

### Rahul

- Age: 27
- Monthly income: ₹60,000
- Annual insurance budget: ₹15,000
- Needs health insurance
- Needs car insurance
- Invests through monthly SIPs
- Car insurance renewal occurs in April

Rahul represents a user who wants to:

1. understand what financial protection he needs
2. compare suitable options
3. make a decision
4. track what he owns
5. remember upcoming renewals
6. monitor investments
7. receive useful recommendations when his financial context changes

The persona exists to help the team build a coherent demo journey.

It is not a production assumption about all users.

---

# 7. Core User Journey

The intended primary journey is:

```text
Landing
   ↓
Authentication
   ↓
Onboarding
   ↓
Financial Profile
   ↓
Dashboard
   ↓
Discover
   ↓
Compare
   ↓
Recommendation
   ↓
Decision
   ↓
Manage
   ↓
Goals / Watchlist / Calendar / Alerts
```

The ideal demo should demonstrate a meaningful portion of this journey without requiring the evaluator to understand the underlying architecture.

---

# 8. Core Product Loop

## Discover

Help users find relevant financial products and financial actions.

Examples:

- health insurance
- motor insurance
- life insurance
- SIPs
- mutual funds

---

## Compare

Allow users to compare relevant options using structured attributes.

Comparison should prioritize meaningful decision factors rather than visual complexity.

---

## Decide

Help users evaluate whether an option fits their context.

This may include:

- budget compatibility
- product characteristics
- financial goals
- existing products
- relevant user preferences
- risk-related considerations

---

## Manage

Allow users to maintain a unified view of financial products they already own.

Examples:

- policies
- investments
- goals
- renewal dates
- important financial dates

---

## Optimize

Identify opportunities for review or improvement.

Examples:

- upcoming renewal
- under-addressed goal
- portfolio review
- watchlisted product change
- potential mismatch between user context and current choices

Optimization must not imply guaranteed financial improvement.

---

# 9. Continuous Financial Loop

NIRNAY's long-term model is:

```text
TRACK
  ↓
DETECT
  ↓
COMPARE
  ↓
RECOMMEND
  ↓
ACT
  ↓
TRACK
```

### Track

Maintain information about:

- policies
- investments
- goals
- financial dates
- watchlisted products

### Detect

Identify relevant events or changes.

Examples:

- renewal approaching
- goal approaching
- tracked item requiring review
- relevant product/data update

### Compare

Evaluate available alternatives where appropriate.

### Recommend

Provide a suitability-oriented suggestion using available verified information.

### Act

Guide the user toward an appropriate next action.

### Track Again

Continue monitoring the user's financial context.

---

# 10. Initial MVP Scope

The MVP should include enough functionality to demonstrate the complete NIRNAY concept.

## Authentication

- Email/password signup
- Email/password sign-in
- Google sign-in
- Sign-out
- Authenticated application access

---

## Onboarding

Collect the minimum financial context required for the MVP.

Potential information includes:

- name
- income
- insurance budget
- financial goals
- existing policies
- existing investments
- relevant preferences

The onboarding flow should remain short and understandable.

---

## Dashboard

The dashboard should provide a concise view of the user's financial context.

Potential sections:

- financial summary
- protection overview
- investment overview
- goals
- upcoming renewals
- alerts
- recommended actions

---

## Discover

Initial categories:

- Health Insurance
- Motor Insurance
- Life Insurance
- SIPs
- Mutual Funds

---

## Compare

The comparison experience should allow meaningful side-by-side evaluation.

It should emphasize:

- important product attributes
- user relevance
- differences
- trade-offs
- source/provenance information where available

---

## Manage

Initial management areas:

- Insurance
- Investments
- Goals
- Calendar
- Watchlist
- Alerts

---

## Intelligence

Initial intelligence should provide:

- deterministic calculations
- suitability-oriented scoring
- recommendation reasoning
- comparison insights
- financial context analysis

---

## AI Copilot

The AI copilot should help users:

- understand financial terminology
- understand comparison results
- ask questions about products
- understand recommendation reasoning
- summarize verified information
- navigate NIRNAY
- identify relevant next actions

The AI must remain grounded in available data.

---

# 11. Explicit Non-Goals

The initial MVP does **not** attempt to become a complete financial institution or financial platform.

The following are outside the immediate MVP unless explicitly approved:

- executing insurance purchases
- executing investment trades
- becoming an insurer
- becoming a mutual fund provider
- acting as a bank
- guaranteeing investment returns
- guaranteeing savings
- providing legally binding financial advice
- replacing licensed financial professionals
- supporting every financial product category
- building a full trading platform
- building a complete tax filing system
- building a complete loan marketplace
- building a full accounting system
- building a proprietary financial-data exchange

The purpose of the MVP is to demonstrate the NIRNAY decision-support experience.

---

# 12. What Makes NIRNAY Different

NIRNAY's differentiation is not simply:

> "We use AI."

AI alone is not the product.

The intended differentiation is the combination of:

```text
Personal Financial Context
        +
Verified Product Information
        +
Structured Comparison
        +
Deterministic Intelligence
        +
Explainable AI
        +
Ongoing Management
```

This creates a more complete financial decision-support loop.

---

# 13. Financial Information Model

NIRNAY should distinguish three types of information.

## 13.1 Verified Facts

Information originating from identified sources.

Examples:

- product characteristics
- documented benefits
- fees
- eligibility
- policy terms
- fund metadata

---

## 13.2 Calculated Information

Information generated deterministically from known inputs.

Examples:

- budget calculations
- comparison scores
- allocation calculations
- goal projections
- portfolio summaries

---

## 13.3 AI-Generated Information

Natural-language output generated by an AI model.

Examples:

- explanations
- summaries
- conversational guidance
- question answering
- recommendations phrased in natural language

AI-generated information must not silently override verified facts.

---

# 14. Recommendation Philosophy

NIRNAY recommendations should answer:

> **"Why does this appear suitable for this user?"**

rather than simply:

> **"This is the best product."**

Recommendations should be explainable.

A conceptual recommendation pipeline is:

```text
User Profile
     +
Financial Goals
     +
Existing Products
     +
Budget
     +
Verified Product Facts
     ↓
Eligibility / Compatibility
     ↓
Deterministic Scoring
     ↓
Recommendation
     ↓
Explanation
```

The exact implementation is defined in the architecture and intelligence documentation.

---

# 15. User Data Philosophy

NIRNAY stores information necessary to provide the product experience.

User-owned information must remain associated with the authenticated user.

Examples include:

- profile information
- financial profile
- policies
- investments
- goals
- watchlist items
- alerts
- calendar entries

Database-level Row Level Security must prevent users from accessing other users' private records.

---

# 16. Trust and Transparency

Important financial information should be presented with appropriate context.

Where applicable, the UI should expose:

- source
- source URL
- last verified date
- data update date
- relevant caveats

The exact provenance requirements are defined in:

[`TRUST_AND_DATA_POLICY.md`](./TRUST_AND_DATA_POLICY.md)

---

# 17. AI Safety Philosophy

NIRNAY's AI must not become a hallucination engine.

The AI must not:

- invent financial facts
- invent product features
- invent premiums
- invent returns
- invent fees
- invent eligibility requirements
- invent offers
- invent regulatory requirements
- invent citations
- fabricate unavailable data
- claim certainty where information is uncertain

When the system does not have sufficient information, the AI should say so.

---

# 18. Product UX Principles

NIRNAY should feel:

- trustworthy
- calm
- intelligent
- modern
- clear
- premium
- useful
- understandable

It should not feel:

- noisy
- gimmicky
- overly corporate
- crypto-like
- casino-like
- artificially futuristic
- overloaded with unnecessary animations
- dominated by chatbot UI

The design system is defined separately in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

---

# 19. Technical Philosophy

NIRNAY should be built as a real application rather than a static prototype.

Important principles:

### Reusable components

Repeated UI patterns should become reusable components.

### Clear boundaries

Authentication, data, business logic, UI, and AI should have understandable responsibilities.

### Database integrity

Data relationships and access control must be enforced at the database layer where appropriate.

### Security

Secrets must remain server-side and protected.

### Determinism

Financial calculations should be deterministic and testable.

### AI grounding

AI should operate on verified application context.

### Observability

Important failures should be diagnosable.

### Maintainability

Code should remain understandable to another team member.

---

# 20. Two-Day Delivery Philosophy

The current objective is not maximum feature count.

The objective is:

> **A coherent, working, deployable MVP that demonstrates the NIRNAY concept convincingly.**

Therefore the team should prioritize:

```text
Core User Journey
        ↓
Reliable Data
        ↓
Working Intelligence
        ↓
AI Integration
        ↓
Visual Polish
        ↓
Secondary Features
```

If time becomes constrained, remove optional features rather than destabilizing the core journey.

---

# 21. Success Criteria

The MVP is successful if a new user can reasonably understand and experience:

1. What NIRNAY is.
2. Why it exists.
3. Who it is for.
4. How their financial context is represented.
5. How products can be discovered.
6. How products can be compared.
7. How NIRNAY helps with the decision.
8. Why a recommendation was made.
9. How existing financial products are managed.
10. How AI assists the user.
11. Why NIRNAY's financial information should be trusted.
12. That the application is a functioning product rather than a collection of mock screens.

---

# 22. Demo Success

The final demonstration should tell one coherent story.

Recommended narrative:

```text
Rahul enters NIRNAY
        ↓
Creates/signs into account
        ↓
Completes financial profile
        ↓
Sees financial dashboard
        ↓
Needs insurance / reviews protection
        ↓
Discovers relevant options
        ↓
Compares options
        ↓
Receives explainable recommendation
        ↓
Understands why
        ↓
Adds/manages financial product
        ↓
Tracks renewal / goal / investment
        ↓
Uses AI Copilot to understand the decision
```

The demo should emphasize the product's complete loop rather than showing every available screen.

---

# 23. Constraints

The current project has significant delivery constraints.

### Time

Approximately two days remain for:

- development
- integration
- deployment
- testing
- demo preparation
- submission

### Team

Four contributors are working in parallel.

### Infrastructure

The project should prioritize free or low-cost services suitable for an MVP.

### Accuracy

Financial information must not be fabricated for the sake of completing UI.

### Collaboration

The shared Git repository must remain stable.

---

# 24. Project Team

The project has four primary contributors.

| Role | Primary Responsibility |
|---|---|
| Member 1 | Technical Lead / Architecture |
| Member 2 | Frontend / Product UX |
| Member 3 | Backend / Data / Financial Engine |
| Member 4 | AI / Intelligence |

Detailed responsibilities are defined in:

[`TEAM.md`](./TEAM.md)

and the individual assignment documents under:

```text
docs/members/
```

---

# 25. Engineering Ownership

Shared infrastructure should not be changed casually.

Particular coordination is required for:

- authentication
- Firebase configuration
- Supabase configuration
- database schema
- RLS policies
- shared application layout
- design-system primitives
- environment variables
- deployment configuration

A developer should communicate with the relevant owner before making changes in another member's core area.

---

# 26. Current Technical Foundation

At the current project checkpoint, NIRNAY has:

- Next.js 16.3.4
- React 19.2.8
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Base UI
- Firebase Authentication
- Firebase Admin SDK
- Firebase custom claims
- Supabase
- PostgreSQL
- Supabase Row Level Security
- Firebase third-party authentication integration
- initial NIRNAY database schema
- database migrations
- user profile persistence
- local Firebase → Supabase Data API verification

The detailed technical stack is defined in [`TECH_STACK.md`](./TECH_STACK.md).

---

# 27. Current Database Foundation

The initial schema contains:

- `user_profiles`
- `financial_profiles`
- `insurance_policies`
- `investments`
- `financial_goals`
- `watchlist`
- `alerts`
- `financial_calendar`

User-owned tables use authenticated user identity and Row Level Security.

The schema is maintained through Supabase migrations.

See [`DATABASE.md`](./DATABASE.md).

---

# 28. Current Authentication Foundation

The current authentication architecture uses:

```text
Firebase Authentication
        ↓
Firebase ID Token
        ↓
Firebase custom claim:
role = authenticated
        ↓
Supabase Firebase third-party authentication
        ↓
Supabase Data API
        ↓
PostgreSQL RLS
```

The Firebase Admin SDK is server-only.

The service-account credentials are not part of the repository.

See [`AUTHENTICATION.md`](./AUTHENTICATION.md) and [`SECURITY.md`](./SECURITY.md).

---

# 29. Repository Principle

The repository is the implementation source of truth.

Documentation describes intended behavior and architecture.

When documentation and code disagree:

1. inspect the implementation
2. determine whether the implementation or documentation is outdated
3. make the appropriate coordinated change
4. update documentation if necessary

Do not silently assume one is correct.

---

# 30. Change Management

Major changes should be evaluated against:

- product scope
- architecture
- security
- database implications
- user experience
- AI safety
- delivery timeline
- team ownership

A feature that sounds useful but threatens the core MVP should be deferred.

---

# 31. What the Team Should Optimize For

Every contributor should optimize for:

### Clarity

Another developer should understand the implementation.

### Reliability

The application should behave predictably.

### Trust

Financial information should be supported and transparent.

### Integration

Features should work together as one product.

### Speed

The two-day constraint requires focused execution.

### Demonstrability

The final product must be easy to understand during a short demo.

---

# 32. Final Project Principle

NIRNAY is not trying to prove that AI can generate a lot of screens.

NIRNAY is trying to demonstrate that AI can be integrated into a meaningful financial decision-support experience while maintaining:

- trustworthy information
- understandable recommendations
- secure user data
- useful financial context
- coherent product design
- maintainable engineering

The standard is therefore:

> **Build less, but make what we build work together.**

---

# 33. Project North Star

The north-star question for every feature is:

> **Does this help a user make, understand, or manage a better-informed financial decision?**

If the answer is no, the feature should probably not be part of the current MVP.

-
