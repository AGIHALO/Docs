import { readFileSync } from "node:fs";
import path from "node:path";
import {
  Callout,
  Code,
  DataTable,
  H2,
  Steps,
} from "@/components/DocsContent";
import type { DocPageMap } from "./types";

const authAgentFile = readFileSync(
  path.join(process.cwd(), "public/agents/halo-auth-agent.md"),
  "utf8"
).trim();

export const authAgentPages: DocPageMap = {
  "authentication/agent-md": {
    toc: [
      { id: "before-you-copy", label: "Before you copy" },
      { id: "copy", label: "Copy agent.md" },
      { id: "use", label: "Use it with an agent" },
      { id: "result", label: "Expected result" },
    ],
    content: (
      <>
        <p>
          Give a coding agent the complete HALO Project Authentication contract
          without making it rediscover endpoints, token rotation, storage, and
          JWT rules. Copy the file below into your repository&apos;s{" "}
          <code>AGENTS.md</code> or the instruction file supported by your agent.
        </p>

        <Callout kind="info" title="One file, framework-aware implementation">
          <p>
            The instructions tell the agent to inspect your stack and reuse its
            existing router, forms, validation, session boundary, and tests. The
            file does not force a specific frontend framework.
          </p>
        </Callout>

        <H2 id="before-you-copy">Before you copy</H2>
        <DataTable
          headers={["Input", "Where to get it", "Secret?"]}
          rows={[
            [
              "HALO project publishable key",
              "Dashboard → Project → Authentication",
              "No; it may be used by the browser",
            ],
            [
              "Application origin",
              "Your deployed application URL",
              "No",
            ],
            [
              "Redirect destination",
              "Your application routing plan",
              "No",
            ],
            [
              "Provider configuration",
              "Authentication → Sign-in providers",
              "Provider secrets remain in HALO",
            ],
          ]}
        />
        <Callout kind="security" title="Do not paste private credentials">
          <p>
            The agent needs the project publishable key, not a HALO account API
            key, Resend key, provider client secret, OAuth App secret, or refresh
            token.
          </p>
        </Callout>

        <H2 id="copy">Copy agent.md</H2>
        <p>
          Use the copy button for the full file, or{" "}
          <a href="/agents/halo-auth-agent.md" target="_blank" rel="noreferrer">
            open the raw Markdown
          </a>
          .
        </p>
        <Code
          language="markdown"
          label="HALO Auth AGENTS.md"
          code={authAgentFile}
        />

        <H2 id="use">Use it with an agent</H2>
        <Steps
          items={[
            {
              title: "Add the instruction file",
              children: (
                <p>
                  Paste the block into the repository root{" "}
                  <code>AGENTS.md</code>, or append it to your existing file
                  under a HALO Auth heading.
                </p>
              ),
            },
            {
              title: "Provide project inputs",
              children: (
                <p>
                  Give the agent the publishable key, deployed origin, desired
                  redirect, and enabled sign-in flows. Do not let it guess real
                  configuration.
                </p>
              ),
            },
            {
              title: "Request the integration",
              children: (
                <p>
                  Ask the agent to implement HALO Auth, run the repository&apos;s
                  tests and production build, and report any dashboard callback
                  configuration still required.
                </p>
              ),
            },
            {
              title: "Review the security boundary",
              children: (
                <p>
                  Confirm that refresh tokens stay behind an HttpOnly
                  application-owned cookie and are never written to browser
                  storage or logs.
                </p>
              ),
            },
          ]}
        />

        <H2 id="result">Expected result</H2>
        <ul>
          <li>A typed HALO Auth client using the production endpoint contract.</li>
          <li>Signup, sign-in, current user, refresh rotation, and logout.</li>
          <li>Confirmation and recovery behavior matching project settings.</li>
          <li>Server-side JWT validation for applications with a protected API.</li>
          <li>Tests for the successful and failed session paths.</li>
          <li>A completion report listing configuration still required.</li>
        </ul>
      </>
    ),
  },
};
