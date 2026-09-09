# NIRNAY — AI Agent Documentation

**Project:** NIRNAY
**Team:** TATVAH
**Purpose:** Shared operating context for AI coding agents
**Status:** Active Development
**Priority:** Production-grade implementation

---

# 1. Purpose

This directory contains the official instructions and operating context for AI coding agents working on NIRNAY.

The goal is to ensure that every AI coding agent understands:

- what NIRNAY is
- what has already been built
- how the architecture works
- what technologies are used
- who owns each subsystem
- how data and authentication work
- how AI features should behave
- how code should be changed
- how Git should be used
- what must never be changed casually
- how to validate work before handoff

AI agents must treat these documents as project instructions, not optional background reading.

---

# 2. AI Agent Documentation Structure

```text
docs/ai-agents/
â”œâ”€â”€ README.md
â”œâ”€â”€ AGENT_INSTRUCTIONS.md
â”œâ”€â”€ GEMINI.md
â”œâ”€â”€ CLAUDE.md
â”œâ”€â”€ CURSOR.md
â”œâ”€â”€ CODEX.md
â””â”€â”€ HANDOFF_PROTOCOL.md
```

Each document has a different purpose.

---

# 3. Document Responsibilities

## README.md

This file.

Provides:

- directory overview
- reading order
- agent documentation map
- core principles

---

## AGENT_INSTRUCTIONS.md

The canonical operating manual for any AI coding agent.

Contains:

- project rules
- architecture rules
- coding standards
- security rules
- database rules
- AI rules
- Git rules
- validation requirements
- scope-control rules

If an AI agent has no provider-specific instruction file, this is the primary document it should follow.

---

## GEMINI.md

Instructions optimized for Gemini-based coding workflows.

It should reference the canonical project rules rather than redefining the entire project independently.

---

## CLAUDE.md

Instructions optimized for Claude-based coding workflows.

It should reference the canonical project rules rather than creating conflicting project rules.

---

## CURSOR.md

Instructions optimized for Cursor-based development.

It should define how Cursor/agent mode should work within the NIRNAY repository.

---

## CODEX.md

Instructions optimized for Codex-based development.

It should define how Codex should inspect, modify, test, and hand off NIRNAY code.

---

## HANDOFF_PROTOCOL.md

Defines how human developers and AI agents transfer work.

It should cover:

- completed work
- files changed
- decisions
- known issues
- tests
- remaining work
- next recommended action

---

# 4. Mandatory Reading Order

Before making meaningful code changes, an AI agent should understand the following hierarchy:

```text
1. docs/ai-agents/README.md
        ↓
2. docs/ai-agents/AGENT_INSTRUCTIONS.md
        ↓
3. Relevant project documentation
        ↓
4. Relevant member ownership document
        ↓
5. Current source code
        ↓
6. Current Git state
```

An agent should not blindly start editing code before understanding the relevant context.

---

# 5. Project Documentation Hierarchy

The main project documentation lives under:

```text
docs/
```

Important files include:

```text
PROJECT.md
PRODUCT.md
ARCHITECTURE.md
TECH_STACK.md
DESIGN_SYSTEM.md
DATABASE.md
AUTHENTICATION.md
SECURITY.md
TRUST_AND_DATA_POLICY.md
DEVELOPMENT.md
GIT_WORKFLOW.md
ROADMAP.md
DEPLOYMENT.md
QUALITY_STANDARDS.md
TEAM.md
```

These documents describe different dimensions of the project.

---

# 6. Ownership Documentation

Team member ownership is defined under:

```text
docs/members/
```

Current ownership:

```text
Prabhat Dash
→ Technical Lead / Architecture

Aryan Gupta
→ Frontend / Product UX

Sarvesh Dhanrale
→ Backend / Data / Financial Engine

Ananya Chaudhary
→ AI / Intelligence
```

AI agents must respect these boundaries.

---

# 7. Source Code Is Also a Source of Truth

Documentation is important, but an AI agent must not assume that documentation is always newer than the code.

Before making changes:

```text
Documentation
+
Current repository state
+
Current Git state
```

should be considered together.

If documentation and implementation conflict, investigate before making a large change.

Do not silently assume one is correct.

---

# 8. Current Technology Foundation

