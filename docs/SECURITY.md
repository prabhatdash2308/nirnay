# NIRNAY — Security Documentation

> **Document:** SECURITY.md
> **Project:** NIRNAY
> **Purpose:** Define the application's security architecture, threat model, secrets management, authentication security, database security, API security, frontend security, financial-data protection, logging rules, dependency practices, deployment security, and AI-agent security requirements.

---

# 1. Purpose

NIRNAY is a financial decision-support application.

Because the application may process:

- Personal information
- Financial information
- Insurance information
- Investment information
- Financial goals
- User preferences
- Authentication identities

security must be treated as a core product requirement.

The primary security objectives are:

```text
Confidentiality
Integrity
Availability
Authorization
Traceability
Trust
```

---

# 2. Security Principles

NIRNAY follows these principles:

1. Least privilege
2. Defense in depth
3. Secure by default
4. Never trust the client
5. Database-enforced authorization
6. Server-side secret protection
7. Explicit data ownership
8. Minimal data collection
9. Safe error handling
10. Traceable external data
11. Clear separation of verified data and AI output
12. Secure development and deployment

---

# 3. Security Architecture

The current security architecture is:

```text
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚        User          â”‚
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚
                                    â–¼
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚   NIRNAY Frontend    â”‚
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚                               â”‚
                    â–¼                               â–¼
          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
          â”‚ Firebase Auth    â”‚            â”‚ Next.js Server   â”‚
          â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜            â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚                               â”‚
                   â”‚ Firebase ID Token             â”‚
                   â”‚                               â”‚
                   â–¼                               â–¼
          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
          â”‚ Firebase Admin   â”‚            â”‚ Server Secrets   â”‚
          â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜            â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚
                   â–¼
          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
          â”‚ Supabase Data APIâ”‚
          â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚
                   â–¼
          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
          â”‚ PostgreSQL + RLS â”‚
          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

The browser is never considered a trusted security boundary.

---

# 4. Threat Model

NIRNAY should assume that an attacker may:

- Manipulate browser JavaScript
- Modify HTTP requests
- Change request payloads
- Attempt to access another user's records
- Attempt to inject malicious input
- Attempt to extract credentials
- Inspect frontend bundles
- Abuse public API endpoints
- Replay requests
- Submit malformed financial data
- Attempt to exploit dependencies
- Attempt to bypass frontend authorization
- Attempt to cause excessive API usage
- Attempt to manipulate AI inputs

Security controls must therefore exist beyond the UI.

---

# 5. Client Is Untrusted

The frontend must be considered untrusted.

Never assume that a value is safe because it originated from:

```text
React state
Form input
URL parameter
Local storage
Browser storage
Request body
Query parameter
Client-side validation
```

Every sensitive operation must validate the relevant data again on the server or database layer.

---

# 6. Authentication Security

Firebase Authentication is responsible for identity.

Current supported providers:

```text
Email / Password
Google
```

Authentication implementation is documented in:

```text
docs/AUTHENTICATION.md
```

The Firebase UID is the canonical application identity.

---

# 7. Authorization Security

Authentication alone is insufficient.

The application must determine whether the authenticated user is authorized to access the requested resource.

For database records:

```text
Firebase UID
        ↓
Firebase JWT `sub`
        ↓
PostgreSQL RLS
        ↓
user_id ownership
```

The core ownership condition is:

```sql
user_id = (auth.jwt() ->> 'sub')
```

---

# 8. Row Level Security

RLS must remain enabled on every user-owned table.

Current user-owned tables include:

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

RLS is a mandatory security boundary.

Never disable RLS simply to make an application query work.

---

# 9. RLS Policy Requirements

Every user-owned table must define appropriate policies for supported operations.

Typical patterns:

```sql
using (
  user_id = (auth.jwt() ->> 'sub')
)
```

and:

```sql
with check (
  user_id = (auth.jwt() ->> 'sub')
)
```

Use both where required.

`USING` controls which existing rows can be accessed.

`WITH CHECK` controls which rows can be inserted or created through the policy.

---

# 10. Cross-User Isolation

A fundamental security requirement is:

```text
User A
  ↓
Can access User A data

User B
  ↓
Can access User B data

User A
  ↓
