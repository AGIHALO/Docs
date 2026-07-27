import {
  Callout,
  Code,
  DataTable,
  Examples,
  FeatureGrid,
  H2,
} from "@/components/DocsContent";
import type { DocPageMap } from "./types";

const openAiCurl = `curl https://api.agihalo.com/openai/v1/chat/completions \\
  -H "Authorization: Bearer $HALO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5-mini",
    "messages": [{"role": "user", "content": "Hello from HALO"}]
  }'`;

const geminiCurl = `curl "https://api.agihalo.com/v1beta/models/gemini-3.5-flash:generateContent" \\
  -H "x-goog-api-key: $HALO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contents": [{
      "role": "user",
      "parts": [{"text": "Hello from HALO"}]
    }]
  }'`;

const anthropicCurl = `curl https://api.agihalo.com/claude/v1/messages \\
  -H "x-api-key: $HALO_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 256,
    "messages": [{"role": "user", "content": "Hello from HALO"}]
  }'`;

const deepSeekCurl = `curl https://api.agihalo.com/deepseek/v1/chat/completions \\
  -H "Authorization: Bearer $HALO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello from HALO"}]
  }'`;

const openSourceCurl = `curl https://api.agihalo.com/open-source/v1/chat/completions \\
  -H "Authorization: Bearer $HALO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "qwen/qwen3.6-35b-a3b",
    "messages": [{"role": "user", "content": "Reply with OK"}],
    "max_tokens": 16,
    "stream": false
  }'`;