The current NIRNAY stack includes:

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
```

AI integrations are server-side and may evolve.

Do not introduce another framework or infrastructure layer without a clear reason.

---

# 9. Current Authentication Architecture

Authentication is handled through:

```text
Firebase Authentication
```

Supported authentication methods currently include:

```text
Email / Password
Google
```

Firebase provides the user identity.

The Firebase UID is the canonical user identity used by NIRNAY.

---

# 10. Firebase → Supabase Architecture

The application uses:

```text
Firebase Authentication
        ↓
Firebase ID Token
        ↓
Firebase custom claim
role = authenticated
        ↓
Supabase
        ↓
PostgreSQL + RLS
```

The Supabase Data API uses the Firebase token.

Do not replace this architecture casually.

---

# 11. Database Authorization

User-owned database records are protected through PostgreSQL Row Level Security.

The conceptual ownership rule is:

```sql
user_id = (auth.jwt() ->> 'sub')
```

An AI agent must not bypass this model casually.

---

# 12. Current Database Entities

The current NIRNAY schema includes:

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

These are described in detail in:

```text
docs/DATABASE.md
```

Before modifying the database, read that document.

---

# 13. Database Changes

AI agents must not casually modify:

- production schema
- RLS policies
- foreign keys
- identity relationships
- financial numeric types
- authentication-related database logic

Schema changes should be implemented through migrations.

Do not directly modify production databases as a shortcut.

---

# 14. Security Boundary

Never expose:

```text
Firebase Admin credentials
Firebase service-account private key
Supabase secret key
AI provider API keys
```

to the client.

Never commit secrets.

Never place secrets inside:

```text
NEXT_PUBLIC_*
```

environment variables.

---

# 15. AI Agent Environment

AI agents may inspect environment variable names and configuration structure when necessary.

They should not print, commit, or expose secret values.

If a command output contains a secret:

```text
STOP
```

Do not paste the secret into chat, GitHub, documentation, logs, or PR descriptions.

---

# 16. NIRNAY Product Principle

NIRNAY is:

> **An AI-powered financial protection and investment decision-support platform.**

Core user loop:

```text
Discover
   ↓
Compare
   ↓
Decide
   ↓
Manage
   ↓
Optimize
```

Continuous loop:

```text
Track
   ↓
Detect
   ↓
Compare
   ↓
Recommend
   ↓
Act
   ↓
Track
```

AI should strengthen this loop.

It should not become a disconnected chatbot.

---

# 17. Trust Principle

NIRNAY follows:

> **Trust before intelligence.**

The product must distinguish:

```text
Verified facts
User-provided data
Calculated values
AI-generated interpretation
Unknown information
```

AI agents must preserve these distinctions.

---

# 18. No Hallucinated Financial Facts

AI agents must never implement behavior that causes the product to invent:

- insurance premiums
- coverage
- exclusions
- waiting periods
- claim statistics
- returns
- discounts
- offers
- fund characteristics
- market statistics
- partnerships
- certifications
- user numbers
- revenue
- awards

If the application does not have reliable data:

> Say that the information is unavailable.

---

# 19. Financial Calculations

Important numerical calculations should preferably be deterministic.

Examples:

```text
premium difference
budget calculations
SIP calculations
goal progress
allocation percentages
renewal dates
comparison scores
recommendation scores
```

Use application code for calculations.

Use AI primarily for:

```text
explanation
contextualization
natural-language reasoning
summarization
insight generation
```

---

# 20. Recommendation Principle

NIRNAY recommendations should generally follow:

```text
User requirements
        ↓
Eligibility / filtering
        ↓
Deterministic scoring
        ↓
Relevant factors
        ↓
AI explanation
```

Not:

```text
User asks
        ↓
LLM randomly chooses product
```

AI agents must preserve this separation.

---

# 21. AI Context

AI should receive only relevant context.

Prefer:

```text
Current user context
+
Relevant financial records
+
Relevant product data
+
Relevant calculations
+
Source/freshness information
```

Avoid sending unnecessary personal data.

Avoid dumping entire database tables into prompts.

---

# 22. AI Output Validation

AI-generated structured data must be validated before being consumed by the frontend.

Conceptually:

```text
LLM
 ↓
