# NIRNAY — Quality Standards

> **Status:** Active
> **Applies To:** All NIRNAY code, UI, database changes, APIs, AI systems, documentation, and production deployments
> **Rule:** A feature is not considered complete merely because it works on the happy path.

---

# 1. Purpose

This document defines the quality bar for NIRNAY.

Every teammate and AI coding agent must use these standards when:

- writing code
- modifying existing features
- designing UI
- changing the database
- implementing APIs
- adding AI functionality
- reviewing pull requests
- preparing deployments
- fixing bugs

The objective is to keep NIRNAY:

- reliable
- maintainable
- secure
- trustworthy
- understandable
- performant
- accessible
- visually consistent
- production-ready

---

# 2. Core Quality Principle

NIRNAY follows this principle:

> **Make it correct first, trustworthy second, maintainable third, and impressive fourth.**

Visual polish and AI sophistication must never compensate for broken functionality or unreliable financial information.

---

# 3. Definition of Done

A feature is considered complete only when the appropriate items below have been addressed.

```text
Requirement
    ↓
Design
    ↓
Implementation
    ↓
Validation
    ↓
Database / API Integration
    ↓
Authorization
    ↓
Error Handling
    ↓
Loading / Empty States
    ↓
Trust Checks
    ↓
Testing
    ↓
Lint
    ↓
Production Build
    ↓
Review
```

A feature that only works in one happy-path scenario is not complete.

---

# 4. Code Quality

## 4.1 TypeScript

Use TypeScript consistently.

Prefer:

```ts
type UserProfile = {
  id: number;
  userId: string;
};
```

over unnecessary untyped objects.

Avoid:

```ts
const data: any = ...
```

unless there is a documented reason.

Do not use `any` to hide type errors.

---

# 5. Naming

Names should communicate intent.

Good:

```text
financialProfile
renewalDate
calculateRecommendation
getUserPolicies
```

Avoid vague names:

```text
data
thing
temp
stuff
handleIt
process
```

Boolean values should read naturally:

```text
isLoading
isAuthenticated
hasProfile
canEdit
```

---

# 6. Functions

Functions should generally have one clear responsibility.

Avoid large functions that simultaneously:

- validate input
- query the database
- perform calculations
- call AI
- transform data
- render UI

Prefer separation:

```text
validate
   ↓
fetch
   ↓
calculate
   ↓
transform
   ↓
render
```

---

# 7. Reuse

Reuse existing components and utilities when appropriate.

Before creating a new component, check whether an existing component already solves the problem.

Do not create multiple visually or functionally identical components.

---

# 8. Abstraction Rule

Do not abstract code merely because two lines look similar.

Abstraction should be introduced when it improves:

- readability
- consistency
- reuse
- testability
- maintainability

Avoid premature abstraction.

---

# 9. Comments

Comments should explain **why**, not merely restate **what** the code does.

Bad:

```ts
// Set loading to true
setLoading(true);
```

Better:

```ts
// Prevent duplicate recommendation requests while the previous
// calculation is still running.
setLoading(true);
```

Remove outdated comments.

---

# 10. Error Handling

Errors must be handled intentionally.

Never silently swallow errors.

Avoid:

```ts
try {
  await something();
} catch {}
```

Prefer:

```ts
try {
  await something();
} catch (error) {
  console.error("Failed to complete operation:", error);
  // Show appropriate user-facing state.
}
```

Do not expose internal implementation details to users.

---

# 11. User-Facing Errors

Technical errors should be translated into understandable messages.

Bad:

```text
PGRST116: JSON object requested, multiple rows returned
```

Better:

```text
We couldn't load this information right now.
Please try again.
```

Detailed technical information belongs in controlled logs, not the user interface.

---

# 12. Loading States

Every asynchronous user-facing operation should have an appropriate loading state.

Examples:

- page loading
- dashboard loading
- table loading
- comparison loading
- recommendation generation
- AI response generation
- save/update operations

Do not leave users wondering whether an action worked.

---

# 13. Empty States

Empty data is not automatically an error.

Examples:

```text
No policies added yet.
```

or:

```text
Your watchlist is empty.
Add a product to compare it later.
```

