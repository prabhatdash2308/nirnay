# NIRNAY — Deployment Guide

> **Status:** Active
> **Deployment Target:** Production MVP
> **Primary Frontend Platform:** Vercel
> **Authentication:** Firebase Authentication
> **Database:** Supabase PostgreSQL
> **AI Layer:** External AI provider(s), configured through server-side environment variables

---

# 1. Purpose

This document defines the deployment architecture and release process for NIRNAY.

The goal is to provide a repeatable path from:

```text
Local Development
      ↓
GitHub
      ↓
Production Build
      ↓
Vercel
      ↓
Firebase + Supabase + AI Services
      ↓
Production NIRNAY
```

Deployment must preserve:

- authentication
- authorization
- database security
- environment-variable separation
- Row Level Security
- AI safety
- data trust requirements
- application reliability

---

# 2. Production Architecture

The intended production architecture is:

```text
                         USERS
                           â”‚
                           â–¼
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚   Vercel    â”‚
                    â”‚  Next.js    â”‚
                    â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜
                           â”‚
             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
             â”‚             â”‚             â”‚
             â–¼             â–¼             â–¼
       Firebase Auth   Supabase DB    AI Services
             â”‚             â”‚             â”‚
             â”‚             â”‚             â”‚
             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                           â–¼
                        NIRNAY
```

---

# 3. Production Components

## 3.1 Vercel

Vercel hosts the Next.js application.

Responsibilities include:

- frontend delivery
- Next.js server rendering
- API routes
- server-side application logic
- production environment variables
- deployment previews
- production deployments

The frontend must never contain server-only secrets.

---

# 4. Firebase Authentication

Firebase is responsible for user identity.

NIRNAY currently supports:

- Email/password authentication
- Google authentication

Firebase provides the authenticated user identity and Firebase ID token.

The Firebase UID is the canonical user identifier across the application.

---

# 5. Firebase Admin SDK

Firebase Admin SDK is used only in trusted server-side code.

Current responsibilities include:

- verifying Firebase ID tokens
- reading Firebase users
- assigning custom claims
- server-side authentication operations

The Firebase service-account private key must never be:

- committed to Git
- exposed to the browser
- stored in `NEXT_PUBLIC_*` variables
- included in client-side bundles
- pasted into public documentation

The service-account file is currently excluded from Git through:

```text
/secrets/
```

---

# 6. Firebase Custom Role

NIRNAY uses the Firebase custom claim:

```json
{
  "role": "authenticated"
}
```

This claim is required by the Supabase Firebase third-party authentication integration.

The flow is:

```text
Firebase Login
      ↓
Firebase ID Token
      ↓
/api/auth/ensure-role
      ↓
Firebase Admin verifies token
      ↓
Custom claim assigned
      ↓
Token refresh
      ↓
Supabase accepts authenticated identity
```

A production deployment must preserve this behavior.

---

# 7. Supabase

Supabase provides:

- PostgreSQL database
- Data API
- Row Level Security
- database migrations
- production database infrastructure

The production application must use the hosted Supabase project.

Local Supabase is for development only.

---

# 8. Supabase Authentication Integration

NIRNAY uses Firebase as the identity provider and Supabase as the database/data layer.

The browser-side Supabase client obtains the Firebase ID token from the currently authenticated Firebase user.

Conceptually:

```text
Firebase User
     ↓
Firebase ID Token
     ↓
Supabase Client
     ↓
Supabase JWT Authentication
     ↓
PostgREST / Data API
     ↓
RLS
     ↓
User's Data
```

The database determines the user's identity from:

```sql
auth.jwt() ->> 'sub'
```

User-owned tables compare this identity against their stored `user_id`.

---

# 9. Production Environment Variables

Environment variables must be configured separately for local development and Vercel production.

## 9.1 Public Firebase Variables

These are safe to expose through `NEXT_PUBLIC_*` because Firebase web configuration identifies the Firebase application/project rather than acting as the authorization mechanism.

Required:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

These values must correspond to the NIRNAY Firebase project.

---

# 10. Supabase Public Variables

Required:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

The publishable key may be used by browser-side Supabase code.

Database authorization must still be enforced through:

- Firebase authentication
- Supabase JWT authentication
- RLS policies

A public key does not bypass RLS.

---

# 11. Supabase Secret Key

The server-side Supabase secret key is:

```text
SUPABASE_SECRET_KEY
```

It must never be:

```text
NEXT_PUBLIC_SUPABASE_SECRET_KEY
```

or exposed to client-side JavaScript.

Use the secret key only when a server-side operation genuinely requires elevated privileges.

Prefer normal authenticated Data API access whenever possible.

---

# 12. AI Environment Variables

AI provider credentials must be server-side only.

For example:

```text
AI_API_KEY
```

