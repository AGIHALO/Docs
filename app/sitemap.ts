import type { MetadataRoute } from "next";
import { DOC_ENTRIES } from "@/lib/navigation";
import {
  DOCS_LOCALES,
  DOCS_LOCALE_OPTIONS,
  getLocalizedDocHref,
} from "@/lib/i18n/locales";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-07-28T00:00:00.000Z");
  return DOC_ENTRIES.flatMap((entry) => {
    const languages = Object.fromEntries(
      DOCS_LOCALE_OPTIONS.map((option) => [
        option.htmlLang,
        `https://docs.agihalo.com${getLocalizedDocHref(
          option.code,
          entry.slug
        )}`,
      ])
    );
    return DOCS_LOCALES.map((locale) => ({
      url: `https://docs.agihalo.com${getLocalizedDocHref(
        locale,
        entry.slug
      )}`,
      lastModified: updated,
      changeFrequency: "weekly" as const,
      priority: entry.slug === "quickstart" ? 1 : 0.7,
      alternates: { languages },
    }));
  });
}
