# NIRNAY — Member 1: Technical Lead / Architecture

> **Owner:** Prabhat Dash
> **Role:** Technical Lead / Architecture
> **Project:** NIRNAY
> **Team:** TATVAH
> **Primary Responsibility:** Technical direction, architecture, integration, security, and production readiness

---

# 1. Role Purpose

The Technical Lead owns the technical coherence of NIRNAY.

The responsibility is not to write every piece of code.

The responsibility is to ensure that:

- the architecture remains understandable
- the four workstreams integrate correctly
- security boundaries are preserved
- technical decisions remain consistent
- production deployment is reliable
- shared infrastructure is stable
- teammates are not blocked unnecessarily
- AI coding agents follow the project architecture

The Technical Lead is the primary technical integration point for the team.

---

# 2. Primary Ownership

The Technical Lead owns:

```text
Architecture
Authentication Architecture
Application Integration
Server / Client Boundaries
Infrastructure
Deployment
Security Coordination
Shared Configuration
Technical Standards
Cross-Team Integration
Production Readiness
```

---

# 3. Current Technology Architecture

The current NIRNAY architecture is:

```text
                    NIRNAY
                       â”‚
                       â–¼
                  Next.js App
                       â”‚
          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
          â”‚            â”‚            â”‚
          â–¼            â–¼            â–¼
     Firebase       Supabase       AI
       Auth         PostgreSQL   Services
          â”‚            â”‚            â”‚
          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                       â–¼
                  User Experience
```

Authentication flow:

```text
Firebase Authentication
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
        ↓
User Data
```

---

# 4. Primary Documentation

The Technical Lead should maintain strong familiarity with:

```text
docs/PROJECT.md
docs/PRODUCT.md
docs/ARCHITECTURE.md
docs/TECH_STACK.md
docs/AUTHENTICATION.md
docs/SECURITY.md
docs/DEVELOPMENT.md
docs/GIT_WORKFLOW.md
docs/DEPLOYMENT.md
docs/QUALITY_STANDARDS.md
docs/TEAM.md
```

Architecture-affecting changes should be reflected in the relevant documentation.

---

# 5. Responsibilities

## 5.1 Architecture

Maintain the overall system architecture.

Ensure that new features fit into the existing architecture rather than creating isolated systems.

Before approving significant architectural changes, ask:

1. Is the change necessary?
2. Does it solve a real product problem?
3. Does it introduce unnecessary complexity?
4. Does it affect security?
5. Does it affect other workstreams?
6. Can the existing architecture support the requirement?
7. Is there a smaller solution?

---

# 6. Authentication Ownership

The Technical Lead owns the authentication architecture.

Current authentication:

```text
Firebase
â”œâ”€â”€ Email / Password
â””â”€â”€ Google

Firebase Admin
â””â”€â”€ Custom Claim
    â””â”€â”€ role = authenticated

Supabase
â””â”€â”€ Firebase Third-Party Auth
    â””â”€â”€ PostgreSQL + RLS
```

Do not replace this architecture without reviewing the complete system impact.

---

# 7. Firebase Admin Security

Firebase Admin SDK must remain server-only.

The service-account private key must never:

- enter Git
- enter browser bundles
- appear in client-side environment variables
- be logged
- be displayed in UI
- be pasted into AI prompts

Local service-account files remain under:

```text
secrets/
```

and must remain ignored by Git.

Production credentials must use secure deployment configuration.

---

# 8. Supabase Architecture

Supabase is the application's primary database/data layer.

The Technical Lead must ensure:

- Firebase identity is correctly passed to Supabase
- authenticated requests receive the correct JWT context
- RLS remains enabled
- production and local environments remain separated
- server-only credentials remain protected

The public Supabase publishable key may be used client-side.

The Supabase secret key must remain server-side.

---

# 9. Server / Client Boundary

The Technical Lead must actively protect the server/client boundary.

Client-side code may access:

```text
Public Firebase configuration
Supabase publishable key
Non-sensitive application configuration
```

Client-side code must not access:

```text
Firebase Admin credentials
Service-account private keys
Supabase secret key
AI provider secret keys
Database passwords
Private server credentials
```

When uncertain, keep the operation server-side until reviewed.

---

# 10. Shared Infrastructure Ownership

The Technical Lead owns infrastructure that affects multiple workstreams.

Examples:

```text
Authentication utilities
Supabase client architecture
Environment configuration
Deployment configuration
Shared application layout architecture
Global middleware / route protection
Shared types with architectural impact
Build configuration
```

Changes to these areas should be communicated before major modifications.

---

# 11. Frontend Collaboration

The Frontend / Product UX owner is Aryan.

The Technical Lead should provide:

- architectural boundaries
- API contracts
- authentication integration
- server/client guidance
- reusable infrastructure
- deployment support

The Technical Lead should not unnecessarily control visual implementation.

Aryan owns the final UI/UX implementation within the established architecture.

---

# 12. Backend Collaboration

The Backend / Data / Financial Engine owner is Sarvesh.

The Technical Lead should collaborate on:

- database architecture
- RLS
- APIs
- authentication/data integration
- migrations affecting application architecture
- production database deployment

