import {
  Callout,
  Code,
  DataTable,
  Endpoint,
  Examples,
  H2,
  Steps,
} from "@/components/DocsContent";
import type { DocPageMap } from "./types";

const nodeMemory = `import { HaloMemoryClient } from "agihalo-node-sdk";

const memory = new HaloMemoryClient({
  apiKey: process.env.HALO_API_KEY!,
  projectKey: "customer-product",
});

const declaration = memory.functionDeclaration();

const result = await memory.executeRetrieveFunction({
  endUserKey: "user_123",
  sessionData: {
    messages: [
      { role: "user", content: "What are my report preferences?" },
    ],
  },
  limit: 5,
});

// Feed result.functionResponse to your model, then capture the final answer.
await memory.capture({
  endUserKey: "user_123",
  sessionData: {
    messages: [
      { role: "user", content: "What are my report preferences?" },
    ],
  },
  response: {
    role: "assistant",
    content: "You prefer concise reports in the morning.",
  },
});`;

const pythonMemory = `from halo import HaloMemoryClient

memory = HaloMemoryClient(
    api_key=HALO_API_KEY,
    project_key="customer-product",
)

declaration = memory.function_declaration()

result = memory.execute_retrieve_function(
    end_user_key="user_123",
    session_data={
        "messages": [
            {"role": "user", "content": "What are my report preferences?"}
        ]
    },
    limit=5,
)

# Feed result["functionResponse"] to your model, then capture the final answer.
memory.capture(
    end_user_key="user_123",
    session_data={
        "messages": [
            {"role": "user", "content": "What are my report preferences?"}
        ]
    },
    response={
        "role": "assistant",
        "content": "You prefer concise reports in the morning.",
    },
)`;

const nodeAuthentication = `import {
  HaloAuthClient,
  HaloOAuthClient,
} from "agihalo-node-sdk";

// OEM or application user Authentication.
const auth = new HaloAuthClient({
  publishableKey: HALO_PROJECT_PUBLISHABLE_KEY,
});

const session = await auth.signInWithPassword(
  "user@example.com",
  "Secret123!"
);
const refreshed = await auth.refreshSession(session.refresh_token);
const user = await auth.getUser(refreshed.access_token);

// Service-side OAuth App client.
const oauth = new HaloOAuthClient({
  clientId: "halo_client_...",
  clientSecret: HALO_OAUTH_CLIENT_SECRET,
});

const tokens = await oauth.exchangeCode(
  callbackCode,
  "https://service.example.com/callback"
);`;

const pythonAuthentication = `from halo import HaloAuthClient, HaloOAuthClient

# OEM or application user Authentication.
auth = HaloAuthClient(
    publishable_key=HALO_PROJECT_PUBLISHABLE_KEY,
)
session = auth.sign_in_with_password(
    "user@example.com",
    "Secret123!",
)
refreshed = auth.refresh_session(session["refresh_token"])
user = auth.get_user(refreshed["access_token"])

# Service-side OAuth App client.
oauth = HaloOAuthClient(
    client_id="halo_client_...",
    client_secret=HALO_OAUTH_CLIENT_SECRET,
)
tokens = oauth.exchange_code(
    code=callback_code,
    redirect_uri="https://service.example.com/callback",
)`;

