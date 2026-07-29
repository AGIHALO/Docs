import {
  Callout,
  Code,
  DataTable,
  Endpoint,
  FeatureGrid,
  H2,
  Steps,
} from "@/components/DocsContent";
import type { DocPageMap } from "./types";

const createService = `curl -X POST https://api.agihalo.com/api/v1/services \\
  -H "Authorization: Bearer $HALO_DASHBOARD_JWT" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Schedule Service",
    "description": "Plans and updates calendar events.",
    "image": "https://service.example.com/icon.png",
    "interfaces": [
      {
        "name": "Schedule",
        "endpoint": "https://service.example.com/runtime",
        "version": "v1",
        "skills": ["calendar.read", "calendar.write"],
        "domains": ["productivity"]
      }
    ],
    "x402Support": true,
    "dnsDomain": "service.example.com"
  }'`;

const customProviderModels = `{
  "data": [
    { "id": "qwen/qwen3.6-35b-a3b" }
  ]
}`;

const customProviderChat = `{
  "model": "qwen/qwen3.6-35b-a3b",
  "messages": [
    { "role": "user", "content": "Reply with the single word OK." }
  ],
  "max_tokens": 16,
  "stream": false
}`;

export const servicePages: DocPageMap = {
  services: {
    toc: [
      { id: "service-model", label: "Service model" },
      { id: "create", label: "Create a registry draft" },
      { id: "metadata", label: "Metadata" },
      { id: "identity", label: "Identity extension" },
    ],
    content: (
      <>
        <p>
          A HALO Service is a capability package published for discovery and
          runtime execution. The registry stores descriptive metadata and can
          extend that record with ERC-8004 on-chain identity, DNS proof, and
          verification references.
        </p>

        <H2 id="service-model">Service model</H2>
        <DataTable
          headers={["Field", "Purpose"]}
          rows={[
            [<code key="name">name</code>, "Human-readable service name"],
            [<code key="description">description</code>, "Capability summary"],
            [<code key="image">image</code>, "Public service artwork"],
            [<code key="interfaces">interfaces[]</code>, "Runtime endpoints and capability metadata"],
            [<code key="x402">x402Support</code>, "Declares compatible payment behavior"],
            [<code key="dns">dnsDomain</code>, "Optional domain ownership proof"],
          ]}
        />
        <Callout kind="info" title="Service-native API">
          <p>
            Services are first-class records at <code>/api/v1/services</code>.
            ERC-8004 is an optional identity extension and does not change the
            Service API path.
          </p>
        </Callout>

        <H2 id="create">Create a registry draft</H2>
        <Code language="bash" label="cURL" code={createService} />
        <Endpoint method="GET" path="/api/v1/services" />
        <Endpoint method="GET" path="/api/v1/services/:id" />
        <Endpoint method="POST" path="/api/v1/services/:id/dns/verify" />

        <H2 id="metadata">Metadata</H2>
        <p>
          Every registered identity receives a HALO-managed JSON metadata URL.
          The public record includes service endpoints, x402 support,
          registrations, identity-reference trust, managed-host metadata, and
          optional DNS or verification fields.
        </p>
        <Endpoint
          method="GET"
          path="/api/v1/services/:id/metadata.json"
          description="Public, no-store metadata for a registered identity."
        />

        <H2 id="identity">Identity extension</H2>
        <FeatureGrid
          items={[
            {
              title: "ERC-8004 registration",
              description:
                "Prepare a transaction, confirm the on-chain event, and bind the token URI.",
              href: "/services/erc-8004",
            },
            {
              title: "DNS proof",
              description:
                "Publish the expected TXT record and ask HALO to verify it.",
            },
            {
              title: "Connected accounts",
              description:
                "Connect project-scoped external accounts without exposing provider tokens.",
              href: "/services/connected-accounts",
              eyebrow: "LIVE",
            },
          ]}
        />
      </>
    ),
  },

  "services/erc-8004": {
    toc: [
      { id: "flow", label: "Registration flow" },
      { id: "owner-proof", label: "Owner proof" },
      { id: "metadata", label: "Managed metadata" },
      { id: "dns", label: "DNS verification" },
    ],
    content: (
      <>
        <p>
          The Service Registry can bind a HALO record to ERC-8004 identity. HALO
          prepares transaction data, verifies the confirmed chain result, and
          serves a stable metadata document.
        </p>

        <H2 id="flow">Registration flow</H2>
        <Steps
          items={[
            {
              title: "Create a Service draft",
              children: (
                <p>Save descriptive metadata and optional DNS intent first.</p>
              ),
            },
            {
              title: "Prepare registration",
              children: (
                <p>
                  Call <code>prepare-register</code> to receive transaction data
                  and the exact HALO metadata URL.
                </p>
              ),
            },
            {
              title: "Submit from the owner wallet",
              children: (
                <p>Broadcast the returned transaction on the configured chain.</p>
              ),
            },
            {
              title: "Confirm the transaction",
              children: (
                <p>
                  HALO verifies the Registered event, <code>ownerOf</code>,
                  token URI, and owner proof before binding the identity.
                </p>
              ),
            },
            {
              title: "Activate the URI",
              children: (
                <p>
                  If required, prepare and confirm the final set-URI transaction.
                </p>
              ),
            },
          ]}
        />
        <Endpoint
          method="POST"
          path="/api/v1/services/:id/erc8004/prepare-register"
        />
        <Endpoint
          method="POST"
          path="/api/v1/services/:id/erc8004/confirm-register"
        />
        <Endpoint
          method="POST"
          path="/api/v1/services/:id/erc8004/prepare-set-uri"
        />
        <Endpoint
          method="POST"
          path="/api/v1/services/:id/erc8004/confirm-uri"
        />

        <H2 id="owner-proof">Owner proof</H2>
        <p>
          Confirmation operations require a signature from the current on-chain
          owner. HALO returns the exact owner-proof message in the record or in a
          401 response when the signature is missing.
        </p>
        <Callout kind="security" title="Chain ownership is authoritative">
          <p>
            Dashboard ownership alone cannot bind or mutate an on-chain identity.
            HALO checks the current owner and rejects a stale wallet proof.
          </p>
        </Callout>

        <H2 id="metadata">Managed metadata</H2>
        <Code
          language="json"
          label="Metadata excerpt"
          code={`{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "Schedule Service",
  "services": [
    {
      "name": "Schedule",
      "endpoint": "https://service.example.com/runtime",
      "version": "v1"
    }
  ],
  "x402Support": true,
  "active": true,
  "registrations": [
    {
      "agentRegistry": "eip155:{chainId}:{registryAddress}",
      "agentId": "{tokenId}"
    }
  ],
  "supportedTrust": ["identity-reference"],
  "halo": {
    "canonicalServiceId": "eip155:{chainId}:{registryAddress}:{tokenId}",
    "metadataHost": {
      "provider": "agihalo",
      "managed": true,
      "contentHash": "sha256:..."
    }
  }
}`}
        />

        <H2 id="dns">DNS verification</H2>
        <p>
          With <code>dnsDomain</code> configured, HALO expects a TXT record like
          <code>_agihalo.example.com</code> containing the service&apos;s assigned
          proof value. Verification updates the managed metadata but does not
          replace wallet ownership.
        </p>
      </>
    ),
  },

  "services/connected-accounts": {
    toc: [
      { id: "status", label: "Live API" },
      { id: "initial", label: "Initial project-isolated mode" },
      { id: "portable", label: "Portable mode" },
      { id: "custody", label: "Token custody" },
      { id: "limits", label: "Legacy-service limits" },
    ],
    content: (
      <>
        <Callout kind="info" title="Project-scoped connection API">
          <p>
            These routes use the Memory Project API key. OAuth client secrets and
            provider tokens are encrypted server-side; responses never return
            either secret.
          </p>
        </Callout>

        <H2 id="status">Live API</H2>
        <p>
          Connected accounts are separate from Project Authentication. Project
          Authentication proves who an application user is; connected accounts
          hold permission to act on an external resource such as a calendar or
          messaging workspace.
        </p>
        <Endpoint
          method="GET"
          path="/api/v1/memory/projects/:projectKey/connectors"
        />
        <Endpoint
          method="GET"
          path="/api/v1/memory/projects/:projectKey/oauth/providers"
        />
        <Endpoint
          method="PUT"
          path="/api/v1/memory/projects/:projectKey/oauth/providers/:providerKey"
        />
        <Endpoint
          method="GET"
          path="/api/v1/memory/projects/:projectKey/oauth/return-uris"
        />
        <Endpoint
          method="POST"
          path="/api/v1/memory/projects/:projectKey/oauth/return-uris"
        />

        <H2 id="initial">Initial project-isolated mode</H2>
        <Steps
          items={[
            {
              title: "Resolve an OEM end user",
              children: (
                <p>A project&apos;s Memory scope anchors the external connection.</p>
              ),
            },
            {
              title: "Start one-time authorization",
              children: (
                <p>
                  HALO stores random state and PKCE context; the provider callback
                  remains fixed per project, not per user.
                </p>
              ),
            },
            {
              title: "Store encrypted tokens",
              children: (
                <p>
                  Provider access and refresh tokens remain in a server-side vault.
                </p>
              ),
            },
            {
              title: "Grant a Service capability",
              children: (
                <p>
                  Runtime execution receives only the scopes approved for that
                  Service, never the provider token itself.
                </p>
              ),
            },
          ]}
        />
        <Endpoint
          method="POST"
          path="/api/v1/memory/projects/:projectKey/scopes/:scopeId/oauth/start"
        />
        <Endpoint
          method="GET"
          path="/api/v1/memory/oauth/callback/:providerKey"
          description="Provider callback authenticated by one-time hashed state."
        />
        <Endpoint
          method="GET"
          path="/api/v1/memory/projects/:projectKey/oauth/sessions/:sessionId"
        />
        <Endpoint
          method="GET"
          path="/api/v1/memory/projects/:projectKey/scopes/:scopeId/connections"
        />
        <Endpoint
          method="POST"
          path="/api/v1/memory/projects/:projectKey/scopes/:scopeId/connections/:connectionId/refresh"
        />

        <H2 id="portable">Portable mode</H2>
        <p>
          A later opt-in portable identity can link verified OEM scopes and reuse
          an existing provider grant across those linked scopes. Email equality
          alone must never create this link. Missing upstream scopes still require
          incremental user consent.
        </p>

        <H2 id="custody">Token custody</H2>
        <DataTable
          headers={["Actor", "Receives provider token?"]}
          rows={[
            ["End-user hardware", "No"],
            ["Installed Service runtime", "No"],
            ["OEM application", "No"],
            ["HALO encrypted token vault", "Yes, server-only"],
          ]}
        />

        <H2 id="limits">Legacy-service limits</H2>
        <p>
          A redirect hook cannot manufacture an upstream API permission. Services
          such as DoorDash that expose no suitable public OAuth/API contract
          remain partnership-required catalog entries.
        </p>
      </>
    ),
  },

  keeper: {
    toc: [
      { id: "types", label: "Provider types" },
      { id: "contract", label: "Custom endpoint contract" },
      { id: "checks", label: "Validation & health" },
      { id: "metering", label: "Metering" },
      { id: "payouts", label: "Payouts" },
    ],
    content: (
      <>
        <p>
          Keeper is the supply side of HALO&apos;s model gateway. A provider can
          register validated inference, pass identity checks, monitor health, and
          request settlement for eligible earnings.
        </p>

        <H2 id="types">Provider types</H2>
        <DataTable
          headers={["Type", "Current availability"]}
          rows={[
            [
              "Custom endpoint",
              "OpenAI-compatible text inference with production validation",
            ],
            [
              "Hosted credential",
              "Configuration may be preserved, but seller traffic and earnings are rollout-gated",
            ],
          ]}
        />

        <H2 id="contract">Custom endpoint contract</H2>
        <ul>
          <li>Public HTTPS base URL with no credentials, query, or fragment.</li>
          <li>
            Relative chat path ending in <code>/chat/completions</code>; HALO
            derives the matching models path.
          </li>
          <li>
            Choose Bearer or <code>X-API-Key</code> authentication for both
            discovery and chat.
          </li>
          <li>
            Return uncompressed JSON. Only same-origin 307/308 redirects are
            followed, at most two hops.
          </li>
        </ul>
        <Code language="json" label="GET /models" code={customProviderModels} />
        <Code
          language="json"
          label="POST /chat/completions probe"
          code={customProviderChat}
        />

        <H2 id="checks">Validation & health</H2>
        <p>
          Registration performs discovery and bounded baseline calls. Optional
          logprob probes report capability but do not affect billing. Continuing
          health checks run in bounded batches; repeated recorded failures can put
          a key on watch and later disable it.
        </p>
        <Callout kind="warning" title="Validation calls can cost the provider">
          <p>
            Check Models, save-time validation, and periodic health calls reach
            your endpoint and may incur your upstream costs.
          </p>
        </Callout>

        <H2 id="metering">Metering</H2>
        <p>
          Custom text usage uses deterministic HALO text units from the canonical
          request and visible assistant response. Seller-reported usage, hidden
          reasoning, cache claims, and model-native tokenizers do not determine
          the customer charge.
        </p>

        <H2 id="payouts">Payouts</H2>
        <ul>
          <li>Complete individual KYC and save a Base USDC receive wallet.</li>
          <li>The UI shows the current fee split before activation.</li>
          <li>One active payout request can allocate available cash-funded earnings.</li>
          <li>Pending requests may be cancelled and expire after seven days.</li>
          <li>Processing and transfer are manually reviewed; timing is not guaranteed.</li>
        </ul>
      </>
    ),
  },
};