Cannot access User B data
```

This must be enforced by PostgreSQL.

Frontend filtering is not an acceptable substitute.

---

# 11. ID Enumeration Protection

Internal IDs are not security mechanisms.

For example:

```text
/policies/123
```

must not become accessible simply because a user knows or guesses `123`.

The database must still verify ownership.

Security must not depend on:

```text
UUID secrecy
Numeric ID secrecy
URL obscurity
Frontend route hiding
```

---

# 12. Secret Management

Secrets must never be committed to source control.

Sensitive credentials include:

```text
Firebase service-account credentials
Firebase private key
Supabase secret key
AI provider secret keys
External API keys where privileged
Database passwords
Deployment secrets
```

---

# 13. Public vs Secret Environment Variables

Browser-safe variables may use:

```text
NEXT_PUBLIC_
```

Examples:

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

Privileged credentials must not use:

```text
NEXT_PUBLIC_
```

---

# 14. Supabase Secret Key

The Supabase secret key is server-only.

Current variable:

```text
SUPABASE_SECRET_KEY
```

It must never be:

```text
NEXT_PUBLIC_SUPABASE_SECRET_KEY
```

It must never appear in:

- Client components
- Browser network responses
- Public source code
- Git
- Screenshots
- Logs
- AI-generated documentation

---

# 15. Firebase Service Account

Firebase Admin credentials are extremely sensitive.

The service-account JSON must remain:

```text
server-only
```

The local development location is:

```text
secrets/firebase-service-account.json
```

The `secrets/` directory is ignored by Git.

Never commit this file.

---

# 16. Secret Exposure Prevention

Never place secrets inside:

```text
app/
components/
public/
README.md
docs/
Git commits
client-side environment variables
```

Documentation may describe the existence and purpose of a secret, but must never contain the secret value.

---

# 17. `.env` Files

Environment files may contain credentials.

They must remain outside version control when they contain real values.

The repository should provide:

```text
.env.example
```

containing placeholder values only.

Example:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

Do not populate `.env.example` with real credentials.

---

# 18. Git Security

Before committing:

```text
[ ] No .env secrets
[ ] No service-account JSON
[ ] No private keys
[ ] No API secrets
[ ] No database passwords
[ ] No access tokens
[ ] No credential dumps
```

Check ignored secrets with:

```bash
git status --ignored
```

and:

```bash
git check-ignore -v <file>
```

---

# 19. Git History

Deleting a secret from the latest commit does not necessarily remove it from Git history.

If a real credential is accidentally committed:

```text
1. Stop using the credential.
2. Rotate/revoke it immediately.
3. Remove the credential from the repository.
4. Assess Git history exposure.
5. Rewrite history if necessary.
6. Verify the replacement credential.
```

Never assume that deleting a file from the working tree is enough.

---

# 20. Authentication Tokens

Firebase ID tokens are sensitive credentials.

Never:

```text
Log them
Store them in source code
Expose them in URLs
Return them from unrelated API endpoints
Include them in screenshots
Paste them into public issues
```

Do not log complete:

```text
Authorization: Bearer <token>
```

headers.

---

# 21. Token Refresh

Firebase manages ID-token lifetime and refresh.

When custom claims are changed, NIRNAY explicitly refreshes the token:

```ts
await user.getIdToken(true);
```

Do not build an independent custom token lifecycle unless the architecture requires it.

---

# 22. Custom Claims

The current application establishes:

```text
role = authenticated
```

through the Firebase Admin SDK.

Custom claims must never be client-controlled.

The server verifies the Firebase token before changing claims.

Existing claims should be preserved.

---

# 23. Server-Only Firebase Admin

The Firebase Admin implementation uses:

```ts
import "server-only";
```

This boundary must be preserved.

Do not import Firebase Admin code into:

```text
Client Components
Browser utilities
Client-side hooks
Public frontend bundles
```

---

# 24. API Route Security

Private API routes must authenticate the caller.

An endpoint must not assume:

```text
"If the button is hidden, the endpoint is secure."
```

A malicious client can call an endpoint directly.

Every sensitive API operation must validate:

```text
Authentication
Authorization
Input
Business rules
```

---

# 25. Authorization at API Boundaries

An API request such as:

```json
{
  "user_id": "another-user"
}
```

must never automatically authorize access to that user.

The authenticated identity must be derived from the verified authentication context.

Client-provided ownership fields must not override authenticated ownership.

---

# 26. Input Validation

All external input must be validated.

Potential sources include:

```text
Forms
Query parameters
Path parameters
Request bodies
URL parameters
Uploaded files
External API responses
AI-generated structured output
```

Validation should verify:

- Type
- Required fields
- Length
- Format
- Range
- Allowed values
- Relationships between values

---

# 27. Financial Input Validation

Financial fields require stricter validation.

Examples:

```text
Income
Premium
Coverage amount
Investment amount
Goal amount
SIP amount
Dates
Percentages
Tenure
```

Validate:

```text
Type
Minimum
Maximum
Precision
Currency
Date relationships
```

Do not assume the browser has validated these correctly.

---

# 28. Positive Financial Amounts

Where a field represents a monetary amount that cannot logically be negative, the database should enforce appropriate constraints.

For example:

```text
premium >= 0
investment_amount >= 0
target_amount >= 0
```

The exact rule depends on the business meaning of the field.

Do not add generic constraints without understanding the domain.

---

# 29. Currency Security

NIRNAY initially focuses on Indian financial users.

Canonical monetary values should be stored numerically.

Do not trust a formatted value such as:

```text
₹1,25,000
```

as a financial calculation input.

Normalize and validate the numeric representation before performing calculations.

---

# 30. Numeric Precision

Financial calculations must avoid accidental floating-point precision problems.

Use appropriate decimal/numeric representations for persisted monetary values.

Application calculations should also use a deliberate strategy for financial precision.

Never silently round financial values merely to make UI output cleaner.

---

# 31. SQL Injection

Supabase client queries should use the structured query interface rather than concatenating raw SQL from user input.

Avoid patterns such as:

```text
"SELECT * FROM policies WHERE name = '" + userInput + "'"
```

Never construct raw SQL from untrusted input without proper parameterization.

---

# 32. XSS Protection

User-generated content must not be rendered as executable HTML.

Avoid unsafe HTML injection patterns.

Be especially careful with:

```text
User names
Notes
Financial descriptions
AI output
External product descriptions
URLs
Markdown
```

If rich HTML rendering is required, sanitize it using an appropriate trusted mechanism.

---

# 33. AI Output Is Untrusted Input

AI-generated text must not automatically be treated as safe HTML, executable code, SQL, or trusted financial facts.

AI output may contain:

```text
Unexpected markup
Incorrect values
Malformed JSON
Prompt-injected content
External URLs
Unsupported claims
```

Validate and sanitize AI output before using it.

---

# 34. Prompt Injection

External financial/product content may contain instructions intended to manipulate an AI model.

For example:

```text
Ignore previous instructions...
```

This must be treated as untrusted content.

The AI system must distinguish:

```text
System instructions
Developer/application instructions
User input
External retrieved content
AI output
```

External content must not override application security rules.

---

# 35. AI Tool Security

AI agents/tools must not receive unnecessary secrets.

Do not provide AI models with:

```text
Firebase private keys
Supabase secret key
Database passwords
Authentication tokens
Unnecessary personal financial data
```

Only provide the minimum information required for the task.

---

# 36. AI Financial Safety

NIRNAY is a decision-support product.

AI must not fabricate:

```text
Premiums
Coverage
Returns
Fees
Eligibility
Policy terms
Fund performance
Regulatory claims
Partner relationships
Discounts
Savings
Guarantees
```

If data is unavailable:

```text
Say that it is unavailable.
```

Do not invent an answer.

---

# 37. Verified Data vs AI Output

The application must distinguish between:

```text
Verified source data
User-provided data
Calculated values
AI summaries
AI recommendations
```

AI should explain or reason over available data.

It must not silently become the source of truth.

---

# 38. External Data Security

External APIs and product feeds should be treated as untrusted.

Validate:

```text
Schema
Types
Required fields
Ranges
Dates
Identifiers
Source
Timestamp
```

before storing or displaying important data.

---

# 39. Source Provenance

Financial product information should preserve provenance where possible.

Relevant metadata may include:

```text
source
source_url
external_id
retrieved_at
last_updated_at
```

This supports:

```text
Traceability
Trust
Debugging
Freshness
```

---

# 40. Stale Data

Financial information can change.

The application must avoid presenting stale external data as current without qualification.

Where relevant, show:

```text
Source
Last updated
Retrieved
```

The exact UI behavior is defined by the product and design documentation.

---

# 41. API Rate Limiting

Public or expensive endpoints should be protected against abuse.

Potential controls include:

```text
Rate limiting
Request quotas
Authentication requirements
Payload limits
Caching
Backoff
```

This is especially important for:

```text
AI generation
External API calls
Search
Recommendation generation
Product comparison
```

Do not create expensive unauthenticated endpoints unnecessarily.

---

# 42. Denial-of-Service Considerations

Application endpoints should avoid operations that can consume unbounded resources.

Examples:

```text
Unbounded database queries
Unlimited text input
Unlimited AI prompts
Huge file uploads
Unbounded result sets
Repeated external API calls
```

Use appropriate limits.

---

# 43. Pagination

Large database collections should be paginated.

Avoid returning unlimited records from:

```text
policies
investments
alerts
calendar events
watchlists
```

Pagination improves:

```text
Performance
Memory usage
API safety
User experience
```

---

# 44. Query Limits

Always consider:

```text
select columns
limit
pagination
filters
indexes
```

when designing database queries.

Do not allow arbitrary client-controlled queries to execute directly against the database.

---

# 45. Error Messages

User-facing errors should be safe.

Avoid exposing:

```text
Database schema
SQL statements
Stack traces
File paths
Credentials
Tokens
Internal service names
Infrastructure details
```

Bad:

```text
PostgrestError: relation public.insurance_policies does not exist
```

Better:

```text
We couldn't load your policies right now.
Please try again.
```

---

# 46. Server Logging

Logs should support debugging without leaking sensitive information.

Safe examples:

```text
Authentication verification failed
Profile update failed
Policy query failed
External product request failed
Recommendation generation failed
```

Do not log complete user financial records unnecessarily.

---

# 47. Sensitive Logging Prohibited

Never log:

```text
Passwords
Firebase service-account credentials
Private keys
Supabase secret key
Firebase ID tokens
Session tokens
Full financial profiles
Full policy records
Full investment portfolios
```

When debugging, redact sensitive fields.

---

# 48. Production Error Monitoring

If error monitoring is introduced, configure it carefully.

Before enabling an external monitoring service:

```text
[ ] Review data collection
[ ] Review PII handling
[ ] Review financial-data exposure
[ ] Configure redaction
[ ] Disable sensitive request-body capture
[ ] Review retention
```

Do not blindly send complete requests to a third-party monitoring service.

---

# 49. Browser Storage

Avoid storing highly sensitive financial information or authentication secrets in browser storage without a clear security design.

Be cautious with:

```text
localStorage
sessionStorage
IndexedDB
cookies
```

Only store what is necessary.

---

# 50. Cookies

If cookies are introduced for server-side authentication or sessions, use appropriate security attributes.

For sensitive authentication cookies, consider:

```text
HttpOnly
Secure
SameSite
Appropriate expiration
```

The exact configuration depends on the authentication architecture.

---

# 51. CSRF

If NIRNAY introduces cookie-based state-changing authentication flows, CSRF protection must be considered.

The application should not assume that browser requests are inherently safe simply because they originate from the application UI.

Firebase token-based client requests have different CSRF characteristics from cookie-authenticated APIs.

---

# 52. CORS

Do not configure permissive CORS unnecessarily.

Avoid:

```text
Access-Control-Allow-Origin: *
```

for sensitive authenticated APIs unless there is a deliberate architectural reason.

Prefer explicitly allowed origins where cross-origin access is actually required.

---

# 53. Content Security

Where practical, the application should use modern browser security controls such as appropriate security headers.

Potential controls include:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Frame protection
Permissions-Policy
```

