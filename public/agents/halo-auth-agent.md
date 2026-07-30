# HALO Project Authentication integration

## Objective

Integrate HALO Project Authentication into this application using the
application's existing framework, routing, data-fetching, validation, and UI
conventions. Implement a production-ready session flow, not a mock.

## Required inputs

Do not invent missing values. Before editing, locate or ask for:

- HALO_PROJECT_PUBLISHABLE_KEY: the selected project's Authentication
  publishable key from the HALO dashboard.
- APP_ORIGIN: the deployed application origin, such as
  https://app.example.com.
- SIGN_IN_REDIRECT_PATH: the route users should reach after sign-in.
- ENABLED_FLOWS: email/password and any configured Google, Apple, GitHub, or
  Microsoft providers.

The project publishable key may be exposed to the browser. HALO account API
keys, Resend keys, provider client secrets, and OAuth App secrets must never be
exposed in client bundles. Access and refresh tokens are user bearer
credentials: keep them out of logs, URLs, analytics, and error messages.

## Source of truth

- API base URL: https://api.agihalo.com/api/v1/auth
- Authentication overview: https://docs.agihalo.com/authentication/
- Email flow: https://docs.agihalo.com/authentication/email/
- Provider flow: https://docs.agihalo.com/authentication/providers/
- Sessions and JWT: https://docs.agihalo.com/authentication/sessions/

Do not substitute Supabase, Firebase, Auth0, or another provider SDK. Do not
invent endpoints or response fields.

For TypeScript or browser applications, prefer:

~~~typescript
import { createClient } from "agihalo-node-sdk/auth";

const halo = createClient(
  "https://api.agihalo.com",
  HALO_PROJECT_PUBLISHABLE_KEY
);
~~~

Use `halo.auth` for the supported session flows instead of reimplementing
header injection, refresh rotation, or PKCE.

## HTTP contract

Requests that resolve project configuration send:

~~~http
apikey: HALO_PROJECT_PUBLISHABLE_KEY
Content-Type: application/json
~~~

Use these endpoints:

~~~text
GET  /settings
POST /signup
POST /token?grant_type=password
POST /token?grant_type=refresh_token
GET  /user
POST /logout
POST /recover
POST /password/reset
GET  /.well-known/jwks.json
~~~

Email signup body:

~~~json
{
  "email": "user@example.com",
  "password": "strong-password",
  "display_name": "Ada",
  "redirect_to": "https://app.example.com/auth/confirmed",
  "data": {}
}
~~~

Password sign-in body:

~~~json
{
  "email": "user@example.com",
  "password": "strong-password"
}
~~~

Refresh body:

~~~json
{
  "refresh_token": "the-current-refresh-token"
}
~~~

A successful sign-in or refresh returns:

~~~json
{
  "access_token": "short-lived-rs256-jwt",
  "refresh_token": "rotating-opaque-token",
  "token_type": "bearer",
  "expires_in": 3600,
  "expires_at": "session-expiry-timestamp",
  "user": {},
  "session": {}
}
~~~

When email confirmation is required, signup returns:

~~~json
{
  "user": {},
  "session": null,
  "confirmation_required": true
}
~~~

GET /user and POST /logout require:

~~~http
apikey: HALO_PROJECT_PUBLISHABLE_KEY
Authorization: Bearer PROJECT_USER_ACCESS_TOKEN
~~~

The publishable key and JWT must belong to the same Project.

Errors use an HTTP status plus:

~~~json
{
  "error": "human-readable message",
  "code": "STABLE_MACHINE_CODE"
}
~~~

Never treat HTTP 401, 403, 429, or 503 as a successful empty session.

## Required implementation

1. Inspect the repository before changing it. Reuse its router, HTTP client,
   schema validator, state management, form controls, error UI, test runner,
   and naming conventions.
2. Add one typed HALO client with `createClient(baseUrl, publishableKey)`. Keep
   that initialization in one configuration boundary. Reject startup or build
   when the publishable key is missing; do not use a placeholder fallback.
