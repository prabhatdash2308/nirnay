# NIRNAY — Product Specification

> **NIRNAY — Your Financial Protection & Investment Copilot**

**Document type:** Product Specification
**Status:** MVP
**Audience:** Product, Design, Frontend, Backend, AI, Technical Lead, AI Coding Agents
**Priority:** Source of truth for intended MVP product behavior

---

# 1. Product Overview

NIRNAY is a financial protection and investment copilot that helps users:

- understand their financial context
- discover relevant financial products
- compare alternatives
- understand trade-offs
- receive suitability-oriented recommendations
- manage existing financial products
- track goals and important dates
- receive alerts
- interact with an AI copilot grounded in available information

The MVP focuses on:

- Health Insurance
- Motor Insurance
- Life Insurance
- SIPs
- Mutual Funds

The product is designed around:

> **Discover → Compare → Decide → Manage → Optimize**

and the long-term continuous loop:

> **Track → Detect → Compare → Recommend → Act → Track**

---

# 2. Product Objective

The objective of the MVP is to demonstrate that NIRNAY can turn fragmented financial decision-making into a coherent digital workflow.

A user should be able to move from:

> "I need to make a financial decision."

to:

> "I understand my options, I understand why one may suit my situation, and I can manage the decision afterward."

The product should minimize unnecessary complexity while providing enough information for meaningful decisions.

---

# 3. Product Principles

## 3.1 User Context First

NIRNAY should use relevant user context when providing personalized experiences.

Relevant context may include:

- age
- income
- budget
- existing products
- financial goals
- investment preferences
- relevant financial priorities

Only collect information that is useful to the experience.

---

## 3.2 Facts Before Recommendations

The system should establish relevant product facts before generating recommendations.

```text
Product Data
     ↓
Validation
     ↓
Comparison
     ↓
Suitability Logic
     ↓
Recommendation
```

---

## 3.3 Explainability

Every meaningful recommendation should have understandable reasoning.

A user should be able to answer:

- Why was this recommended?
- What factors mattered?
- What alternatives exist?
- What trade-offs should I know?
- What information was used?

---

## 3.4 No False Certainty

NIRNAY must distinguish between:

- verified facts
- calculations
- assumptions
- recommendations
- AI-generated explanations

The interface should never present uncertain information as confirmed fact.

---

## 3.5 Management After Decision

NIRNAY should continue to be useful after a user chooses a financial product.

The product therefore includes:

- policies
- investments
- goals
- calendar
- watchlist
- alerts

---

# 4. Primary User

The primary MVP audience is a digitally comfortable individual who wants a simpler way to understand and manage financial protection and investment decisions.

The experience should work for someone who:

- may not have deep financial knowledge
- wants clear explanations
- wants comparisons rather than raw information
- has limited time
- wants a consolidated financial view
- prefers guided decisions

---

# 5. Representative Demo Persona

The MVP may use the fictional persona:

## Rahul

| Attribute | Value |
|---|---|
| Age | 27 |
| Monthly income | ₹60,000 |
| Annual insurance budget | ₹15,000 |
| Health insurance | Required |
| Car insurance | Required |
| SIP | Monthly investment |
| Car insurance renewal | April |

Rahul is a fictional demonstration persona.

He should be used to demonstrate the complete product journey.

---

# 6. Primary User Journey