or provider-specific server environment variables.

The exact variable name depends on the selected AI provider.

Never expose an AI API key through:

```text
NEXT_PUBLIC_*
```

AI requests that require private credentials should pass through trusted server-side code.

---

# 13. Local vs Production Environment

NIRNAY has two distinct environments.

## Local

Used for:

- development
- schema changes
- testing
- debugging
- feature implementation

Typical local configuration:

```text
Next.js
   ↓
Local Firebase project/config
   ↓
Local Supabase
   ↓
Local PostgreSQL
```

---

## Production

Used for:

- competition demo
- deployed application
- real production-like testing

Typical production configuration:

```text
Vercel
   ↓
Firebase project
   ↓
Supabase Cloud
   ↓
Production PostgreSQL
```

Do not accidentally point the deployed application at local Supabase.

---

# 14. `.env` Rules

Local environment files must not be committed.

Examples:

```text
.env
.env.local
.env.production.local
```

must remain ignored according to the repository's `.gitignore`.

Never commit:

- Firebase Admin service-account JSON
- private keys
- AI API keys
- Supabase secret keys
- database passwords
- access tokens

---

# 15. Firebase Production Configuration

Before deployment, verify the Firebase project.

## Required

- [ ] Firebase project exists
- [ ] Web application registered
- [ ] Email/password provider enabled
- [ ] Google provider enabled
- [ ] authorized domains configured
- [ ] service account available for server-side Admin SDK
- [ ] Firebase project ID matches production configuration

The deployed domain must be added to Firebase Authentication's authorized domains.

---

# 16. Google Authentication Production Setup

Google authentication requires the production domain to be compatible with Firebase Authentication configuration.

Before the final demo:

- [ ] production domain is known
- [ ] domain is added to Firebase Authentication authorized domains
- [ ] Google sign-in tested from production
- [ ] redirect/popup behavior verified
- [ ] sign-out tested

Do not assume that authentication working locally means it will automatically work in production.

---

# 17. Supabase Production Configuration

Before deployment, verify:

- [ ] production Supabase project exists
- [ ] Firebase third-party authentication is enabled
- [ ] Firebase project ID is correct
- [ ] production schema exists
- [ ] RLS is enabled
- [ ] policies are present
- [ ] migrations are applied
- [ ] production URL is correct
- [ ] publishable key is correct

---

# 18. Database Migration Strategy

The database schema is maintained through migrations.

Migration files are stored under:

```text
supabase/migrations/
```

The migration files are the source of truth for schema changes.

Do not manually modify production tables when the same change can be represented as a migration.

Preferred workflow:

```text
Change Schema Locally
        ↓
Create Migration
        ↓
Apply Locally
        ↓
Test
        ↓
Commit Migration
        ↓
Review
        ↓
Apply to Production
```

---

# 19. Initial NIRNAY Schema

The current schema includes:

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

All user-owned data must preserve the Firebase UID relationship.

---

# 20. Production RLS Requirement

RLS is mandatory.

Every user-owned table must prevent one authenticated user from reading or modifying another user's data.

The expected ownership pattern is conceptually:

```sql
user_id = (auth.jwt() ->> 'sub')
```

Before production deployment:

- [ ] SELECT policies verified
- [ ] INSERT policies verified
- [ ] UPDATE policies verified
- [ ] DELETE policies verified
- [ ] ownership conditions verified
- [ ] cross-user access tested

Never disable RLS merely to make an application feature work.

---

# 21. Vercel Project Setup

Create a Vercel project connected to the NIRNAY GitHub repository.

Recommended configuration:

```text
Framework:
Next.js

Root Directory:
repository root

Build Command:
npm run build

Install Command:
npm install
```

Use the repository's existing package manager/lockfile configuration.

Do not unnecessarily override framework defaults.

---

# 22. Vercel Environment Variables

Configure production environment variables in Vercel.

Add:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Add server-only variables as required:

```text
SUPABASE_SECRET_KEY
```

and the AI provider credentials.

---

# 23. Firebase Admin Service Account in Vercel

Local development currently reads:

```text
secrets/firebase-service-account.json
```

Production should not depend on a committed JSON file.

For Vercel deployment, prefer secure server-side environment configuration.

The service-account credentials should be stored as protected Vercel environment variables or another secure server-side secret mechanism.

Never place the service-account private key in:

```text
NEXT_PUBLIC_*
```

---

# 24. Recommended Production Credential Pattern

The production application should conceptually use:

```text
Browser
   â”‚
   â”œâ”€â”€ Public Firebase config
   â””â”€â”€ Supabase publishable key
             â”‚
             â–¼
       Authenticated Data API

Server
   â”‚
   â”œâ”€â”€ Firebase Admin credentials
   â”œâ”€â”€ Supabase secret key (only if required)
   â””â”€â”€ AI provider credentials
```