export const billingSdkReferencePages: DocPageMap = {
  "billing/usage": {
    toc: [
      { id: "what-is-metered", label: "What is metered" },
      { id: "balance", label: "Balance & credits" },
      { id: "limits", label: "Usage limits" },
      { id: "history", label: "History & stats" },
    ],
    content: (
      <>
        <p>
          HALO meters completed model activity, Memory operations, and applicable
          media workloads against the owning account. The selected project and
          client key remain attached to each request for attribution.
        </p>

        <H2 id="what-is-metered">What is metered</H2>
        <DataTable
          headers={["Workload", "Metering source"]}
          rows={[
            ["Hosted text models", "Validated upstream usage and HALO pricing catalog"],
            ["Custom open-source text", "Canonical request + visible assistant text units"],
            ["Imagen / Veo", "Model, duration, resolution, and count reservation"],
            ["Memory", "Writes, retrieves, end users, and storage under the Memory plan"],
          ]}
        />

        <H2 id="balance">Balance & credits</H2>
        <p>
          Card checkout and eligible x402 settlements add spendable account
          balance. The project dashboard shows current balance and activity, while
          the account-level membership controls project and Memory plan limits.
        </p>
        <Callout kind="info" title="Provider earnings have a separate ledger">
          <p>
            Customer balance, completed model charges, Keeper commission, and
            payout eligibility are tracked separately. A provider cannot infer
            payable earnings from request count alone.
          </p>
        </Callout>

        <H2 id="limits">Usage limits</H2>
        <p>
          A positive account usage limit is enforced before upstream dispatch.
          Requests beyond the limit return 429. Reservation-aware media and model
          routes also hold bounded maximum usage before a shared platform key is
          released.
        </p>

        <H2 id="history">History & stats</H2>
        <p>
          The dashboard History view summarizes project traffic. Authenticated
          account APIs expose logs, charges, and realtime/hourly/daily/summary
          statistics.
        </p>
        <Endpoint method="GET" path="/api/user/logs" />
        <Endpoint method="GET" path="/api/user/charges" />
        <Endpoint method="GET" path="/api/user/stats/realtime" />
        <Endpoint method="GET" path="/api/user/stats/hourly" />
        <Endpoint method="GET" path="/api/user/stats/daily" />
        <Endpoint method="GET" path="/api/user/stats/summary" />
      </>
    ),
  },

  "billing/x402": {
    toc: [
      { id: "flow", label: "Payment flow" },
      { id: "headers", label: "Headers" },
      { id: "sdk", label: "SDK automation" },
      { id: "recovery", label: "Settlement recovery" },
    ],
    content: (
      <>
        <p>
          x402 lets an agent or trusted runtime recover model access when prepaid
          balance is unavailable. The client signs the payment requirement, HALO
          verifies and credits the settlement, then the request is retried.
        </p>

        <H2 id="flow">Payment flow</H2>
        <Steps
          items={[
            {
              title: "Receive 402",
              children: (
                <p>The gateway returns a payment requirement before model dispatch.</p>
              ),
            },
            {
              title: "Sign authorization",
              children: (
                <p>
                  A trusted wallet signs the required EIP-712 USDC authorization
                  on the configured network.
                </p>
              ),
            },
            {
              title: "Retry with proof",
              children: (
                <p>
                  The client resends the request with
                  <code>Payment-Signature</code>.
                </p>
              ),
            },
            {
              title: "Settle and execute",
              children: (
                <p>
                  HALO atomically applies eligible credit before dispatching the
                  paid request.
                </p>
              ),
            },
          ]}
        />

        <H2 id="headers">Headers</H2>
        <DataTable
          headers={["Header", "Purpose"]}
          rows={[
            [<code key="payment">Payment-Signature</code>, "Signed x402 payment proof"],
            [<code key="rescue">x-halo-rescue: true</code>, "Request the bounded rescue judge path when eligible"],
            [<code key="tx">x-payment-tx</code>, "Legacy manual recovery header; rejected by current flow"],
          ]}
        />

        <H2 id="sdk">SDK automation</H2>
        <p>
          The Node.js and Python SDKs include a model wrapper for automatic
          payment and lower-level tools for TEE or custom decision logic.
        </p>
        <Code
          language="typescript"
          label="Node.js"
          code={`import { haloSystem } from "agihalo-node-sdk";

const paidModel = haloSystem(model, {
  privateKey: secureWalletPrivateKey,
  apiKey: HALO_API_KEY,
});

const result = await paidModel.generateContent("Continue the task");`}
        />
        <Callout kind="security" title="Never ship a private key in application code">
          <p>
            Use a wallet, HSM, TEE, or signing callback appropriate to the
            workload. The examples use a variable only to show the SDK boundary.
          </p>
        </Callout>

        <H2 id="recovery">Settlement recovery</H2>
        <p>
          Current settlement recovery is automatic. Do not copy a transaction ID
          to a different client key or retry through the legacy
          <code>x-payment-tx</code> path. If a settlement is still being reconciled,
          wait and retry the original workload.
        </p>
      </>
    ),
  },

  "sdks/node": {
    toc: [
      { id: "install", label: "Install" },
      { id: "authentication", label: "Authentication & OAuth" },
      { id: "memory", label: "Memory client" },
      { id: "delete", label: "Memory deletion" },
      { id: "connections", label: "Connected accounts" },
      { id: "payments", label: "Payment helpers" },
    ],
    content: (
      <>
        <p>
          The Node.js SDK provides explicit Memory helpers, legacy router headers,
          and x402 payment utilities for trusted JavaScript and TypeScript
          runtimes.
        </p>

        <H2 id="install">Install</H2>
        <Code
          language="bash"
          label="npm"
          code={`npm install agihalo-node-sdk ethers`}
        />

        <H2 id="authentication">Authentication & OAuth</H2>
        <Code
          language="typescript"
          label="TypeScript"
          code={nodeAuthentication}
        />
        <p>
          <code>HaloAuthClient</code> uses a Project publishable key for
          application-user signup, password sessions, refresh rotation, user
          lookup, password recovery, and upstream provider PKCE flows.
          <code>HaloOAuthClient</code> is for Services registered as OAuth Apps.
          It does not store returned tokens.
        </p>
        <Callout kind="warning" title="Keep confidential secrets server-side">
          <p>
            A Project publishable key may run in a frontend. An OAuth App
            <code>clientSecret</code>, HALO client key, provider secret, or wallet
            private key must remain in a trusted runtime.
          </p>
        </Callout>

        <H2 id="memory">Memory client</H2>
        <Code language="typescript" label="TypeScript" code={nodeMemory} />
        <Callout kind="info" title="Projects must already exist">
          <p>
            The SDK does not auto-create a Memory project during capture or
            retrieve. Pass the HALO API key and Memory project key explicitly from
            trusted configuration.
          </p>
        </Callout>

        <H2 id="delete">Memory deletion</H2>
        <Code
          language="typescript"
          label="TypeScript"
          code={`await memory.deleteTopic({
  endUserKey: "user_123",
  topicKey: "report_preferences",
  includeRaw: false,
});

await memory.deleteRawEntry({
  endUserKey: "user_123",
  rawEntryId: "raw_entry_id",
});`}
        />

        <H2 id="connections">Connected accounts</H2>
        <Code
          language="typescript"
          label="TypeScript"
          code={`await memory.registerOAuthProvider({
  providerKey: "google",
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  redirectUri:
    "https://connect.example.com/api/v1/memory/oauth/callback/google",
});

const result = await memory.startOAuth({
  scopeId: "memory-scope-uuid",
  connectorId: "google.calendar",
  completionMode: "mobile_deep_link",
  returnUri: "example-app://oauth/complete",
});`}
        />
        <Callout kind="warning" title="Preview API">
          <p>
            Connected-account helpers are packaged for controlled rollout. Verify
            that the connector is enabled for your project before exposing the
            flow to end users.
          </p>
        </Callout>

        <H2 id="payments">Payment helpers</H2>
        <p>
          Use <code>haloSystem</code> for an automatic 402 retry wrapper or
          <code>HaloPaymentTools</code> when an agent must decide and sign
          explicitly.
        </p>
        <Code
          language="typescript"
          label="Manual tools"
          code={`import { HaloPaymentTools } from "agihalo-node-sdk";

const tools = new HaloPaymentTools({
  privateKey: secureWalletPrivateKey,
  apiKey: HALO_API_KEY,
  haloUrl: "https://api.agihalo.com",
});

const decision = await tools.consultJudge(context, "1.00 USDC");
const signature = await tools.signPayment(paymentRequirement);`}
        />
      </>
    ),
  },

  "sdks/python": {
    toc: [
      { id: "install", label: "Install" },
      { id: "authentication", label: "Authentication & OAuth" },
      { id: "memory", label: "Memory client" },
      { id: "delete", label: "Memory deletion" },
      { id: "connections", label: "Connected accounts" },
      { id: "router", label: "Legacy router headers" },
      { id: "payments", label: "Payment helpers" },
    ],
    content: (
      <>
        <p>
          The Python SDK exposes the same explicit Memory and x402 boundaries in
          Python naming conventions.
        </p>
        <H2 id="install">Install</H2>
        <Code language="bash" label="pip" code={`pip install halo-sdk`} />

        <H2 id="authentication">Authentication & OAuth</H2>
        <Code
          language="python"
          label="Python"
          code={pythonAuthentication}
        />
        <p>
          The Python clients expose the same Project-user and Service OAuth
          boundaries as the Node.js SDK and never persist returned tokens.
        </p>

        <H2 id="memory">Memory client</H2>
        <Code language="python" label="Python" code={pythonMemory} />

        <H2 id="delete">Memory deletion</H2>
        <Code
          language="python"
          label="Python"
          code={`memory.delete_topic(
    end_user_key="user_123",
    topic_key="report_preferences",
    include_raw=False,
)

memory.delete_raw_entry(
    end_user_key="user_123",
    raw_entry_id="raw_entry_id",
)`}
        />

        <H2 id="connections">Connected accounts</H2>
        <Code
          language="python"
          label="Python"
          code={`result = memory.start_oauth(
    scope_id="memory-scope-uuid",
    connector_id="google.calendar",
    completion_mode="mobile_deep_link",
    return_uri="example-app://oauth/complete",
)`}
        />
        <Callout kind="warning" title="Preview API">
          <p>
            Connected-account helpers are packaged for controlled rollout. Check
            connector availability before showing the authorization flow.
          </p>
        </Callout>

        <H2 id="router">Legacy router headers</H2>
        <Code
          language="python"
          label="Python"
          code={`from halo import halo_memory_headers

headers = halo_memory_headers(
    project_key="customer-product",
    end_user_key="user_123",
    mode="capture",
)

# Pass headers through the provider client's per-request header option.`}
        />
        <p>
          New integrations should prefer function declaration plus direct function
          execution. Router retrieval asks HALO to inject compact context and a
          function declaration into a proxied model request.
        </p>

        <H2 id="payments">Payment helpers</H2>
        <Code
          language="python"
          label="Python"
          code={`from halo import HaloPaymentTools

tools = HaloPaymentTools(
    private_key=secure_wallet_private_key,
    api_key=HALO_API_KEY,
    halo_url="https://api.agihalo.com",
)

decision = tools.consult_judge(
    context="Continue an important agent task",
    amount_str="1.00 USDC",
)
signature = tools.sign_payment(payment_requirement)`}
        />
      </>
    ),
  },

  "api-reference/authentication": {
    toc: [
      { id: "credential-matrix", label: "Credential matrix" },
      { id: "client-key", label: "HALO client key" },
      { id: "publishable", label: "Project publishable key" },
      { id: "bearer", label: "Project user bearer token" },
      { id: "owner", label: "Dashboard owner JWT" },
    ],
    content: (
      <>
        <p>
          HALO uses separate credentials for resource spending, public project
          configuration, end-user authorization, and project administration.
          Choose by API surface instead of passing one universal token everywhere.
        </p>

        <H2 id="credential-matrix">Credential matrix</H2>
        <DataTable
          headers={["Credential", "Example", "API surfaces"]}
          rows={[
            ["Client API key", <code key="sk">sk-…</code>, "Model Gateway, Memory"],
            ["Publishable key", <code key="pk">apikey: …</code>, "Public Project Authentication"],
            ["Project user access", <code key="user">Bearer eyJ…</code>, "Current user, logout, OAuth consent"],
            ["OAuth App access", <code key="oauth">Bearer eyJ…</code>, "OAuth userinfo and service scopes"],
            ["Dashboard owner JWT", <code key="owner">Bearer …</code>, "Project configuration and management"],
          ]}
        />

        <H2 id="client-key">HALO client key</H2>
        <p>
          Keys beginning with <code>sk-</code> authorize billable gateway and
          Memory calls. They must remain in a trusted runtime.
        </p>

        <H2 id="publishable">Project publishable key</H2>
        <p>
          Send it in <code>apikey</code> or
          <code>x-halo-project-key</code>. Navigation to a provider authorize
          endpoint may carry <code>?apikey=</code> because a browser redirect
          cannot add a custom header.
        </p>

        <H2 id="bearer">Project user bearer token</H2>
        <p>
          The RS256 access token represents one Authentication user and one
          session. Verify it with the project JWKS and required claims. Do not use
          it as a model-spending key.
        </p>

        <H2 id="owner">Dashboard owner JWT</H2>
        <p>
          Owner routes live below <code>/api/user</code>. The backend verifies
          project ownership before allowing Authentication configuration, user
          administration, session revocation, API key management, or registry
          mutation.
        </p>
      </>
    ),
  },

  "api-reference/endpoints": {
    toc: [
      { id: "gateway", label: "Model Gateway" },
      { id: "memory", label: "Memory" },
      { id: "auth", label: "Project Authentication" },
      { id: "registry", label: "Service Registry" },
      { id: "account", label: "Account & Keeper" },
    ],
    content: (
      <>
        <p>
          All production APIs use <code>https://api.agihalo.com</code>. Paths
          below are grouped by caller and credential boundary.
        </p>

        <H2 id="gateway">Model Gateway</H2>
        <Endpoint method="POST" path="/v1beta/models/:model:generateContent" />
        <Endpoint method="POST" path="/v1beta/models/:model:streamGenerateContent" />
        <Endpoint method="POST" path="/v1beta/models/:model:predictLongRunning" />
        <Endpoint method="POST" path="/openai/v1/chat/completions" />
        <Endpoint method="POST" path="/claude/v1/messages" />
        <Endpoint method="POST" path="/deepseek/v1/chat/completions" />
        <Endpoint method="POST" path="/v1/chat/completions" />
        <Endpoint method="POST" path="/:family/v1/chat/completions" />

        <H2 id="memory">Memory</H2>
        <Endpoint method="POST" path="/api/v1/memory/capture" />
        <Endpoint method="POST" path="/api/v1/memory/retrieve" />
        <Endpoint
          method="POST"
          path="/api/v1/memory/functions/halo_retrieve_end_user_memory"
        />
        <Endpoint method="GET" path="/api/v1/memory/projects" />
        <Endpoint method="POST" path="/api/v1/memory/projects" />
        <Endpoint method="GET" path="/api/v1/memory/projects/:projectKey" />
        <Endpoint method="DELETE" path="/api/v1/memory/projects/:projectKey" />

        <H2 id="auth">Project Authentication</H2>
        <Endpoint method="GET" path="/api/v1/auth/settings" />
        <Endpoint method="GET" path="/api/v1/auth/.well-known/jwks.json" />
        <Endpoint method="POST" path="/api/v1/auth/signup" />
        <Endpoint method="POST" path="/api/v1/auth/token" />
        <Endpoint method="GET" path="/api/v1/auth/user" />
        <Endpoint method="POST" path="/api/v1/auth/logout" />
        <Endpoint method="POST" path="/api/v1/auth/recover" />
        <Endpoint method="POST" path="/api/v1/auth/password/reset" />
        <Endpoint method="GET" path="/api/v1/auth/providers/:provider/authorize" />
        <Endpoint method="POST" path="/api/v1/auth/providers/token" />
        <Endpoint method="GET" path="/api/v1/auth/oauth/authorize" />
        <Endpoint method="POST" path="/api/v1/auth/oauth/authorize" />
        <Endpoint method="POST" path="/api/v1/auth/oauth/token" />
        <Endpoint method="GET" path="/api/v1/auth/oauth/userinfo" />

        <H2 id="registry">Service Registry</H2>
        <Endpoint method="GET" path="/api/v1/services" />
        <Endpoint method="POST" path="/api/v1/services" />
        <Endpoint method="GET" path="/api/v1/services/:id" />
        <Endpoint method="GET" path="/api/v1/services/:id/metadata.json" />
        <Endpoint method="POST" path="/api/v1/services/:id/dns/verify" />
        <Endpoint
          method="POST"
          path="/api/v1/services/:id/erc8004/prepare-register"
        />
        <Endpoint
          method="POST"
          path="/api/v1/services/:id/erc8004/confirm-register"
        />

        <H2 id="account">Account & Keeper</H2>
        <Endpoint method="GET" path="/api/user/projects" />
        <Endpoint method="POST" path="/api/user/projects" />
        <Endpoint method="GET" path="/api/user/keys" />
        <Endpoint method="POST" path="/api/user/keys" />
        <Endpoint method="DELETE" path="/api/user/keys/:key" />
        <Endpoint method="GET" path="/api/user/model-vendors" />
        <Endpoint method="PUT" path="/api/user/model-vendors" />
        <Endpoint method="GET" path="/api/user/model-providers" />
        <Endpoint method="POST" path="/api/user/model-providers" />
        <Endpoint method="POST" path="/api/user/model-providers/:id/test" />
        <Endpoint method="POST" path="/api/user/model-providers/payouts" />
      </>
    ),
  },

  "api-reference/errors": {
    toc: [
      { id: "shape", label: "Error shapes" },
      { id: "statuses", label: "Status codes" },
      { id: "retry", label: "Retry policy" },
      { id: "security", label: "Security failures" },
    ],
    content: (
      <>
        <p>
          HALO preserves provider-compatible error envelopes where practical and
          returns stable machine-readable codes for Authentication and selected
          payment flows.
        </p>

        <H2 id="shape">Error shapes</H2>
        <Examples
          title="Common error envelopes"
          examples={[
            {
              label: "OpenAI-compatible",
              language: "json",
              code: `{
  "error": {
    "message": "Invalid API Key",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}`,
            },
            {
              label: "Authentication",
              language: "json",
              code: `{
  "error": "Project publishable key is required",
  "code": "PUBLISHABLE_KEY_REQUIRED"
}`,
            },
          ]}
        />

        <H2 id="statuses">Status codes</H2>
        <DataTable
          headers={["Status", "Meaning", "Default action"]}
          rows={[
            ["400", "Invalid payload, redirect, scope, model, or contract", "Fix the request"],
            ["401", "Credential or required proof missing", "Authenticate; do not blind retry"],
            ["403", "Invalid credential or blocked resource", "Stop and inspect policy"],
            ["402", "Payment is required", "Settle or add balance, then retry"],
            ["409", "State or rollout conflict", "Refresh state and follow the code"],
            ["429", "Usage or Authentication rate limit", "Back off"],
            ["500", "Unexpected server failure", "Retry only if idempotent"],
            ["503", "Required dependency or capacity unavailable", "Back off with jitter"],
          ]}
        />

        <H2 id="retry">Retry policy</H2>
        <ul>
          <li>Retry GET requests and explicitly idempotent operations with bounded backoff.</li>
          <li>Do not replay one-time authorization codes, refresh tokens, or payment proofs blindly.</li>
          <li>
            Streaming requests require application-level handling because a
            partial response may have already reached the client.
          </li>
          <li>Respect <code>Retry-After</code> when it is present.</li>
        </ul>

        <H2 id="security">Security failures</H2>
        <Callout kind="warning" title="Fail closed is intentional">
          <p>
            Authentication returns 503 if its rate limiter is unavailable;
            unsupported Gemini resources are blocked; invalid redirect URIs,
            OAuth scopes, PKCE, owner proofs, and provider contracts are rejected
            rather than relaxed through fallback behavior.
          </p>
        </Callout>
      </>
    ),
  },
};
