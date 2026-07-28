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
import {
  DOCS_LOCALES,
  DOCS_LOCALE_OPTIONS,
  getLocalizedDocHref,
  parseLocalizedDocSlug,
} from "@/lib/i18n/locales";
import {
  localizeDocEntry,
  localizeDocPage,
  localizeNavGroups,
} from "@/lib/i18n/server";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return DOCS_LOCALES.flatMap((locale) =>
    DOC_ENTRIES.map((entry) => ({
      slug: (
        locale === "en" ? entry.slug : `${locale}/${entry.slug}`
      ).split("/"),
    }))
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: segments } = await params;
  const { locale, slug: path } = parseLocalizedDocSlug(segments);
  const entry = findDocEntry(path);
  if (!entry) return {};
  const localizedEntry = localizeDocEntry(entry, locale) || entry;
  const canonical = getLocalizedDocHref(locale, entry.slug);
  const languages = Object.fromEntries(
    DOCS_LOCALE_OPTIONS.map((option) => [
      option.htmlLang,
      getLocalizedDocHref(option.code, entry.slug),
    ])
  );
  return {
    title: localizedEntry.title,
    description: localizedEntry.description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: `${localizedEntry.title} · HALO Docs`,
      description: localizedEntry.description,
      url: canonical,
      locale:
        DOCS_LOCALE_OPTIONS.find((option) => option.code === locale)
          ?.htmlLang || "en",
    },
  };
}

export default async function DocumentationPage({ params }: PageProps) {
  const { slug: segments } = await params;
  const { locale, slug: path } = parseLocalizedDocSlug(segments);
  const entry = findDocEntry(path);
  const page = findDocPage(path);
  if (!entry || !page) notFound();

  const { previous, next } = getAdjacentDocs(path);
  const localizedPage = localizeDocPage(page, locale);

  return (
    <DocsShell
      locale={locale}
      current={localizeDocEntry(entry, locale) || entry}
      navGroups={localizeNavGroups(NAV_GROUPS, locale)}
      toc={localizedPage.toc}
      previous={localizeDocEntry(previous, locale)}
      next={localizeDocEntry(next, locale)}
    >
      {localizedPage.content}
    </DocsShell>
  );
}
