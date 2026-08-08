import {
  Callout,
  Code,
  DataTable,
  Examples,
  FeatureGrid,
  H2,
  H3,
} from "@/components/DocsContent";
import type { DocPageMap } from "./types";

const openAiCurl = `curl https://api.agihalo.com/openai/v1/chat/completions \\
  -H "Authorization: Bearer $HALO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5-mini",
    "messages": [{"role": "user", "content": "Hello from HALO"}]
  }'`;

const openAiVisionCurl = `curl https://api.agihalo.com/openai/v1/chat/completions \\
  -H "Authorization: Bearer $HALO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5.6",
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "Describe the important details."},
        {
          "type": "image_url",
          "image_url": {
            "url": "https://example.com/input.png",
            "detail": "high"
          }
        }
      ]
    }]
  }'`;

const openAiImageGenerationCurl = `curl https://api.agihalo.com/openai/v1/images/generations \\
  -H "Authorization: Bearer $HALO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-image-2",
    "prompt": "A glass observatory above a moonlit cloud layer",
    "size": "1536x1024",
    "quality": "high",
    "output_format": "png"
  }'`;

const openAiImageEditCurl = `curl https://api.agihalo.com/openai/v1/images/edits \\
  -H "Authorization: Bearer $HALO_API_KEY" \\
  -F "model=gpt-image-2" \\
  -F "prompt=Add a watercolor texture" \\
  -F "image[]=@source.png" \\
  -F "mask=@mask.png"`;

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

const openSourceCurl = `curl https://api.agihalo.com/qwen/v1/chat/completions \\
  -H "Authorization: Bearer $HALO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "qwen/qwen3.6-35b-a3b",
    "messages": [{"role": "user", "content": "Reply with OK"}],
    "max_tokens": 16,
    "stream": false
  }'`;

const withModelCode = (rows: readonly (readonly string[])[]) =>
  rows.map(([model, ...prices]) => [
    <code key={model}>{model}</code>,
    ...prices,
  ]);

const geminiBasePricing = [
  ["gemini-3.6-flash", "$1.50", "$0.15", "$7.50"],
  ["gemini-3.5-flash", "$1.50", "$0.15", "$9.00"],
  ["gemini-3.5-flash-lite", "$0.30", "$0.03", "$2.50"],
  [
    "gemini-3.1-pro-preview",
    "$2.00 / $4.00",
    "$0.20 / $0.40",
    "$12.00 / $18.00",
  ],
  ["gemini-3.1-flash-lite", "$0.25", "$0.025", "$1.50"],
  ["gemini-3-flash-preview", "$0.50", "$0.05", "$3.00"],
  [
    "gemini-2.5-pro",
    "$1.25 / $2.50",
    "$0.125 / $0.25",
    "$10.00 / $15.00",
  ],
  ["gemini-2.5-flash", "$0.30", "$0.03", "$2.50"],
  ["gemini-2.5-flash-lite", "$0.10", "$0.01", "$0.40"],
] as const;

const openAiBasePricing = [
  [
    "gpt-5.6",
    "$6.25 / $12.50",
    "$0.50 / $1.00",
    "$30.00 / $45.00",
  ],
  [
    "gpt-5.6-sol",
    "$6.25 / $12.50",
    "$0.50 / $1.00",
    "$30.00 / $45.00",
  ],
  [
    "gpt-5.6-terra",
    "$2.50 / $5.00",
    "$0.20 / $0.40",
    "$12.00 / $18.00",
  ],
  [
    "gpt-5.6-luna",
    "$0.25 / $0.50",
    "$0.02 / $0.04",
    "$1.20 / $1.80",
  ],
  ["gpt-5.5", "$5.00 / $10.00", "$0.50 / $1.00", "$30.00 / $45.00"],
  ["gpt-5.4", "$2.50 / $5.00", "$0.25 / $0.50", "$15.00 / $22.50"],
  ["gpt-5.4-mini", "$0.75", "$0.075", "$4.50"],
  ["gpt-5.4-nano", "$0.20", "$0.02", "$1.25"],
  ["gpt-5.2", "$1.75", "$0.175", "$14.00"],
  ["gpt-5.1", "$1.25", "$0.125", "$10.00"],
  ["gpt-5", "$1.25", "$0.125", "$10.00"],
  ["gpt-5-mini", "$0.25", "$0.025", "$2.00"],
  ["gpt-5-nano", "$0.05", "$0.005", "$0.40"],
  ["gpt-4.1", "$2.00", "$0.50", "$8.00"],
  ["gpt-4.1-mini", "$0.40", "$0.10", "$1.60"],
  ["gpt-4.1-nano", "$0.10", "$0.025", "$0.40"],
  ["gpt-4o", "$2.50", "$1.25", "$10.00"],
  ["gpt-4o-mini", "$0.15", "$0.075", "$0.60"],
  ["o3", "$2.00", "$0.50", "$8.00"],
  ["o4-mini", "$1.10", "$0.275", "$4.40"],
] as const;