Sarvesh owns the detailed database and financial-engine implementation.

Prabhat owns the system-level architecture around it.

---

# 13. AI Collaboration

The AI / Intelligence owner is Ananya.

The Technical Lead should collaborate on:

- AI service architecture
- server-side AI integration
- environment variables
- API boundaries
- AI data access
- authentication
- security
- deployment
- reliability

Ananya owns AI behavior and intelligence implementation.

Prabhat owns the system boundary within which AI operates.

---

# 14. Integration Responsibility

The Technical Lead is responsible for ensuring that:

```text
Frontend
    â†•
Backend
    â†•
Database
    â†•
AI
    â†•
Authentication
```

form one coherent system.

A feature is not complete if each subsystem works independently but integration fails.

---

# 15. API Contract Coordination

When frontend and backend need to communicate, establish a clear contract.

Example:

```text
Request
    ↓
API
    ↓
Validation
    ↓
Business Logic
    ↓
Response
```

The Technical Lead should help resolve contract disagreements.

Do not allow frontend and backend to independently assume different response structures.

---

# 16. Database Contract Coordination

The Technical Lead does not replace the Backend/Data owner.

Instead, the Technical Lead ensures database architecture remains compatible with:

- authentication
- application architecture
- product requirements
- deployment
- security

Database implementation remains primarily owned by Sarvesh.

---

# 17. AI Architecture Coordination

The AI system should follow:

```text
Trusted Application Data
        ↓
Controlled Context
        ↓
AI
        ↓
Structured Output
        ↓
Validation
        ↓
User Experience
```

The Technical Lead should prevent architectures where AI can freely bypass:

- authentication
- authorization
- RLS
- business rules
- application validation

---

# 18. Security Responsibility

Security is shared across the team.

The Technical Lead is the primary coordinator.

Key areas:

- authentication
- authorization
- secrets
- API boundaries
- server/client separation
- deployment configuration
- dependency risk
- AI security
- data exposure
- production incidents

Any suspected critical security issue should immediately be escalated.

---

# 19. RLS Oversight

Sarvesh owns implementation of RLS policies.

The Technical Lead must verify that application architecture does not accidentally bypass them.

Critical principle:

```text
Frontend filtering
       â‰ 
Database authorization
```

Filtering data in the UI is never a replacement for database-level security.

---

# 20. Production Environment Ownership

The Technical Lead owns production deployment configuration.

Responsibilities:

- Vercel project
- production environment variables
- Firebase production configuration
- Supabase production connection
- AI production configuration
- deployment verification
- rollback coordination

---

# 21. Local Environment Ownership

Local development must remain reproducible.

The Technical Lead should ensure that teammates know:

```text
How to start Next.js
How to start Supabase
How to apply migrations
How to configure environment variables
How to run lint
How to run build
```

Do not require teammates to manually guess infrastructure setup.

---

# 22. Build & Release Responsibility

Before a production release:

```bash
npm run lint
npm run build
```

must pass.

Also verify:

```bash
git status
git diff
```

for accidental changes or secrets.

---

# 23. Deployment Checklist

Before production:

```text
[ ] Git working tree reviewed
[ ] Lint passes
[ ] Build passes
[ ] Environment variables verified
[ ] Firebase verified
[ ] Supabase verified
[ ] RLS verified
[ ] AI configuration verified
[ ] Authentication tested
[ ] Database tested
[ ] Core user journey tested
[ ] Production smoke test completed
```

---

# 24. Production Incident Ownership

If production fails, the Technical Lead coordinates the response.

Process:

```text
Detect
 ↓
Classify
 ↓
Communicate
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

Do not make multiple unrelated changes simultaneously.

---

# 25. Emergency Decision Making

During a critical production or competition issue, the Technical Lead may make a rapid technical decision when necessary.

However:

- communicate the decision
- document significant changes
- avoid unnecessary scope expansion
- restore stability first
- perform deeper refactoring later

---

# 26. Git Responsibilities

The Technical Lead should protect the main branch.

Responsibilities:

- enforce branch workflow
- encourage focused commits
- review high-risk PRs
- coordinate conflict resolution
- prevent accidental secret commits
- coordinate release branches/tags where needed
- maintain production stability

See:

```text
docs/GIT_WORKFLOW.md
```

---

# 27. Shared File Protection

Extra care is required for:

```text
package.json
package-lock.json
next.config.*
tsconfig.json
authentication files
Supabase configuration
database migrations
shared types
deployment configuration
```

Before modifying these files:

1. check for ongoing teammate work
2. communicate if necessary
3. keep changes focused
4. test affected systems

---

# 28. Dependency Decisions

The Technical Lead should review major dependency additions.

Before adding a dependency, ask:

```text
Is it necessary?
Is it already solved?
Does it increase bundle size?
Does it introduce security risk?
Will the team understand it?
Does it help the MVP?
```

For a two-day competition build:

> Prefer a smaller reliable stack over infrastructure experimentation.

---

# 29. Architecture Decision Rule

When choosing between two technically valid solutions, prefer the option that:

1. solves the current problem
2. introduces less complexity
3. is easier for the team to maintain
4. is easier to debug
5. preserves security
6. can be deployed quickly

Do not optimize prematurely for hypothetical scale.

---

# 30. Feature Review

Before accepting a major feature, ask:

### Product

Does this improve the user journey?

### Architecture

Does it fit the current system?

### Data

Does it require schema changes?

### Security

Does it introduce new access paths?

### AI

Does it require AI context or model changes?

### Deployment

Does it require new infrastructure?

### Deadline

Can it realistically be completed?

---

# 31. Technical Debt

Technical debt is acceptable when:

- the trade-off is understood
- it does not compromise security
- it does not corrupt financial data
- it does not make the system unstable
- it is documented when significant

Examples of acceptable competition debt:

```text
Simple mock data source
Minimal caching
Basic analytics
Limited AI evaluation
Simplified background processing
```

Examples of unacceptable debt:

```text
Disabled RLS
Committed secrets
Broken authentication
Unvalidated financial calculations
Unauthorized data access
```

---

# 32. Competition Strategy

The Technical Lead should continuously protect the critical path.

Priority:

```text
Working MVP
    ↓
