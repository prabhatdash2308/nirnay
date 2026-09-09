# NIRNAY — Authentication Documentation

> **Document:** AUTHENTICATION.md
> **Project:** NIRNAY
> **Purpose:** Define authentication architecture, Firebase integration, Supabase integration, token flow, authorization claims, client/server boundaries, failure handling, and authentication rules for developers and AI agents.

---

# 1. Purpose

NIRNAY uses **Firebase Authentication** as its primary identity provider.

Supabase PostgreSQL is used as the application's database and uses the Firebase identity token to authorize database access through Row Level Security (RLS).

The authentication architecture is intentionally split:

```text
Firebase
=
Identity + Authentication

Supabase
=
Database + Authorization through RLS
```

This separation allows NIRNAY to use Firebase's authentication providers while retaining PostgreSQL, Supabase Data API, and RLS for application data.

---

# 2. Authentication Architecture

The current authentication flow is:

```text
User
 â”‚
 â–¼
NIRNAY Web App
 â”‚
 â–¼
Firebase Authentication
 â”‚
 â”œâ”€â”€ Email / Password
 â”‚
 â””â”€â”€ Google
 â”‚
 â–¼
Firebase User
 â”‚
 â–¼
Firebase UID
 â”‚
 â–¼
Firebase ID Token
 â”‚
 â–¼
NIRNAY /api/auth/ensure-role
 â”‚
 â–¼
Firebase custom claim:
role = authenticated
 â”‚
 â–¼
Fresh Firebase ID Token
 â”‚
 â–¼
Supabase Client
 â”‚
 â–¼
Supabase Data API
 â”‚
 â–¼
PostgreSQL RLS
 â”‚
 â–¼
User-owned data
```

---

# 3. Identity Provider

Firebase Authentication is the source of truth for user identity.

Firebase is responsible for:

- Account creation
- Sign-in
- Google authentication
- Password authentication
- Identity verification
- User UID generation
- ID token generation
- Custom authentication claims

The application should not create a second independent authentication system.

---

# 4. Firebase Project

The current Firebase project is:

```text
Project:
NIRNAY

Firebase Project ID:
nirnay-82c42
```

The Firebase web application is registered as:

```text
NIRNAY Web
```

---

# 5. Supported Authentication Providers

The current application supports:

```text
Email / Password
Google
```

Additional providers should not be introduced unless the product requires them.

If another provider is added, update:

```text
AUTHENTICATION.md
SECURITY.md
PROJECT.md
```

and the relevant implementation documentation.

---

# 6. Firebase Client Configuration

The browser-side Firebase SDK uses public web configuration values.

Current environment variables:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

These are used by:

```text
app/lib/firebase-client.ts
```

The values identify the Firebase web application.

They are not equivalent to the Firebase Admin service-account credentials.

---

# 7. Firebase Client Initialization

The Firebase client is initialized once and reused.

Conceptually:

```ts
const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
```

This prevents unnecessary repeated Firebase application initialization during client-side execution.

---

# 8. Firebase Admin SDK

NIRNAY also uses the Firebase Admin SDK for server-side operations.

The Admin SDK is used for privileged authentication operations such as:

- Verifying Firebase ID tokens
- Reading Firebase user records
- Reading custom claims
- Setting custom claims

The implementation lives in:

```text
app/lib/firebase-admin.ts
```

---

# 9. Firebase Admin Security

The Firebase Admin SDK is **server-only**.

The service-account credentials must never be exposed to:

- Browser JavaScript
- React components
- Client bundles
- Public API responses
- Git
- Screenshots
- Logs
- AI agents' visible output

The service-account JSON is stored locally under:

```text
secrets/
```

and the directory is ignored by Git.

---

# 10. Server-Only Boundary

The Firebase Admin implementation explicitly uses:

```ts
import "server-only";
```

This is intentional.

Any file that imports Firebase Admin functionality must remain on the server side.

Do not import:

```text
app/lib/firebase-admin.ts
```

into a client component.

---

# 11. Authentication Client

Client authentication functions are centralized in:

```text
app/lib/auth-client.ts
```

Current operations include:

```text
signUpWithEmail()
signInWithEmail()
signInWithGoogle()
logout()
```

Authentication UI should use these functions instead of duplicating Firebase authentication logic across components.

---

# 12. Email Sign-Up Flow

The email sign-up flow is:

```text
User enters email + password
        ↓
Firebase createUserWithEmailAndPassword()
        ↓
Firebase creates account
        ↓
Firebase returns authenticated user
        ↓
establishAuthenticatedRole()
        ↓
/api/auth/ensure-role
        ↓
Firebase Admin verifies ID token
        ↓
Custom claim is established
        ↓
Fresh token requested
        ↓
Authenticated application state
```