const openAiImageBasePricing = [
  ["gpt-image-2", "$5.00", "$1.25", "—", "$8.00", "$2.00", "$30.00"],
  [
    "gpt-image-1.5",
    "$5.00",
    "$1.25",
    "$10.00",
    "$8.00",
    "$2.00",
    "$32.00",
  ],
  [
    "gpt-image-1-mini",
    "$2.00",
    "$0.20",
    "—",
    "$2.50",
    "$0.25",
    "$8.00",
  ],
  [
    "gpt-image-1",
    "$5.00",
    "$1.25",
    "—",
    "$10.00",
    "$2.50",
    "$40.00",
  ],
  [
    "chatgpt-image-latest",
    "$5.00",
    "$1.25",
    "$10.00",
    "$8.00",
    "$2.00",
    "$32.00",
  ],
] as const;

const anthropicBasePricing = [
  ["claude-fable-5", "$10.00", "$1.00", "$12.50", "$50.00"],
  ["claude-opus-4-8", "$5.00", "$0.50", "$6.25", "$25.00"],
  ["claude-opus-4-7", "$5.00", "$0.50", "$6.25", "$25.00"],
  ["claude-opus-4-6", "$5.00", "$0.50", "$6.25", "$25.00"],
  ["claude-opus-4-5-20251101", "$5.00", "$0.50", "$6.25", "$25.00"],
  ["claude-sonnet-4-6", "$3.00", "$0.30", "$3.75", "$15.00"],
  ["claude-sonnet-4-5-20250929", "$3.00", "$0.30", "$3.75", "$15.00"],
  ["claude-sonnet-4-20250514", "$3.00", "$0.30", "$3.75", "$15.00"],
  ["claude-haiku-4-5-20251001", "$1.00", "$0.10", "$1.25", "$5.00"],
  ["claude-3-5-haiku-20241022", "$0.80", "$0.08", "$1.00", "$4.00"],
] as const;

const deepSeekBasePricing = [
  ["deepseek-chat", "$0.28", "$0.028", "$0.42"],
  ["deepseek-reasoner", "$0.28", "$0.028", "$0.42"],
] as const;