Reliable Integration
    ↓
Security
    ↓
Demo Quality
    ↓
Polish
    ↓
Nice-to-Have Features
```

Do not allow a teammate to spend most of the remaining deadline on low-impact technical improvements while core functionality remains incomplete.

---

# 33. Technical Freeze

Before the final competition demonstration:

```text
Feature Freeze
      ↓
Integration Test
      ↓
Production Build
      ↓
Deployment
      ↓
Smoke Test
      ↓
Bug Fix Only
      ↓
Demo
```

After freeze, major architectural changes should be avoided.

---

# 34. AI Coding Agent Supervision

The Technical Lead is the primary technical gatekeeper for AI-generated architectural changes.

AI agents may:

- implement scoped features
- refactor small areas
- generate tests
- fix bugs
- create UI
- create utilities

AI agents should not independently:

- redesign the architecture
- replace authentication
- disable RLS
- change production infrastructure
- introduce major dependencies
- delete important functionality
- expose secrets

---

# 35. AI Agent Review Questions

Before accepting AI-generated code:

```text
What did it change?
Why did it change it?
Did it modify unrelated files?
Did it alter security?
Did it alter database behavior?
Did it introduce a dependency?
Did it invent data?
Did it pass lint?
Did it pass build?
```

---

# 36. Technical Lead Daily Checklist

At the beginning of a work session:

```text
[ ] Check Git status
[ ] Check active branches/PRs
[ ] Check blockers
[ ] Check architecture-impacting work
[ ] Check production/demo risk
```

During development:

```text
[ ] Keep integration contracts stable
[ ] Resolve blockers
[ ] Review high-risk changes
[ ] Protect security boundaries
```

Before ending a session:

```text
[ ] Working tree understood
[ ] Changes committed/pushed where appropriate
[ ] Blockers communicated
[ ] Next steps clear
```

---

# 37. Technical Lead Handoff Format

When handing architecture work to another teammate:

```text
AREA:
What subsystem was changed?

CURRENT STATE:
What works?

ARCHITECTURE:
How does it work?

FILES:
What files matter?

DEPENDENCIES:
What must remain unchanged?

TESTING:
What was verified?

NEXT:
What should happen next?
```

---

# 38. Technical Lead Escalation Levels

## Level 1 — Normal

Small implementation issue.

Resolve within the relevant workstream.

## Level 2 — Cross-Team

Two workstreams are blocked.

Technical Lead coordinates.

## Level 3 — Architectural

System design must change.

Technical Lead reviews and documents the decision.

## Level 4 — Critical

Security, production, or major data integrity issue.

Stop unrelated work and prioritize resolution.

---

# 39. Technical Lead Anti-Patterns

Avoid becoming:

### The bottleneck

Do not require approval for every tiny UI change.

### The sole coder

Do not attempt to implement everything personally.

### The architecture astronaut

Do not build infrastructure for hypothetical future scale.

### The emergency-only reviewer

Stay involved early enough to prevent major integration problems.

### The silent decision-maker

Communicate significant decisions.

---

# 40. What the Technical Lead Should NOT Own

The Technical Lead should not micromanage:

- button styling
- typography choices within the design system
- individual AI prompt wording
- every database query
- every component implementation

Ownership remains distributed.

The Technical Lead owns the **system**, not every line.

---

# 41. Success Criteria

The Technical Lead has succeeded when:

```text
The team can work independently
        ↓
Subsystems integrate cleanly
        ↓
Security remains intact
        ↓
Build remains stable
        ↓
Deployment works
        ↓
The product is demo-ready
```

The strongest sign of good technical leadership is not writing the most code.

It is enabling the team to move quickly without breaking the system.

---

# 42. Final Responsibility

The Technical Lead is ultimately responsible for asking:

> **"Does everything we are building still form one reliable NIRNAY product?"**

Every architectural decision should support:

```text
TRUST
SECURITY
SIMPLICITY
INTEGRATION
RELIABILITY
```

The role is to keep the four workstreams moving in the same direction.

**Build the system. Enable the team. Protect the product.**
```
