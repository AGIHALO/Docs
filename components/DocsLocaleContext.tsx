"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import {
  DEFAULT_DOCS_LOCALE,
  getDocsUi,
  type DocsLocale,
  type DocsUiStrings,
} from "@/lib/i18n/locales";

interface DocsLocaleContextValue {
  locale: DocsLocale;
  ui: DocsUiStrings;
}

const DocsLocaleContext = createContext<DocsLocaleContextValue>({
  locale: DEFAULT_DOCS_LOCALE,
  ui: getDocsUi(DEFAULT_DOCS_LOCALE),
});

export function DocsLocaleProvider({
  locale,
  children,
}: {
  locale: DocsLocale;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ locale, ui: getDocsUi(locale) }),
    [locale]
  );
  return (
    <DocsLocaleContext.Provider value={value}>
      {children}
    </DocsLocaleContext.Provider>
  );
}

export const useDocsLocale = () => useContext(DocsLocaleContext);