const openSourcePricingFamilies = [
  {
    id: "allenai",
    label: "AllenAI · OLMo",
    rows: [["allenai/olmo-3-32b-think", "$0.15", "$0.15", "$0.50"]],
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    rows: [
      ["deepseek/deepseek-v4-flash", "$0.135883", "$0.045979", "$0.266656"],
      ["deepseek/deepseek-v4-pro", "$1.310879", "$0.133455", "$2.632670"],
    ],
  },
  {
    id: "gemma",
    label: "Google · Gemma",
    rows: [
      ["google/gemma-4-31b-it", "$0.29", "$0.272222", "$0.668889"],
      ["google/gemma-4-26b-a4b-it", "$0.11", "$0.075556", "$0.368889"],
    ],
  },
  {
    id: "llama",
    label: "Meta · Llama",
    rows: [
      ["meta-llama/llama-4-maverick", "$0.284", "$0.248", "$0.934"],
      ["meta-llama/llama-4-scout", "$0.16", "$0.146250", "$0.482500"],
    ],
  },
  {
    id: "minimax",
    label: "MiniMax",
    rows: [["minimax/minimax-m3", "$0.36", "$0.168", "$1.44"]],
  },
  {
    id: "mistral",
    label: "Mistral AI",
    rows: [
      ["mistralai/mistral-small-2603", "$0.168750", "$0.101250", "$0.675"],
      ["mistralai/mistral-large-2512", "$0.50", "$0.05", "$1.50"],
    ],
  },
  {
    id: "kimi",
    label: "Moonshot AI · Kimi",
    rows: [
      ["moonshotai/kimi-k3", "$3.00", "$0.30", "$15.00"],
      ["moonshotai/kimi-k2.7-code", "$0.928744", "$0.186155", "$4.059333"],
    ],
  },
  {
    id: "nemotron",
    label: "NVIDIA · Nemotron",
    rows: [
      ["nvidia/nemotron-3-nano-30b-a3b", "$0.055", "$0.055", "$0.22"],
      ["nvidia/nemotron-3-ultra-550b-a55b", "$0.55", "$0.15", "$2.90"],
    ],
  },
  {
    id: "gpt-oss",
    label: "OpenAI · GPT-OSS",
    rows: [
      ["openai/gpt-oss-120b", "$0.112800", "$0.104467", "$0.478333"],
      ["openai/gpt-oss-20b", "$0.051167", "$0.043458", "$0.190833"],
    ],
  },
  {
    id: "qwen",
    label: "Qwen",
    rows: [
      ["qwen/qwen3.6-35b-a3b", "$0.176", "$0.159333", "$1.160625"],
      ["qwen/qwen3-coder-next", "$0.182", "$0.135200", "$1.10"],
    ],
  },
  {
    id: "mimo",
    label: "Xiaomi · MiMo",
    rows: [
      ["xiaomi/mimo-v2.5-pro", "$0.549707", "$0.062359", "$1.566080"],
      ["xiaomi/mimo-v2.5", "$0.138250", "$0.021050", "$0.294"],
    ],
  },
  {
    id: "glm",
    label: "Z.ai · GLM",
    rows: [["z-ai/glm-5.2", "$1.354196", "$0.260500", "$4.348842"]],
  },
] as const;

const imagenBasePricing = [
  ["imagen-3.0-generate-002", "$0.03"],
  ["imagen-4.0-fast-generate-001", "$0.02"],
  ["imagen-4.0-generate-001", "$0.04"],
  ["imagen-4.0-ultra-generate-001", "$0.06"],
] as const;

