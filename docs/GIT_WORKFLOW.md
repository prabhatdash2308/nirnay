# NIRNAY — Git & GitHub Workflow

> **Document:** GIT_WORKFLOW.md
> **Project:** NIRNAY
> **Purpose:** Define the team's Git/GitHub collaboration workflow, branch strategy, commit conventions, pull requests, conflict resolution, AI-agent contributions, emergency fixes, and repository safety rules.

---

# 1. Purpose

NIRNAY is being developed by a four-member team.

Git and GitHub are the shared coordination layer for the codebase.

The purpose of this workflow is to ensure:

- Multiple contributors can work simultaneously
- Changes remain traceable
- Work is not accidentally overwritten
- Security-sensitive files are not committed
- AI-generated changes remain reviewable
- The main branch stays usable
- Features can be integrated quickly
- Conflicts are resolved deliberately

The guiding principle is:

> **Move fast without losing ownership, traceability, or control of the codebase.**

---

# 2. Repository

The project repository is:

```text
NIRNAY
```

The canonical remote repository should be treated as the shared source of truth for application code.

The exact GitHub URL should not be hard-coded into documentation if the repository location changes.

---

# 3. Team

The current four-person team is:

```text
Member 1
Technical Lead / Architecture

Member 2
Frontend / Product UX

Member 3
Backend / Data / Financial Engine

Member 4
AI / Intelligence
```

The exact individual names and responsibilities are maintained in:

```text
docs/TEAM.md
docs/members/
```

---

# 4. Branch Strategy

The preferred workflow is:

```text
main
  â”‚
  â”œâ”€â”€ feature/...
  â”œâ”€â”€ fix/...
  â”œâ”€â”€ refactor/...
  â””â”€â”€ chore/...
```

The `main` branch represents the integrated application.

Feature work should normally happen on a dedicated branch.

---

# 5. Main Branch

`main` should remain:

```text
Buildable
Runnable
Reviewable
Deployable
```

Avoid pushing experimental or half-complete work directly to `main`.

If the team's competition timeline requires direct pushes for speed, contributors must still ensure that:

```text
npm run lint
npm run build
```

pass before pushing.

---

# 6. Branch Naming

Use descriptive branch names.

Examples:

```text
feature/policy-dashboard
feature/comparison-engine
feature/financial-calendar
feature/ai-recommendations
fix/auth-token-refresh
fix/mobile-navigation
refactor/supabase-client
chore/update-dependencies
```

Avoid:

```text
test
new
branch1
stuff
changes
final
final2
```

A branch name should communicate intent.

---

# 7. Creating a Branch

Start from an updated `main`:

```bash
git checkout main
git pull
```

Create the feature branch:

```bash
git checkout -b feature/<feature-name>
```

Example:

```bash
git checkout -b feature/policy-dashboard
```

---

# 8. Before Starting Work

Always inspect:

```bash
git status
```

Then synchronize with the latest shared branch:

```bash
git checkout main
git pull
```

Then create or update the feature branch.

This reduces unnecessary merge conflicts.

---

# 9. One Feature Per Branch

A branch should generally represent one logical piece of work.

Good:

```text
feature/policy-dashboard
```

with changes related to the policy dashboard.

Avoid mixing:

```text
Policy dashboard
+
AI redesign
+
Database refactor
+
Unrelated dependency upgrades
```

unless the changes are genuinely required together.

---

# 10. Focused Commits

Commits should represent logical milestones.

Example:

```text
feat: add policy dashboard layout
feat: connect policy data
fix: correct policy expiry calculation
```

Avoid a single huge commit containing unrelated work.

---

# 11. Commit Message Format

Use conventional-style commit messages.

Format:

```text
<type>: <short description>
```

Common types:

```text
feat
fix
refactor
style
docs
test
chore
perf
```

Examples:

```text
feat: add financial goals dashboard
fix: prevent duplicate policy records
refactor: simplify recommendation service
style: improve comparison card spacing
docs: update authentication guide
test: add goal calculation coverage
chore: update dependencies
perf: optimize policy query
```

---

# 12. Commit Message Rules

Good commit messages are:

```text
Short
Specific
Action-oriented
Understandable
```

Avoid:

```text
update
changes
fixed stuff
final
working
done
```

The commit history should help another developer understand what changed.

---

# 13. Before Committing

Run:

```bash
git status
```

Then inspect:

```bash
git diff
```

Confirm:

```text
Correct files
Correct feature
No debug code
No secrets
No unrelated changes
```

