# NIRNAY — Team Structure & Collaboration

> **Status:** Active
> **Team:** TATVAH
> **Institute:** Smt. Indira Gandhi College of Engineering
> **Project:** NIRNAY
> **Core Team Size:** 4

---

# 1. Purpose

This document defines the responsibilities, ownership boundaries, collaboration model, handoff rules, and decision-making process for the NIRNAY team.

The purpose is to ensure that four developers can work in parallel without:

- duplicating work
- overwriting each other's changes
- creating conflicting architectures
- blocking one another unnecessarily
- introducing inconsistent UI
- breaking shared infrastructure
- losing important project context

The team should operate as **one product team with four specialized workstreams**.

---

# 2. Team

## Team Name

**TATVAH**

## Project

**NIRNAY**

## Members

| Member | Role |
|---|---|
| **Aryan Gupta** | Frontend / Product UX |
| **Prabhat Dash** | Technical Lead / Architecture |
| **Ananya Chaudhary** | AI / Intelligence |
| **Sarvesh Dhanrale** | Backend / Data / Financial Engine |

---

# 3. Team Structure

The four workstreams are:

```text
                    NIRNAY
                       â”‚
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚              â”‚              â”‚
        â–¼              â–¼              â–¼
 Architecture       Product        Intelligence
        â”‚              â”‚              â”‚
        â–¼              â–¼              â–¼
     Technical      Frontend          AI
      Lead            UX            Systems
        â”‚
        â–¼
   Integration
```

Backend/Data operates across the product foundation:

```text
              Backend / Data
                    â”‚
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â–¼           â–¼           â–¼
    Database    Financial     APIs
                 Logic
```

---

# 4. Member 1 — Technical Lead / Architecture

## Primary Responsibility

Own the overall technical architecture and integration of NIRNAY.

## Responsibilities

- application architecture
- system boundaries
- authentication architecture
- Supabase integration architecture
- server/client boundaries
- shared infrastructure
- deployment
- production configuration
- technical standards
- dependency decisions
- cross-workstream integration
- critical bug resolution
- final technical readiness

## Primary Areas

```text
app/
configuration
deployment
authentication architecture
shared infrastructure
integration
```

## Primary Documentation

- `PROJECT.md`
- `ARCHITECTURE.md`
- `TECH_STACK.md`
- `AUTHENTICATION.md`
- `SECURITY.md`
- `DEPLOYMENT.md`

---

# 5. Member 2 — Frontend / Product UX

## Primary Responsibility

Own the user-facing NIRNAY experience.

## Responsibilities

- application shell
- navigation
- page layouts
- responsive design
- dashboards
- onboarding UI
- financial profile UI
- product discovery UI
- comparison UI
- recommendation UI
- watchlist UI
- alerts/calendar UI
- visual consistency
- accessibility
- loading states
- empty states
- error states

## Primary Areas

```text
app/
components/
UI components
design system implementation
```

## Primary Documentation

- `PRODUCT.md`
- `DESIGN_SYSTEM.md`
- `QUALITY_STANDARDS.md`

---

# 6. Member 3 — Backend / Data / Financial Engine

## Primary Responsibility

Own NIRNAY's data model and deterministic financial/business logic.

## Responsibilities

- PostgreSQL schema
- Supabase
- migrations
- RLS
- database policies
- database indexes
- data validation
- APIs
- financial calculations
- comparison calculations
- deterministic recommendation scoring
- data normalization
- data integrity
- backend error handling

## Primary Areas

```text
supabase/
supabase/migrations/
server-side data logic
financial calculations
database policies
```

## Primary Documentation

- `DATABASE.md`
- `SECURITY.md`
- `TRUST_AND_DATA_POLICY.md`
- `QUALITY_STANDARDS.md`

---

# 7. Member 4 — AI / Intelligence

## Primary Responsibility

Own NIRNAY's AI capabilities and intelligence layer.