---

# 13. Email Sign-In Flow

The email sign-in flow is:

```text
User enters credentials
        ↓
Firebase signInWithEmailAndPassword()
        ↓
Firebase authenticates user
        ↓
Firebase user returned
        ↓
establishAuthenticatedRole()
        ↓
/api/auth/ensure-role
        ↓
Token refreshed
        ↓
Application continues
```

---

# 14. Google Sign-In Flow

Google authentication uses Firebase's Google provider.

Conceptually:

```text
User selects Google sign-in
        ↓
Google authentication popup
        ↓
Firebase receives Google identity
        ↓
Firebase user returned
        ↓
establishAuthenticatedRole()
        ↓
/api/auth/ensure-role
        ↓
Token refreshed
        ↓
Application continues
```

The same application-level role establishment must occur regardless of authentication provider.

---

# 15. Custom Authentication Role

Supabase's Firebase third-party authentication integration requires the Firebase JWT to carry the appropriate authenticated role.

NIRNAY establishes:

```text
role = authenticated
```

as a Firebase custom claim.

This is not a client-controlled value.

It is assigned by the Firebase Admin SDK on the server.

---

# 16. Why the Role Is Server-Side

The client must never be allowed to decide:

```text
role = authenticated
```

or any privileged role.

If a client could arbitrarily assign authentication claims, authorization would be compromised.

Therefore:

```text
Client
  ↓
requests role establishment
  ↓
Server verifies Firebase ID token
  ↓
Firebase Admin sets claim
```

---

# 17. Role Establishment Endpoint

Current endpoint:

```text
/api/auth/ensure-role
```

Implementation:

```text
app/api/auth/ensure-role/route.ts
```

The endpoint accepts:

```http
Authorization: Bearer <Firebase ID Token>
```

---

# 18. Role Endpoint Validation

The endpoint first checks for:

```text
Authorization
```

and verifies that it begins with:

```text
Bearer
```

Missing or malformed authentication headers result in an unauthorized response.

The endpoint must never trust a UID supplied independently in the request body.

---

# 19. Firebase Token Verification

The server uses Firebase Admin to verify the provided ID token.

Conceptually:

```ts
const decodedToken =
  await auth.verifyIdToken(idToken);
```

This establishes that:

- The token is valid
- The token was issued by the expected Firebase project
- The Firebase identity is genuine
- The UID can safely be used for authenticated operations

---

# 20. User Record Lookup

After verifying the token, the server retrieves the Firebase user.

Conceptually:

```ts
const user =
  await auth.getUser(decodedToken.uid);
```

Existing custom claims are read from the Firebase user record.

---

# 21. Preserving Existing Claims

The application must not blindly replace all existing custom claims.

The current implementation reads:

```ts
const existingClaims =
  user.customClaims ?? {};
```

and preserves them when adding:

```text
role = authenticated
```

Conceptually:

```ts
{
  ...existingClaims,
  role: "authenticated"
}
```

This prevents unrelated claims from being accidentally destroyed.

---

# 22. Avoiding Unnecessary Claim Updates

The endpoint checks whether the user already has:

```text
role = authenticated
```

If the role is already correct, the server does not needlessly rewrite the claims.

Conceptually:

```text
Existing role = authenticated
        ↓
No update required
```

Otherwise:

```text
Missing/wrong role
        ↓
Set role = authenticated
```

---

# 23. Token Refresh

A newly assigned Firebase custom claim does not automatically appear in an already-issued ID token.

Therefore, after establishing the role, the client explicitly refreshes the token:

```ts
await user.getIdToken(true);
```

The `true` forces a refresh.

This is important for the Firebase → Supabase authentication bridge.

---

# 24. Authentication Bridge

The complete bridge is:

```text
Firebase User
      â”‚
      â–¼
Firebase UID
      â”‚
      â–¼
Firebase ID Token
      â”‚
      â”œâ”€â”€ sub = Firebase UID
      â”‚
      â””â”€â”€ role = authenticated
      â”‚
      â–¼
Supabase Client
      â”‚
      â–¼
Supabase Data API
      â”‚
      â–¼
PostgreSQL
```

The PostgreSQL RLS layer uses the JWT identity.

---

# 25. Firebase UID

The Firebase UID is the canonical application user identifier.

Example:

```text
Firebase UID
abc123...
```

The same identity is stored in:

```text
user_profiles.user_id
```

and other user-owned tables.

---

# 26. JWT Subject

The authenticated user's Firebase UID is represented by the JWT subject claim:

```text
sub
```

PostgreSQL can retrieve it using:

```sql
auth.jwt() ->> 'sub'
```

This is the foundation of NIRNAY's user-level RLS.

---

# 27. Supabase Client

The application Supabase client is:

```text
app/lib/supabase-client.ts
```

It uses:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

The Firebase user's current ID token is supplied through the Supabase client configuration.

---

# 28. Supabase Authentication Model

NIRNAY does not use Supabase email/password authentication as its primary user login system.

Instead:

```text
Firebase
=
Authentication

Supabase
=
Database + Data API + RLS
```

This distinction must remain clear.

---

# 29. Supabase Data API Authentication

When an authenticated user accesses Supabase:

```text
Firebase ID Token
        ↓
Supabase Client
        ↓
Supabase Data API
        ↓
JWT claims
        ↓
PostgreSQL RLS
```

The database evaluates ownership from the authenticated JWT.

---

# 30. RLS Ownership

A typical policy is:

```sql
using (
  user_id = (auth.jwt() ->> 'sub')
)
```

This means:

```text
Database row.user_id
        =
Authenticated Firebase UID
```

Only then can the row be accessed.

---

# 31. Why Frontend Checks Are Not Enough

This is not a sufficient security mechanism:

```ts
if (currentUser.uid === row.user_id) {
  show(row);
}
```

A malicious client can manipulate frontend code or requests.

The database must independently enforce ownership.

Therefore:

```text
Frontend check
=
UX convenience

RLS
=
Security boundary
```

---

# 32. Authenticated Application State

A successful Firebase sign-in does not automatically mean the entire NIRNAY application flow is ready.

The application must establish:

```text
Firebase authentication
+
authenticated custom claim
+
fresh token
```

before relying on Supabase authenticated operations.

---

# 33. Authentication State

The Firebase client exposes:

```text
firebaseAuth.currentUser
```

The application can use Firebase's authentication state listeners where persistent reactive auth state is required.

Avoid manually maintaining duplicate authentication state unless there is a clear reason.

---

# 34. Current Auth Role Helper

The application includes:

```text
app/lib/auth-role.ts
```

which can retrieve:

```text
uid
role
```

from the current Firebase user's ID token.

Conceptually:

```ts
const tokenResult =
  await getIdTokenResult(user);
```

The helper returns the current role claim when available.

---

# 35. Sign-Out Flow

Sign-out is handled through Firebase:

```ts
await signOut(firebaseAuth);
```

After logout:

```text
Firebase currentUser
=
null
```

The application should immediately treat the user as unauthenticated.

Private application data should no longer be accessible through the authenticated UI.

---

# 36. Sign-Out Security

Logout should clear or invalidate application-level authenticated state.

Do not rely solely on hiding navigation elements.

Private database access remains protected by Firebase authentication and Supabase RLS.

---

# 37. Authentication Errors

Common categories include:

```text
Invalid credentials
Email already in use
Weak password
Popup closed
Popup blocked
Unauthorized token
Expired/invalid token
Firebase configuration error
Supabase authorization error
Network failure
```

User-facing messages should be understandable.

Do not expose internal credentials, tokens, or service-account details.

---

# 38. Firebase API-Key Errors

A Firebase client configuration error may appear as:

```text
auth/api-key-not-valid
```

When debugging, verify:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Also verify that environment variables are loaded by the running Next.js process.

After modifying environment variables, restart the development server.

---

# 39. Environment Variable Rules

Public Firebase web configuration:

```text
NEXT_PUBLIC_FIREBASE_*
```

may be used in browser code.

Supabase browser configuration:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

may be used in browser code.

Privileged credentials must remain server-side.

---

# 40. Secrets That Must Never Reach the Client

Never expose:

```text
Firebase service-account private key
Firebase service-account JSON
SUPABASE_SECRET_KEY
```

Never place these values in:

```text
NEXT_PUBLIC_*
```

variables.

Never include them in frontend source code.

Never return them from API endpoints.

---

# 41. `.env` and `.env.local`

Environment files are local configuration.

They must remain ignored by Git where they contain credentials or environment-specific secrets.

The repository should provide an example configuration file such as:

```text
.env.example
```

without real secrets.

---

# 42. Firebase Service Account

The Admin SDK currently reads the service-account file from:

```text
secrets/firebase-service-account.json
```

The `secrets/` directory is ignored by Git.

This file must never be committed.

---

# 43. Production Secret Management

For production deployment, service credentials should be stored using the deployment platform's secret/environment-variable mechanism or another secure server-side secret store.

Do not upload the service-account JSON into:

```text
public/
```

or any client-accessible directory.

