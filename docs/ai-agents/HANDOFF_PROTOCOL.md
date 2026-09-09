# NIRNAY — Human & AI Handoff Protocol

**Project:** NIRNAY
**Team:** TATVAH
**Document Type:** Human/AI handoff and continuity protocol
**Applies To:** All team members and AI coding agents
**Canonical AI Rules:** `docs/ai-agents/AGENT_INSTRUCTIONS.md`

---

# 1. PURPOSE

NIRNAY is being developed collaboratively by four team members and multiple AI coding assistants.

This document defines how work is handed from:

- human → human
- human → AI
- AI → human
- AI → AI

The goal is:

> **No important context should be lost during a handoff.**

A handoff must allow the next person or agent to understand:

```text
What was requested
 ↓
What was inspected
 ↓
What was changed
 ↓
What was validated
 ↓
What remains
 ↓
What the next action should be
```

---

# 2. CORE PRINCIPLE

A handoff is not a conversation transcript.

It is a:

> **compressed, actionable state of the work.**

Do not dump unnecessary history.

Capture the information required to continue safely.

---

# 3. HANDOFF TYPES

NIRNAY uses four primary handoff directions:

```text
Human
 ↓
AI

AI
 ↓
Human

Human
 ↓
Human

AI
 ↓
AI
```

The same core information should survive all four.

---

# 4. REQUIRED HANDOFF INFORMATION

Every meaningful handoff should communicate:

```text
Task
Current state
Relevant files
Architecture decisions
Changes made
Validation performed
Known issues
Remaining work
Risks
Next action
```

---

# 5. MINIMUM HANDOFF FORMAT

Use this format for normal tasks:

```md
## Handoff

### Task
<what was being implemented>

### Owner
<person or agent>

### Status
<not started | in progress | blocked | complete>

### Context
<short explanation>

### Files Changed
- `path/to/file`
- `path/to/file`

### Changes
- ...
- ...

### Validation
- `npm run lint` — PASS
- `npm run build` — PASS
- `git diff --check` — PASS

### Known Issues
- ...

### Remaining Work
- ...

### Risks
- ...

### Next Action
<exact next step>
```

---

# 6. TASK

State the actual task.

Bad:

```text
Worked on dashboard.
```

Good:

```text
Implement the authenticated financial dashboard shell with profile summary,
insurance overview, investment summary, goals, and upcoming financial events.
```

The next person should understand the objective immediately.

---

# 7. OWNER

Identify the current owner.

Examples:

```text
Prabhat Dash
Aryan Gupta
Sarvesh Dhanrale
Ananya Chaudhary
Codex
Claude
Gemini
Cursor
```

For AI agents, identify the provider.

---

# 8. STATUS

Use one of:

```text
NOT STARTED
IN PROGRESS
BLOCKED
READY FOR REVIEW
COMPLETE
```

Do not mark work complete if validation or required functionality remains unfinished.

---

# 9. CONTEXT

Keep context short but sufficient.

Include:

- why the work exists
- relevant product requirement
- important architectural constraint
- important dependency

Do not include irrelevant conversation history.

---

# 10. FILES CHANGED

List every important changed file.

Example:

```text
app/dashboard/page.tsx
components/dashboard/financial-summary.tsx
app/lib/dashboard.ts
```

For generated or migration files, include them explicitly.

---

# 11. CHANGES

Describe what was actually implemented.

Use concrete statements.

Good:

```text
Added authenticated dashboard data loading.
Added empty state for users without financial records.
Added summary cards for insurance and investments.
```

Avoid:

```text
Made dashboard better.
```

---

# 12. VALIDATION

Only report commands that were actually executed.

Typical validation:

```bash
npm run lint
npm run build
git diff --check
```

Feature-specific validation should also be recorded.

Example:

```text
Firebase authentication tested
Supabase RLS tested
Dashboard empty state tested
Mobile layout checked
```

---

# 13. KNOWN ISSUES

Explicitly state incomplete or known problems.

Example:

```text
- AI insights are currently mocked.
- Product data source integration is pending.
- Mobile chart interaction still needs refinement.
```

Never hide known issues to make a handoff appear complete.

---

# 14. REMAINING WORK

State what still needs to happen.

Prefer actionable items:

```text
- Connect dashboard summary to `financial_profiles`.
- Add insurance renewal data.
- Add loading skeleton.
```

Avoid:

```text
- Finish dashboard.
```

---

# 15. RISKS

Mention anything that could affect the next step.

Examples:

```text
- Changing the shared financial profile type will affect dashboard and recommendation code.
- This migration requires RLS policy verification.
- AI provider credentials are not configured locally.
```

---

# 16. NEXT ACTION

Every meaningful handoff should identify the next action.

Example:

```text
Run the dashboard flow with a Firebase-authenticated user and verify that
only the current user's records are returned.
```

The next person should not need to ask:

> "What should I do now?"

---

# 17. HUMAN → AI HANDOFF

When asking an AI agent to continue work, provide:

```text
Task
Relevant documentation
Current implementation
Constraints
Expected outcome
Validation requirement
```

Example:

```text
Read:
- docs/ai-agents/AGENT_INSTRUCTIONS.md
- docs/DATABASE.md
- docs/DESIGN_SYSTEM.md

Task:
Implement the dashboard financial summary.

Constraints:
- Preserve Firebase authentication.
- Use Supabase RLS.
- Do not introduce a new UI framework.
- Do not use mock production data.

Validation:
- npm run lint
- npm run build
- verify authenticated user isolation
```

---

# 18. AI → HUMAN HANDOFF

AI must not simply say:

```text
Done.
```

Instead report:

```text
What changed
Where
Why
What was tested
What failed
What remains
```

Use the standard handoff format.

---

# 19. HUMAN → HUMAN HANDOFF

A human handoff should be understandable without the original conversation.

Example:

```md
## Handoff

### Task
Implement insurance comparison UI.

### Owner
Aryan Gupta

### Status
IN PROGRESS

### Context
Comparison is part of the core Discover → Compare → Decide flow.

### Files Changed
- `app/compare/page.tsx`
- `components/insurance/comparison-table.tsx`

### Changes
- Added comparison table structure.
- Added responsive mobile layout.
- Added selected-product state.

### Validation
- `npm run lint` — PASS
- Manual desktop check — PASS

### Known Issues
- Product data is currently connected to the temporary fixture layer.

### Remaining Work
- Connect to verified product data.
- Add source and freshness metadata.

### Risks
- Comparison fields must match the backend product schema.

### Next Action
Sarvesh should confirm the final product comparison data contract.
```

---

# 20. AI → AI HANDOFF

When switching AI providers, create a compact continuation context.

Example:

```md
## AI Continuation Context

### Project
NIRNAY

### Task
Implement insurance comparison.

### Current State
Comparison UI exists and uses temporary product data.

### Important Files
- `app/compare/page.tsx`
- `components/insurance/comparison-table.tsx`

### Architecture
Next.js → Supabase
Firebase handles identity.

### Constraints
- Preserve RLS.
- Preserve design system.
- No unsupported financial claims.
- Verified product data must retain source metadata.

### Completed
- Table layout
- Responsive layout
- Selection state

### Pending
- Backend product query
- Source metadata
- Freshness display

### Validation
- `npm run lint` — PASS

### Next Action
Inspect the backend product schema before replacing the temporary data layer.
```

---

# 21. NEVER RELY ON MEMORY ALONE

AI agents must not assume that another agent remembers:

- previous decisions
- hidden implementation details
- temporary fixes
- environment configuration
- database changes
- unresolved issues

Record important state in:

```text
documentation
code
migrations
commit history
handoff notes
```

---

# 22. SOURCE OF TRUTH ORDER

When information conflicts, prefer:

```text
1. Current repository implementation
2. Database schema/migrations
3. Current environment configuration
4. Canonical project documentation
5. Recent Git history
6. Handoff notes
7. Conversation history
8. Agent assumptions
```