The browser must never receive the server-side credentials.

---

# 25. Deployment Flow

The standard deployment flow is:

```text
Developer
   ↓
Feature Branch
   ↓
Local Testing
   ↓
Commit
   ↓
Push
   ↓
Pull Request
   ↓
Review
   ↓
Merge to main
   ↓
Vercel Deployment
   ↓
Production Verification
```

---

# 26. Preview Deployments

Vercel preview deployments are useful for reviewing feature branches before production.

Recommended workflow:

```text
Feature Branch
      ↓
Push
      ↓
Vercel Preview
      ↓
Test
      ↓
Review
      ↓
Merge
      ↓
Production
```

Preview environments must be configured carefully if they connect to shared backend services.

Do not allow preview deployments to accidentally modify production financial data.

---

# 27. Production Database Safety

Before running database changes against production:

1. inspect the migration
2. understand affected tables
3. verify RLS behavior
4. verify foreign keys
5. verify constraints
6. test locally
7. review with the technical lead
8. apply the migration
9. verify the resulting schema

Never run an unknown SQL script against production.

---

# 28. Deployment Checklist

## Code

- [ ] working tree clean
- [ ] feature merged
- [ ] lint passes
- [ ] build passes
- [ ] TypeScript passes through build
- [ ] no debug code
- [ ] no temporary test UI
- [ ] no accidental local URLs

---

## Environment

- [ ] Firebase variables configured
- [ ] Supabase variables configured
- [ ] AI variables configured
- [ ] server secrets protected
- [ ] production values verified
- [ ] no local credentials used accidentally

---

## Firebase

- [ ] Email/password works
- [ ] Google login works
- [ ] production domain authorized
- [ ] Firebase Admin works
- [ ] custom role works
- [ ] token refresh works

---

## Supabase

- [ ] production project reachable
- [ ] Firebase integration enabled
- [ ] migrations applied
- [ ] tables present
- [ ] RLS enabled
- [ ] policies present
- [ ] authenticated Data API works

---

## Application

- [ ] landing page works
- [ ] authentication works
- [ ] dashboard works
- [ ] core product flow works
- [ ] AI flow works
- [ ] loading states work
- [ ] error states work
- [ ] mobile layout works

---

# 29. Post-Deployment Smoke Test

After deployment, perform a complete smoke test.

## Test 1 — Landing Page

Open the production URL.

Verify:

- page loads
- no console-breaking errors
- assets load
- navigation works

---

## Test 2 — Authentication

Create/use a demo account.

Verify:

```text
Login
 ↓
Firebase User
 ↓
Authenticated Role
 ↓
Application
```

---

## Test 3 — Database

Create or update a safe demo record.

Verify:

```text
Browser
 ↓
Firebase Token
 ↓
Supabase Data API
 ↓
RLS
 ↓
Database
```

---

## Test 4 — User Isolation

Use two test accounts.

Verify:

```text
User A
  âœ•
User B's Data
```

The second user must not be able to access the first user's records.

---

## Test 5 — AI

Verify:

- request succeeds
- response renders correctly
- errors are handled
- no secret is exposed
- recommendation context is correct
- unsupported claims are not generated as facts

---

# 30. Production Logging

Logs should help diagnose failures without exposing sensitive data.

Do not log:

- passwords
- authentication tokens
- private keys
- complete financial records
- AI provider secrets
- database credentials

Prefer structured, minimal logging.

Example:

```text
Recommendation request failed
user_id: <internal-safe-reference>
reason: missing product data
```

Avoid dumping complete request payloads into production logs.

---

# 31. Error Handling

Production errors should be user-friendly.

Do not expose internal implementation details.

Bad:

```text
Firebase Admin certificate parsing failed at line 17...
```

Better:

```text
We couldn't complete this request right now.
Please try again.
```

Detailed technical information should remain in server logs.

---

# 32. Performance

Before final deployment:

- [ ] optimize large images
- [ ] avoid unnecessary client components
- [ ] avoid unnecessary API calls
- [ ] minimize duplicate database queries
- [ ] lazy-load heavy features where appropriate
- [ ] verify dashboard load time
- [ ] verify AI request latency
- [ ] avoid blocking the entire UI on non-critical requests

Performance work should prioritize the actual user journey.

---

# 33. Production AI Safety

AI-powered financial functionality requires additional deployment checks.

Before release:

- [ ] AI credentials server-side
- [ ] user context scoped to current user
- [ ] database queries respect RLS
- [ ] prompt injection defenses considered
- [ ] AI output validated
- [ ] unsupported claims handled
- [ ] financial guarantees prohibited
- [ ] recommendations clearly presented as decision support
- [ ] user approval required before consequential actions