---

# 14. Staging Changes

Prefer specific staging:

```bash
git add path/to/file
```

or:

```bash
git add file1 file2 file3
```

Then inspect:

```bash
git diff --cached
```

This makes accidental changes easier to detect.

---

# 15. Validate the Staged Diff

Before committing:

```bash
git diff --cached --check
```

This helps identify whitespace errors and other basic problems.

---

# 16. Required Validation

Before a meaningful commit:

```bash
npm run lint
npm run build
```

If the feature affects a specific flow, manually test that flow as well.

---

# 17. Commit

After validation:

```bash
git commit -m "feat: add <feature>"
```

Example:

```bash
git commit -m "feat: add policy dashboard"
```

---

# 18. Push Feature Branch

Push the branch:

```bash
git push -u origin feature/<feature-name>
```

Example:

```bash
git push -u origin feature/policy-dashboard
```

---

# 19. Pull Requests

When using pull requests:

```text
Feature branch
      ↓
Push
      ↓
Pull Request
      ↓
Review
      ↓
Validation
      ↓
Merge
      ↓
main
```

The PR should explain:

```text
What changed?
Why?
How was it tested?
Are there database changes?
Are there security implications?
Are there UI changes?
```

---

# 20. Pull Request Template

A useful PR description:

```md
## What changed

- Added ...
- Updated ...
- Fixed ...

## Why

Explain the product/technical reason.

## Testing

- [ ] npm run lint
- [ ] npm run build
- [ ] Manual testing

## Database

- [ ] No database changes
- [ ] Migration included

## Security

- [ ] No security impact
- [ ] Security reviewed

## Screenshots

Add screenshots for significant UI changes.
```

---

# 21. PR Review Responsibilities

Reviewers should check:

```text
Correctness
Security
Architecture
Design consistency
Data ownership
Performance
Maintainability
Testing
Documentation
```

The review should not focus only on whether the page visually works.

---

# 22. Technical Lead Review

The Technical Lead should pay particular attention to:

```text
Architecture changes
Authentication
Database architecture
Shared infrastructure
Security
Dependencies
Deployment
Cross-team integration
```

---

# 23. Frontend Review

Frontend / Product UX review should pay attention to:

```text
Design system
Responsive behavior
Accessibility
Component reuse
Loading states
Empty states
Error states
Visual consistency
Interaction quality
```

---

# 24. Backend / Data Review

Backend / Data review should pay attention to:

```text
Schema
Migrations
RLS
Queries
Constraints
Indexes
Financial calculations
Data integrity
API contracts
```

---

# 25. AI Review

AI / Intelligence review should pay attention to:

```text
Prompt design
Structured outputs
Source grounding
Hallucination risk
Recommendation logic
Explainability
Fallback behavior
Model errors
Data minimization
```

---

# 26. Shared File Conflicts

Files likely to experience frequent conflicts include:

```text
package.json
package-lock.json
app/globals.css
shared components
supabase migrations
documentation
```

Communicate before editing highly shared files when possible.

---

# 27. Database Migration Conflicts

Migration files are especially sensitive.

Two contributors may create migrations with different timestamps.

Example:

```text
20260909100000_feature_a.sql
20260909100500_feature_b.sql
```

Both may be valid.

Do not casually rename or delete another contributor's migration.

If migrations conflict:

```text
Review
→ Determine intended order
→ Preserve both changes where possible
→ Test from clean database state
```

---

# 28. Migration Conflict Rule

Never solve a migration conflict by deleting someone else's database change without understanding it.

Database history is part of the application architecture.

---

# 29. Pulling Changes

Before starting new work:

```bash
git checkout main
git pull
```

If already on a feature branch:

```bash
git fetch origin
```

Then integrate the latest main changes according to the team's chosen workflow.

---

# 30. Updating a Feature Branch

One common approach:

```bash
git checkout feature/<feature-name>
git merge main
```

Alternatively, the team may use rebase if everyone understands the consequences.

For a fast-moving team, consistency is more important than choosing an elaborate Git strategy.

---

# 31. Merge vs Rebase

### Merge

```bash
git merge main
```

Advantages:

```text
Simple
Safe for shared branches
Preserves branch history
```

### Rebase

```bash
git rebase main
```

Advantages:

```text
Cleaner linear history
```

But rebasing rewrites commit history.

Do not rebase a branch that other contributors are actively using without coordination.

---

# 32. Conflict Resolution

When Git reports conflicts:

```text
Do not panic.
Do not blindly choose "ours".
Do not blindly choose "theirs".
```

First inspect:

```bash
git status
```

Then inspect conflict markers:

```text
```

Understand what each change is trying to accomplish.

---

# 33. Conflict Resolution Process

Use:

```text
1. Identify conflicting files
2. Read both versions
3. Understand intent
4. Combine compatible changes
5. Remove conflict markers
6. Test
7. Stage resolved files
8. Continue merge/rebase
```

---

# 34. After Conflict Resolution

Run:

```bash
npm run lint
npm run build
```

Then manually test the affected feature.

A conflict resolution that compiles may still have broken behavior.

---

# 35. Abort a Bad Merge

If a merge becomes confusing and has not been completed:

```bash
git merge --abort
```

If rebasing:

```bash
git rebase --abort
```

Use these only when appropriate to the current Git operation.

---

# 36. Never Destroy Work During Conflict Resolution

Before destructive commands:

```text
Check:
git status
git diff
```

If uncertain, stop and ask the Technical Lead.

---

# 37. AI-Generated Changes

AI agents are contributors, not authorities.

Every AI-generated change must be:

```text
Inspected
Tested
Reviewed
```

Do not merge AI-generated changes merely because:

```text
"The code looks good."
```

---

# 38. AI Agent Branches

When practical, use:

```text
feature/ai-<task>
```

or the same branch naming convention used by human contributors.

Example:

```text
feature/ai-comparison-engine
```

The important requirement is traceability.

---

# 39. AI Agent Commit Rules

AI agents should make focused commits when explicitly instructed to commit.

Example:

```text
feat: add comparison scoring logic
```

Avoid:

```text
feat: massive project rewrite
```

---

# 40. AI Agent Scope

An AI agent must not:

```text
Rewrite the entire application
Change architecture without approval
Delete unrelated files
Replace the UI library
Disable RLS
Expose secrets
Modify deployment credentials
```

unless explicitly authorized and properly reviewed.

---

# 41. AI Agent Before/After Report

After making changes, an AI agent should report:

```text
Changed:
- file
- file

Implemented:
- feature
- behavior

Tested:
- npm run lint
- npm run build
- manual test

Potential concerns:
- ...
```

This creates a useful handoff to human contributors.

---

# 42. Secrets and Git

Never commit:

```text
.env
.env.local
Firebase service-account JSON
Private keys
Supabase secret key
API tokens
Passwords
Credential files
```

Before pushing:

```bash
git status --ignored
```

---

# 43. Secret Detection

If a suspicious file appears:

```bash
git status
```

Check whether it is ignored:

```bash
git check-ignore -v <file>
```

Do not add it simply because GitHub says the file is untracked.

---

# 44. If a Secret Is Accidentally Committed

Immediately:

```text
1. Stop using the credential.
2. Rotate/revoke it.
3. Inform the Technical Lead.
4. Remove it from the repository.
5. Assess Git history.
6. Replace it securely.
7. Verify affected services.
```

Deleting the file from the latest commit is not necessarily sufficient.

---

# 45. Force Push

Avoid:

```bash
git push --force
```

on shared branches.

If force push is absolutely necessary:

```text
Obtain team agreement first.
```

Use the safest force-push mode appropriate to the situation.

---

# 46. Destructive Git Commands

Be extremely careful with:

```bash
git reset --hard
git clean -fd
git push --force
```

These commands can destroy work.

Before using them, confirm:

```text
What will be deleted?
Is it committed?
Is another contributor using it?
Can it be recovered?
```

---

# 47. Main Branch Emergency Fix

If production/demo is broken and an immediate fix is required:

```text
Identify issue
   ↓
Create fix branch
   ↓
Minimal fix
   ↓
Test
   ↓
Review
   ↓
Merge
   ↓
Deploy
```

Do not turn an emergency fix into an unrelated refactor.

---

# 48. Hotfix Naming

Example:

```bash
git checkout -b fix/production-auth-error
```

Keep the change narrowly scoped.

---

# 49. Competition Deadline Workflow

Because NIRNAY may be developed under a short competition deadline:

```text
Correctness
    >
Feature count
```

Prioritize:

```text
Working core flows
Stable demo
Authentication
Database security
Comparison
Recommendations
Dashboard
Visual polish
Deployment
```

over speculative features.

---

# 50. Freeze Before Demo

Before the final demo:

```text
Feature development
        ↓
Integration
        ↓
Testing
        ↓
Bug fixing
        ↓
Visual polish
        ↓
Deployment
        ↓
Feature freeze
```