An effective empty state should explain:

1. what is empty
2. why it matters
3. what the user can do next

---

# 14. Error States

Error states should provide:

- clear explanation
- recovery action where possible
- retry mechanism where appropriate
- no internal stack traces

Example:

```text
Unable to load your policies.

[Try Again]
```

---

# 15. Forms

Forms must include:

- labels
- validation
- useful defaults where appropriate
- clear required/optional indicators
- appropriate input types
- understandable error messages
- disabled/loading state during submission

Do not rely solely on placeholder text as a label.

---

# 16. Financial Input Validation

Financial values require stricter validation.

Validate:

- numeric format
- minimum values
- maximum values where applicable
- decimal precision
- currency
- required fields
- date validity

Never silently accept malformed financial input.

---

# 17. Money Handling

Never use floating-point arithmetic casually for financial calculations.

Prefer appropriate numeric representations.

Database financial amounts should use suitable PostgreSQL numeric/decimal types.

Application calculations must account for precision.

Example:

```text
₹10,000.00
```

must not unexpectedly become:

```text
₹9,999.999999
```

---

# 18. Date Handling

Financial dates must be handled explicitly.

Examples:

- policy renewal date
- SIP date
- target date
- alert date

Avoid ambiguous date parsing.

Do not assume a user's timezone without considering the application context.

---

# 19. Financial Calculations

Every financial calculation should have:

- defined inputs
- defined formula
- known assumptions
- predictable output
- appropriate validation

Where practical, calculations should be deterministic.

AI should not replace deterministic financial calculations when a calculation can be performed reliably by code.

---

# 20. Recommendation Quality

Recommendations should be based on identifiable inputs.

Conceptually:

```text
User Context
     +
Product Data
     +
Rules / Scoring
     ↓
Recommendation
     +
Explanation
```

The system should not produce arbitrary rankings merely because an AI model generated them.

---

# 21. Recommendation Explainability

A recommendation should answer:

```text
Why was this selected?
What user factors mattered?
What trade-offs exist?
What alternatives were considered?
What information is missing?
```

Avoid black-box recommendations whenever practical.

---

# 22. AI Quality Standards

AI responses must be:

- relevant
- grounded
- concise enough to understand
- transparent about uncertainty
- consistent with trusted data
- safe for financial contexts

AI must not invent:

- product facts
- prices
- premiums
- coverage
- exclusions
- returns
- partnerships
- discounts
- certifications
- regulations
- user data

---

# 23. AI Grounding

When answering product-specific questions, AI should rely on trusted application data.

Preferred:

```text
Structured Data
      ↓
Application Logic
      ↓
AI Explanation
```

Avoid:

```text
User Question
      ↓
Unrestricted Model Guess
      ↓
Financial Claim
```

---

# 24. AI Uncertainty

If information is unavailable, the AI should say so.

Good:

```text
I don't have verified information about that feature.
Please check the product's official documentation.
```

Bad:

```text
This policy definitely includes that feature.
```

when the underlying data is unavailable.

---

# 25. No Financial Guarantees

NIRNAY must never present uncertain financial outcomes as guaranteed.

Avoid statements such as:

```text
You will save ₹X.
```

or:

```text
This investment will return X%.
```

unless the statement is explicitly describing a verified historical or deterministic fact and is appropriately contextualized.

Recommendations should remain decision support.

---

# 26. Source Attribution

Important external financial-product information should preserve source information where available.

Recommended metadata:

```text
Source
Last Updated
Data Type
```

Users should be able to distinguish verified information from AI-generated explanation.

---

# 27. Trust Labels

NIRNAY should conceptually distinguish:

```text
VERIFIED
USER PROVIDED
CALCULATED
AI GENERATED
```

Do not silently merge these categories.

---

# 28. UI Quality

The interface must follow the NIRNAY design system.

Use:

- existing design tokens
- consistent spacing
- consistent typography
- existing component primitives
- established interaction patterns

Do not introduce arbitrary visual systems for individual pages.

---

# 29. Component Quality

Reusable UI components should have:

- clear responsibility
- predictable props
- sensible defaults
- responsive behavior
- accessible interaction
- loading/error support where relevant