The primary MVP flow is:

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
Track / Alert / Review
```

The exact screens may evolve during implementation, but the conceptual journey should remain coherent.

---

# 7. Application Areas

The intended application structure is:

```text
/app
â”œâ”€â”€ Dashboard
â”œâ”€â”€ Discover
â”‚   â”œâ”€â”€ Insurance
â”‚   â””â”€â”€ Investments
â”œâ”€â”€ Compare
â”œâ”€â”€ Manage
â”‚   â”œâ”€â”€ Insurance
â”‚   â””â”€â”€ Investments
â”œâ”€â”€ Goals
â”œâ”€â”€ Calendar
â”œâ”€â”€ Watchlist
â””â”€â”€ Alerts
```

Authentication and onboarding sit before the authenticated application.

---

# 8. Landing Page

## Purpose

Explain NIRNAY quickly and motivate the user to begin.

## Required content

The landing page should communicate:

### What NIRNAY is

A financial protection and investment copilot.

### What it helps with

- Compare
- Decide
- Manage
- Save

### Why it is useful

It brings financial context, comparison, intelligence, and management into one experience.

### Primary CTA

The user should have a clear path to:

- Get Started
- Sign In

The exact wording may vary according to the final design.

---

# 9. Authentication

Authentication is powered by Firebase.

The MVP supports:

- Email/password signup
- Email/password login
- Google login
- Logout

After successful authentication, the user should enter the appropriate application flow.

New users should proceed toward onboarding.

Existing users should proceed toward their authenticated experience.

---

# 10. Onboarding

## Purpose

Collect enough information to personalize the initial NIRNAY experience.

The onboarding experience should be:

- short
- progressive
- understandable
- mobile-friendly
- easy to complete

---

## 10.1 Potential Profile Inputs

Depending on final MVP scope, onboarding may collect:

### Identity

- name

### Financial context

- monthly income
- annual insurance budget

### Protection needs

- health insurance requirement
- motor insurance requirement
- life insurance requirement

### Investments

- current investments
- SIP information
- investment goals

### Goals

- financial goal
- target amount
- target timeframe

---

## 10.2 Onboarding Principle

Do not ask for every possible financial detail.

Only collect information that contributes to:

- recommendations
- dashboard personalization
- comparisons
- financial tracking

---

# 11. Financial Profile

The financial profile represents the user's high-level financial context.

It may contain:

```text
Income
Insurance Budget
Goals
Existing Protection
Existing Investments
Preferences
```

The profile is used by the intelligence layer to contextualize recommendations.

---

# 12. Dashboard

## Purpose

Provide a single financial overview immediately after onboarding.

The dashboard should answer:

> "What is happening with my finances and what should I pay attention to?"

---

## 12.1 Dashboard Sections

Potential sections include:

### Financial Overview

Examples:

- monthly income
- protection budget
- investment contribution
- tracked financial items

### Protection

Examples:

- health insurance
- motor insurance
- life insurance
- renewal status

### Investments

Examples:

- SIP contribution
- tracked investments
- portfolio summary

### Goals

Examples:

- active goals
- progress
- upcoming target

### Alerts

Examples:

- upcoming renewal
- relevant review
- financial action

### Recommended Actions

Examples:

- complete profile
- review coverage
- compare alternatives
- review a goal
- inspect an alert

---

# 13. Discover

## Purpose

Help users find relevant products.

Initial categories:

```text
Insurance
â”œâ”€â”€ Health Insurance
â”œâ”€â”€ Motor Insurance
â””â”€â”€ Life Insurance

Investments
â”œâ”€â”€ SIPs
â””â”€â”€ Mutual Funds
```

---

## 13.1 Discover Experience

A discovery screen should provide:

- category navigation
- product cards/list
- relevant attributes
- filtering where useful
- sorting where useful
- comparison entry point
- product details entry point
- source/provenance information where applicable

---

# 14. Product Card

A product card should expose only useful information.

Potential information:

- product name
- provider
- category
- key feature
- important metric
- suitability indicator
- source/update information

Avoid filling cards with every available field.

The purpose of a card is to support discovery, not replace the detailed comparison experience.

---

# 15. Product Details

A product details view should provide enough information for the user to understand the product before comparing or deciding.

Potential sections:

### Overview

What the product is.

### Key Features

Important characteristics.

### Costs

Relevant premium/fee information where verified and available.

### Eligibility

Relevant documented criteria.

### Important Conditions

Important limitations, exclusions, or caveats.

### Why It May Fit

User-context-aware explanation.

### Source

Where the information came from.

### Last Updated / Verified

When the information was last checked.

---

# 16. Compare

## Purpose

Allow users to understand differences between products.

Comparison should not simply show two cards side-by-side.

It should highlight meaningful differences.

---

## 16.1 Comparison Categories

Depending on product type:

### Insurance

Potential comparison factors:

- premium
- coverage
- coverage amount
- important benefits
- exclusions
- waiting periods
- deductibles
- eligibility
- claim-related information where verified

### Investments

Potential factors:

- category
- risk characteristics
- expense-related information
- minimum investment
- historical information where legitimately available
- investment objective
- relevant fund characteristics

The exact fields depend on available verified data.

---

# 17. Comparison Rules

Comparison must:

- use structured data
- make differences obvious
- avoid misleading rankings
- distinguish verified facts from calculations
- show missing data honestly
- avoid implying that one product is universally best

---

# 18. Recommendation

## Purpose

Help the user interpret the comparison.

The recommendation layer should consider:

```text
User Context
+
Product Facts
+
Budget
+
Goals
+
Existing Products
+
Relevant Preferences
```

The result should be suitability-oriented rather than an absolute declaration of superiority.

---

# 19. Recommendation Output

A recommendation may include:

### Recommendation

Example:

> "This option appears to fit your current requirements better."

### Why

A concise explanation of the strongest factors.

### Strengths

What makes the option suitable.

### Trade-offs

What the user should consider.

### Alternatives

Other reasonable options.

### Important Caveats

Relevant limitations or missing information.

---

# 20. Recommendation Scoring

Where practical, recommendation scoring should be deterministic.

Conceptually:

```text
Eligibility
      ↓
