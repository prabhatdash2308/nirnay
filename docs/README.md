# NIRNAY Documentation

> **NIRNAY — Your Financial Protection & Investment Copilot**

NIRNAY is a production-oriented fintech application designed to help users discover, compare, understand, decide on, and manage financial protection and investment products through a trustworthy, explainable, and user-centric experience.

The core product loop is:

**Discover → Compare → Decide → Manage → Optimize**

The long-term continuous loop is:

**Track → Detect → Compare → Recommend → Act → Track**

---

## 1. Purpose of This Documentation

This documentation is the shared source of truth for the NIRNAY project.

It exists so that:

- every team member understands what we are building
- every team member understands why we are building it
- every team member understands their responsibilities
- developers understand the architecture and technical boundaries
- designers understand the product and design system
- AI agents understand how they are allowed to work inside the repository
- nobody independently introduces conflicting architecture
- nobody invents financial or product information
- development can happen in parallel without losing consistency
- future contributors can understand the project without relying on private conversations

**If there is a conflict between an individual's assumption and this documentation, the repository and current implementation are the source of truth.**

Documentation should be updated when an architectural, product, security, data, or workflow decision materially changes.

---

# 2. Start Here

If you are new to NIRNAY, follow this order.

### Human team members

1. Read this file.
2. Read [`PROJECT.md`](./PROJECT.md).
3. Read [`PRODUCT.md`](./PRODUCT.md).
4. Read [`ARCHITECTURE.md`](./ARCHITECTURE.md).
5. Read [`TECH_STACK.md`](./TECH_STACK.md).
6. Read [`DEVELOPMENT.md`](./DEVELOPMENT.md).
7. Read [`GIT_WORKFLOW.md`](./GIT_WORKFLOW.md).
8. Read [`TEAM.md`](./TEAM.md).
9. Read your individual assignment in [`members/`](./members/).
10. Read any additional technical documentation relevant to your task.
11. Inspect the actual repository before making changes.
12. Work only within your assigned responsibility unless coordination is required.

### AI coding agents

AI agents must additionally read:

1. [`ai-agents/README.md`](./ai-agents/README.md)
2. [`ai-agents/AGENT_INSTRUCTIONS.md`](./ai-agents/AGENT_INSTRUCTIONS.md)
3. [`ai-agents/HANDOFF_PROTOCOL.md`](./ai-agents/HANDOFF_PROTOCOL.md)
4. The appropriate agent-specific guide in [`ai-agents/`](./ai-agents/).
5. The relevant human team member assignment in [`members/`](./members/).

**An AI agent must inspect the repository before proposing or implementing architectural changes.**

---

# 3. Documentation Map

| Document | Purpose |
|---|---|
| [`PROJECT.md`](./PROJECT.md) | Project vision, problem, solution, goals, scope, constraints |
| [`PRODUCT.md`](./PRODUCT.md) | Product requirements, user journeys, features and MVP behavior |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System architecture, layers, boundaries and technical structure |
| [`TECH_STACK.md`](./TECH_STACK.md) | Technology choices, versions, rationale and usage rules |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | UI/UX principles, visual language and component standards |
| [`DATABASE.md`](./DATABASE.md) | Database model, tables, relationships, RLS and migration rules |
| [`AUTHENTICATION.md`](./AUTHENTICATION.md) | Firebase authentication and Firebase → Supabase integration |
| [`SECURITY.md`](./SECURITY.md) | Security requirements, secrets, access control and threat considerations |
| [`TRUST_AND_DATA_POLICY.md`](./TRUST_AND_DATA_POLICY.md) | Financial-data trust, provenance, verification and AI safety rules |
| [`DEVELOPMENT.md`](./DEVELOPMENT.md) | Local development and engineering practices |
| [`GIT_WORKFLOW.md`](./GIT_WORKFLOW.md) | Branches, commits, pull requests and collaboration |
| [`ROADMAP.md`](./ROADMAP.md) | Execution roadmap and two-day shipping plan |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Production deployment architecture and checklist |
| [`QUALITY_STANDARDS.md`](./QUALITY_STANDARDS.md) | Definition of done, testing and quality gates |
| [`TEAM.md`](./TEAM.md) | Team structure, responsibilities and collaboration model |