Structured output
 ↓
Schema validation
 ↓
Valid
 ↓
UI
```

Invalid output must produce a controlled fallback.

Do not blindly trust model-generated JSON.

---

# 23. AI Failure Behavior

AI failure must not break core application functionality.

If the AI provider fails:

```text
Verified data
+
Deterministic calculations
+
Comparison results
```

should remain usable.

The user should receive a useful fallback rather than a blank screen.

---

# 24. Human-in-the-Loop

AI should not silently perform consequential financial actions.

For important actions:

```text
AI recommendation
        ↓
User review
        ↓
User confirmation
        ↓
Action
```

Do not implement autonomous:

- purchases
- investments
- cancellations
- money transfers
- policy changes

without explicit product requirements and user confirmation.

---

# 25. Frontend Rule

AI agents must respect the existing design system.

Primary UI foundations:

```text
shadcn/ui
Base UI
Tailwind CSS
Lucide icons where appropriate
```

Avoid introducing unrelated UI libraries without approval.

Do not create inconsistent "Frankenstein UI."

---

# 26. UI Quality

New UI should be:

- responsive
- accessible
- consistent
- calm
- professional
- production-grade

Avoid:

- excessive gradients
- unnecessary glassmorphism
- random animations
- inconsistent spacing
- excessive rounded cards
- generic AI-chat aesthetics
- visual clutter

Refer to:

```text
docs/DESIGN_SYSTEM.md
```

before major UI work.

---

# 27. Existing Code Before New Code

Before implementing a feature:

```text
Search
 ↓
Understand
 ↓
Reuse
 ↓
Extend
 ↓
Only then create new abstraction
```

Do not create duplicate:

- API clients
- utility functions
- auth logic
- database access patterns
- components
- hooks
- AI providers

without checking whether one already exists.

---

# 28. Dependency Discipline

Before installing a package:

Ask:

```text
Do we already have something that solves this?
```

Then:

```text
Does this dependency materially improve the product?
```

Then:

```text
Does it increase risk during the two-day competition timeline?
```

Prefer a smaller reliable dependency set.

---

# 29. Git Safety

AI agents must inspect:

```bash
git status
```

before editing.

Before committing:

```bash
git diff --check
npm run lint
npm run build
```

Then inspect the diff.

Never blindly commit the entire repository.

---

# 30. Branch Safety

Do not casually work directly on:

```text
main
```

unless the current team workflow explicitly requires it.

Preferred pattern:

```text
feature branch
    ↓
implementation
    ↓
validation
    ↓
commit
    ↓
push
    ↓
review
    ↓