const veoBasePricing = [
  ["veo-3.1-lite-generate-preview", "$0.05", "$0.08", "—"],
  ["veo-3.1-fast-generate-preview", "$0.10", "$0.12", "$0.30"],
  ["veo-3.1-generate-preview", "$0.40", "$0.40", "$0.60"],
  ["veo-3.0-fast-generate-001", "$0.10", "$0.12", "$0.30"],
  ["veo-3.0-generate-001", "$0.40", "$0.40", "$0.40"],
  ["veo-2.0-generate-001", "$0.35", "—", "—"],
] as const;

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
              "Chat Completions, vision, and GPT Image",
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
              "Chat Completions SDK",
              <code key="s">https://api.agihalo.com/v1</code>,
              "OpenAI, DeepSeek, and open families by model ID",
            ],
            [
              "Open model family",
              <code key="sf">https://api.agihalo.com/{"{family}"}/v1</code>,
              "Family-bound Chat Completions",
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
              description:
                "Chat, vision, image generation, and image editing with OpenAI client compatibility.",
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

  "model-gateway/pricing": {
    toc: [
      { id: "units", label: "How to read prices" },
      { id: "gemini-pricing", label: "Google Gemini" },
      { id: "openai-pricing", label: "OpenAI" },
      { id: "anthropic-pricing", label: "Anthropic" },
      { id: "deepseek-pricing", label: "DeepSeek" },
      { id: "open-source-pricing", label: "Open-source" },
      { id: "media-pricing", label: "Media generation" },
      { id: "pricing-notes", label: "Billing notes" },
    ],
    content: (
      <>
        <p>
          These base rates mirror the HALO production pricing catalog checked on
          August 1, 2026. Text prices are in USD per 1 million tokens.
        </p>

        <H2 id="units">How to read prices</H2>
        <Callout kind="info" title="USD per 1M tokens">
          <p>
            Token rates are metered separately by the usage categories shown in
            each table. Paired values show standard and long-context rates in
            that order.
          </p>
        </Callout>

        <H2 id="gemini-pricing">Google Gemini</H2>
        <DataTable
          headers={["Model", "Input", "Cached input", "Output"]}
          rows={withModelCode(geminiBasePricing)}
        />
        <p>
          Paired Gemini rates apply at up to 200,000 input tokens and above
          200,000 input tokens.
        </p>

        <H2 id="openai-pricing">OpenAI</H2>
        <DataTable
          headers={["Model", "Uncached input", "Cached input", "Output"]}
          rows={withModelCode(openAiBasePricing)}
        />
        <p>
          OpenAI Chat Completions reports cached input separately. All remaining
          prompt input is billed at the uncached-input rate. Paired rates apply
          at up to 272,000 input tokens and above 272,000 input tokens.
        </p>

        <H3 id="openai-image-pricing">OpenAI GPT Image</H3>
        <p>
          GPT Image rates are in USD per 1 million tokens and are metered
          separately by text and image modality.
        </p>
        <DataTable
          headers={[
            "Model",
            "Text input",
            "Cached text input",
            "Text output",
            "Image input",
            "Cached image input",
            "Image output",
          ]}
          rows={withModelCode(openAiImageBasePricing)}
        />

        <H2 id="anthropic-pricing">Anthropic</H2>
        <DataTable
          headers={["Model", "Input", "Cached input", "Cache write", "Output"]}
          rows={withModelCode(anthropicBasePricing)}
        />

        <H2 id="deepseek-pricing">DeepSeek</H2>
        <DataTable
          headers={["Model", "Input", "Cached input", "Output"]}
          rows={withModelCode(deepSeekBasePricing)}
        />

        <H2 id="open-source-pricing">Open-source</H2>
        <p>
          Open-source rates are HALO catalog rates for the listed runtime pool.
          Project visibility and healthy provider capacity still apply.
        </p>
        {openSourcePricingFamilies.map((family) => (
          <section key={family.id}>
            <H3 id={`open-source-${family.id}`}>{family.label}</H3>
            <DataTable
              headers={["Model", "Input", "Cached input", "Output"]}
              rows={withModelCode(family.rows)}
            />
          </section>
        ))}

        <H2 id="media-pricing">Media generation</H2>
        <H3 id="imagen-pricing">Imagen · per generated image</H3>
        <DataTable
          headers={["Model", "Price"]}
          rows={withModelCode(imagenBasePricing)}
        />
        <H3 id="veo-pricing">Veo · USD per generated second</H3>
        <DataTable
          headers={["Model", "720p", "1080p", "4K"]}
          rows={withModelCode(veoBasePricing)}
        />
        <p>
          A dash means that resolution is unavailable and is rejected before
          provider dispatch.
        </p>

        <H2 id="pricing-notes">Billing notes</H2>
        <ul>
          <li>Batch, Flex, Priority, and regional processing tiers are not listed.</li>
          <li>
            Search, cache storage, and modality-specific audio, image, or video
            token rates can add separate usage.
          </li>
          <li>
            The completed upstream usage and the billing snapshot attached to the
            request determine the final debit.
          </li>
          <li>
            Use the dashboard Models page for the current project-visible catalog.
          </li>
        </ul>
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
      { id: "models", label: "Models" },
      { id: "request", label: "Make a request" },
      { id: "sdk", label: "OpenAI SDK" },
      { id: "vision", label: "Vision input" },
      { id: "images", label: "Generate & edit images" },
      { id: "restrictions", label: "Restrictions" },
      { id: "behavior", label: "Gateway behavior" },
    ],
    content: (
      <>
        <p>
          HALO&apos;s OpenAI entrypoint accepts Chat Completions, vision input,
          GPT Image generations, and GPT Image edits under
          <code>/openai/v1</code>. The same image routes are also available at
          the canonical <code>/v1</code> SDK base.
        </p>

        <H2 id="models">Models</H2>
        <DataTable
          headers={["Capability", "Production model IDs"]}
          rows={[
            [
              "Latest chat and vision",
              "gpt-5.6 (Sol alias), gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-5.5",
            ],
            [
              "Other chat and vision",
              "gpt-5.4, gpt-5.4-mini, gpt-5.4-nano, gpt-5.2, gpt-5.1, retained GPT-5/GPT-4.1/GPT-4o/o3/o4-mini models",
            ],
            [
              "Image generation and editing",
              "gpt-image-2, gpt-image-1.5, gpt-image-1-mini, gpt-image-1, chatgpt-image-latest",
            ],
          ]}
        />
        <Callout kind="info" title="Responses-only Pro models">
          <p>
            Pro models may appear in pricing references, but Responses-API-only
            models are not advertised on HALO Chat Completions. HALO does not
            silently substitute another endpoint or model.
          </p>
        </Callout>

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

        <H2 id="vision">Vision input</H2>
        <p>
          OpenAI image blocks are accepted in user messages as credential-free
          HTTPS URLs or inline base64 image data URLs. The selected model must
          declare image-input support.
        </p>
        <Code language="bash" label="Vision request" code={openAiVisionCurl} />
        <p>
          Image detail can be <code>auto</code>, <code>low</code>, or
          <code>high</code>. <code>original</code> is limited to the base
          GPT-5.4, GPT-5.5, and GPT-5.6 models that expose that capability.
        </p>

        <H2 id="images">Generate &amp; edit images</H2>
        <Code
          language="bash"
          label="Generate with GPT Image"
          code={openAiImageGenerationCurl}
        />
        <Code
          language="bash"
          label="Multipart image edit"
          code={openAiImageEditCurl}
        />
        <p>
          Image edits accept one to sixteen JSON HTTPS/data-URL references or
          multipart <code>image</code>/<code>image[]</code> uploads, plus one
          optional mask. Generation and edit streams are forwarded without
          buffering the returned base64 payload.
        </p>

        <H2 id="restrictions">Restrictions</H2>
        <ul>
          <li>
            OpenAI <code>file_id</code> values are account-bound and unavailable
            on shared HALO platform routes. Upload the file or use an HTTPS/data
            URL.
          </li>
          <li>JSON and multipart image request bodies are capped at 64 MB.</li>
          <li>
            Provider-owned files, caches, conversations, tools, unsafe URLs,
            unknown fields, and unsupported capabilities fail closed.
          </li>
          <li>DeepSeek and custom model-family routes remain text-only.</li>
        </ul>

        <H2 id="behavior">Gateway behavior</H2>
        <p>
          The gateway validates a priced model, selects an eligible platform key,
          forwards the canonical request, parses upstream usage, and bills the
          completed response. GPT Image billing records provider-reported text
          input, image input, image output, and generated image count.
          Authentication errors use an OpenAI-style error envelope.
        </p>
        <p>
          See the current upstream references for
          {" "}
          <a href="https://developers.openai.com/api/docs/models" target="_blank" rel="noreferrer">
            models
          </a>
          ,
          {" "}
          <a href="https://developers.openai.com/api/docs/pricing" target="_blank" rel="noreferrer">
            pricing
          </a>
          , and
          {" "}
          <a href="https://developers.openai.com/api/docs/guides/image-generation" target="_blank" rel="noreferrer">
            image generation
          </a>
          .
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
        <Code
          language="typescript"
          label="OpenAI SDK — single model endpoint"
          code={`import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.HALO_API_KEY,
  baseURL: "https://api.agihalo.com/v1",
});

const response = await client.chat.completions.create({
  model: "qwen/qwen3.6-35b-a3b",
  messages: [{ role: "user", content: "Reply with OK" }],
});`}
        />
        <p>
          This SDK base URL accepts configured OpenAI and official DeepSeek
          model IDs as well as listed open-model IDs. HALO selects exactly one
          runtime from the canonical <code>model</code> value.
        </p>

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
        <p>
          Family-bound base URLs are <code>/qwen/v1</code>,
          <code>/llama/v1</code>, <code>/deepseek/v1</code>,
          <code>/kimi/v1</code>, <code>/mistral/v1</code>,
          <code>/gemma/v1</code>, <code>/glm/v1</code>,
          <code>/minimax/v1</code>, <code>/nemotron/v1</code>,
          <code>/mimo/v1</code>, <code>/gpt-oss/v1</code>, and
          <code>/allenai/v1</code>. A family URL rejects a canonical model ID
          belonging to another family.
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
            [
              "OpenAI",
              "GPT-5.6/5.5/5.4, GPT-4.1/4o, o3/o4, GPT Image 2/1.x",
            ],
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
