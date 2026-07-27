export type DocStatus = "live" | "preview";

export interface DocEntry {
  slug: string;
  title: string;
  description: string;
  group: string;
  status?: DocStatus;
  keywords?: string[];
}

export interface NavGroup {
  label: string;
  items: DocEntry[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        slug: "quickstart",
        title: "Quickstart",
        description: "Make your first HALO model request.",
        group: "Overview",
        keywords: ["start", "curl", "api"],
      },
      {
        slug: "platform",
        title: "Platform concepts",
        description: "Understand HALO's project-scoped capability layer.",
        group: "Overview",
        keywords: ["architecture", "products", "gateway"],
      },
      {
        slug: "projects-api-keys",
        title: "Projects & API keys",
        description: "Separate environments, ownership, and credentials.",
        group: "Overview",
        keywords: ["project", "key", "credential"],
      },
    ],
  },
  {
    label: "Model Gateway",
    items: [
      {
        slug: "model-gateway",
        title: "Gateway overview",
        description: "Use provider-native APIs behind one HALO key.",
        group: "Model Gateway",
        keywords: ["router", "models", "provider"],
      },
      {
        slug: "model-gateway/gemini",
        title: "Google Gemini",
        description: "Gemini SDK-compatible requests and supported actions.",
        group: "Model Gateway",
      },
      {
        slug: "model-gateway/openai",
        title: "OpenAI",
        description: "OpenAI chat completions through HALO.",
        group: "Model Gateway",
      },
      {
        slug: "model-gateway/anthropic",
        title: "Anthropic",
        description: "Anthropic Messages API through HALO.",
        group: "Model Gateway",
        keywords: ["claude"],
      },
      {
        slug: "model-gateway/deepseek",
        title: "DeepSeek",
        description: "DeepSeek chat and reasoner models through HALO.",
        group: "Model Gateway",
      },
      {
        slug: "model-gateway/open-source",
        title: "Open-source models",
        description: "OpenAI-compatible access to listed open models.",
        group: "Model Gateway",
        keywords: ["qwen", "llama", "mistral", "kimi"],
      },
      {
        slug: "model-gateway/routing",
        title: "Models & routing",
        description: "Control vendor families and project routing.",
        group: "Model Gateway",
      },
    ],
  },
  {
    label: "Memory",
    items: [
      {
        slug: "memory",
        title: "Memory overview",
        description: "Project and end-user scoped long-term memory.",
        group: "Memory",
      },
      {
        slug: "memory/function-calling",
        title: "Function calling",
        description: "Retrieve memory from any model tool loop.",
        group: "Memory",
        keywords: ["tool", "function", "retrieve"],
      },
      {
        slug: "memory/capture-retrieve",
        title: "Capture & retrieve",
        description: "Direct REST flows for writing and reading memory.",
        group: "Memory",
      },
      {
        slug: "memory/lifecycle",
        title: "Lifecycle & deletion",
        description: "Topics, raw records, scopes, and deletion behavior.",
        group: "Memory",
      },
    ],
  },
  {
    label: "Authentication",
    items: [
      {
        slug: "authentication",
        title: "Authentication overview",
        description: "Project-scoped identity for your application users.",
        group: "Authentication",
        keywords: ["auth", "users", "publishable key"],
      },
      {
        slug: "authentication/email",
        title: "Email & Resend",
        description: "Email/password, confirmation, recovery, and templates.",
        group: "Authentication",
      },
      {
        slug: "authentication/providers",
        title: "Sign-in providers",
        description: "Configure Google, Apple, GitHub, and Microsoft.",
        group: "Authentication",
        keywords: ["oauth", "callback", "social"],
      },
      {
        slug: "authentication/sessions",
        title: "Sessions & JWT",
        description: "Refresh rotation, RS256 access tokens, and JWKS.",
        group: "Authentication",
      },
      {
        slug: "authentication/oauth-apps",
        title: "OAuth Apps",
        description: "Let services request scoped access to project users.",
        group: "Authentication",
        keywords: ["authorization code", "pkce", "client"],
      },
    ],
  },
  {
    label: "Services",
    items: [
      {
        slug: "services",
        title: "Service Registry",
        description: "Publish service metadata and runtime endpoints.",
        group: "Services",
        keywords: ["agent", "registry"],
      },
      {
        slug: "services/erc-8004",
        title: "ERC-8004 identity",
        description: "Register on-chain identity and managed metadata.",
        group: "Services",
        keywords: ["blockchain", "metadata", "dns"],
      },
      {
        slug: "services/connected-accounts",
        title: "Connected accounts",
        description: "Project-isolated access today, portable reuse later.",
        group: "Services",
        status: "preview",
        keywords: ["oauth", "token vault", "reuse"],
      },
      {
        slug: "keeper",
        title: "Keeper providers",
        description: "Supply custom inference and receive settlement.",
        group: "Services",
        keywords: ["provider", "seller", "payout"],
      },
    ],
  },
  {
    label: "Billing",
    items: [
      {
        slug: "billing/usage",
        title: "Usage & balance",
        description: "Understand metering, credits, and project activity.",
        group: "Billing",
      },
      {
        slug: "billing/x402",
        title: "x402 payments",
        description: "Recover resource access with signed USDC payment.",
        group: "Billing",
        keywords: ["402", "payment", "base"],
      },
    ],
  },
  {
    label: "SDKs",
    items: [
      {
        slug: "sdks/node",
        title: "Node.js SDK",
        description: "Memory and x402 helpers for TypeScript.",
        group: "SDKs",
        keywords: ["npm", "javascript", "typescript"],
      },
      {
        slug: "sdks/python",
        title: "Python SDK",
        description: "Memory and x402 helpers for Python.",
        group: "SDKs",
        keywords: ["pip"],
      },
    ],
  },
  {
    label: "API Reference",
    items: [
      {
        slug: "api-reference/authentication",
        title: "API authentication",
        description: "Choose the right credential for each API surface.",
        group: "API Reference",
      },
      {
        slug: "api-reference/endpoints",
        title: "Endpoint index",
        description: "Production base URLs and public endpoint families.",
        group: "API Reference",
      },
      {
        slug: "api-reference/errors",
        title: "Errors",
        description: "HTTP status codes and safe retry behavior.",
        group: "API Reference",
      },
    ],
  },
];

export const DOC_ENTRIES = NAV_GROUPS.flatMap((group) => group.items);

export const findDocEntry = (slug: string) =>
  DOC_ENTRIES.find((entry) => entry.slug === slug);

export const getAdjacentDocs = (slug: string) => {
  const index = DOC_ENTRIES.findIndex((entry) => entry.slug === slug);
  return {
    previous: index > 0 ? DOC_ENTRIES[index - 1] : null,
    next: index >= 0 && index < DOC_ENTRIES.length - 1
      ? DOC_ENTRIES[index + 1]
      : null,
  };
};