Avoid extremely large components that contain an entire application page's business logic.

---

# 30. shadcn/Base UI Standard

NIRNAY uses the established shadcn/Base UI component foundation.

Before creating custom primitives, check whether the existing component system can support the requirement.

Do not introduce another UI component library without technical-lead approval.

---

# 31. Responsive Design

Every important user-facing feature must work across:

```text
Mobile
Tablet
Desktop
```

Do not treat mobile responsiveness as a final afterthought.

---

# 32. Accessibility

Where applicable:

- use semantic HTML
- provide accessible labels
- support keyboard navigation
- maintain visible focus states
- provide meaningful button text
- avoid color-only communication
- maintain sufficient contrast
- use appropriate ARIA only when necessary

Accessibility is part of product quality.

---

# 33. Navigation

Users should always understand:

- where they are
- what section they are viewing
- what action they can take
- how to return to previous context

Avoid dead ends.

---

# 34. Tables & Financial Data

Financial tables must prioritize readability.

Use:

- clear column headings
- consistent number formatting
- appropriate alignment
- readable row spacing
- responsive behavior
- meaningful sorting/filtering where necessary

Important financial values should be visually distinguishable without becoming visually overwhelming.

---

# 35. Charts

Charts should communicate a meaningful insight.

Do not add charts merely because they look impressive.

Every chart should answer a question such as:

```text
How is my goal progressing?
How is my portfolio allocated?
What is approaching?
```

Charts must not imply certainty where the underlying data is uncertain.

---

# 36. Animation

Animation should improve:

- feedback
- hierarchy
- transitions
- perceived responsiveness

Avoid:

- excessive motion
- distracting animation
- animation that delays important actions
- animation used to hide slow performance

---

# 37. Database Quality

Database changes must be represented through migrations.

Do not rely on undocumented manual production edits.

Every schema change should consider:

- data types
- constraints
- indexes
- foreign keys
- RLS
- policies
- triggers
- migration safety

---

# 38. Row Level Security

RLS is mandatory for user-owned data.

Every new user-owned table must answer:

```text
Who owns this row?
Who can read it?
Who can create it?
Who can update it?
Who can delete it?
```

The answer must be enforced at the database level wherever appropriate.

---

# 39. API Quality

API routes must:

- validate input
- authenticate requests where required
- authorize access
- return appropriate status codes
- avoid leaking sensitive data
- handle failures
- use predictable response structures

Never trust client-provided ownership information.

---

# 40. Authentication Quality

Authentication-related code must preserve the established architecture:

```text
Firebase
   ↓
ID Token
   ↓
Server Verification
   ↓
Custom Role
   ↓
Refreshed Token
   ↓
Supabase
   ↓
RLS
```

Do not bypass this architecture casually.

---

# 41. Authorization

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

A valid Firebase login does not automatically authorize access to another user's data.

Every protected operation must consider both.

---

# 42. Secrets

Never commit:

- API keys that are actually secret credentials
- private keys
- passwords
- service-account JSON
- database credentials
- tokens
- secret environment variables

Public Firebase web configuration may use `NEXT_PUBLIC_*` according to the established architecture.

Server-only credentials must never use `NEXT_PUBLIC_*`.

---

# 43. Dependency Quality

Before adding a dependency, ask:

1. Is it necessary?
2. Does an existing dependency already solve the problem?
3. Is it maintained?
4. Does it introduce security or bundle-size concerns?
5. Does the team understand how it works?
6. Is it worth the long-term maintenance cost?

Avoid dependency bloat.

---

# 44. Testing Standard

Testing should exist at multiple levels.

## Level 1 — Manual Verification

Verify the complete user journey.

## Level 2 — Component / Logic Testing

Test important deterministic behavior.

## Level 3 — Integration Testing

Test:

```text
Frontend
 ↓
API
 ↓
Database
```

where appropriate.

## Level 4 — Production Smoke Testing

Verify the deployed application.

Not every feature requires every testing level, but critical financial/authentication behavior should receive stronger testing.

---

# 45. Critical Paths

The following paths deserve special attention:

```text
Authentication
Database access
RLS
Financial calculations
Product comparison
Recommendation scoring
AI grounding
User data isolation
Production deployment
```