merge
```

---

# 31. AI Agent Git Restrictions

AI agents must never:

```text
force push
delete remote branches
reset unrelated work
discard teammate changes
rewrite history
```

unless explicitly instructed by the technical lead.

Never use destructive Git commands merely to "fix" a dirty working tree.

---

# 32. Existing Teammate Work

Before editing a file:

```text
git status
```

If the file contains changes you did not create:

```text
Do not overwrite them blindly.
```

Inspect the diff first.

Preserve teammate work.

---

# 33. Scope Control

An AI agent should solve the requested problem.

It should not automatically:

- redesign unrelated pages
- refactor the entire codebase
- replace working infrastructure
- rename major concepts
- change database architecture
- replace authentication
- upgrade frameworks
- introduce unnecessary abstractions

unless explicitly requested.

---

# 34. Two-Day Competition Rule

NIRNAY is being built under a highly compressed competition timeline.

Therefore:

> **Shipping a stable MVP is more important than architectural perfection.**

Prioritize:

```text
Working
+
Reliable
+
Demo-ready
+
Trustworthy
```

over:

```text
Complex
+
Over-engineered
+
Theoretically perfect
```

---

# 35. P0 Priority

For the MVP, prioritize:

```text
Application shell
Authentication
Financial profile
Dashboard
Insurance discovery
Comparison
Recommendation
Investment/SIP basics
Management
AI copilot
Trust/explainability
Deployment
```

Avoid spending excessive time on low-value infrastructure.

---

# 36. Documentation Synchronization

When a major architectural decision changes:

```text
Code
+
Relevant documentation
```

should eventually be brought back into alignment.

Do not create documentation that describes functionality that does not exist.

Do not implement critical architecture that contradicts documented security boundaries without updating the relevant documentation.

---

# 37. AI Agent Decision Rule

When uncertain:

```text
1. Check documentation.
2. Inspect existing implementation.
3. Check ownership.
4. Check Git state.
5. Prefer the smallest safe change.
6. Ask the technical lead when architecture is unclear.
```

Do not guess.

---

# 38. When an Agent Should Stop

An AI agent should stop and ask for clarification when:

- requirements conflict
- authentication architecture would change
- database ownership is unclear
- security boundaries would change
- a destructive migration is required
- production infrastructure would be affected
- a teammate's work would be overwritten
- the requested behavior contradicts trust policy
- the change requires a major architectural decision

---

# 39. When an Agent Can Proceed

An AI agent can generally proceed when:

- the task is clearly scoped
- ownership is clear
- architecture already supports it
- the change is reversible
- no security boundary changes
- no destructive migration is required
- existing conventions are clear

---

# 40. Required Validation

Before reporting completion:

```bash
npm run lint
npm run build
git diff --check
```

For relevant database changes:

```text
Migration applies
RLS remains enabled
Policies remain correct
```

For authentication changes:

```text
Signup works
Sign-in works
Google auth works where applicable
role = authenticated
Supabase access works
```

For AI changes:

```text
Normal response works
Invalid output is handled
Provider failure is handled
No secrets are exposed
No unsupported financial claims are generated
```

---

# 41. Completion Report

Every AI agent handoff should report:

```text
What changed
Files changed
Why it changed
Tests run
Test results
Known limitations
Potential follow-up
```

Use the handoff format defined in:

```text
docs/ai-agents/HANDOFF_PROTOCOL.md
```

---

# 42. Recommended Agent Workflow

The default workflow is:

```text
READ
 ↓
PLAN
 ↓
INSPECT
 ↓
IMPLEMENT
 ↓
VALIDATE
 ↓
REVIEW
 ↓
REPORT
```

Expanded:

```text
1. Read relevant docs
2. Inspect repository
3. Inspect Git state
4. Identify ownership
5. Understand current implementation
6. Plan minimal change
7. Implement
8. Run validation
9. Inspect diff
10. Report handoff
```

---

# 43. Agent Context Priority

When information conflicts, investigate in this order:

```text
Explicit current user requirement
        ↓
Current architecture/security constraints
        ↓
Current source implementation
        ↓
Relevant project documentation
        ↓
General assumptions
```

Do not use generic coding knowledge to override project-specific rules.

---

# 44. Do Not Assume

AI agents must not assume:

- an API exists
- a table exists
- a column exists
- an environment variable exists
- an endpoint exists
- a product fact exists
- a provider is configured
- a feature is deployed
- a teammate has completed a task

Verify first.

---

# 45. Repository Inspection

Before significant changes, inspect:

```text
package.json
app/
components/
lib/
supabase/
docs/
```

and relevant configuration files.

Use the actual repository structure rather than relying solely on previous conversation context.

---

# 46. Production Mindset

Every implementation should consider:

```text
Correctness
Security
Maintainability
Performance
Accessibility
Trust
Failure behavior
Deployment
```

But do not over-engineer beyond the MVP requirement.

---

# 47. Final AI Agent Principle

The AI agent's job is not merely to produce code.

The job is to:

> **Make the repository better without breaking the system around it.**

Every change should preserve:

```text
Architecture
+
Security
+
Trust
+
Ownership
+
User experience
+
Team velocity
```

---

# 48. Canonical References

Before making major changes, consult:

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
docs/DEVELOPMENT.md
docs/GIT_WORKFLOW.md
docs/ROADMAP.md
docs/DEPLOYMENT.md
docs/QUALITY_STANDARDS.md
docs/TEAM.md
```

For ownership:

```text
docs/members/
```

For AI-agent behavior:

```text
docs/ai-agents/
```

---

# 49. Golden Rule

When working on NIRNAY:

> **Understand before changing.**

Then:

> **Change the smallest thing that correctly solves the problem.**

Then:

> **Validate before claiming completion.**

And always:

> **Protect user data, financial trust, and teammate work.**
```

---
