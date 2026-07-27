import {
  Callout,
  Code,
  DataTable,
  Endpoint,
  Examples,
  FeatureGrid,
  H2,
  Steps,
} from "@/components/DocsContent";
import type { DocPageMap } from "./types";

const signupCurl = `curl -X POST https://api.agihalo.com/api/v1/auth/signup \\
  -H "apikey: $HALO_PROJECT_PUBLISHABLE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "use-a-strong-password",
    "display_name": "Ada",
    "redirect_to": "https://app.example.com/auth/confirmed"
  }'`;

const passwordLoginCurl = `curl -X POST \\
  "https://api.agihalo.com/api/v1/auth/token?grant_type=password" \\
  -H "apikey: $HALO_PROJECT_PUBLISHABLE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "use-a-strong-password"
  }'`;

const refreshCurl = `curl -X POST \\
  "https://api.agihalo.com/api/v1/auth/token?grant_type=refresh_token" \\
  -H "apikey: $HALO_PROJECT_PUBLISHABLE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "refresh_token": "halo_auth_rt_..."
  }'`;

const providerAuthorize = `// 1. Create an S256 PKCE verifier/challenge in your app.
const url = new URL(
  "https://api.agihalo.com/api/v1/auth/providers/google/authorize"
);

url.searchParams.set("apikey", HALO_PROJECT_PUBLISHABLE_KEY);
url.searchParams.set("redirect_to", "https://app.example.com/auth/callback");
url.searchParams.set("code_challenge", codeChallenge);
url.searchParams.set("code_challenge_method", "S256");
url.searchParams.set("state", clientState);

window.location.assign(url.toString());`;

const providerToken = `curl -X POST https://api.agihalo.com/api/v1/auth/providers/token \\
  -H "apikey: $HALO_PROJECT_PUBLISHABLE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "code": "one_time_callback_code",
    "code_verifier": "original_pkce_verifier",
    "redirect_to": "https://app.example.com/auth/callback"
  }'`;

const oauthAuthorize = `GET https://api.agihalo.com/api/v1/auth/oauth/authorize
  ?client_id=halo_client_...
  &redirect_uri=https%3A%2F%2Fservice.example.com%2Fcallback
  &scope=profile%20email
  &state=opaque-client-state`;

const oauthConsent = `curl -X POST https://api.agihalo.com/api/v1/auth/oauth/authorize \\
  -H "Authorization: Bearer $PROJECT_USER_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "halo_client_...",
    "redirect_uri": "https://service.example.com/callback",
    "scopes": ["profile", "email"],
    "state": "opaque-client-state",
    "code_challenge": "S256_CHALLENGE",
    "code_challenge_method": "S256"
  }'`;

const oauthToken = `curl -X POST https://api.agihalo.com/api/v1/auth/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "authorization_code",
    "client_id": "halo_client_...",
    "code": "halo_code_...",
    "redirect_uri": "https://service.example.com/callback",
    "code_verifier": "ORIGINAL_PKCE_VERIFIER"
  }'`;