---

# 4. Team Documentation

Each member has a dedicated assignment document.

| Member | Responsibility | Assignment |
|---|---|---|
| Member 1 | Technical Lead / Architecture | [`MEMBER_1_TECH_LEAD.md`](./members/MEMBER_1_TECH_LEAD.md) |
| Member 2 | Frontend / Product UX | [`MEMBER_2_FRONTEND_UX.md`](./members/MEMBER_2_FRONTEND_UX.md) |
| Member 3 | Backend / Data / Financial Engine | [`MEMBER_3_BACKEND_DATA.md`](./members/MEMBER_3_BACKEND_DATA.md) |
| Member 4 | AI / Intelligence | [`MEMBER_4_AI_INTELLIGENCE.md`](./members/MEMBER_4_AI_INTELLIGENCE.md) |

These documents define:

- responsibilities
- ownership
- current tasks
- expected deliverables
- dependencies
- files and areas likely to be touched
- boundaries
- quality requirements
- handoff requirements
- definition of done

---

# 5. AI Agent Documentation

AI agents are treated as engineering assistants, not autonomous product owners.

The AI documentation defines how agents must work.

| Document | Purpose |
|---|---|
| [`ai-agents/README.md`](./ai-agents/README.md) | AI documentation entry point |
| [`ai-agents/AGENT_INSTRUCTIONS.md`](./ai-agents/AGENT_INSTRUCTIONS.md) | Universal instructions for coding agents |
| [`ai-agents/GEMINI.md`](./ai-agents/GEMINI.md) | Gemini-specific working instructions |
| [`ai-agents/CLAUDE.md`](./ai-agents/CLAUDE.md) | Claude-specific working instructions |
| [`ai-agents/CURSOR.md`](./ai-agents/CURSOR.md) | Cursor-specific working instructions |
| [`ai-agents/CODEX.md`](./ai-agents/CODEX.md) | Codex-specific working instructions |
| [`ai-agents/HANDOFF_PROTOCOL.md`](./ai-agents/HANDOFF_PROTOCOL.md) | Required reporting and handoff format |

---

# 6. Current Project Status

NIRNAY is currently in the **MVP implementation phase**.

The foundational authentication and database infrastructure has already been established.

### Completed foundation

- Next.js application foundation
- TypeScript
- React
- Tailwind CSS
- shadcn/ui foundation
- Firebase project
- Firebase Web Authentication
- Email/password authentication
- Google authentication
- Firebase Admin SDK
- Firebase custom authentication role
- Firebase → Supabase third-party authentication integration
- Supabase local development environment
- Supabase JavaScript client
- Row Level Security
- initial NIRNAY database schema
- database migrations
- user profile persistence
- authenticated Firebase → Supabase Data API flow
- local authentication/database bridge verification
- Git repository and team collaboration setup
- initial production-oriented architecture foundation

### Current repository checkpoint

The authentication/database foundation was committed as:

`28fc7f4 feat: establish authentication and database foundation`

This commit has been pushed to the GitHub repository.

---

# 7. Current Technical Foundation

The current application uses:

```text
Frontend
    ↓
Next.js
    ↓
React + TypeScript
    ↓
Tailwind CSS + shadcn/ui

Authentication
    ↓
Firebase Authentication
    ↓
Firebase Admin SDK
    ↓
Firebase custom claims

Data
    ↓
Supabase
    ↓
PostgreSQL
    ↓
Row Level Security

Authentication bridge
    ↓
Firebase ID Token
    ↓
Supabase third-party Firebase authentication
    ↓
PostgreSQL RLS

The complete architecture is documented in [`ARCHITECTURE.md`](./ARCHITECTURE.md).
8. Product Scope
The initial NIRNAY MVP focuses on:
Financial protection
- Health insurance
- Motor insurance
- Life insurance
Investments
- SIPs
- Mutual funds
Core capabilities
- Discover products
- Compare products
- Understand important product attributes
- Maintain a financial profile
- Track existing financial products
- Manage insurance policies
- Track investments
- Set financial goals
- Maintain a watchlist
- Receive alerts
- Maintain a financial calendar
- Receive suitability-oriented recommendations
- Explain recommendations
- Provide an AI-powered financial copilot experience
The exact MVP behavior is defined in [`PRODUCT.md`](./PRODUCT.md).
9. NIRNAY Trust Principle
NIRNAY is a financial product.
Therefore, trust is a product requirement, not merely a technical requirement.
The system must distinguish between:
Verified facts
Information obtained from an identified and trusted source.
Examples:
- product name
- insurer/fund provider
- coverage information
- policy features
- fees
- eligibility information
- documented terms
- investment product metadata
Calculated information
Information calculated by NIRNAY from known inputs.
Examples:
- comparison scores
- budget allocation
- goal projections
- premium comparisons
- portfolio summaries
AI-generated explanations
Natural-language explanations generated from verified facts and calculated information.
AI-generated text must not become the source of truth.
10. Non-Negotiable Trust Rules
NIRNAY must never:
- invent insurance product facts
- invent policy coverage
- invent premiums
- invent investment returns
- invent fees
- invent eligibility criteria
- invent regulatory information
- invent offers
- invent partnerships
- invent user statistics
- claim guaranteed returns
- claim guaranteed savings
- present an AI guess as a verified fact
- hide the source of important financial information
- fabricate citations
- imply that an unavailable product is currently available
- misrepresent stale information as current information
When external financial/product information is used, the system should preserve provenance whenever practical:
- source
- source URL
- last verified date
- data update date
- relevant metadata
Detailed rules are defined in [`TRUST_AND_DATA_POLICY.md`](./TRUST_AND_DATA_POLICY.md).
11. Architecture Philosophy
NIRNAY follows a layered approach.
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚              UI / UX                â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚         Application Logic           â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚       Intelligence / Rules          â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚       Verified Facts / Data         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚       PostgreSQL / Supabase         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Firebase Authentication / Identity  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
The AI layer sits above verified facts and intelligence.
Verified Data
      ↓
Deterministic Calculations
      ↓
Suitability / Recommendation Logic
      ↓
AI Explanation / Conversation
The AI should explain and assist rather than independently inventing financial truth.
12. Development Principle
We are building a real MVP under a very short delivery window.
Therefore:
Ship a coherent, reliable MVP rather than a large collection of unfinished features.

Priorities are:
1. Correctness
2. Trust
3. Core user experience
4. Authentication/security
5. Data integrity
6. Demonstrable intelligence
7. Visual polish
8. Additional features
Do not sacrifice the first six merely to add more screens.
13. Two-Day Delivery Constraint
The project currently has approximately two days remaining to:
- complete the MVP
- integrate all team work
- deploy the application
- validate the production build
- prepare the final demo
- ship the submission
The detailed execution strategy is defined in [`ROADMAP.md`](./ROADMAP.md).
Every feature should therefore be evaluated using:
MUST SHIP
Required for the core product and demo.
SHOULD SHIP
Important improvements if the core MVP is stable.
IF TIME REMAINS
Optional polish or secondary functionality.
14. Git and Collaboration Rules
The repository is shared by the entire team.
All contributors must:
- work on feature branches
- keep commits focused
- avoid committing secrets
- avoid force-pushing shared branches
- create pull requests where practical
- communicate ownership before modifying shared infrastructure
- use database migrations for schema changes
- avoid manually modifying production database structure
- run validation before requesting integration
- avoid unrelated refactors
- document important architectural changes
The main branch should remain deployable.
See [`GIT_WORKFLOW.md`](./GIT_WORKFLOW.md).
15. Secrets and Environment Variables
Never commit:
- .env
- .env.local
- Firebase service-account JSON
- private keys
- API secrets
- Supabase secret keys
- access tokens
- credentials
- passwords
Public Firebase web configuration values are intentionally used by the browser application, but server credentials and private keys must remain protected.
The Firebase Admin service-account file is stored locally under:
secrets/
and must never be committed.
Security requirements are documented in [`SECURITY.md`](./SECURITY.md).
16. Definition of a Good Contribution
A contribution is considered complete only when:
- the requested behavior works
- existing functionality is not unnecessarily broken
- TypeScript is valid
- lint passes
- production build passes where applicable
- UI is responsive where applicable
- authentication and authorization boundaries are respected
- RLS is respected
- no secrets are exposed
- financial facts are not fabricated
- changes are limited to the intended scope
- documentation is updated if behavior or architecture changed
- the contributor can clearly explain what changed
See [`QUALITY_STANDARDS.md`](./QUALITY_STANDARDS.md).
17. Ownership Boundaries
The four team responsibilities are intentionally separated.
Member 1 — Technical Lead / Architecture
Owns:
- architecture
- integration
- authentication/security
- infrastructure
- shared engineering standards
- final integration
- deployment coordination
Member 2 — Frontend / Product UX
Owns:
- visual experience
- application shell
- navigation
- pages
- components
- responsive UI
- interaction design
- product UX
Member 3 — Backend / Data / Financial Engine
Owns:
- database extensions
- financial data model
- product data
- verified product facts
- data ingestion
- deterministic financial calculations
- backend APIs/services
Member 4 — AI / Intelligence
Owns:
- recommendation logic
- suitability scoring
- explainability
- AI copilot
- AI prompts
- AI integration
- AI safety boundaries
- grounding AI responses in verified data
Detailed assignments are in [`members/`](./members/).
18. Shared Engineering Rule
Before changing code, ask:
1. What problem am I solving?
2. Is this part of my responsibility?
3. Does an existing implementation already solve part of it?
4. What existing files will this affect?
5. Does the change affect another team member's area?
6. Does it affect authentication, RLS, database structure, or shared UI?
7. Does it require a migration?
8. Does it introduce a new dependency?
9. Does it introduce a new security risk?
10. Does it affect the production build?
If the answer to any of these is unclear, inspect the repository and documentation before coding.
19. What We Do Not Want
NIRNAY should not become:
- a generic chatbot
- a fake financial advisor
- a static dashboard full of meaningless charts
- a collection of disconnected UI screens
- a product comparison site with unverified data
- an AI wrapper that invents answers
- a demo that works only on one developer's machine
- a codebase filled with temporary hacks that cannot be explained
The goal is a coherent fintech MVP with a credible technical foundation and a strong demo experience.
20. Source of Truth Hierarchy
When resolving uncertainty, use this order:
1. Actual repository implementation
2. Database migrations
3. Explicit project documentation
4. Official platform/library documentation
5. Approved team decisions
6. Reasonable engineering judgment
Never replace an existing implementation with an assumption without inspecting it first.
For financial/product facts, the source hierarchy is different and is defined in [`TRUST_AND_DATA_POLICY.md`](./TRUST_AND_DATA_POLICY.md).
21. Documentation Maintenance
Documentation is part of the product engineering process.
Update documentation when:
- architecture changes
- technology choices change
- database structure changes
- authentication changes
- security requirements change
- product scope changes
- team ownership changes
- deployment architecture changes
- AI behavior changes
- major development workflow changes
Do not create documentation for the sake of documentation.
Documentation should answer:
What? Why? How? Who owns it? What are the constraints? What is the current state? What happens next?

22. First Action for New Contributors
If you are a human teammate:
Read:
docs/README.md
docs/PROJECT.md
docs/PRODUCT.md
docs/ARCHITECTURE.md
docs/TEAM.md
docs/members/<YOUR_ASSIGNMENT>.md
If you are an AI agent:
Read:
docs/README.md
docs/ai-agents/README.md
docs/ai-agents/AGENT_INSTRUCTIONS.md
docs/ai-agents/HANDOFF_PROTOCOL.md
docs/members/<RELEVANT_MEMBER_ASSIGNMENT>.md
Then inspect the actual repository.
Do not begin implementation from assumptions.
23. NIRNAY in One Sentence
NIRNAY is a trustworthy financial protection and investment copilot that helps people discover, compare, decide on, and manage financial products using verified information, deterministic intelligence, and explainable AI.

24. Current Mission
For the current two-day build window:
Build, integrate, deploy, and ship a coherent NIRNAY MVP that demonstrates a complete user journey from financial profile → discovery/comparison → intelligent recommendation → management, with trustworthy data handling and explainable AI.

Everything we build should contribute to that mission.
