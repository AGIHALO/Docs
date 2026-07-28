import type { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Info,
  LockKeyhole,
} from "lucide-react";
import { CodeTabs, type CodeExample } from "./CodeTabs";

export function H2({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h2 id={id} className="doc-heading">
      <a href={`#${id}`} aria-label={String(children)}>
        #
      </a>
      {children}
    </h2>
  );
}

export function H3({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h3 id={id} className="doc-subheading">
      <a href={`#${id}`} aria-label={String(children)}>
        #
      </a>
      {children}
    </h3>
  );
}

export function Callout({
  kind = "info",
  title,
  children,
}: {
  kind?: "info" | "warning" | "success" | "security";
  title: string;
  children: ReactNode;
}) {
  const Icon =
    kind === "warning"
      ? AlertTriangle
      : kind === "success"
        ? CheckCircle2
        : kind === "security"
          ? LockKeyhole
          : Info;
  return (
    <aside className="callout" data-kind={kind}>
      <Icon size={18} aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <div>{children}</div>
      </div>
    </aside>
  );
}

export function Code({
  code,
  language = "text",
  label,
}: {
  code: string;
  language?: string;
  label?: string;
}) {
  return (
    <CodeTabs
      title={label}
      examples={[
        {
          label: label || language,
          language,
          code,
        },
      ]}
    />
  );
}

export function Examples({
  examples,
  title,
}: {
  examples: CodeExample[];
  title?: string;
}) {
  return <CodeTabs examples={examples} title={title} />;
}

export function Steps({
  items,
}: {
  items: Array<{ title: string; children: ReactNode }>;
}) {
  return (
    <ol className="steps">
      {items.map((item, index) => (
        <li key={item.title}>
          <span className="step-number">{index + 1}</span>
          <div>
            <strong>{item.title}</strong>
            <div>{item.children}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function FeatureGrid({
  items,
}: {
  items: Array<{
    title: string;
    description: string;
    href?: string;
    eyebrow?: string;
  }>;
}) {
  return (
    <div className="feature-grid">
      {items.map((item) => {
        const content = (
          <>
            <span className="feature-icon">
              <CircleDot size={15} aria-hidden="true" />
            </span>
            {item.eyebrow ? <small>{item.eyebrow}</small> : null}
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </>
        );
        return item.href ? (
          <a key={item.title} href={item.href} className="feature-card">
            {content}
          </a>
        ) : (
          <div key={item.title} className="feature-card">
            {content}
          </div>
        );
      })}
    </div>
  );
}

export function Endpoint({
  method,
  path,
  description,
}: {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  description?: string;
}) {
  return (
    <div className="endpoint-row">
      <span data-method={method}>{method}</span>
      <code>{path}</code>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
