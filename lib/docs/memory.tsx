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

const memoryFunctionName = "halo_retrieve_end_user_memory";

const functionRequest = `curl -X POST \\
  https://api.agihalo.com/api/v1/memory/functions/halo_retrieve_end_user_memory \\
  -H "Authorization: Bearer $HALO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectKey": "customer-product",
    "endUserKey": "user_123",
    "arguments": {
      "sessionData": {
        "messages": [
          {
            "role": "user",
            "content": "What format do I prefer for weekly reports?"
          }
        ]
      },
      "query": "weekly report preference",
      "limit": 5
    }
  }'`;

const captureRequest = `curl -X POST https://api.agihalo.com/api/v1/memory/capture \\
  -H "Authorization: Bearer $HALO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectKey": "customer-product",
    "endUserKey": "user_123",
    "sessionData": {
      "messages": [
        {
          "role": "user",
          "content": "Keep my weekly reports short and send them in the morning."
        }
      ]
    },
    "response": {
      "role": "assistant",
      "content": "I will keep them concise and morning-ready."
    }
  }'`;

const directRetrieve = `curl -X POST https://api.agihalo.com/api/v1/memory/retrieve \\
  -H "Authorization: Bearer $HALO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectKey": "customer-product",
    "endUserKey": "user_123",
    "topics": ["report_preferences"],
    "limit": 5,
    "includeRaw": true,
    "includeDisabledTopics": false
  }'`;

