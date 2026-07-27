import {
  Callout,
  Code,
  DataTable,
  Examples,
  FeatureGrid,
  H2,
  Steps,
} from "@/components/DocsContent";
import type { DocPageMap } from "./types";

const quickstartCurl = `curl https://api.agihalo.com/openai/v1/chat/completions \\
  -H "Authorization: Bearer $HALO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5-mini",
    "messages": [
      { "role": "user", "content": "Reply with one word: ready" }
    ]
  }'`;

const quickstartTypeScript = `import OpenAI from "openai";

const halo = new OpenAI({
  apiKey: process.env.HALO_API_KEY,
  baseURL: "https://api.agihalo.com/openai/v1",
});

const response = await halo.chat.completions.create({
  model: "gpt-5-mini",
  messages: [{ role: "user", content: "Reply with one word: ready" }],
});

console.log(response.choices[0].message.content);`;

const quickstartPython = `from openai import OpenAI
import os

halo = OpenAI(
    api_key=os.environ["HALO_API_KEY"],
    base_url="https://api.agihalo.com/openai/v1",
)

response = halo.chat.completions.create(
    model="gpt-5-mini",
    messages=[{"role": "user", "content": "Reply with one word: ready"}],
)

print(response.choices[0].message.content)`;

export const overviewPages: DocPageMap = {
  quickstart: {
    toc: [
      { id: "before-you-begin", label: "Before you begin" },
      { id: "create-project", label: "1. Create a project" },
      { id: "create-key", label: "2. Create an API key" },
      { id: "first-request", label: "3. Make a request" },
      { id: "next", label: "Next steps" },
    ],
    content: (
      <>
        <p>
          HALO gives one project-scoped key access to provider-native model APIs,
          long-term Memory, Authentication, service identity, and usage controls.
          This quickstart sends a first OpenAI-compatible model request.
        </p>

        <H2 id="before-you-begin">Before you begin</H2>
        <p>
          You need a HALO account and an active project. Model calls consume the
          account balance assigned to the project owner.
        </p>
        <Callout kind="security" title="Keep client API keys on your server">
          <p>
            A key beginning with <code>sk-</code> can spend balance and access
            project data. Do not embed it in a browser, mobile binary, firmware,
            public repository, or model tool arguments.
          </p>
        </Callout>

        <H2 id="create-project">1. Create a project</H2>
        <p>
          Open the HALO dashboard, choose <strong>Projects</strong>, and create a
          project for the application or environment you are integrating.
        </p>
        <Steps
          items={[
            {
              title: "Name the boundary",
              children: (
                <p>
                  Use separate projects for production, staging, and unrelated OEM
                  products. Memory and Authentication are isolated by project.
                </p>
              ),
            },
            {
              title: "Open the project",
              children: (
                <p>
                  The selected project becomes the dashboard context for keys,
                  models, Memory, history, and Authentication.
                </p>
              ),
            },
          ]}
        />

        <H2 id="create-key">2. Create an API key</H2>
        <p>
          Select <strong>API Keys</strong>, create a client key, and copy it once.
          Store it in your server secret manager as <code>HALO_API_KEY</code>.
        </p>
        <Code
          language="bash"
          label=".env"
          code={`HALO_API_KEY=sk-your-project-client-key`}
        />

        <H2 id="first-request">3. Make a request</H2>
        <p>
          HALO keeps each vendor&apos;s familiar wire protocol. Point an existing
          OpenAI client at the HALO base URL and keep the rest of your request
          structure.
        </p>
        <Examples
          title="First model request"
          examples={[
            { label: "cURL", language: "bash", code: quickstartCurl },
            {
              label: "TypeScript",
              language: "typescript",
              code: quickstartTypeScript,
            },
            { label: "Python", language: "python", code: quickstartPython },
          ]}
        />
        <Callout kind="info" title="A 402 is actionable">
          <p>
            If the balance is empty, HALO can return an x402 payment requirement.
            Add balance in the dashboard or use an SDK payment helper to settle and
            retry.
          </p>
        </Callout>

        <H2 id="next">Next steps</H2>
        <FeatureGrid
          items={[
            {
              title: "Choose another provider",
              description:
                "Use Gemini, Anthropic, DeepSeek, or listed open-source models.",
              href: "/model-gateway",
              eyebrow: "GATEWAY",
            },
            {
              title: "Add long-term Memory",
              description:
                "Capture an end-user conversation and retrieve it from a tool call.",
              href: "/memory",
              eyebrow: "MEMORY",
            },
            {
              title: "Add application users",
              description:
                "Configure email, social sign-in, sessions, and OAuth Apps.",
              href: "/authentication",
              eyebrow: "AUTH",
            },
            {
              title: "Install an SDK",
              description:
                "Use typed Memory and x402 helpers in Node.js or Python.",
              href: "/sdks/node",
              eyebrow: "SDK",
            },
          ]}
        />
      </>
    ),
  },

  platform: {
    toc: [
      { id: "one-project-boundary", label: "One project boundary" },
      { id: "products", label: "Product surfaces" },
      { id: "credential-boundaries", label: "Credential boundaries" },
      { id: "request-path", label: "Request path" },
    ],
    content: (
      <>
        <p>
          HALO is a capability distribution and execution layer for AI products.
          A hardware maker or application team integrates one project boundary,
          then enables the model, memory, identity, service, and payment
          capabilities it needs.
        </p>

        <H2 id="one-project-boundary">One project boundary</H2>
        <p>
          A project is the unit that owns client API keys, Memory namespaces,
          Authentication configuration, application users, and model settings.
          The HALO account owns one or more projects.
        </p>
        <Callout kind="info" title="Account login is not application Authentication">
          <p>
            HALO&apos;s dashboard login identifies the developer or OEM operator.
            Project Authentication identifies that project&apos;s end users. Their
            users, sessions, and provider credentials never become HALO dashboard
            accounts.
          </p>
        </Callout>

        <H2 id="products">Product surfaces</H2>
        <DataTable
          headers={["Surface", "What it owns", "Primary caller"]}
          rows={[
            [
              <strong key="gateway">Model Gateway</strong>,
              "Provider-native model requests, routing, and metering",
              "Backend or trusted agent runtime",
            ],
            [
              <strong key="memory">Memory</strong>,
              "End-user scopes, topics, raw exchanges, summaries",
              "Backend or model tool executor",
            ],
            [
              <strong key="auth">Authentication</strong>,
              "App users, identities, sessions, OAuth Apps",
              "Application frontend and backend",
            ],
            [
              <strong key="registry">Service Registry</strong>,
              "Service metadata and ERC-8004 identity",
              "Service publisher",
            ],
            [
              <strong key="keeper">Keeper</strong>,
              "Inference provider supply, health, earnings, payouts",
              "Model infrastructure provider",
            ],
          ]}
        />

        <H2 id="credential-boundaries">Credential boundaries</H2>
        <DataTable
          headers={["Credential", "Use", "Exposure"]}
          rows={[
            [
              <code key="sk">sk-… client key</code>,
              "Model Gateway and Memory",
              "Server only",
            ],
            [
              <code key="pk">Project publishable key</code>,
              "Public Authentication endpoints",
              "May be used by the project application",
            ],
            [
              <code key="jwt">Project user access token</code>,
              "Current Authentication user and OAuth consent",
              "End-user session",
            ],
            [
              <code key="owner">Dashboard JWT</code>,
              "Project administration APIs",
              "HALO dashboard session only",
            ],
            [
              <code key="secret">Provider/Resend/OAuth secrets</code>,
              "Server-to-server upstream access",
              "Encrypted and never returned after save",
            ],
          ]}
        />

        <H2 id="request-path">Request path</H2>
        <Steps
          items={[
            {
              title: "Authenticate the project",
              children: <p>The request presents the credential for its API surface.</p>,
            },
            {
              title: "Resolve policy",
              children: (
                <p>
                  HALO resolves project ownership, model configuration, usage
                  limits, or Authentication settings.
                </p>
              ),
            },
            {
              title: "Execute",
              children: (
                <p>
                  The gateway dispatches to a model, Memory selects project-scoped
                  context, or Authentication issues a project-signed session.
                </p>
              ),
            },
            {
              title: "Meter and audit",
              children: (
                <p>
                  Usage and security-sensitive operations are recorded without
                  placing raw credentials in access logs.
                </p>
              ),
            },
          ]}
        />
      </>
    ),
  },

  "projects-api-keys": {
    toc: [
      { id: "project-model", label: "Project model" },
      { id: "create-key", label: "Create a client key" },
      { id: "use-key", label: "Use a client key" },
      { id: "rotation", label: "Rotation & deletion" },
    ],
    content: (
      <>
        <p>
          Projects sit above product features. A client API key belongs to exactly
          one project, so the same credential resolves the correct routing,
          Memory, usage, and billing boundary.
        </p>

        <H2 id="project-model">Project model</H2>
        <ul>
          <li>An account can own multiple projects, subject to its membership plan.</li>
          <li>Each project has a stable internal ID and an encrypted project key.</li>
          <li>Client API keys are assigned to a project when created.</li>
          <li>Deleting a project is a destructive boundary operation.</li>
        </ul>
        <Callout kind="warning" title="Do not use an API key as a project key">
          <p>
            Memory payloads may require a <code>projectKey</code>, but this value
            is not the <code>sk-</code> client credential. The API key belongs in
            the authorization header.
          </p>
        </Callout>

        <H2 id="create-key">Create a client key</H2>
        <Steps
          items={[
            {
              title: "Select a project",
              children: <p>Open the intended environment from the project grid.</p>,
            },
            {
              title: "Open API Keys",
              children: (
                <p>Create a key with a name that identifies its workload.</p>
              ),
            },
            {
              title: "Copy once",
              children: (
                <p>
                  Store the plaintext immediately. HALO displays only safe
                  identifiers after creation.
                </p>
              ),
            },
          ]}
        />

        <H2 id="use-key">Use a client key</H2>
        <p>The accepted header depends on the provider-compatible API.</p>
        <DataTable
          headers={["API", "Accepted client-key placement"]}
          rows={[
            [
              "Gemini",
              <code key="gemini">x-goog-api-key: sk-… or ?key=sk-…</code>,
            ],
            [
              "OpenAI / DeepSeek / open-source",
              <code key="bearer">Authorization: Bearer sk-…</code>,
            ],
            [
              "Anthropic",
              <code key="anthropic">x-api-key: sk-…</code>,
            ],
            [
              "Memory",
              <code key="memory">Authorization: Bearer sk-…</code>,
            ],
          ]}
        />

        <H2 id="rotation">Rotation & deletion</H2>
        <p>
          Create a replacement key, deploy it to the trusted workload, verify
          traffic, then delete the old key. Deletion is immediate; requests using
          that key will fail authentication.
        </p>
        <Callout kind="security" title="Use one key per workload">
          <p>
            Separate keys make rotation and incident response smaller. Never reuse
            a provider upstream secret as a HALO client key.
          </p>
        </Callout>
      </>
    ),
  },
};