Do not expose it through a Git repository.

---

# 44. Server API Authentication

Any private NIRNAY server endpoint must explicitly determine how the caller is authenticated.

Do not assume:

```text
POST /api/example
```

is authenticated simply because the frontend hides the button.

Private API routes should validate the Firebase ID token or use a server-side authentication mechanism that reliably establishes the Firebase user.

---

# 45. Authorization vs Authentication

Authentication answers:

> Who is this user?

Authorization answers:

> What is this user allowed to access?

NIRNAY uses:

```text
Firebase
→ authentication / identity

Supabase RLS
→ database authorization
```

Both are required.

---

# 46. Roles

The current application has one primary authenticated application role:

```text
authenticated
```

Do not create additional roles such as:

```text
admin
advisor
manager
superuser
```

unless the product actually requires them.

If privileged roles are introduced, they must be explicitly designed and documented.

---

# 47. Admin Access

If NIRNAY eventually requires an administrative interface, it must not be implemented by trusting a client-controlled value such as:

```text
role = admin
```

Admin authorization must be assigned and verified server-side.

The database policies must also be reviewed.

---

# 48. User Profile Synchronization

After successful authentication, NIRNAY may create or update the corresponding:

```text
user_profiles
```

record.

The conceptual relationship is:

```text
Firebase User
     â”‚
     â–¼
Firebase UID
     â”‚
     â–¼
user_profiles.user_id
```

This ensures the application has a database representation of the authenticated user.

---

# 49. Profile Upsert Security

The profile operation must use the authenticated Firebase UID.

Do not allow a client to submit:

```json
{
  "user_id": "some-other-user"
}
```

and expect the database to trust it.

RLS must verify ownership.

---

# 50. Authenticated Data Flow

A normal authenticated page may follow:

```text
1. Firebase user signs in
2. Firebase returns user
3. Role is established
4. Token is refreshed
5. Application loads user profile
6. Supabase request carries Firebase token
7. RLS identifies user from JWT
8. Only that user's rows are returned
```

---

# 51. Unauthenticated Data Flow

If there is no Firebase user:

```text
firebaseAuth.currentUser
=
null
```

The application must treat the user as signed out.

Private Supabase operations should not be attempted as if the user were authenticated.

---

# 52. Authentication Loading State

Authentication state is asynchronous.

The UI should distinguish:

```text
Loading
Authenticated
Unauthenticated
Error
```

Avoid showing:

```text
"Welcome back"
```

before authentication state has actually been resolved.

---

# 53. Protected Routes

Private pages should enforce authentication at the application level.

Examples may include:

```text
Dashboard
Portfolio
Policies
Investments
Goals
Watchlist
Calendar
Alerts
```

The exact route structure may evolve.

Route protection should not be considered a replacement for database RLS.

Both layers are necessary.

---

# 54. Public vs Private Areas

Typical public areas:

```text
Landing page
Authentication page
Product explanation
Public informational content
```

Typical private areas:

```text
Financial dashboard
User profile
Policies
Investments
Goals
Watchlist
Alerts
Calendar
Personal recommendations
```

The final route structure is defined by the application implementation.

---

# 55. Authenticated Requests

Authenticated browser requests to Supabase should use the currently valid Firebase ID token.

Do not cache a Firebase token indefinitely.

Use Firebase's token APIs so that token refresh can occur correctly.

---

# 56. Token Expiration

Firebase ID tokens are temporary credentials.

The application should rely on Firebase's token management rather than implementing its own token lifetime system.

If a request fails because the token is invalid or expired:

```text
Refresh / re-authenticate
        ↓
Retry when appropriate
```

Avoid infinite retry loops.

---

# 57. Token Logging

Never log the complete Firebase ID token.

Never log:

```text
Authorization: Bearer <full-token>
```

Even during development.

If token debugging is absolutely necessary, inspect non-sensitive metadata such as:

```text
UID
role
expiration timestamp
```

without exposing the token itself.

---

# 58. Authentication Debugging

When authentication fails, debug in this order:

```text
1. Firebase configuration
2. Firebase provider configuration
3. Firebase sign-in result
4. Firebase UID
5. /api/auth/ensure-role
6. Custom claim
7. Forced token refresh
8. Supabase client configuration
9. Supabase Data API request
10. PostgreSQL RLS policy
```

Do not immediately disable RLS to diagnose an authentication issue.

---

# 59. Authentication Test Matrix

The application should test:

### Email sign-up

```text
[ ] New account created
[ ] Firebase UID exists
[ ] Role established
[ ] Token refreshed
[ ] Supabase access works
[ ] User profile can be created
```

### Email sign-in