## Responsibilities

- AI architecture
- prompt design
- structured outputs
- AI context
- recommendation explanations
- AI tools
- AI grounding
- hallucination prevention
- AI safety
- AI error handling
- AI evaluation
- model integration
- AI response quality

## Primary Areas

```text
AI services
AI utilities
recommendation explanation
AI orchestration
AI prompts
```

## Primary Documentation

- `PRODUCT.md`
- `ARCHITECTURE.md`
- `TRUST_AND_DATA_POLICY.md`
- `SECURITY.md`
- `QUALITY_STANDARDS.md`

---

# 8. Ownership Principle

Each workstream has a primary owner.

Primary ownership means:

> The owner is responsible for understanding the implementation, maintaining it, and coordinating changes.

It does **not** mean other teammates are forbidden from contributing.

---

# 9. Shared Responsibility

Some areas require collaboration.

| Area | Primary Owner | Required Collaboration |
|---|---|---|
| Architecture | Member 1 | All |
| Authentication | Member 1 | Member 3 |
| Database | Member 3 | Member 1 |
| RLS | Member 3 | Member 1 |
| Financial Logic | Member 3 | Member 4 |
| Frontend | Member 2 | All |
| Recommendation UX | Member 2 | Members 3 + 4 |
| Recommendation Logic | Member 3 | Member 4 |
| AI | Member 4 | Members 1 + 3 |
| Deployment | Member 1 | All |
| Security | Member 1 | All |
| Trust/Data Policy | Member 3 | Member 4 |
| Design System | Member 2 | All |

---

# 10. Decision Authority

## Technical Architecture

Final technical decision:

**Member 1 — Technical Lead**

Major architectural decisions should be discussed with the affected teammates before implementation.

---

## Database

Final schema ownership:

**Member 3 — Backend/Data**

Database changes that affect architecture, authentication, or security should also be reviewed by Member 1.

---

## UI/UX

Final design-system ownership:

**Member 2 — Frontend/UX**

Changes that affect data behavior or technical architecture should involve the relevant owner.

---

## AI

Final AI implementation ownership:

**Member 4 — AI/Intelligence**

AI behavior that affects financial calculations, database access, authentication, or security requires collaboration with the relevant owner.

---

# 11. No Silent Ownership Changes

A teammate should not silently take ownership of another person's core subsystem.

For example:

Do not:

```text
Frontend developer
      ↓
Rewrite database schema
      ↓
Change RLS
      ↓
Merge without backend review
```

Instead:

```text
Frontend requirement
      ↓
Discuss data requirement
      ↓
Backend implements schema/API
      ↓
Frontend consumes contract
```

---

# 12. Parallel Development Model

The team should work in parallel where dependencies allow it.

Recommended structure:

```text
Member 1
Architecture / Integration / Deployment
        â”‚
        â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚               â”‚
        â–¼               â–¼
Member 2            Member 3
Frontend            Backend/Data
        â”‚               â”‚
        â””â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜
                â–¼
             Member 4
               AI
```

AI should integrate with stable data contracts rather than depending on constantly changing database internals.

---

# 13. Work Dependency Model

A typical feature should flow:

```text
Requirement
    ↓
UX Definition
    ↓
Data Contract
    ↓
Backend
    ↓
Frontend
    ↓
AI / Intelligence
    ↓
Integration
    ↓
Testing
```

However, development may happen in parallel using agreed interfaces.

---

# 14. Interface-First Collaboration

When two teammates need to integrate, define the interface before implementation.

For example:

```ts
type Recommendation = {
  productId: string;
  score: number;
  reasons: string[];
  tradeoffs: string[];
};
```

The exact implementation can change independently as long as the agreed contract remains stable.

---

# 15. API Contract Rule

Frontend should not guess backend response structures.

Backend should document expected response shapes.

Example:

```text
GET /api/policies
```

should have an understood response structure before frontend integration.

If the contract changes:

1. notify affected teammate
2. update documentation/types
3. update consumers
4. test integration

---

# 16. Database Contract Rule

Frontend developers should not directly design database structure based only on UI needs.

Database design should consider:

- data ownership
- normalization
- constraints
- indexing
- RLS
- future requirements
- financial data integrity

Frontend requirements should be communicated to Member 3.

---

# 17. AI Contract Rule

AI should consume trusted structured context.

Preferred:

```text
Database
   ↓
Backend / Financial Engine
   ↓
Trusted Context
   ↓
AI
   ↓
Structured Output
   ↓
Validation
   ↓
Frontend
```

Avoid allowing AI to independently query arbitrary user data without controlled authorization.

---

# 18. Shared Files

Some files are high-conflict areas.

Examples:

```text
package.json
package-lock.json
README.md
next.config.*
tsconfig.json
middleware / auth infrastructure
shared UI primitives
supabase migrations
shared types
```

Before modifying a high-conflict file:

- check whether another teammate is working on it
- communicate the intended change
- keep the change focused

---

# 19. Database Migration Ownership

Database migrations are primarily owned by Member 3.

When another teammate needs a database change:

```text
Requirement
   ↓
Message Member 3
   ↓
Agree on schema
   ↓
Migration
   ↓
Test
   ↓
Commit
```

Do not independently create competing migrations for the same feature.

---

# 20. Authentication Ownership

Authentication infrastructure is primarily owned by Member 1.

The current architecture is:

```text
Firebase Auth
      ↓
Firebase ID Token
      ↓
Firebase Admin Verification
      ↓
role = authenticated
      ↓
Token Refresh
      ↓
Supabase
      ↓
RLS
```

Do not replace or bypass this flow without architectural review.

---

# 21. UI Component Ownership

Member 2 owns the design-system implementation.

Before creating a new shared component:

1. check existing components
2. determine whether an existing component can be extended
3. avoid duplicate primitives
4. preserve established styling
5. communicate significant shared changes

---

# 22. Financial Logic Ownership

Member 3 owns deterministic financial calculations.

Examples:

- comparison scoring
- financial progress
- contribution calculations
- budget calculations
- deterministic recommendation factors

AI should not silently replace deterministic financial logic.

---

# 23. Recommendation Ownership

Recommendations are intentionally split.

### Member 3

Owns:

- deterministic inputs
- calculations
- scoring
- constraints
- product comparison logic

### Member 4

Owns:

- explanation
- natural-language reasoning
- AI interpretation
- conversational assistance

### Member 2

Owns:

- recommendation presentation
- comparison UX
- user interaction

### Member 1

Owns:

- integration
- architecture
- security boundaries

---

# 24. AI Safety Ownership

Member 4 owns AI-specific safety implementation.

However, everyone is responsible for identifying unsafe AI behavior.

Immediately report:

- hallucinated financial facts
- fabricated product information
- unauthorized data exposure
- prompt injection vulnerabilities
- misleading recommendations
- false guarantees

---

# 25. Communication Rule

Communication should happen before large shared changes, not after conflicts appear.

A short message is sufficient.

Example:

```text
I need to add renewal data to insurance_policies.
I'll add renewal_date and update the relevant RLS-safe query.
Please let me know if anyone is modifying this migration.
```

---

# 26. Blocker Protocol

If blocked for more than a reasonable amount of time:

1. identify the blocker
2. communicate it
3. state what is needed
4. continue independent work if possible

Example:

```text
BLOCKED:
Frontend comparison page needs the final product response shape.

NEEDED:
Backend response contract.

CAN CONTINUE:
UI layout and mock data integration.
```

Do not silently wait.

---

# 27. Handoff Protocol

When handing work to another teammate, provide:

```text
What was built
Where it lives
How it works
What remains
Known issues
Dependencies
Testing performed
```

Example:

```text
Recommendation API complete.

Location:
app/api/recommendations/

Input:
financial profile + product IDs

Output:
structured recommendation

Tested:
lint + build + local request

Remaining:
Frontend integration
```

---

# 28. Daily Synchronization

During the competition sprint, the team should maintain short synchronization points.

Recommended format:

```text
DONE:
...

DOING:
...

BLOCKED:
...

NEEDS FROM:
...
```

Keep updates short and actionable.

---

# 29. Work Allocation During the Two-Day Sprint

Recommended initial parallelization:

## Member 1

```text
Architecture
Integration
Auth
Deployment
Production readiness
```

## Member 2

```text
Application shell
Dashboard
Onboarding
Discovery
Comparison UX
Responsive polish
```

## Member 3

```text
Financial profile backend
Product data
Comparison engine
Recommendation scoring
Policy/investment CRUD
```

## Member 4

```text
AI service
Recommendation explanation
AI context
Copilot
AI safety
AI evaluation
```

---

# 30. Dependency Minimization

Each teammate should minimize unnecessary dependencies on others.

For example:

### Frontend

Can proceed using typed mock data while backend contracts are finalized.

### Backend

Can build and test APIs using deterministic fixtures.

### AI

Can develop prompt/output logic using structured mock product/user data.

### Architecture

Can establish integration contracts before all implementation is complete.

This allows parallel progress.

---

# 31. Mock Data Rule

Mock data is allowed for development.

However:

- mark it clearly
- keep its structure compatible with real data
- do not present it as real user/market data
- replace or clearly label it before final demo

---

# 32. Shared Type Strategy

Where frontend and backend share important structures, prefer centralized or clearly documented types.

Examples:

```text
UserProfile
FinancialProfile
InsurancePolicy
Investment
FinancialGoal
Recommendation
Alert
CalendarEvent
```

Avoid maintaining silently conflicting versions of the same structure.

---

# 33. Git Branch Ownership

Each teammate should primarily work from their own feature branches.

Example:

```text
feature/frontend-dashboard
feature/backend-recommendations
feature/ai-copilot
feature/auth-production
```

Follow `GIT_WORKFLOW.md`.

---

# 34. Commit Ownership

Commits should represent meaningful work.

Avoid:

```text
fix
changes
update
stuff
final
final2
```

Prefer:

```text
feat: add financial profile form
feat: add recommendation scoring
feat: add AI recommendation explanation
fix: prevent cross-user policy access
```

---

# 35. Pull Request Responsibility

The author is responsible for:

- implementation
- tests
- explanation
- resolving review comments

The reviewer is responsible for:

- correctness
- architecture
- security
- regressions
- maintainability

Approval should not be treated as a formality.

---

# 36. Cross-Review

Recommended review relationships:

```text
Member 1 → Reviews architecture/security
Member 2 → Reviews UI/UX
Member 3 → Reviews database/financial logic
Member 4 → Reviews AI behavior
```

At least one other teammate should review significant shared changes.

---

# 37. Breaking Change Protocol

A change is breaking if it affects another teammate's work unexpectedly.

Examples:

- changing API response shape
- renaming database fields
- removing shared components
- changing authentication behavior
- changing environment variables
- changing shared types

Before a breaking change:

1. communicate
2. explain impact
3. coordinate timing
4. update consumers
5. test

---

# 38. Conflict Resolution

When conflicts occur:

## First

Identify the source of truth.

## Second

Understand both changes.

## Third

Do not automatically choose one side.

## Fourth

Preserve required behavior from both where possible.

## Fifth

Run:

```bash
npm run lint
npm run build
```

after resolving.

---

# 39. Architectural Disagreement

If teammates disagree:

1. define the actual problem
2. list constraints
3. compare options
4. choose the smallest reliable solution
5. document the decision if significant

Avoid arguments based only on personal preference.

---

# 40. AI Agent Collaboration

AI coding agents are treated as implementation assistants, not project owners.