export const modelGatewayPages: DocPageMap = {
  "model-gateway": {
    toc: [
      { id: "provider-native", label: "Provider-native APIs" },
      { id: "base-urls", label: "Base URLs" },
      { id: "choose", label: "Choose an integration" },
      { id: "billing", label: "Authentication & billing" },
    ],
    content: (
      <>
        <p>
          HALO exposes separate provider-native entrypoints behind one
          project-scoped client key. Existing SDKs generally need only a base URL
          and credential change.
        </p>

        <H2 id="provider-native">Provider-native APIs</H2>
        <p>
          HALO does not flatten every provider into one synthetic request schema.
          Gemini keeps Gemini resources, Anthropic keeps Messages, and
          OpenAI-compatible providers keep Chat Completions.
        </p>
        <Callout kind="info" title="One project key, multiple protocols">
          <p>
            The same <code>sk-</code> key can authenticate supported vendor
            endpoints. Its header placement follows the provider&apos;s convention.
          </p>
        </Callout>

        <H2 id="base-urls">Base URLs</H2>
        <DataTable
          headers={["Provider", "HALO base URL", "Protocol"]}
          rows={[
            [
              "Google Gemini",
              <code key="g">https://api.agihalo.com</code>,
              "Gemini Developer API",
            ],
            [
              "OpenAI",
              <code key="o">https://api.agihalo.com/openai/v1</code>,
              "Chat Completions",
            ],
            [
              "Anthropic",
              <code key="a">https://api.agihalo.com/claude/v1</code>,
              "Messages",
            ],
            [
              "DeepSeek",
              <code key="d">https://api.agihalo.com/deepseek/v1</code>,
              "Chat Completions",
            ],
            [
              "Open-source",
              <code key="s">https://api.agihalo.com/open-source/v1</code>,
              "OpenAI-compatible",
            ],
          ]}
        />

        <H2 id="choose">Choose an integration</H2>
        <FeatureGrid
          items={[
            {
              title: "Gemini",
              description:
                "Text streaming plus priced Imagen and Veo long-running generation.",
              href: "/model-gateway/gemini",
            },
            {
              title: "OpenAI",
              description: "Chat Completions with OpenAI client compatibility.",
              href: "/model-gateway/openai",
            },
            {
              title: "Anthropic",
              description: "Claude Messages with Anthropic headers and payloads.",
              href: "/model-gateway/anthropic",
            },
            {
              title: "Open-source",
              description:
                "Listed families routed to validated custom inference endpoints.",
              href: "/model-gateway/open-source",
            },
          ]}
        />

        <H2 id="billing">Authentication & billing</H2>
        <p>
          HALO authenticates the client key, enforces the account usage limit,
          resolves an eligible upstream, and records completed usage. If prepaid
          balance is unavailable, the request may enter the x402 flow before
          dispatch.
        </p>
        <Callout kind="warning" title="Model catalogs are not proxied uniformly">
          <p>
            Gemini model-list and arbitrary resource access are blocked by the
            production allowlist. Use the HALO dashboard for project model
            selection and this documentation for supported request families.
          </p>
        </Callout>
      </>
    ),
  },

  "model-gateway/gemini": {
    toc: [
      { id: "request", label: "Make a request" },
      { id: "actions", label: "Supported actions" },
      { id: "long-running", label: "Long-running media" },
      { id: "restrictions", label: "Restrictions" },
    ],
    content: (
      <>
        <p>
          Point the Google Gen AI SDK or Gemini REST request at
          <code>https://api.agihalo.com</code>. Use the HALO client key as the
          Gemini API key.
        </p>

        <H2 id="request">Make a request</H2>
        <Code language="bash" label="cURL" code={geminiCurl} />

        <H2 id="actions">Supported actions</H2>
        <DataTable
          headers={["Action", "Availability"]}
          rows={[
            [<code key="generate">generateContent</code>, "Supported"],
            [<code key="stream">streamGenerateContent</code>, "Supported"],
            [<code key="lro">predictLongRunning</code>, "Priced Imagen/Veo flows"],
            ["Operation polling", "Owner-bound after an admitted long-running start"],
            ["Signed file retrieval", "Supported through capability-bound file routes"],
          ]}
        />

        <H2 id="long-running">Long-running media</H2>
        <p>
          HALO reserves the maximum priced amount before releasing an Imagen or
          Veo operation. The operation is bound to the initiating user, client
          key, model, and upstream key revision. Polling uses that original
          binding.
        </p>
        <Callout kind="info" title="Keep the operation name">
          <p>
            Persist the exact operation returned by the start request. A different
            client key cannot take over polling, even when it belongs to the same
            account.
          </p>
        </Callout>

        <H2 id="restrictions">Restrictions</H2>
        <ul>
          <li>Model listing and arbitrary Gemini resources are unavailable.</li>
          <li>Music generation requests are blocked.</li>
          <li>
            Billing-affecting media fields must use their canonical top-level
            parameter paths.
          </li>
          <li>
            Unknown shared-key resources, embedding/count/predict actions, and
            unsupported cached or URI context fail closed.
          </li>
        </ul>
      </>
    ),
  },

  "model-gateway/openai": {
    toc: [
      { id: "request", label: "Make a request" },
      { id: "sdk", label: "OpenAI SDK" },
      { id: "behavior", label: "Gateway behavior" },
    ],
    content: (
      <>
        <p>
          HALO&apos;s OpenAI entrypoint accepts Chat Completions at
          <code>/openai/v1/chat/completions</code>.
        </p>
        <H2 id="request">Make a request</H2>
        <Code language="bash" label="cURL" code={openAiCurl} />

        <H2 id="sdk">OpenAI SDK</H2>
        <Examples
          examples={[
            {
              label: "TypeScript",
              language: "typescript",
              code: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.HALO_API_KEY,
  baseURL: "https://api.agihalo.com/openai/v1",
});

const result = await client.chat.completions.create({
  model: "gpt-5-mini",
  messages: [{ role: "user", content: "Hello from HALO" }],
});`,
            },
            {
              label: "Python",
              language: "python",
              code: `from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["HALO_API_KEY"],
    base_url="https://api.agihalo.com/openai/v1",
)

result = client.chat.completions.create(
    model="gpt-5-mini",
    messages=[{"role": "user", "content": "Hello from HALO"}],
)`,
            },
          ]}
        />

        <H2 id="behavior">Gateway behavior</H2>
        <p>
          The gateway validates a priced model, selects an eligible platform key,
          forwards the canonical request, parses upstream usage, and bills the
          completed response. Authentication errors use an OpenAI-style error
          envelope.
        </p>
      </>
    ),
  },

  "model-gateway/anthropic": {
    toc: [
      { id: "request", label: "Make a request" },
      { id: "sdk", label: "Anthropic SDK" },
      { id: "headers", label: "Headers" },
    ],
    content: (
      <>
        <p>
          Anthropic-compatible requests use the HALO
          <code>/claude/v1/messages</code> endpoint and the familiar
          <code>x-api-key</code> header.
        </p>
        <H2 id="request">Make a request</H2>
        <Code language="bash" label="cURL" code={anthropicCurl} />

        <H2 id="sdk">Anthropic SDK</H2>
        <Code
          language="typescript"
          label="TypeScript"
          code={`import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.HALO_API_KEY,
  baseURL: "https://api.agihalo.com/claude/v1",
});

const message = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 256,
  messages: [{ role: "user", content: "Hello from HALO" }],
});`}
        />

        <H2 id="headers">Headers</H2>
        <p>
          Send the HALO key in <code>x-api-key</code>. Keep the required
          <code>anthropic-version</code> header expected by your Anthropic client
          version. Provider credentials are selected inside HALO and are never
          returned.
        </p>
      </>
    ),
  },

  "model-gateway/deepseek": {
    toc: [
      { id: "request", label: "Make a request" },
      { id: "models", label: "Models" },
      { id: "compatibility", label: "Compatibility" },
    ],
    content: (
      <>
        <p>
          DeepSeek uses an OpenAI-compatible chat shape at the HALO
          <code>/deepseek/v1</code> base URL.
        </p>
        <H2 id="request">Make a request</H2>
        <Code language="bash" label="cURL" code={deepSeekCurl} />
        <H2 id="models">Models</H2>
        <ul>
          <li><code>deepseek-chat</code> for chat workloads.</li>
          <li><code>deepseek-reasoner</code> for reasoning workloads.</li>
        </ul>
        <H2 id="compatibility">Compatibility</H2>
        <p>
          Use an OpenAI-compatible client and change its base URL to
          <code>https://api.agihalo.com/deepseek/v1</code>. The HALO client key is
          sent as a bearer token.
        </p>
      </>
    ),
  },

  "model-gateway/open-source": {
    toc: [
      { id: "request", label: "Make a request" },
      { id: "contract", label: "Runtime contract" },
      { id: "families", label: "Model families" },
      { id: "keeper", label: "Supplying inference" },
    ],
    content: (
      <>
        <p>
          The open-source gateway routes listed canonical model IDs to validated
          custom inference providers while preserving an OpenAI-compatible chat
          response.
        </p>
        <H2 id="request">Make a request</H2>
        <Code language="bash" label="cURL" code={openSourceCurl} />

        <H2 id="contract">Runtime contract</H2>
        <ul>
          <li>Text-only messages and visible assistant output.</li>
          <li><code>n</code> and <code>best_of</code>, when present, must be 1.</li>
          <li>
            Tools, function declarations, tool-role messages, audio, images, and
            multimodal content are rejected before provider dispatch.
          </li>
          <li>
            Runtime normalizes to <code>stream: false</code> and caps output at
            32,768 tokens.
          </li>
        </ul>
        <Callout kind="warning" title="No fallback to an unknown provider">
          <p>
            If no healthy, selected, contract-valid provider exists for the exact
            model, the request fails. HALO does not silently change the model ID.
          </p>
        </Callout>

        <H2 id="families">Model families</H2>
        <p>
          The production catalog groups listed models across Qwen, Llama,
          DeepSeek, Kimi, Mistral, Gemma, GLM, MiniMax, Nemotron, MiMo, GPT-OSS,
          and AllenAI families. Use the dashboard&apos;s Models page for the
          current project-visible IDs.
        </p>

        <H2 id="keeper">Supplying inference</H2>
        <p>
          If you operate an OpenAI-compatible HTTPS endpoint, read the Keeper
          contract before registration. Model discovery, baseline checks,
          bounded health probes, deterministic metering, and payout rules apply.
        </p>
      </>
    ),
  },

  "model-gateway/routing": {
    toc: [
      { id: "project-settings", label: "Project settings" },
      { id: "vendor-families", label: "Vendor families" },
      { id: "selection", label: "Provider selection" },
      { id: "failures", label: "Failure behavior" },
    ],
    content: (
      <>
        <p>
          Model selection is project-scoped. The dashboard exposes vendor
          activation and model-family settings without placing upstream
          credentials in client applications.
        </p>
        <H2 id="project-settings">Project settings</H2>
        <p>
          Open a project and choose <strong>Models</strong>. Changes apply to that
          project&apos;s client keys. A revision check prevents an older dashboard
          view from overwriting newer routing state.
        </p>

        <H2 id="vendor-families">Vendor families</H2>
        <DataTable
          headers={["Vendor", "Examples"]}
          rows={[
            ["Gemini", "Gemini 3.x, Imagen, Veo"],
            ["OpenAI", "GPT-5, GPT-4.1, GPT-4o, o3/o4"],
            ["Anthropic", "Claude Fable, Opus, Sonnet, Haiku"],
            ["DeepSeek", "Chat and Reasoner"],
            ["Open-source", "Qwen, Llama, Kimi, Mistral, Gemma, and more"],
          ]}
        />

        <H2 id="selection">Provider selection</H2>
        <p>
          Hosted platform routing and custom open-source supply have separate
          rollout controls. A request must match a priced canonical model and an
          eligible upstream. Provider health and agreement status are checked
          before dispatch.
        </p>

        <H2 id="failures">Failure behavior</H2>
        <ul>
          <li>Unknown or unpriced models fail before upstream dispatch.</li>
          <li>Usage-limit and balance gates run before the selected upstream call.</li>
          <li>Open-source provider capacity failures do not create seller earnings.</li>
          <li>HALO never substitutes a different canonical model silently.</li>
        </ul>
      </>
    ),
  },
};