Avoid introducing large architectural changes immediately before the presentation.

---

# 51. Demo Branch

If useful, create:

```text
release/demo
```

or another agreed release branch.

This is optional.

The team should avoid creating unnecessary branch complexity during the competition.

---

# 52. Tagging Releases

For important milestones, tags may be used.

Example:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Potential milestones:

```text
v0.1.0
MVP foundation

v0.2.0
Core user workflow

v1.0.0
Competition demo release
```

Only tag meaningful milestones.

---

# 53. Documentation Changes

Documentation is part of the codebase.

If a change modifies:

```text
Architecture
Database
Authentication
Security
Development workflow
Product behavior
Design system
Deployment
```

update the corresponding documentation.

---

# 54. README Changes

The root README should remain useful to a new contributor.

It should eventually explain:

```text
What NIRNAY is
How to run it
Core architecture
Required environment variables
Development commands
Links to docs
```

Do not duplicate huge amounts of documentation unnecessarily.

---

# 55. Working Tree Cleanliness

Before switching branches:

```bash
git status
```

Understand any uncommitted changes.

Do not switch branches casually when carrying unrelated modifications.

---

# 56. Stashing

If temporary work must be set aside:

```bash
git stash
```

Then later:

```bash
git stash pop
```

Use stash carefully.

Prefer committing meaningful work when possible.

---

# 57. Never Stash Secrets

Do not use Git stash as a secret-storage mechanism.

Secrets belong in:

```text
.env.local
secure secret management
```

not Git history or stash history.

---

# 58. Cherry-Picking

Cherry-pick may be useful when a specific commit needs to be transferred:

```bash
git cherry-pick <commit>
```

Before cherry-picking:

```text
Understand what the commit changes.
Check dependencies.
Check whether related commits are required.
```

Do not cherry-pick blindly.

---

# 59. Code Ownership

Ownership is about responsibility, not exclusive control.

A contributor may modify another area when necessary, but should communicate with the responsible teammate.

Example:

```text
Frontend needs database change
        ↓
Coordinate with Backend/Data

AI feature needs new UI
        ↓
Coordinate with Frontend/UX
```

---

# 60. Integration Responsibility

The Technical Lead should help coordinate cross-cutting changes.

Examples:

```text
Authentication + frontend
Database + AI
AI + recommendations UI
Deployment + environment configuration
```

---

# 61. Avoid Parallel Duplication

Before implementing a major feature, communicate:

```text
"I'm implementing X."
```

This avoids two contributors independently building the same system.

---

# 62. Daily Team Sync

A lightweight team sync should answer:

```text
What did I complete?
What am I working on?
What is blocked?
What shared files will I modify?
What integration do I need?
```

Keep it short.

---

# 63. Handoff Format

When handing work to another teammate:

```md
## Completed

- ...

## Files Changed

- ...

## Behavior

- ...

## Testing

- ...

## Known Issues

- ...

## Next Step

- ...
```

This is especially useful when switching between AI agents.

---

# 64. Commit as a Handoff

A good commit should make handoff easier.

Example:

```text
feat: add policy expiry tracking
```

is better than:

```text
changes
```

---

# 65. Repository Health Check

Periodically run:

```bash
git status
npm run lint
npm run build
```

Then inspect:

```bash
git log --oneline -10
```

This gives a quick view of repository health.

---

# 66. Before Pulling Major Changes

If another teammate changed:

```text
package.json
database
authentication
globals.css
shared components
```

read the relevant diff before continuing work.

---

# 67. Dependency Conflict

If two contributors modify dependencies:

```text
package.json
package-lock.json
```

resolve carefully.

Run:

```bash
npm install
npm run lint
npm run build
```

after resolution.

---

# 68. Lockfile Conflict

Do not manually merge a complex `package-lock.json` conflict unless necessary.

Prefer resolving `package.json` correctly and regenerating the lockfile using npm when appropriate.

Then verify:

```bash
npm install
npm run build
```

---

# 69. Database Branching Reality

Local database state is not automatically synchronized by Git.

Git tracks:

```text
Migration files
```

not the entire local database state.

Therefore migrations are critical.

---

# 70. Schema as Code

The database schema should be reproducible from:

```text
supabase/migrations/
```

A new contributor should be able to recreate the intended schema without depending on undocumented manual Studio edits.

---

# 71. Production Database Rule

Never run experimental SQL against production simply because it worked locally.