These should be introduced carefully and tested against Next.js and third-party authentication flows.

---

# 54. Clickjacking

Sensitive financial interfaces should not be freely embedded in unknown websites.

Consider appropriate frame restrictions through security headers.

---

# 55. Dependency Security

NIRNAY relies on third-party packages.

Dependencies should be kept reasonably current.

Before upgrading a major dependency:

```text
1. Review release notes
2. Check breaking changes
3. Upgrade
4. Run lint
5. Run build
6. Test authentication
7. Test database access
8. Test critical UI flows
```

---

# 56. Dependency Auditing

Periodically review dependencies for known vulnerabilities.

Useful commands may include:

```bash
npm audit
```

However, do not blindly apply every suggested upgrade.

Review:

```text
Severity
Exploitability
Package role
Breaking changes
Production impact
```

---

# 57. Lockfile

The repository must keep:

```text
package-lock.json
```

in version control.

Do not delete or regenerate it unnecessarily.

The lockfile improves reproducibility.

---

# 58. Secure Development Workflow

Recommended flow:

```text
Feature
  ↓
Security impact review
  ↓
Implementation
  ↓
Local testing
  ↓
Authentication testing
  ↓
RLS testing
  ↓
Input validation testing
  ↓
Lint
  ↓
Build
  ↓
Code review
  ↓
Merge
```