export const memoryPages: DocPageMap = {
  memory: {
    toc: [
      { id: "scope-model", label: "Scope model" },
      { id: "flow", label: "Recommended flow" },
      { id: "data", label: "What Memory stores" },
      { id: "integration-modes", label: "Integration modes" },
    ],
    content: (
      <>
        <p>
          HALO Memory turns end-user conversations into project-isolated topics,
          summaries, and linked raw exchanges. Retrieval returns relevant source
          records to your model; HALO does not generate the final user-facing
          answer.
        </p>

        <H2 id="scope-model">Scope model</H2>
        <DataTable
          headers={["Value", "Meaning", "Rule"]}
          rows={[
            [
              <code key="api">HALO_API_KEY</code>,
              "Authenticates the trusted caller",
              "Header only; never a tool argument",
            ],
            [
              <code key="project">projectKey</code>,
              "Memory product or environment",
              "Must reference an existing project and must not begin with sk-",
            ],
            [
              <code key="user">endUserKey</code>,
              "Your stable customer identifier",
              "Required and non-null",
            ],
            [
              <code key="session">sessionData</code>,
              "Current messages and application state",
              "Pass when the current task needs context selection",
            ],
          ]}
        />
        <Callout kind="warning" title="Session is not the retrieval index">
          <p>
            Memory is isolated by <code>projectKey + endUserKey</code>.
            A <code>sessionKey</code> may be carried as legacy metadata, but it does
            not replace the end-user scope.
          </p>
        </Callout>

        <H2 id="flow">Recommended flow</H2>
        <Steps
          items={[
            {
              title: "Declare the retrieve function",
              children: (
                <p>
                  Add <code>{memoryFunctionName}</code> to the tools sent to your
                  model.
                </p>
              ),
            },
            {
              title: "Execute only when called",
              children: (
                <p>
                  Your backend inserts project and end-user identity, then calls
                  the HALO function endpoint.
                </p>
              ),
            },
            {
              title: "Return sources to the model",
              children: (
                <p>
                  Feed <code>functionResponse</code> back into the model&apos;s tool
                  loop.
                </p>
              ),
            },
            {
              title: "Capture the final exchange",
              children: (
                <p>
                  After the assistant answer is complete, write the user/assistant
                  exchange separately.
                </p>
              ),
            },
          ]}
        />

        <H2 id="data">What Memory stores</H2>
        <ul>
          <li>An overall summary for an end-user scope.</li>
          <li>Topic keys, labels, aliases, confidence, and summaries.</li>
          <li>Raw user/assistant request and response records linked to topics.</li>
          <li>Processing jobs and usage needed to classify and summarize writes.</li>
        </ul>
        <Callout kind="security" title="Capture conversation data only">
          <p>
            Do not put provider secrets, model declarations, tool schemas, system
            prompts, project metadata, or HALO integration settings into raw
            Memory content.
          </p>
        </Callout>

        <H2 id="integration-modes">Integration modes</H2>
        <FeatureGrid
          items={[
            {
              title: "Function calling",
              description:
                "Best for apps that keep their existing LLM client and tool loop.",
              href: "/memory/function-calling",
            },
            {
              title: "Direct REST",
              description:
                "Best for dashboards, maintenance jobs, and explicit data flows.",
              href: "/memory/capture-retrieve",
            },
            {
              title: "Router headers",
              description:
                "Legacy model-proxy mode can request capture or injected retrieval.",
              href: "/sdks/node",
            },
          ]}
        />
      </>
    ),
  },

  "memory/function-calling": {
    toc: [
      { id: "declaration", label: "Function declaration" },
      { id: "execute", label: "Execute the function" },
      { id: "response", label: "Use the response" },
      { id: "capture", label: "Capture after the answer" },
    ],
    content: (
      <>
        <p>
          Function calling is the preferred Memory integration when your
          application already owns the model request. The model decides whether
          current context needs long-term memory; your server owns identity and
          credentials.
        </p>

        <H2 id="declaration">Function declaration</H2>
        <Code
          language="json"
          label="JSON schema"
          code={`{
  "name": "${memoryFunctionName}",
  "description": "Retrieve relevant long-term memory for this end user.",
  "parameters": {
    "type": "object",
    "properties": {
      "sessionData": {
        "type": "object",
        "description": "Current conversation and application state."
      },
      "query": {
        "type": "string",
        "description": "Optional retrieval focus."
      },
      "limit": {
        "type": "number",
        "description": "Maximum raw records to return."
      }
    },
    "required": ["sessionData"]
  }
}`}
        />
        <Callout kind="security" title="The model does not select identity">
          <p>
            Keep <code>apiKey</code>, <code>projectKey</code>, and normally
            <code>endUserKey</code> outside the function arguments the model
            generates. Resolve them from trusted server state.
          </p>
        </Callout>

        <H2 id="execute">Execute the function</H2>
        <Code language="bash" label="cURL" code={functionRequest} />

        <H2 id="response">Use the response</H2>
        <p>
          HALO immediately selects retrievable topics and linked processed raw
          exchanges. The response includes <code>selectedTopicKeys</code>,
          <code>selectionReason</code>, <code>overallSummary</code>,
          <code>topics</code>, <code>rawEntries</code>, and a compact
          <code>functionResponse</code>.
        </p>
        <Code
          language="json"
          label="Response excerpt"
          code={`{
  "name": "${memoryFunctionName}",
  "projectKey": "customer-product",
  "endUserKey": "user_123",
  "selectedTopicKeys": ["report_preferences"],
  "selectionReason": "The user is asking about report format.",
  "overallSummary": "The user prefers concise weekly reports.",
  "functionResponse": {
    "requestId": "memory_request_id",
    "rawEntries": [
      {
        "id": "raw_entry_id",
        "topic": { "topicKey": "report_preferences" },
        "requestRaw": { "messages": [] },
        "responseRaw": { "role": "assistant", "content": "..." }
      }
    ]
  }
}`}
        />
        <p>
          If no scope exists, HALO returns the same shape with empty topic and raw
          arrays. Treat that as an ordinary first-time-user state.
        </p>

        <H2 id="capture">Capture after the answer</H2>
        <p>
          Retrieval never implies a write. Call capture after your model has
          produced the final assistant message.
        </p>
        <Code language="bash" label="cURL" code={captureRequest} />
      </>
    ),
  },

  "memory/capture-retrieve": {
    toc: [
      { id: "capture", label: "Capture" },
      { id: "retrieve", label: "Direct retrieve" },
      { id: "endpoints", label: "Endpoint summary" },
      { id: "consistency", label: "Processing consistency" },
    ],
    content: (
      <>
        <p>
          Use the REST API when your backend explicitly controls Memory writes and
          reads. Both operations authenticate with the project&apos;s
          <code>sk-</code> client key.
        </p>

        <H2 id="capture">Capture</H2>
        <Code language="bash" label="cURL" code={captureRequest} />
        <p>
          Capture stores the raw exchange, accounts for write usage, and queues
          topic classification and summary work for the Memory worker.
        </p>

        <H2 id="retrieve">Direct retrieve</H2>
        <Code language="bash" label="cURL" code={directRetrieve} />
        <DataTable
          headers={["Field", "Purpose"]}
          rows={[
            [<code key="topics">topics</code>, "Restrict to explicit topic keys"],
            [<code key="limit">limit</code>, "Bound returned raw records"],
            [<code key="raw">includeRaw</code>, "Include linked source exchanges"],
            [
              <code key="disabled">includeDisabledTopics</code>,
              "Include topics disabled for normal retrieval",
            ],
          ]}
        />

        <H2 id="endpoints">Endpoint summary</H2>
        <Endpoint method="POST" path="/api/v1/memory/capture" />
        <Endpoint method="POST" path="/api/v1/memory/retrieve" />
        <Endpoint
          method="POST"
          path="/api/v1/memory/functions/halo_retrieve_end_user_memory"
        />
        <Endpoint method="POST" path="/api/v1/memory/delete" />

        <H2 id="consistency">Processing consistency</H2>
        <Callout kind="info" title="Capture is asynchronous after raw persistence">
          <p>
            A successful capture can precede updated topic summaries because the
            Memory worker classifies and summarizes queued records separately.
            Direct function retrieval selects processed, retrievable sources.
          </p>
        </Callout>
      </>
    ),
  },

  "memory/lifecycle": {
    toc: [
      { id: "hierarchy", label: "Data hierarchy" },
      { id: "disable-topic", label: "Disable retrieval" },
      { id: "delete", label: "Deletion operations" },
      { id: "identity", label: "Stable identity" },
    ],
    content: (
      <>
        <p>
          Memory lifecycle operations work at project, end-user scope, topic, and
          raw-record levels. Choose the smallest destructive boundary that matches
          the user request.
        </p>

        <H2 id="hierarchy">Data hierarchy</H2>
        <DataTable
          headers={["Level", "Contains", "Typical operation"]}
          rows={[
            ["Project", "All Memory for one product/environment", "Environment teardown"],
            ["Scope", "One end user's summary, topics, and raw records", "User erasure"],
            ["Topic", "A semantic summary and its linked records", "Forget one subject"],
            ["Raw record", "One captured user/assistant exchange", "Remove one source"],
          ]}
        />

        <H2 id="disable-topic">Disable retrieval</H2>
        <p>
          A topic may remain stored but be marked retrieval-disabled. Normal
          retrieval excludes it unless the administrative caller explicitly asks
          for disabled topics.
        </p>
        <Callout kind="warning" title="Disabled is not deleted">
          <p>
            Use deletion when the data must be removed. Retrieval controls change
            selection behavior but preserve the underlying record.
          </p>
        </Callout>

        <H2 id="delete">Deletion operations</H2>
        <Endpoint
          method="DELETE"
          path="/api/v1/memory/projects/:projectKey/scopes/:scopeId"
          description="Delete one end-user Memory scope."
        />
        <Endpoint
          method="DELETE"
          path="/api/v1/memory/projects/:projectKey/topics/:topicId"
          description="Delete one topic and apply the requested raw-data policy."
        />
        <Endpoint
          method="DELETE"
          path="/api/v1/memory/projects/:projectKey/raw/:rawEntryId"
          description="Delete one captured raw exchange."
        />
        <Endpoint
          method="DELETE"
          path="/api/v1/memory/projects/:projectKey"
          description="Delete the complete Memory project boundary."
        />

        <H2 id="identity">Stable identity</H2>
        <p>
          Reuse a stable application user identifier as
          <code>endUserKey</code>. Do not use a transient device token or browser
          session ID, or the same person will fragment into multiple Memory scopes.
        </p>
      </>
    ),
  },
};