---

# 34. Production Trust Checks

Every financial-product experience should preserve:

```text
Source
Last Updated
Data Type
Calculation / Method
Important Assumptions
```

The deployed application must not hide data freshness or uncertainty simply to make the UI look cleaner.

---

# 35. Rollback Strategy

If a production deployment causes a serious issue:

```text
Detect
 ↓
Assess
 ↓
Stop further changes
 ↓
Rollback application
 ↓
Verify
 ↓
Investigate
 ↓
Fix
 ↓
Redeploy
```

Do not attempt multiple unrelated fixes simultaneously during an incident.

---

# 36. Database Rollback Warning

Application rollback and database rollback are different.

If a migration has changed production data/schema, simply rolling back the frontend deployment may not restore the previous database state.

Database rollback must be planned carefully.

For destructive migrations:

- understand data impact
- create appropriate backup/recovery strategy
- test the migration
- review before production execution

---

# 37. Competition Deployment Strategy

Because the competition timeline is compressed, use a deployment freeze.

Recommended process:

```text
Feature Development
       ↓
Integration
       ↓
Production Candidate
       ↓
Full Smoke Test
       ↓
Demo Freeze
       ↓
Only Critical Fixes
```

After demo freeze:

Avoid introducing:

- new major features
- new infrastructure
- large refactors
- new authentication mechanisms
- unnecessary dependency changes

Only fix issues that materially affect:

- functionality
- security
- deployment
- presentation
- demo reliability

---

# 38. Demo Backup Strategy

Before the competition presentation:

Maintain:

1. production deployment
2. known-good Git commit
3. demo data
4. screenshots/video backup
5. local runnable version

The team should be able to recover quickly if a cloud service or deployment fails.

---

# 39. Deployment Ownership

### Member 1 — Technical Lead

Primary deployment owner.

Responsible for:

- Vercel
- production configuration
- release readiness
- deployment failures
- environment configuration
- production rollback

### Member 2 — Frontend / UX

Responsible for:

- production UI verification
- responsive behavior
- visual regressions
- route/navigation checks

### Member 3 — Backend / Data

Responsible for:

- production migrations
- database verification
- RLS verification
- data integrity

### Member 4 — AI / Intelligence

Responsible for:

- AI environment variables
- AI endpoint verification
- prompt/configuration validation
- AI safety checks
- response quality

---

# 40. Deployment Incident Protocol

If production breaks:

## Step 1

Do not immediately change multiple files.

## Step 2

Identify whether the failure is:

```text
Frontend
Authentication
Database
Environment
AI
Network
Deployment
```

## Step 3

Check the most recent deployment.

## Step 4

Check server/runtime logs.

## Step 5

Reproduce the failure.

## Step 6

Apply the smallest safe fix.

## Step 7

Run:

```bash
npm run lint
npm run build
```

## Step 8

Deploy.

## Step 9

Perform the smoke test again.

---

# 41. Production Definition of Done

A deployment is complete only when:

```text
Code
+
Build
+
Environment
+
Authentication
+
Authorization
+
Database
+
RLS
+
AI
+
UX
+
Smoke Test
```

have all been verified to the appropriate level.

A green Vercel deployment alone does not mean NIRNAY is production-ready.

---

# 42. Final Deployment Architecture

The target production system is:

```text
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚       USER          â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                               â”‚
                               â–¼
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚       VERCEL        â”‚
                    â”‚      NEXT.JS        â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                               â”‚
          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
          â”‚                    â”‚                    â”‚
          â–¼                    â–¼                    â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Firebase Auth   â”‚  â”‚ Supabase         â”‚  â”‚ AI Provider     â”‚
â”‚                 â”‚  â”‚ PostgreSQL       â”‚  â”‚                 â”‚
â”‚ Identity        â”‚  â”‚ Data + RLS       â”‚  â”‚ Intelligence    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         â”‚                    â”‚                     â”‚
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â–¼
                     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                     â”‚     NIRNAY      â”‚
                     â”‚ Financial       â”‚
                     â”‚ Copilot         â”‚
                     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

# 43. Final Principle

Deployment is part of the product.

NIRNAY is not finished when the code works locally.

It is finished when the intended user journey works reliably in the environment where the product will actually be demonstrated or used.

```text
LOCAL
  ↓
TEST
  ↓
REVIEW
  ↓
DEPLOY
  ↓
VERIFY
  ↓
MONITOR
  ↓
IMPROVE
```

**Never trade security, trust, or reliability for deployment speed.**
```


### I VERIFY

I’ll keep the next files consistent with:

- Vercel deployment
- Firebase Authentication
- Supabase Cloud
- production RLS
- server-only secrets
- the current migration architecture
- the team's ownership model
- the competition/demo freeze strategy
