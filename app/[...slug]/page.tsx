import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsShell } from "@/components/DocsShell";
import { findDocPage } from "@/lib/docs";
import {
  DOC_ENTRIES,
  NAV_GROUPS,
  findDocEntry,
  getAdjacentDocs,
} from "@/lib/navigation";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return DOC_ENTRIES.map((entry) => ({ slug: entry.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  const entry = findDocEntry(path);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.description,
    alternates: {
      canonical: `/${entry.slug}`,
    },
    openGraph: {
      title: `${entry.title} · HALO Docs`,
      description: entry.description,
      url: `/${entry.slug}`,
    },
  };
}

export default async function DocumentationPage({ params }: PageProps) {
  const { slug } = await params;
  const path = slug.join("/");
  const entry = findDocEntry(path);
  const page = findDocPage(path);
  if (!entry || !page) notFound();

  const { previous, next } = getAdjacentDocs(path);

  return (
    <DocsShell
      current={entry}
      navGroups={NAV_GROUPS}
      toc={page.toc}
      previous={previous}
      next={next}
    >
      {page.content}
    </DocsShell>
  );
}