Budget Fit
      ↓
Requirement Fit
      ↓
Goal Fit
      ↓
Preference Fit
      ↓
Product Characteristics
      ↓
Score
      ↓
Recommendation
```

The exact scoring implementation is defined by the intelligence/backend work.

AI should not arbitrarily invent the score.

---

# 21. Explainability

The UI should make recommendation reasoning understandable.

Example structure:

```text
Why this recommendation?

✓ Fits your stated budget
✓ Matches your selected protection need
✓ Meets important requirements
✓ Provides relevant features

Trade-offs

â€¢ Higher cost than the lowest-cost option
â€¢ Some information requires verification
```

The actual statements must be generated from available facts.

---

# 22. Manage

## Purpose

Provide an ongoing view of products and financial activities already associated with the user.

Manage contains:

```text
Insurance
Investments
Goals
Calendar
Watchlist
Alerts
```

---

# 23. Insurance Management

Users should be able to track insurance policies.

Potential fields:

- policy name
- provider
- policy type
- policy number
- premium
- coverage
- start date
- renewal date
- status
- notes

Sensitive information should be handled carefully.

---

# 24. Investment Management

Users should be able to track investments.

Potential information:

- investment name
- provider
- category
- SIP amount
- frequency
- current value where available
- invested amount where available
- goal association
- notes

The MVP should avoid pretending to have real-time market data unless such data is actually available.

---

# 25. Goals

Goals allow users to connect financial activity to outcomes.

A goal may contain:

- goal name
- target amount
- current amount
- target date
- contribution amount
- status

Example:

```text
Emergency Fund
Target: ₹3,00,000
Current: ₹1,20,000
Progress: 40%
```

The calculation should be deterministic.

---

# 26. Calendar

The financial calendar provides a timeline of important financial events.

Examples:

- insurance renewal
- SIP date
- goal target date
- review date
- other user-defined financial events

The calendar should make upcoming actions easy to identify.

---

# 27. Watchlist

The watchlist allows users to save products or financial items for later review.

Potential actions:

- add to watchlist
- remove from watchlist
- open details
- compare
- review updates

A watchlist item should not imply that NIRNAY has verified a current price or availability unless it actually has.

---

# 28. Alerts

Alerts surface events that may require user attention.

Examples:

- policy renewal approaching
- goal deadline approaching
- watchlisted information changed
- incomplete profile
- important review reminder

Alerts should be useful rather than excessive.

---

# 29. AI Copilot

## Purpose

The AI Copilot is a conversational interface for understanding and navigating NIRNAY.

It should help users:

- understand financial terminology
- understand product information
- understand comparisons
- understand recommendations
- summarize information
- navigate the application
- identify relevant next actions

---

# 30. AI Copilot Boundaries

The AI must not become the financial database.

It must not independently invent:

- premiums
- coverage
- returns
- fees
- eligibility
- offers
- product features
- statistics
- regulatory claims

The AI should use available structured data and verified product information whenever possible.

---

# 31. AI Response Model

A conceptual AI flow is:

```text
User Question
      ↓
Intent Detection
      ↓
Relevant Application Context
      ↓
Verified Product / Financial Data
      ↓
Rules / Calculations
      ↓
AI Explanation
      ↓
User
```

If relevant information is unavailable:

> The AI should acknowledge the limitation rather than fabricate an answer.

---

# 32. AI Examples

### Good

> "Based on the information currently stored in your profile, this option fits your stated insurance budget better."

### Better

> "This option appears to fit your stated budget and selected coverage requirements. The comparison also shows a higher premium than Option B, so the trade-off is cost versus the additional documented features."

### Bad

> "This is definitely the best insurance policy for you."

### Unacceptable

> "This insurer has a 99% claim approval rate."

unless the application has a verified source for that specific claim.

---

# 33. Notifications and Recommendations

NIRNAY should prioritize actionable information.

Examples:

```text
Your car insurance renewal is approaching.
        ↓
Review your current policy
        ↓
Compare available alternatives
        ↓