A failure in one of these areas can invalidate the product.

---

# 46. Git Quality

Before creating a pull request:

```bash
npm run lint
npm run build
```

should pass.

Also inspect:

```bash
git status
git diff
```

and ensure:

- no secrets
- no generated junk
- no unrelated changes
- no debug files
- no accidental local configuration

---

# 47. Pull Request Quality

A good PR should clearly explain:

```text
What changed?
Why?
How was it tested?
What files/areas are affected?
Are there database changes?
Are there environment changes?
Are there known limitations?
```

Avoid massive unrelated PRs.

---

# 48. Code Review

Reviewers should check:

### Functionality

- Does it work?

### Correctness

- Is the logic correct?

### Security

- Can unauthorized users access it?

### Data

- Are database changes safe?

### UX

- Are loading/error/empty states handled?

### Trust

- Are financial claims grounded?

### Maintainability

- Can the next developer understand it?

---

# 49. Performance

Performance optimization should be evidence-driven.

Prioritize:

- unnecessary network requests
- excessive database queries
- large client bundles
- expensive rendering
- slow AI calls
- unnecessarily large payloads

Do not prematurely optimize trivial code.

---

# 50. Observability

Production systems should provide enough information to diagnose important failures.

Logs should identify:

- operation
- failure category
- safe request context
- timestamp

Never log sensitive information unnecessarily.

---

# 51. Privacy

NIRNAY handles financial information.

Therefore:

- collect only necessary information
- minimize sensitive data exposure
- avoid unnecessary logging
- enforce user ownership
- protect server-side credentials
- do not expose private data through client-side URLs or logs

---

# 52. AI Prompt Security

AI systems must account for untrusted input.

Treat user-provided content as potentially adversarial.

Do not allow user text to override system security requirements.

Sensitive application instructions and secrets must not be exposed through AI responses.

---

# 53. AI Output Validation

Where AI output controls application behavior, prefer structured output.

Conceptually:

```text
AI
 ↓
Structured Output
 ↓
Schema Validation
 ↓
Business Rules
 ↓
Application
```

Do not blindly execute arbitrary AI-generated instructions.

---

# 54. Financial Safety

NIRNAY is a decision-support product.

The application must avoid implying that:

- recommendations are guaranteed
- investment returns are certain
- insurance coverage is universally suitable
- AI replaces professional financial judgment
- incomplete data is complete

Important assumptions should be visible.

---

# 55. Demo Data Quality

Competition/demo data must be clearly treated as fictional or sample data.

Do not invent:

- real users
- real customers
- fake partnerships
- fake traction
- fake revenue
- fake certifications
- fake awards
- fake market statistics

unless the information is genuinely verified and appropriately sourced.

---

# 56. Temporary Code

Temporary code must be clearly identified.

Examples:

```text
TODO
TEMP
DEMO ONLY
REMOVE BEFORE PRODUCTION
```

Temporary test pages should not accidentally remain in the final production navigation.

---

# 57. Debugging Standard

When debugging:

1. reproduce
2. isolate
3. identify root cause
4. make the smallest correct fix
5. test
6. run lint/build
7. document important architectural changes

Do not repeatedly patch symptoms without understanding the cause.

---

# 58. Avoiding Regression

Before modifying shared infrastructure:

- inspect existing dependencies
- inspect current imports
- inspect related routes
- inspect database policies
- understand existing behavior

After modifying it:

- test affected paths
- test authentication
- test database access
- run build

---

# 59. AI Coding Agent Standards

AI coding agents must:

- read relevant documentation before coding
- inspect existing implementation
- preserve established architecture
- avoid unnecessary rewrites
- avoid deleting working functionality
- avoid changing unrelated files
- never invent credentials
- never invent financial data
- explain significant architectural changes
- run appropriate validation
- report modified files

AI-generated code is held to the same quality standard as human-written code.

---

# 60. AI Agent Change Boundary

An AI agent should not perform broad changes when a narrow change solves the task.

Bad:

```text
Fix one button
 ↓
Rewrite entire dashboard
 ↓
Change database
 ↓
Replace component library
```

Good:

```text
Fix button
 ↓
Test
 ↓
Stop
```

---

# 61. Production Build Standard

The production build must pass before release.

Required command:

```bash
npm run build
```

A successful local development server is not sufficient evidence of production readiness.

---

# 62. Lint Standard

Lint must pass before merging.

Required command:

```bash
npm run lint
```

Do not suppress lint rules merely to make CI green unless the exception is justified.

---

# 63. Environment Validation

Before deployment, verify:

- required variables exist
- correct environment is targeted
- local URLs are not used in production
- server secrets remain server-side
- Firebase project is correct
- Supabase project is correct
- AI provider configuration is correct

---

# 64. Production Readiness Checklist

## Code

- [ ] feature complete
- [ ] types correct
- [ ] no unnecessary duplication
- [ ] no debug code
- [ ] no dead code
- [ ] errors handled

## UX

- [ ] loading state
- [ ] empty state
- [ ] error state
- [ ] responsive
- [ ] accessible
- [ ] visually consistent

## Data

- [ ] schema correct
- [ ] migration created
- [ ] constraints reviewed
- [ ] RLS verified
- [ ] ownership verified

## Security

- [ ] authentication verified
- [ ] authorization verified
- [ ] secrets protected
- [ ] input validated
- [ ] sensitive logs avoided

## AI

- [ ] grounded
- [ ] output validated where required
- [ ] no unsupported financial claims
- [ ] uncertainty communicated
- [ ] user context scoped correctly

## Build

- [ ] lint passes
- [ ] build passes
- [ ] production smoke test passes

---

# 65. Quality Gates

Every major feature should pass these gates.

## Gate 1 — Functional

Does it work?

## Gate 2 — Data

Does it use the correct data?

## Gate 3 — Security

Can unauthorized users access it?

## Gate 4 — UX

Does the user understand what is happening?

## Gate 5 — Trust

Can the user understand where the result came from?

## Gate 6 — Reliability

What happens when something fails?

## Gate 7 — Production

Does it work in the deployed environment?

---

# 66. Severity Levels

Issues should be classified approximately as:

### P0 — Critical

Examples:

- authentication broken
- cross-user data exposure
- production unavailable
- incorrect critical financial calculation
- secret exposed

Must be fixed immediately.

---

### P1 — High

Examples:

- major feature broken
- important recommendation failure
- severe mobile issue
- database operation unreliable

Should be fixed before release where possible.

---

### P2 — Medium

Examples:

- non-critical UI bug
- minor performance issue
- incomplete secondary state

Can be scheduled after critical work.

---

### P3 — Low

Examples:

- cosmetic issue
- minor wording improvement
- small enhancement

Can wait.

---

# 67. Competition Priority

During the competition deadline:

```text
P0
 ↓
P1
 ↓
Demo-critical P2
 ↓
Polish
 ↓
Nice-to-have
```

Do not spend critical time polishing low-impact details while core functionality is broken.

---

# 68. Quality vs Speed

Speed is important during the competition.

However:

> **Fast does not mean careless.**

The preferred approach is:

```text
Small Scope
+
Clear Architecture
+
Fast Iteration
+
Continuous Validation
```

rather than:

```text
Huge Scope
+
Fast Coding
+
No Validation
+
Last-Minute Debugging
```

---

# 69. Definition of Production-Ready

A feature is production-ready when it is:

```text
Correct
+
Secure
+
Tested
+
Understandable
+
Maintainable
+
Trustworthy
+
Deployable
```

Not merely:

```text
"It works on my laptop."
```

---

# 70. Final Quality Principle

Every line of NIRNAY should support one of four goals:

```text
TRUST
SECURITY
USEFULNESS
CLARITY
```

If a piece of complexity does not meaningfully improve one of these, question whether it belongs in the product.

The goal is not to build the most complicated fintech application.

The goal is to build a product that users can understand, trust, and use confidently.

**Quality is not a final phase. Quality is part of every phase.**
```


### I VERIFY

I’ll keep the next documentation files consistent with this quality bar, especially around:

- production readiness
- financial calculations
- AI hallucination prevention
- RLS/security
- UI/UX consistency
- testing
- Git/PR standards
- competition deadline priorities