Agent assumptions should never override verified repository state.

---

# 23. DOCUMENTATION VS CODE

If documentation says:

```text
X exists
```

but the repository shows:

```text
X does not exist
```

do not blindly follow the documentation.

Verify the implementation.

Then determine whether the documentation is stale.

---

# 24. STALE CONTEXT

Mark stale information explicitly.

Example:

```text
STALE:
The old dashboard used mock data.

CURRENT:
The dashboard now reads from Supabase.
```

Do not allow outdated instructions to silently propagate.

---

# 25. ARCHITECTURAL DECISIONS

Important decisions should be recorded.

Examples:

```text
Firebase remains the identity provider.
Supabase remains the application database.
RLS remains the primary user-data isolation mechanism.
AI does not perform deterministic financial calculations.
```

If a decision changes:

```text
Old decision
 ↓
Reason for change
 ↓
New decision
 ↓
Affected systems
```

should be documented.

---

# 26. DECISION LOGGING

For major architectural decisions, use:

```md
### Decision
<decision>

### Reason
<why>

### Alternatives Considered
- ...
- ...

### Impact
- ...
- ...
```

Do not create decision records for trivial implementation details.

---

# 27. DATABASE HANDOFF

Database changes require additional information:

```text
Migration file
Tables affected
Columns affected
Constraints
Indexes
RLS policies
Data migration requirements
Rollback considerations
```

Example:

```text
Migration:
supabase/migrations/20260909120000_add_goal_priority.sql

Affected table:
financial_goals

Added:
priority

RLS:
Existing policies remain unchanged.
```

---

# 28. AUTHENTICATION HANDOFF

Authentication changes must mention:

```text
Firebase behavior
Supabase behavior
JWT/custom claims
token refresh
RLS impact
client/server boundary
```

Never assume authentication changes are isolated.

---

# 29. AI HANDOFF

AI changes must mention:

```text
provider
model
prompt/version
input context
output schema
validation
fallback
cost/latency considerations
security considerations
```

Example:

```text
Prompt:
RECOMMENDATION_EXPLANATION_PROMPT_V1

Output:
structured JSON

Validation:
schema validation before UI rendering

Fallback:
deterministic comparison remains available
```

---

# 30. FRONTEND HANDOFF

Frontend changes should mention:

```text
route
components
states
responsive behavior
data source
loading state
empty state
error state
accessibility considerations
```

---

# 31. BACKEND HANDOFF

Backend changes should mention:

```text
endpoint
request
response
authentication
authorization
database queries
validation
errors
external dependencies
```

---

# 32. FINANCIAL ENGINE HANDOFF

Financial logic changes should mention:

```text
inputs
formula
assumptions
numeric representation
rounding
outputs
edge cases
```

Example:

```text
Input:
monthly SIP = ₹5,000

Assumption:
annual return = 12%

Output:
projected value

Important:
projection is illustrative and not guaranteed.
```

---

# 33. TRUST HANDOFF

Any feature that presents financial information must identify:

```text
data source
verification state
freshness
calculation source
AI-generated content
unknown fields
```

This prevents trust metadata from being lost during implementation.

---

# 34. SECURITY HANDOFF

If security-sensitive code changed, state:

```text
authentication impact
authorization impact
RLS impact
secret handling
input validation
logging impact
```

If no security boundary changed, state:

```text
Security boundary unchanged.
```

---

# 35. BLOCKED HANDOFF

When blocked, do not continue guessing.

Use:

```md
## Blocked

### Task
...

### Blocker
...

### Evidence
...

### What Was Tried
- ...
- ...

### Required Decision
...

### Suggested Owner
...

### Next Step After Unblocking
...
```

---

# 36. BLOCKER EXAMPLE