---

# 59. Security Review Questions

Before merging a feature, ask:

```text
Who can access this?
Who should not access this?
What input can the user control?
What secrets are involved?
Can the request be replayed?
Can another user access the record?
Does RLS enforce ownership?
Can AI output influence sensitive behavior?
Can external data be malicious?
Can the operation consume excessive resources?
```

---

# 60. Database Security Checklist

For every new table:

```text
[ ] RLS enabled
[ ] Ownership defined
[ ] SELECT policy reviewed
[ ] INSERT policy reviewed
[ ] UPDATE policy reviewed
[ ] DELETE policy reviewed
[ ] Cross-user isolation tested
[ ] Foreign keys reviewed
[ ] Constraints reviewed
[ ] Sensitive fields reviewed
[ ] Indexes reviewed
```

---

# 61. API Security Checklist

For every new API endpoint:

```text
[ ] Authentication requirement defined
[ ] Authorization requirement defined
[ ] Input schema defined
[ ] Input limits defined
[ ] Error handling safe
[ ] Rate limiting considered
[ ] Secrets remain server-side
[ ] Logging reviewed
[ ] External calls reviewed
[ ] Abuse cases considered
```

---

# 62. Frontend Security Checklist

For every new frontend feature:

```text
[ ] No secret exposed
[ ] No privileged key exposed
[ ] User input validated
[ ] Unsafe HTML avoided
[ ] URLs validated where necessary
[ ] Error messages sanitized
[ ] Private data not unnecessarily cached
[ ] Auth state handled correctly
```

