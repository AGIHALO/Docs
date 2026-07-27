import type { ReactNode } from "react";

export interface TocItem {
  id: string;
  label: string;
  level?: 2 | 3;
}

export interface DocPage {
  toc: TocItem[];
  content: ReactNode;
}

export type DocPageMap = Record<string, DocPage>;