Decide whether to continue or review
```

The system should avoid generating unnecessary alerts simply because an event exists.

---

# 34. User Actions

The primary actions should be clear.

Examples:

- Get Started
- Sign In
- Complete Profile
- Explore
- Compare
- View Details
- Add to Watchlist
- Add Policy
- Add Investment
- Create Goal
- Review Recommendation
- Ask Copilot
- Manage
- View Calendar

---

# 35. Empty States

Empty states should guide users.

Examples:

### No policies

> "You haven't added any insurance policies yet."

CTA:

> "Add Policy"

### No investments

> "Track your investments here."

CTA:

> "Add Investment"

### No goals

> "Create a goal to start planning toward something specific."

CTA:

> "Create Goal"

### Empty watchlist

> "Save products here to compare or review later."

CTA:

> "Explore Products"

---

# 36. Loading States

Loading states should:

- preserve layout
- communicate progress
- avoid sudden layout shifts
- use skeletons where appropriate
- avoid unnecessary full-screen loaders

---

# 37. Error States

Errors should be:

- understandable
- actionable
- non-technical where possible

Avoid exposing raw database or infrastructure errors to normal users.

Instead of:

> `PGRST116`

Prefer:

> "We couldn't load your profile. Please try again."

Technical details should remain available to developers through appropriate logs.

---

# 38. Responsive Product

NIRNAY must work across:

- desktop
- laptop
- tablet
- mobile

The primary demo may be desktop-oriented, but mobile layouts should not be intentionally broken.

---

# 39. Accessibility

The MVP should follow practical accessibility standards.

Important requirements:

- keyboard navigation
- visible focus states
- readable contrast
- semantic HTML
- accessible labels
- form error messaging
- meaningful button names
- no information conveyed only by color
- responsive text sizing

---

# 40. Product Navigation

Authenticated users should have a consistent navigation structure.

Recommended conceptual navigation:

```text
Dashboard
Discover
Compare
Manage
Goals
Calendar
Watchlist
Alerts
```

The exact visual implementation belongs to the frontend/design owner.

---

# 41. Application Shell

The authenticated shell should provide:

- persistent navigation
- user identity
- primary page content
- responsive navigation
- consistent spacing
- global feedback mechanisms where necessary

The shell should feel like one application rather than separate pages.

---

# 42. Data States

Every major feature should account for:

```text
Loading
Success
Empty
Error
Unauthorized
Unavailable
```

Do not design only the successful state.

---

# 43. Product Trust Indicators

Where financial/product data is shown, consider displaying:

- verified source
- source link
- last updated
- last verified
- information availability
- relevant disclaimer

The UI should not overload users with technical metadata.

Trust information should be visible where it affects a decision.

---

# 44. Financial Disclaimer Philosophy

NIRNAY should not represent itself as replacing professional financial advice.

The exact wording should be finalized during implementation.

The interface should avoid:

- guarantees
- absolute claims
- misleading certainty
- unsupported financial promises

---

# 45. MVP Priorities

## P0 — Must Ship

These are required for the core demonstration.

### Foundation

- Authentication
- Protected application
- User profile
- Database persistence

### Product

- Onboarding
- Financial profile
- Dashboard
- Discover
- Product comparison
- Recommendation
- Manage

### Intelligence

- deterministic recommendation logic
- explainable recommendation output

### AI

- grounded AI Copilot
- product/recommendation explanation

---

# 46. P1 — Should Ship

If the core MVP is stable:

- Goals
- Calendar
- Watchlist
- Alerts
- stronger product detail pages
- richer comparison
- better recommendation explanations
- polished responsive behavior
- additional empty/error states

---

# 47. P2 — If Time Remains

Optional improvements:

- advanced filtering
- richer analytics
- advanced portfolio visualization
- additional financial categories
- enhanced AI conversational workflows
- additional animation
- personalization improvements

Do not allow P2 features to destabilize P0 functionality.

---

# 48. Out-of-Scope MVP Features

The following should not consume critical implementation time unless explicitly approved:

- actual financial transaction execution
- insurance purchase execution
- investment trade execution
- bank account integration
- real-time brokerage integration
- full KYC workflow
- tax filing
- loan origination
- complete wealth management
- complex financial planning
- production-grade market-data terminal
- automated financial transactions
- guaranteed investment advice

---

# 49. Demo Data

Demo data may be used where real external integrations are not yet implemented.

However:

### Demo data must be clearly controlled.

Do not present invented demo statistics as real-world statistics.

Do not fabricate claims about actual providers.

If product data is mocked for the competition demo, the implementation should make that distinction clear internally and avoid presenting unsupported facts as verified external information.

---

# 50. Product Data Requirements

Any product catalog should ideally contain structured fields.

Example conceptual model:

```text
Product
â”œâ”€â”€ id
â”œâ”€â”€ name
â”œâ”€â”€ provider
â”œâ”€â”€ category
â”œâ”€â”€ description
â”œâ”€â”€ features
â”œâ”€â”€ pricing
â”œâ”€â”€ eligibility
â”œâ”€â”€ limitations
â”œâ”€â”€ metadata
â”œâ”€â”€ source
â”œâ”€â”€ source_url
â”œâ”€â”€ last_verified_at
â””â”€â”€ data_updated_at
```

The actual database implementation may differ.

---

# 51. Product Comparison Data Quality

Before a product attribute is displayed as fact, the system should know:

1. What the value is.
2. Where it came from.
3. When it was last verified.
4. Whether the value is applicable to the current product/context.

If these conditions cannot be satisfied, the UI should avoid false certainty.

---

# 52. Recommendation Data Quality

A recommendation should be reproducible from:

- user context
- product data
- scoring rules
- recommendation logic

If the same inputs are provided to a deterministic recommendation engine, the result should be explainable and consistent.

---

# 53. Product Metrics

The MVP should avoid vanity metrics unless they are meaningful.

Potential product-level metrics in the future:

- profile completion
- comparison usage
- recommendation engagement
- policy tracking
- goal creation
- watchlist activity
- alert interaction

Do not invent current user counts, conversion rates, or savings claims.

---

# 54. Definition of a Complete User Journey

The MVP should be considered product-complete when a user can reasonably:

```text
1. Create an account
2. Complete their financial profile
3. View their dashboard
4. Discover a financial product
5. Inspect relevant information
6. Compare options
7. Understand a recommendation
8. Add/manage a financial item
9. View an important financial action
10. Ask the AI Copilot for an explanation
```

Not every secondary feature must be complete if the core journey is strong.

---

# 55. Definition of Product Quality

A product-quality NIRNAY screen should:

- solve a clear user problem
- have a clear primary action
- use consistent components
- handle loading
- handle empty states
- handle errors
- respect authentication
- display trustworthy information
- work responsively
- avoid unnecessary visual complexity

---

# 56. Cross-Team Dependencies

## Frontend depends on:

- database shape
- product data structure
- recommendation response shape
- authentication state
- shared UI components

## Backend/Data depends on:

- product requirements
- user profile requirements
- recommendation requirements
- frontend data needs

## AI depends on:

- verified product data
- user financial context
- recommendation outputs
- structured application context

## Technical Lead coordinates:

- integration
- architecture
- shared infrastructure
- authentication
- security
- deployment
- cross-team conflicts

---

# 57. Product Change Rule

Any feature change that affects the core user journey should be discussed before implementation if it changes:

- user flow
- data model
- authentication
- recommendation behavior
- AI behavior
- navigation
- shared design system

Small UI improvements do not require architectural approval.

---

# 58. MVP Decision Rule

When deciding whether to implement a feature, ask:

### Question 1

Does it improve the core financial decision journey?

### Question 2

Can we build it reliably within the remaining time?

### Question 3

Can we explain it during the final demo?

### Question 4

Can we maintain it after the competition?

If the answer to most is no:

> Defer it.

---

# 59. Primary Demo Story

The preferred demo should use one user journey rather than jumping randomly between screens.

Recommended story:

```text
"I am Rahul."

        ↓

"I want to organize my financial protection and investments."

        ↓

NIRNAY learns my financial context.

        ↓

"I need health/car protection."

        ↓

NIRNAY helps me discover options.

        ↓

"I don't know which one fits me."

        ↓

NIRNAY compares them.

        ↓

"It recommends an option and explains why."

        ↓

"I want to understand the decision."

        ↓

AI Copilot explains the recommendation.

        ↓

"I already own financial products."

        ↓

NIRNAY helps me manage them.

        ↓

"I need to remember upcoming actions."

        ↓

Calendar / Alerts / Goals help me stay on track.
```

This demonstrates the full product thesis.

---

# 60. Product North Star

The most important product question is:

> **Does NIRNAY help the user make, understand, or manage a better-informed financial decision?**

If yes, the feature is aligned.

If no, it should be questioned.

---

# 61. Final Product Statement

NIRNAY is not simply a comparison engine.

It is not simply a financial dashboard.

It is not simply a chatbot.

It is not simply a recommendation engine.

It is the combination of:

```text
Financial Context
       +
Verified Information
       +
Comparison
       +
Decision Intelligence
       +
Explainable AI
       +
Ongoing Management
```

That combination is the product.

---
