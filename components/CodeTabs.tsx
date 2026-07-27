"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export interface CodeExample {
  label: string;
  language: string;
  code: string;
}

export function CodeTabs({
  examples,
  title,
}: {
  examples: CodeExample[];
  title?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const active = examples[activeIndex] || examples[0];

  const copy = async () => {
    await navigator.clipboard.writeText(active.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="code-frame">
      <div className="code-toolbar">
        <div className="code-tabs" role="tablist" aria-label={title || "Code examples"}>
          {examples.map((example, index) => (
            <button
              key={`${example.label}-${index}`}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              className={activeIndex === index ? "active" : ""}
              onClick={() => {
                setActiveIndex(index);
                setCopied(false);
              }}
            >
              {example.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="copy-code"
          onClick={copy}
          aria-label="Copy code"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre data-language={active.language}>
        <code>{active.code}</code>
      </pre>
    </div>
  );
}