Agents must follow:

```text
docs/ai-agents/AGENT_INSTRUCTIONS.md
```

and the rest of the documentation system.

AI agents must not:

- redefine the roadmap
- bypass security
- expose secrets
- invent financial data
- rewrite unrelated systems
- delete working functionality without reason
- make large architectural changes without approval

---

# 41. AI Agent Handoff

When an AI agent finishes work, it should report:

```text
TASK
What was requested.

CHANGES
What changed.

FILES
Files modified/created.

TESTS
What was run.

RESULT
Pass/fail.

KNOWN ISSUES
Anything remaining.

NEXT
Recommended next step.
```

---

# 42. Documentation Ownership

Documentation should evolve with the implementation.

If a major architectural decision changes:

- update the relevant documentation
- notify the team
- avoid leaving contradictory documentation

Documentation is part of the source of truth.

---

# 43. Security Incident Protocol

If a teammate discovers:

- leaked secret
- authentication bypass
- RLS failure
- cross-user data exposure
- compromised credential

stop normal feature work and notify the Technical Lead immediately.

Do not hide the problem.

Do not commit additional sensitive data while attempting to fix it.

---

# 44. Production Incident Protocol

During a production incident:

```text
Detect
 ↓
Communicate
 ↓
Classify
 ↓
Contain
 ↓
Fix
 ↓
Test
 ↓
Deploy
 ↓
Verify
```

Member 1 coordinates technical response.

The relevant subsystem owner performs the fix.

---

# 45. Competition Freeze

Before the final demonstration:

```text
FEATURE FREEZE
      ↓
SMOKE TEST
      ↓
BUG FIX ONLY
      ↓
PRODUCTION VERIFY
      ↓
DEMO
```

After freeze, avoid:

- major refactors
- new libraries
- database redesign
- new authentication systems
- large UI rewrites

unless required to fix a critical issue.

---

# 46. Definition of Team Done

A team task is complete when:

- implementation exists
- required integration is complete
- appropriate tests pass
- lint passes
- build passes
- relevant documentation is updated
- handoff information is available
- no known critical blocker remains

---

# 47. Team Definition of Success

The team succeeds when all four workstreams converge into one coherent product.

Not:

```text
Four impressive features
```

but:

```text
One reliable NIRNAY experience
```

The user should never know which teammate built which subsystem.

---

# 48. Team Principles

## Principle 1 — Communicate early

Small communication prevents large conflicts.

## Principle 2 — Own your subsystem

Understand what you build.

## Principle 3 — Respect interfaces

Do not casually break another workstream.

## Principle 4 — Protect the user

Financial data and authentication require extra care.

## Principle 5 — Trust the architecture

Do not bypass security because a shortcut is faster.

## Principle 6 — Optimize for the deadline

Prioritize the complete MVP over unnecessary complexity.

## Principle 7 — Leave context behind

The next person should be able to understand your work.

---

# 49. Final Team Model

The NIRNAY team operates as:

```text
                    PRODUCT VISION
                          â”‚
                          â–¼
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚  NIRNAY   â”‚
                    â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”˜
                          â”‚
       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
       â”‚                  â”‚                  â”‚
       â–¼                  â–¼                  â–¼
  ARCHITECTURE          PRODUCT           INTELLIGENCE
  Member 1              Member 2           Member 4
       â”‚                  â”‚                  â”‚
       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                          â”‚
                          â–¼
                    BACKEND / DATA
                       Member 3
                          â”‚
                          â–¼
                     INTEGRATION
                          â”‚
                          â–¼
                      PRODUCTION
```

The roles are specialized, but the product is shared.

---

# 50. Final Principle

> **No teammate should optimize only for their own subsystem.**

The frontend must serve the backend.

The backend must serve the product.

The AI must serve trusted data.

The architecture must enable all three.

And every subsystem must ultimately serve the user.

**One team. One architecture. One product. One source of truth.**
```