```text
[ ] Existing account authenticates
[ ] UID is correct
[ ] Role is available
[ ] Supabase access works
```

### Google sign-in

```text
[ ] Popup opens
[ ] Google authentication succeeds
[ ] Firebase user exists
[ ] Role established
[ ] Supabase access works
```

### Logout

```text
[ ] Firebase user becomes null
[ ] Private UI responds
[ ] Authenticated database operations no longer proceed
```

---

# 60. Cross-User Security Test

Authentication is not complete until user isolation is tested.

Example:

```text
User A
  ↓
Creates profile/policy/investment
```

Then:

```text
User B
  ↓
Attempts to query User A's record
```

Expected:

```text
Access denied / record not visible
```

This must be enforced by RLS.

---

# 61. Current Authentication Test Status

The current foundation has already demonstrated:

```text
Firebase sign-in
        ↓
Firebase UID
        ↓
authenticated custom claim
        ↓
fresh Firebase token
        ↓
Supabase Data API
        ↓
RLS-protected user profile
```

A real `user_profiles` upsert has been successfully tested through the application.

This validates the core authentication-to-database bridge.

---

# 62. Common Authentication Mistakes

## Mistake 1 — Using Supabase Auth as a second login system

Avoid creating duplicate identity systems unless architecture explicitly changes.

---

## Mistake 2 — Trusting a client-provided UID

Never use arbitrary request-body `user_id` as proof of identity.

---

## Mistake 3 — Setting Firebase custom claims from the client

Custom claims must be assigned through trusted server-side Firebase Admin functionality.

---

## Mistake 4 — Forgetting token refresh

After setting a new custom claim:

```ts
await user.getIdToken(true);
```

must be considered.

---

## Mistake 5 — Importing Firebase Admin into client code

Prohibited.

---

## Mistake 6 — Exposing the service-account JSON

Prohibited.

---

## Mistake 7 — Treating route protection as database security

Route protection is useful.

RLS is still mandatory.

---

## Mistake 8 — Disabling RLS during debugging

Do not solve authorization problems by removing the security boundary.

---

## Mistake 9 — Logging tokens

Never log complete authentication tokens.

---

## Mistake 10 — Hard-coding credentials

Environment configuration must be used.

---

# 63. Authentication Architecture Rules for AI Agents

AI coding agents must follow these rules:

1. Firebase remains the primary authentication provider.
2. Do not replace Firebase with another authentication system without explicit approval.
3. Do not introduce duplicate user identities.
4. Firebase UID remains the canonical application identity.
5. Do not expose Firebase Admin credentials.
6. Keep Firebase Admin server-only.
7. Do not expose `SUPABASE_SECRET_KEY`.
8. Never place secrets in `NEXT_PUBLIC_*`.
9. Do not set Firebase custom claims from browser code.
10. Preserve existing Firebase custom claims.
11. Refresh the token after changing custom claims.
12. Do not trust client-provided `user_id`.
13. Do not disable RLS.
14. Test cross-user isolation.
15. Keep authentication and authorization responsibilities clearly separated.
16. Update this document if the authentication architecture changes.

---

# 64. Authentication Change Protocol

Before changing authentication architecture:

```text
1. Read AUTHENTICATION.md
2. Read SECURITY.md
3. Read ARCHITECTURE.md
4. Inspect existing auth implementation
5. Identify affected flows
6. Implement the smallest safe change
7. Test email authentication
8. Test Google authentication if affected
9. Test custom claims
10. Test token refresh
11. Test Supabase access
12. Test RLS isolation
13. Run lint
14. Run build
15. Update documentation
16. Commit the change
```

---

# 65. Definition of Authentication Done

Authentication is complete only when:

```text
[ ] Firebase project configured
[ ] Email authentication works
[ ] Google authentication works
[ ] Firebase UID available
[ ] Custom authenticated role established
[ ] Token refresh works
[ ] Supabase receives authenticated Firebase token
[ ] RLS recognizes authenticated identity
[ ] User profile access works
[ ] Cross-user access is blocked
[ ] Logout works
[ ] Secrets remain server-side
[ ] Error handling is implemented
[ ] Lint passes
[ ] Build passes
[ ] Documentation is current
```

---

# 66. Final Authentication Principle

NIRNAY's authentication architecture follows one simple rule:

> **Firebase proves who the user is. Supabase RLS decides which database records that user may access.**

The browser is never the final authority.

The client may request an action.

The server may validate identity.

The database must enforce ownership.

```text
Identity
   ↓
Authentication
   ↓
Authorization
   ↓
Data
```

That separation is fundamental to NIRNAY's security and trust model.

---