---

# 63. Authentication Security Checklist

```text
[ ] Firebase authentication works
[ ] Providers configured correctly
[ ] Firebase UID used consistently
[ ] Custom role set server-side
[ ] Token refresh works
[ ] Firebase Admin remains server-only
[ ] Tokens never logged
[ ] Logout works
[ ] Cross-user access blocked
```

---

# 64. Production Security Checklist

Before deployment:

```text
[ ] Production Firebase project verified
[ ] Production Supabase project verified
[ ] Production environment variables configured
[ ] No development credentials in production
[ ] No secrets committed
[ ] Firebase Admin credentials secured
[ ] Supabase secret key secured
[ ] RLS enabled
[ ] RLS policies verified
[ ] Database migrations applied
[ ] Authentication tested
[ ] Cross-user isolation tested
[ ] Error handling tested
[ ] Build passes
[ ] HTTPS enabled
[ ] Domain configuration reviewed
```

---

# 65. Deployment Security

Production deployment must use:

```text
HTTPS
Secure environment variables
Production Firebase configuration
Production Supabase configuration
Production database
```

Never deploy using:

```text
Local Supabase URL
Local database credentials
Development service-account credentials
Temporary test secrets
```

unless explicitly intended for a controlled staging environment.

---

# 66. Local Development Security

Local development still requires safe practices.

Do not assume:

```text
"It's only local"
```

makes secrets safe to publish.

The same rules apply:

```text
No committed secrets
No service-account JSON
No exposed tokens
No production data without authorization
```

---

# 67. Production Data Isolation

Development and production data must remain separate.

Avoid connecting local development to production databases unless there is a deliberate and documented reason.

Prefer:

```text
Development
→ Local Supabase

Production
→ Supabase Cloud
```

---

# 68. Backups and Recovery

Production database backup and recovery procedures should be verified before relying on the database for important user data.

When production infrastructure is finalized, document:

```text
Backup strategy
Retention
Recovery process
Recovery owner
Recovery testing
```

---

# 69. Data Minimization

Only collect information necessary for the product.

Avoid collecting:

```text
Unnecessary identity information
Unnecessary financial information
Unnecessary documents
Unnecessary authentication data
```

Every additional field increases:

```text
Privacy risk
Security risk
Storage responsibility
Compliance complexity
```

---

# 70. Data Retention

Data retention should be intentional.

Do not retain data forever simply because storage is cheap.

When retention requirements are defined, document:

```text
What is retained
Why it is retained
How long it is retained
How deletion works
What happens to backups
```

---

# 71. User Data Deletion

If account deletion is implemented, it must address both:

```text
Firebase identity
```

and:

```text
Supabase application data
```

The deletion flow must be designed carefully because user data spans multiple systems.

Do not implement partial deletion and claim the account is completely deleted.

---

# 72. Third-Party Services

Every external service increases the security boundary.

Before integrating a service, evaluate:

```text
What data is sent?
Why is it sent?
Where is it stored?
Who can access it?
How long is it retained?
Does it receive financial information?
Does it receive authentication data?
```