export const authenticationPages: DocPageMap = {
  authentication: {
    toc: [
      { id: "boundary", label: "Project identity boundary" },
      { id: "quickstart", label: "Email quickstart" },
      { id: "public-api", label: "Public API" },
      { id: "choose", label: "Choose the next guide" },
    ],
    content: (
      <>
        <p>
          Project Authentication is an application-user identity layer. Each
          project receives its own publishable key, users, identities, sessions,
          signing key, redirect policy, email delivery, and OAuth Apps.
        </p>

        <H2 id="boundary">Project identity boundary</H2>
        <DataTable
          headers={["Identity", "Owner", "Purpose"]}
          rows={[
            ["HALO account user", "HALO", "Access the developer dashboard"],
            ["Project Authentication user", "Your project", "Sign in to your application"],
            ["Upstream provider identity", "Google, Apple, GitHub, Microsoft", "Verify a project user"],
            ["OAuth App client", "Your project", "Request scoped access to a signed-in project user"],
          ]}
        />
        <Callout kind="info" title="Publishable does not mean anonymous authority">
          <p>
            The project publishable key identifies Authentication configuration
            and may be used in an application frontend. Sensitive actions still
            require a password, one-time code, refresh token, user access token,
            or dashboard owner JWT.
          </p>
        </Callout>

        <H2 id="quickstart">Email quickstart</H2>
        <Steps
          items={[
            {
              title: "Configure URLs",
              children: (
                <p>
                  Set the site URL and every exact redirect URL the project may
                  use.
                </p>
              ),
            },
            {
              title: "Configure email",
              children: (
                <p>
                  Add a Resend sending key, verified From address, and the three
                  required HTML templates.
                </p>
              ),
            },
            {
              title: "Copy the publishable key",
              children: (
                <p>
                  The dashboard Authentication section displays the project key
                  used by public endpoints.
                </p>
              ),
            },
            {
              title: "Create a user session",
              children: (
                <p>
                  Sign up or sign in, keep the access token short-lived, and rotate
                  the refresh token through the token endpoint.
                </p>
              ),
            },
          ]}
        />
        <Examples
          title="Email Authentication"
          examples={[
            { label: "Sign up", language: "bash", code: signupCurl },
            { label: "Sign in", language: "bash", code: passwordLoginCurl },
            { label: "Refresh", language: "bash", code: refreshCurl },
          ]}
        />

        <H2 id="public-api">Public API</H2>
        <Endpoint method="GET" path="/api/v1/auth/settings" />
        <Endpoint method="POST" path="/api/v1/auth/signup" />
        <Endpoint method="POST" path="/api/v1/auth/token?grant_type=password" />
        <Endpoint method="POST" path="/api/v1/auth/token?grant_type=refresh_token" />
        <Endpoint method="GET" path="/api/v1/auth/user" />
        <Endpoint method="POST" path="/api/v1/auth/logout" />
        <Endpoint method="GET" path="/api/v1/auth/.well-known/jwks.json" />

        <H2 id="choose">Choose the next guide</H2>
        <FeatureGrid
          items={[
            {
              title: "Email & Resend",
              description:
                "Configure password policy, sender identity, and HTML messages.",
              href: "/authentication/email",
            },
            {
              title: "Sign-in providers",
              description:
                "Register project-specific callbacks with four upstream providers.",
              href: "/authentication/providers",
            },
            {
              title: "Sessions & JWT",
              description:
                "Validate project-signed access tokens and rotate refresh sessions.",
              href: "/authentication/sessions",
            },
            {
              title: "OAuth Apps",
              description:
                "Let a service request explicit scopes from a signed-in project user.",
              href: "/authentication/oauth-apps",
            },
          ]}
        />
      </>
    ),
  },

  "authentication/email": {
    toc: [
      { id: "email-settings", label: "Email settings" },
      { id: "resend", label: "Configure Resend" },
      { id: "templates", label: "HTML templates" },
      { id: "flows", label: "Confirmation & recovery" },
      { id: "rate-limits", label: "Rate limits" },
    ],
    content: (
      <>
        <p>
          HALO sends project Authentication email directly through the
          project&apos;s Resend key. Generic SMTP and arbitrary email delivery
          webhooks are not part of the production contract.
        </p>

        <H2 id="email-settings">Email settings</H2>
        <ul>
          <li>Enable or disable email Authentication and public signup separately.</li>
          <li>Choose whether email confirmation is required before a session.</li>
          <li>Set minimum length and uppercase, lowercase, number, and symbol rules.</li>
          <li>Set a site URL and an exact allowlist of redirect URLs.</li>
        </ul>

        <H2 id="resend">Configure Resend</H2>
        <Steps
          items={[
            {
              title: "Verify a sending domain",
              children: (
                <p>
                  Add and verify the domain in Resend before selecting a From
                  address.
                </p>
              ),
            },
            {
              title: "Create a restricted key",
              children: (
                <p>
                  Create a Sending access key beginning with <code>re_</code>.
                  Prefer a domain-restricted key.
                </p>
              ),
            },
            {
              title: "Save project delivery",
              children: (
                <p>
                  Set From name, verified From address, paste the key, and enable
                  delivery.
                </p>
              ),
            },
          ]}
        />
        <Callout kind="security" title="The Resend key is write-only after save">
          <p>
            HALO encrypts the key. The dashboard can report that a key exists but
            cannot return its plaintext. Leave the field blank to keep it or paste
            a replacement to rotate it.
          </p>
        </Callout>

        <H2 id="templates">HTML templates</H2>
        <p>
          Confirmation, password recovery, and invitation each require a subject
          and HTML body. HTML is sent as configured through Resend.
        </p>
        <DataTable
          headers={["Variable", "Value"]}
          rows={[
            [<code key="confirmation">{"{{ .ConfirmationURL }}"}</code>, "Required verification or recovery link"],
            [<code key="email">{"{{ .Email }}"}</code>, "Recipient email"],
            [<code key="site">{"{{ .SiteURL }}"}</code>, "Configured project site URL"],
            [<code key="project">{"{{ .ProjectID }}"}</code>, "Project identifier"],
            [<code key="purpose">{"{{ .Purpose }}"}</code>, "confirmation, recovery, or invite"],
          ]}
        />
        <Code
          language="html"
          label="Confirmation template"
          code={`<!doctype html>
<html>
  <body style="font-family: sans-serif; color: #111">
    <h1>Confirm your account</h1>
    <p>Finish signing in as {{ .Email }}.</p>
    <p><a href="{{ .ConfirmationURL }}">Confirm email</a></p>
  </body>
</html>`}
        />

        <H2 id="flows">Confirmation & recovery</H2>
        <Endpoint method="GET" path="/api/v1/auth/verify" />
        <Endpoint method="POST" path="/api/v1/auth/recover" />
        <Endpoint method="POST" path="/api/v1/auth/password/reset" />
        <p>
          Redirect targets must be the configured site URL or an exact allowed
          redirect. HALO does not accept an arbitrary URL supplied by the user.
        </p>

        <H2 id="rate-limits">Rate limits</H2>
        <p>
          Configure hourly signup, login, and recovery limits. Limits are
          project-scoped and discriminator-aware. Authentication fails closed
          with a 503 if the rate limiter is unavailable.
        </p>
      </>
    ),
  },

  "authentication/providers": {
    toc: [
      { id: "callback", label: "Project callback URL" },
      { id: "providers", label: "Supported providers" },
      { id: "browser-flow", label: "Browser + PKCE flow" },
      { id: "security", label: "Security behavior" },
    ],
    content: (
      <>
        <p>
          A project can enable Google, Apple, GitHub, and Microsoft sign-in. HALO
          owns the upstream callback exchange, while your application receives a
          short-lived one-time code at an allowlisted client callback.
        </p>

        <H2 id="callback">Project callback URL</H2>
        <Code
          language="text"
          label="Exact pattern"
          code={`https://api.agihalo.com/api/v1/auth/projects/{PROJECT_ID}/providers/{PROVIDER}/callback`}
        />
        <Callout kind="warning" title="Register the exact project callback">
          <p>
            The callback includes both project ID and provider. Copy it from the
            project&apos;s Authentication UI; do not reuse another project&apos;s
            URL or the older provider-only callback.
          </p>
        </Callout>

        <H2 id="providers">Supported providers</H2>
        <DataTable
          headers={["Provider", "Upstream application", "Callback method"]}
          rows={[
            ["Google", "OAuth Web application", "GET"],
            ["Apple", "Services ID / Sign in with Apple", "POST form response"],
            ["GitHub", "OAuth App", "GET"],
            ["Microsoft", "App registration / Web redirect", "GET"],
          ]}
        />
        <p>
          Save the client ID and secret in HALO, choose provider scopes, then
          enable sign-in. Stored secrets are encrypted and never returned.
        </p>

        <H2 id="browser-flow">Browser + PKCE flow</H2>
        <Examples
          title="Provider sign-in"
          examples={[
            {
              label: "1. Authorize",
              language: "typescript",
              code: providerAuthorize,
            },
            {
              label: "2. Exchange code",
              language: "bash",
              code: providerToken,
            },
          ]}
        />
        <Steps
          items={[
            {
              title: "Your app starts authorization",
              children: (
                <p>
                  Open the HALO provider authorize URL with the publishable key,
                  allowlisted client callback, state, and S256 challenge.
                </p>
              ),
            },
            {
              title: "HALO calls the provider",
              children: (
                <p>
                  HALO stores one-time state, sends the provider request, and
                  receives the project-specific callback.
                </p>
              ),
            },
            {
              title: "Your callback receives a code",
              children: (
                <p>
                  HALO redirects to the exact client callback with a short-lived
                  code and your original state.
                </p>
              ),
            },
            {
              title: "Your app exchanges the code",
              children: (
                <p>
                  Send the original verifier and redirect URL to receive the
                  project user session.
                </p>
              ),
            },
          ]}
        />

        <H2 id="security">Security behavior</H2>
        <ul>
          <li>Authorization and callback responses use no-store policies.</li>
          <li>Redirect URLs must match project configuration exactly.</li>
          <li>State and one-time codes are consumed once and expire.</li>
          <li>Unverified provider email and cross-project identity conflicts fail closed.</li>
        </ul>
      </>
    ),
  },

  "authentication/sessions": {
    toc: [
      { id: "tokens", label: "Token model" },
      { id: "refresh", label: "Refresh rotation" },
      { id: "verify", label: "Verify access tokens" },
      { id: "revoke", label: "Revocation" },
    ],
    content: (
      <>
        <p>
          Project Authentication issues short-lived RS256 access tokens and
          opaque rotating refresh tokens. Session policy is configured per
          project.
        </p>

        <H2 id="tokens">Token model</H2>
        <DataTable
          headers={["Token", "Format", "Use"]}
          rows={[
            ["Access token", "RS256 JWT", "Call user-protected application APIs"],
            ["Refresh token", "Opaque halo_auth_rt_…", "Rotate the session"],
            ["Provider login code", "One-time opaque code", "Complete social sign-in"],
            ["OAuth App token", "RS256 JWT + opaque refresh", "Service-scoped access"],
          ]}
        />

        <H2 id="refresh">Refresh rotation</H2>
        <Code language="bash" label="cURL" code={refreshCurl} />
        <Callout kind="security" title="Replace the stored refresh token">
          <p>
            A successful refresh returns a new refresh token. Persist the new
            value atomically and discard the previous token. Reusing an invalid or
            consumed value fails.
          </p>
        </Callout>

        <H2 id="verify">Verify access tokens</H2>
        <Endpoint method="GET" path="/api/v1/auth/.well-known/jwks.json" />
        <p>
          Fetch the project public JWK using the publishable-key header and cache
          it briefly. Validate all of the following:
        </p>
        <ul>
          <li>Algorithm is <code>RS256</code> and the JWT <code>kid</code> matches a JWK.</li>
          <li>Issuer is <code>halo-project:{"{projectId}"}</code>.</li>
          <li>Audience is <code>halo-project-auth</code> for project user tokens.</li>
          <li><code>tokenUse</code> is <code>project_auth_access</code>.</li>
          <li>Expiry, project ID, subject, session ID, and email are present.</li>
        </ul>
        <Endpoint
          method="GET"
          path="/api/v1/auth/user"
          description="Resolve a valid bearer access token to the current user."
        />

        <H2 id="revoke">Revocation</H2>
        <Endpoint method="POST" path="/api/v1/auth/logout" />
        <p>
          Project owners can also list active sessions and revoke an individual
          session from the dashboard. User ban or deletion makes future session
          validation unavailable.
        </p>
      </>
    ),
  },

  "authentication/oauth-apps": {
    toc: [
      { id: "what-it-is", label: "What an OAuth App is" },
      { id: "register", label: "Register an app" },
      { id: "authorization", label: "Authorization flow" },
      { id: "token", label: "Token exchange" },
      { id: "userinfo", label: "User info & scopes" },
    ],
    content: (
      <>
        <p>
          OAuth Apps turn Project Authentication into an authorization server for
          services. A signed-in project user can approve explicit scopes for an
          app without giving that app the user&apos;s password or upstream social
          provider token.
        </p>

        <H2 id="what-it-is">What an OAuth App is</H2>
        <Callout kind="info" title="OAuth Apps and sign-in providers are different">
          <p>
            Sign-in providers let Google, Apple, GitHub, or Microsoft authenticate
            a project user. OAuth Apps let a service obtain HALO project-user
            access after that user is signed in.
          </p>
        </Callout>

        <H2 id="register">Register an app</H2>
        <p>
          In the project Authentication UI, add a name, client type, homepage,
          exact redirect URIs, and allowed scopes.
        </p>
        <DataTable
          headers={["Client type", "Secret", "PKCE"]}
          rows={[
            ["Public", "No deployable client secret", "S256 required"],
            ["Confidential", "Client secret required at token exchange", "Supported and recommended"],
          ]}
        />
        <p>
          The client secret is shown once. Rotating it revokes existing OAuth
          tokens for that app.
        </p>

        <H2 id="authorization">Authorization flow</H2>
        <Code language="http" label="Authorization request" code={oauthAuthorize} />
        <p>
          The GET endpoint validates the client, redirect URI, and requested
          scopes, then returns app details for your consent UI. After the user
          approves, call the POST endpoint with the project user access token.
        </p>
        <Code language="bash" label="Approve scopes" code={oauthConsent} />
        <p>
          The response contains <code>redirectTo</code>. Navigate to that exact URL
          so the service receives <code>code</code> and the original
          <code>state</code>.
        </p>

        <H2 id="token">Token exchange</H2>
        <Code language="bash" label="Public client + PKCE" code={oauthToken} />
        <p>
          Confidential clients also send <code>client_secret</code>. The
          authorization code is one-time and bound to the registered client,
          redirect URI, project user, scopes, and optional S256 challenge.
        </p>
        <Endpoint
          method="POST"
          path="/api/v1/auth/oauth/token"
          description="Authorization-code and refresh-token grants."
        />

        <H2 id="userinfo">User info & scopes</H2>
        <Endpoint method="GET" path="/api/v1/auth/oauth/userinfo" />
        <p>
          Send the OAuth access token as a bearer token. HALO validates its project,
          app, audience, token use, user status, and scopes before returning
          project-user information.
        </p>
        <Callout kind="warning" title="No upstream provider token is delegated">
          <p>
            OAuth App tokens authorize HALO project-user scopes. They do not expose
            the Google, Apple, GitHub, or Microsoft credential used to sign that
            user in.
          </p>
        </Callout>
      </>
    ),
  },
};