3. Read GET /settings and render only flows enabled for the project. Enforce the
   returned minimum password length and password requirements in the UI, while
   still handling server validation errors.
4. Implement signup, password sign-in, current-user loading, refresh, logout,
   confirmation handling, and recovery routes that match the application's
   existing UX.
5. Match the application architecture explicitly:
   - For a browser SPA, use the SDK's default managed browser session, as with a
     Supabase client. Apply a strict CSP, avoid unsafe HTML execution, keep
     dependencies current, and never copy tokens into application logs or URLs.
   - For an application with a server or BFF, set `persistSession: false` and
     keep the refresh token in a Secure, HttpOnly, SameSite=Lax,
     application-owned cookie. Proxy refresh/logout through same-origin
     handlers, validate Origin, and apply CSRF protection.
6. Do not create a second ad hoc token store alongside the SDK. If custom
   persistence is required, pass one audited storage adapter to the client.
7. Refresh tokens rotate. After every successful refresh, atomically replace
   the stored refresh token with the returned refresh_token. Never reuse the
   previous value. Deduplicate concurrent refresh attempts with one in-flight
   promise or server-side lock.
8. Retry an application request at most once after a successful refresh.
   Prevent refresh loops. On refresh failure, clear local session state and
   require a fresh sign-in.
9. Protect private routes using the application's server middleware when
   available. Preserve the intended destination and return there after
   successful sign-in. Do not flash protected content before session
   resolution.
10. On logout, call POST /logout with the current access token, clear the
    application-owned cookie and in-memory state even if the remote session is
    already invalid, then navigate to the signed-out route.
11. Keep authentication responses out of caches. Do not log passwords, access
    tokens, refresh tokens, authorization codes, or provider state.
12. Preserve unrelated application behavior and styling. Do not replace the
    existing user database or account model unless the user explicitly asks.

## Backend JWT verification

If this repository exposes its own protected API, verify HALO access tokens
locally:

- Fetch GET /.well-known/jwks.json with the project publishable key and cache it
  for no longer than the response cache policy.
- Allow only RS256.
- Require a matching JWK kid.
- Require issuer halo-project:{PROJECT_ID}.
- Require audience halo-project-auth.
- Require tokenUse project_auth_access.
- Require projectId, sub, sessionId, email, exp, and iat.
- Reject missing, expired, malformed, cross-project, or wrong-purpose tokens.

Do not authorize a request from decoded-but-unverified claims. Use GET /user
when an authoritative current-user check is required.

## Social providers

Implement a provider only when GET /settings reports it as enabled. Follow the
HALO provider guide and use Authorization Code plus S256 PKCE. Generate and
verify state, keep the PKCE verifier out of URLs, exchange the one-time callback
code once, and require an exact allowlisted redirect URL. Never expose an
upstream provider client secret in the application frontend.

## Acceptance criteria

- Missing configuration fails clearly without a fake default.
- Signup handles both immediate sessions and confirmation_required.
- Password sign-in creates a usable session.
- Reload restores a session through the secure refresh path.
- One expired access token causes at most one refresh and one request retry.
- Refresh rotation stores the new token and discards the old token.
- Invalid or expired refresh clears the session.
- GET /user resolves the signed-in project user.
- Logout revokes and clears the session.
- Protected routes do not render for signed-out users.
- No sensitive token appears in URLs, logs, snapshots, or committed files.
  Browser storage, when used, is owned only by the managed SDK session.
- Unit or integration tests cover success, confirmation-required, refresh
  rotation, refresh failure, logout, and protected-route behavior.
- Existing lint, typecheck, tests, and production build pass.

## Completion report

When finished, report:

- Files changed.
- Configuration names the operator must set.
- HALO dashboard settings still required.
- Auth flows implemented.
- Token storage and refresh strategy.
- Tests and build commands run with results.
- Any blocked item that requires a real publishable key, provider
  configuration, or deployed callback URL.