Only send necessary data.

---

# 73. External API Keys

External API keys must be stored server-side when privileged.

Never expose privileged external API keys through:

```text
NEXT_PUBLIC_*
```

unless the provider explicitly documents that the key is public and safe for browser use.

---

# 74. Financial Data Classification

NIRNAY should treat the following as sensitive application data:

```text
Income
Expenses
Insurance policies
Policy numbers
Premiums
Coverage
Investments
Investment amounts
Financial goals
Risk preferences
Financial calendar
```

Avoid exposing these values unnecessarily.

---

# 75. Privacy-Aware UI

Private financial information should not be unnecessarily displayed in:

```text
URLs
Page titles
Browser notifications
Logs
Analytics events
Error messages
Public links
```

Analytics should use anonymized or non-sensitive event metadata where possible.

---

# 76. Screenshots and Demo Security

For competition demos:

```text
Use fictional demo data.
```

Never expose:

```text
Real policy numbers
Real financial account information
Real authentication tokens
Real service credentials
Real private user records
```

The fictional demo persona should remain fictional.

---

# 77. Demo Environment

If a separate demo environment is created, keep it isolated from production.

Prefer:

```text
Demo
→ Demo credentials
→ Demo database
→ Fictional user
→ Fictional financial data
```

Do not use real customer information for presentation screenshots.

---

# 78. Security and Trust

Security is part of the NIRNAY product experience.

Users should be able to trust that:

```text
Their data belongs to them.
Their records are isolated.
Important facts have sources.
AI does not invent financial facts.
Secrets remain protected.
```

---

# 79. AI Coding Agent Security Rules

AI coding agents working on NIRNAY must follow these mandatory rules:

1. Never request or print secret values.
2. Never expose `.env` contents.
3. Never expose Firebase service-account JSON.
4. Never expose `SUPABASE_SECRET_KEY`.
5. Never disable RLS.
6. Never bypass authentication for convenience.
7. Never trust client-provided ownership.
8. Never add insecure debug endpoints.
9. Never log authentication tokens.
10. Never hard-code credentials.
11. Never commit secrets.
12. Never fabricate security guarantees.
13. Never treat AI output as verified financial data.
14. Never execute destructive database operations without explicit intent.
15. Always inspect existing security policies before changing schema.
16. Always test cross-user isolation for user-owned data.
17. Preserve server/client boundaries.
18. Use least privilege.
19. Update security documentation when architecture changes.

---

# 80. Security Incident Response

If a secret or sensitive credential is exposed:

```text
1. Stop using the exposed credential.
2. Revoke or rotate it.
3. Determine where it was exposed.
4. Remove it from active code.
5. Review Git history if applicable.
6. Check logs and deployment environments.
7. Replace the credential securely.
8. Verify affected systems.
9. Document the incident.
```

Do not continue development using a known-compromised credential.

---

# 81. Security Regression Testing

Security testing should be repeated after major architecture changes.

At minimum test:

```text
Authentication
Authorization
RLS
Cross-user isolation
API access
Input validation
Secret exposure
Error handling
```

---

# 82. Minimum Security Gate

A feature must not be considered production-ready if:

```text
RLS is disabled
Secrets are exposed
Authentication is bypassable
Ownership can be spoofed
Sensitive tokens are logged
Privileged credentials reach the browser
Cross-user access is possible
```

---

# 83. Security Definition of Done

A security-sensitive feature is complete only when:

```text
[ ] Threats considered
[ ] Authentication defined
[ ] Authorization defined
[ ] Input validation implemented
[ ] RLS reviewed
[ ] Cross-user isolation tested
[ ] Secrets reviewed
[ ] Logging reviewed
[ ] Error handling reviewed
[ ] Abuse cases considered
[ ] External integrations reviewed
[ ] AI risks reviewed where applicable
[ ] Local tests pass
[ ] Lint passes
[ ] Build passes
[ ] Documentation updated
```

---

# 84. Final Security Principle

NIRNAY handles financial information.

Therefore:

> **Security cannot be a frontend feature. It must be enforced throughout the entire system.**

The core security model is:

```text
Firebase
   ↓
Identity

Next.js
   ↓
Application validation + server boundaries

Supabase
   ↓
Data API

PostgreSQL
   ↓
RLS + integrity

AI
   ↓
Untrusted decision-support layer

User
   ↓
Final decision
```

No single layer is trusted blindly.

Defense in depth is the foundation of NIRNAY security.

---