```md
## Blocked

### Task
Connect insurance comparison to verified product data.

### Blocker
The current database schema does not contain the required product catalogue.

### Evidence
Existing schema contains user-owned insurance policies but no product catalogue table.

### What Was Tried
- Inspected `docs/DATABASE.md`.
- Inspected Supabase migrations.
- Searched existing product-related types.

### Required Decision
Determine whether product catalogue data should be introduced for the MVP.

### Suggested Owner
Sarvesh Dhanrale + Prabhat Dash

### Next Step After Unblocking
Define the product data contract and migration.
```

---

# 37. DO NOT HIDE BLOCKERS

A blocked task should remain visibly blocked.

Do not:

- invent a schema
- invent an API
- fabricate data
- silently use fake production behavior
- bypass security

---

# 38. COMMIT AS HANDOFF CHECKPOINTS

Meaningful commits can serve as continuation points.

Prefer commits that represent coherent states:

```text
feat: add authenticated dashboard shell
feat: add financial profile persistence
feat: add insurance comparison
fix: validate recommendation response
```

Avoid giant commits that combine unrelated work.

---

# 39. COMMIT + HANDOFF

When appropriate, include:

```text
Commit:
<hash>

Branch:
<branch>

Status:
READY FOR REVIEW
```

This allows another teammate to inspect the exact state.

---

# 40. UNCOMMITTED HANDOFF

If work is intentionally uncommitted:

```text
Status:
IN PROGRESS

Working tree:
contains intentional uncommitted changes

Important:
Do not reset or clean the working tree.
```

This prevents accidental loss.

---

# 41. HANDOFF DURING ACTIVE DEVELOPMENT

If another teammate is currently modifying nearby files:

```text
Stop
 ↓
Inspect git status
 ↓
Identify overlap
 ↓
Coordinate
 ↓
Continue
```

Do not overwrite active work.

---

# 42. CONFLICT HANDOFF

When merge conflicts occur, report:

```text
Files conflicted
Conflict cause
Which behavior each side represents
Recommended resolution
Tests required afterward
```

Do not blindly choose one side.

---

# 43. PRODUCTION HANDOFF

Before deployment handoff, include:

```text
build status
environment variables required
database migration status
Firebase configuration status
Supabase configuration status
AI provider configuration
smoke tests
known limitations
rollback plan
```

---

# 44. DEPLOYMENT HANDOFF EXAMPLE

```md
## Deployment Handoff

### Build
`npm run build` — PASS

### Environment
Required variables configured in deployment environment.

### Database
Migrations applied.

### Firebase
Authentication providers enabled.

### Supabase
Third-party Firebase authentication enabled.

### AI
Provider configured server-side.

### Smoke Tests
- Sign up — PASS
- Google sign-in — PASS
- Dashboard — PASS
- User isolation — PASS

### Known Limitations
AI explanation may fall back when provider is unavailable.

### Rollback
Revert the deployment to the previous known-good commit.
```

---

# 45. COMPETITION DEMO HANDOFF

Before a demo, identify:

```text
demo account
demo data
demo path
expected outputs
fallback behavior
known risks
```

Never expose real user credentials.

---

# 46. DEMO PATH

The intended demonstration should generally communicate:

```text
Authentication
 ↓
Financial profile
 ↓
Dashboard
 ↓
Discover
 ↓
Compare
 ↓
Decide
 ↓
Manage
 ↓
AI explanation
```

The exact final path may evolve.

---

# 47. HANDOFF QUALITY STANDARD

A good handoff allows the next person to answer:

```text
What am I doing?
Why am I doing it?
Where is the code?
What has already changed?
What is verified?
What is broken?
What remains?
What should I do next?
```

If the handoff cannot answer these questions:

> It is incomplete.

---

# 48. NO CONTEXT DUMPING

Do not paste:

- entire source files
- entire terminal logs
- entire chat histories
- huge stack traces
- irrelevant documentation

unless specifically required.

Provide the smallest useful context.

---

# 49. IMPORTANT LOGS

When an error matters, preserve:

```text
error message
reproduction step
affected route
affected component
relevant environment
```

Redact:

```text
tokens
keys
passwords
private identifiers
sensitive personal data
```

---

# 50. REPRODUCTION STEPS

For bugs, always attempt to provide:

```text
1. Start application
2. Sign in
3. Open route
4. Perform action
5. Observe result
```

The next agent should be able to reproduce the problem.

---

# 51. BUG HANDOFF FORMAT

```md
## Bug Handoff

### Problem
<what is wrong>

### Expected
<expected behavior>

### Actual
<actual behavior>

### Reproduction
1. ...
2. ...
3. ...

### Affected Files
- ...

### Suspected Layer
<UI | client | API | auth | database | AI | external provider>

### Evidence
...

### Attempts
- ...

### Next Step
...
```

---

# 52. SECURITY INCIDENT HANDOFF

If a potential secret exposure or security issue is discovered:

> Stop normal implementation and escalate.

Record:

```text
what happened
affected area
whether a secret may have been exposed
what was contained
what needs rotation
who needs to review
```

Never copy the secret into the handoff.

---

# 53. DATA INCIDENT HANDOFF

If incorrect financial data may have been stored or displayed:

```text
Stop affected operation
 ↓
Identify affected records/flow
 ↓
Preserve evidence
 ↓
Notify owner
 ↓
Determine correction
 ↓
Validate
```

Do not silently rewrite data without understanding the impact.

---

# 54. AI INCIDENT HANDOFF

If AI generates unsupported financial claims:

```text
Capture the behavior
 ↓
Identify prompt/context
 ↓
Identify affected output
 ↓
Prevent unsafe display
 ↓
Escalate to AI owner
```

Do not normalize unsupported claims as acceptable output.

---

# 55. HANDOFF BETWEEN PROVIDERS

When switching:

```text
Codex → Claude
Claude → Gemini
Gemini → Cursor
Cursor → Codex
```

the receiving agent should first read:

```text
docs/ai-agents/AGENT_INSTRUCTIONS.md
docs/ai-agents/HANDOFF_PROTOCOL.md
```

Then inspect the repository.

---

# 56. RECEIVING A HANDOFF

The receiving agent should:

```text
Read handoff
 ↓
Read relevant docs
 ↓
Inspect current repository
 ↓
Verify claimed state
 ↓
Continue
```

Do not blindly trust the handoff.

---

# 57. VERIFY HANDOFF CLAIMS

If a handoff says:

```text
"lint passes"
```

the receiving agent should trust the report provisionally but rerun validation when its changes affect the relevant code.

If it says:

```text
"migration applied"
```

verify the current migration/schema state before making further database changes.

---

# 58. Handoff Completion

A handoff is complete when:

```text
Current state is clear
Relevant files are identified
Validation is recorded
Known issues are explicit
Next action is defined
Risks are visible
```

---

# 59. STANDARD HANDOFF TEMPLATE

Copy this template when needed:

```md
# Handoff

## Task
<task>

## Owner
<owner>

## Status
<NOT STARTED | IN PROGRESS | BLOCKED | READY FOR REVIEW | COMPLETE>

## Context
<context>

## Relevant Documentation
- `docs/...`
- `docs/...`

## Files Changed
- `...`

## Changes Made
- ...
- ...

## Architecture Decisions
- ...

## Validation
- `npm run lint` — <PASS/FAIL/NOT RUN>
- `npm run build` — <PASS/FAIL/NOT RUN>
- `git diff --check` — <PASS/FAIL/NOT RUN>
- Feature-specific tests — <status>

## Known Issues
- ...

## Remaining Work
- ...

## Risks
- ...

## Security Impact
- ...

## Data / RLS Impact
- ...

## AI Impact
- ...

## Commit
<hash or "uncommitted">

## Next Action
<exact next action>
```

---

# 60. FINAL PRINCIPLE

NIRNAY development must remain understandable even when:

- teammates change tasks
- AI providers change
- conversations become long
- implementation evolves
- bugs interrupt development
- deadlines become tight

Therefore:

> **Document state, not noise.**

A good handoff should make the next step obvious.

The goal is not to preserve every word of the past.

The goal is to preserve enough verified context to continue safely and efficiently.
```

---