Production changes must follow:

```text
Migration
→ Review
→ Apply
→ Verify
```

---

# 72. Pull Request Security Review

Before merging a PR, check:

```text
[ ] No secrets
[ ] No insecure endpoints
[ ] No RLS bypass
[ ] No privileged browser access
[ ] No authentication bypass
[ ] No sensitive logging
```

---

# 73. Pull Request Trust Review

For financial features:

```text
[ ] No fabricated facts
[ ] Sources preserved
[ ] Freshness preserved
[ ] Estimates labeled
[ ] AI output distinguished
[ ] No guarantees
[ ] Recommendation reasoning understandable
```

---

# 74. Pull Request Database Review

For database changes:

```text
[ ] Migration included
[ ] RLS reviewed
[ ] Ownership correct
[ ] Constraints reviewed
[ ] Indexes reviewed
[ ] Cross-user isolation considered
```

---

# 75. Pull Request UI Review

For UI changes:

```text
[ ] Design system followed
[ ] Responsive
[ ] Accessible
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] No unnecessary component duplication
```

---

# 76. Pull Request AI Review

For AI changes:

```text
[ ] Prompt reviewed
[ ] Input data minimized
[ ] Output validated
[ ] Hallucination risk considered
[ ] Source grounding considered
[ ] Fallback behavior exists
[ ] No security authority delegated to AI
```

---

# 77. What Not to Do

Do not:

```text
Commit secrets
Push broken builds knowingly
Disable RLS
Rewrite another person's work without coordination
Delete migrations
Force-push shared branches
Commit generated junk
Leave debug endpoints
Leave console dumps of sensitive data
Install unnecessary dependencies
Rewrite architecture without approval
```

---

# 78. Recommended Command Reference

## Start development

```bash
npm run dev
```

## Lint

```bash
npm run lint
```

## Production build

```bash
npm run build
```

## Git status

```bash
git status
```

## Pull latest changes

```bash
git pull
```

## Create branch

```bash
git checkout -b feature/<name>
```

## Stage

```bash
git add <files>
```

## Review staged changes

```bash
git diff --cached
```

## Validate staged diff

```bash
git diff --cached --check
```

## Commit

```bash
git commit -m "feat: <description>"
```

## Push

```bash
git push -u origin <branch>
```

---

# 79. Supabase Command Reference

Start:

```bash
npx supabase start
```

Status:

```bash
npx supabase status
```

Stop:

```bash
npx supabase stop
```

Apply migrations:

```bash
npx supabase migration up
```

Reset local database:

```bash
npx supabase db reset
```

Create migration:

```bash
npx supabase migration new <name>
```

Never run destructive local commands against production.

---

# 80. Final Integration Checklist

Before merging into `main`:

```text
[ ] Feature works
[ ] No unrelated changes
[ ] Lint passes
[ ] Build passes
[ ] Authentication tested if relevant
[ ] Database tested if relevant
[ ] RLS tested if relevant
[ ] Security reviewed
[ ] Trust reviewed
[ ] AI behavior reviewed if relevant
[ ] Documentation updated
[ ] Git diff reviewed
```

---

# 81. Final Demo Checklist

Before competition presentation:

```text
[ ] main builds
[ ] main runs
[ ] Production deployment works
[ ] Authentication works
[ ] Demo account works
[ ] Database works
[ ] Dashboard works
[ ] Core comparison works
[ ] Recommendation flow works
[ ] No broken links
[ ] No console errors
[ ] No visible secrets
[ ] No real private financial data
[ ] Mobile layout checked
[ ] Desktop layout checked
```

---

# 82. Git Workflow Principle

The repository should tell a clear story:

```text
Issue / Requirement
        ↓
Branch
        ↓
Implementation
        ↓
Test
        ↓
Commit
        ↓
Review
        ↓
Merge
        ↓
Deploy
```

Every meaningful change should be traceable through this chain.

---

# 83. Definition of Git Done

A contribution is complete when:

```text
[ ] Correct branch
[ ] Focused implementation
[ ] Tests pass
[ ] Lint passes
[ ] Build passes
[ ] No secrets
[ ] Diff reviewed
[ ] Commit message is meaningful
[ ] Branch pushed
[ ] PR reviewed where applicable
[ ] Documentation updated where required
```

---

# 84. Final Git Principle

Git is not merely a place to store code.

It is the team's shared memory.

Therefore:

> **Commit clearly, communicate changes, protect the main branch, and never sacrifice repository safety for speed.**

---
