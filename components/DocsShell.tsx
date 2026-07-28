"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Languages,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { DocEntry, NavGroup } from "@/lib/navigation";
import { DocsLocaleProvider } from "./DocsLocaleContext";
import {
  DOCS_LOCALE_OPTIONS,
  getDocsLocaleOption,
  getDocsUi,
  getLocalizedDocHref,
  isDocsLocale,
  type DocsLocale,
} from "@/lib/i18n/locales";

interface TocItem {
  id: string;
  label: string;
  level?: 2 | 3;
}

interface DocsShellProps {
  locale: DocsLocale;
  current: DocEntry;
  navGroups: NavGroup[];
  toc: TocItem[];
  previous: DocEntry | null;
  next: DocEntry | null;
  children: ReactNode;
}

const normalize = (value: string) => value.trim().toLowerCase();

export function DocsShell({
  locale,
  current,
  navGroups,
  toc,
  previous,
  next,
  children,
}: DocsShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const ui = getDocsUi(locale);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("halo-docs-theme");
    const resolved =
      stored === "light" || stored === "dark"
        ? stored
        : "dark";
    document.documentElement.dataset.theme = resolved;
    const frame = window.requestAnimationFrame(() => setTheme(resolved));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = getDocsLocaleOption(locale).htmlLang;
    window.localStorage.setItem("halo-docs-locale", locale);
  }, [locale]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        closeSearch();
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSearch]);

  useEffect(() => {
    if (!searchOpen) return;
    window.setTimeout(() => searchInputRef.current?.focus(), 20);
  }, [searchOpen]);

  const searchResults = useMemo(() => {
    const value = normalize(query);
    const entries = navGroups.flatMap((group) => group.items);
    if (!value) return entries.slice(0, 9);
    return entries
      .map((entry) => {
        const haystack = normalize(
          [
            entry.title,
            entry.description,
            entry.group,
            ...(entry.keywords || []),
          ].join(" ")
        );
        const exact = normalize(entry.title).includes(value) ? 2 : 0;
        const score = exact + (haystack.includes(value) ? 1 : 0);
        return { entry, score };
      })
      .filter((result) => result.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 12)
      .map((result) => result.entry);
  }, [navGroups, query]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("halo-docs-theme", nextTheme);
  };

  const copyPageLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const changeLocale = (value: string) => {
    if (!isDocsLocale(value) || value === locale) return;
    window.localStorage.setItem("halo-docs-locale", value);
    router.push(
      `${getLocalizedDocHref(value, current.slug)}${window.location.hash}`
    );
  };

  const sidebar = (
    <nav className="docs-sidebar-nav" aria-label={ui.documentationPages}>
      {navGroups.map((group) => (
        <section key={group.label}>
          <h2>{group.label}</h2>
          <ul>
            {group.items.map((entry) => {
              const href = getLocalizedDocHref(locale, entry.slug);
              const active = pathname === href;
              return (
                <li key={entry.slug}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    data-active={active || undefined}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <span>{entry.title}</span>
                    {entry.status === "preview" ? (
                      <small>{ui.preview}</small>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );

  return (
    <div
      className="docs-app"
      data-locale={locale}
      lang={getDocsLocaleOption(locale).htmlLang}
    >
      <header className="topbar">
        <div className="brand-area">
          <Link
            href={getLocalizedDocHref(locale, "quickstart")}
            className="brand"
            aria-label={ui.haloDocsHome}
          >
            <Image src="/halo-logo.svg" alt="" width={38} height={20} priority />
            <span>HALO</span>
            <em>Docs</em>
          </Link>
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileNavOpen(true)}
            aria-label={ui.openNavigation}
          >
            <Menu size={19} />
          </button>
        </div>

        <nav className="topnav" aria-label={ui.documentationSections}>
          <Link href={getLocalizedDocHref(locale, "quickstart")}>
            {ui.guides}
          </Link>
          <Link href={getLocalizedDocHref(locale, "api-reference/endpoints")}>
            {ui.apiReference}
          </Link>
          <Link href={getLocalizedDocHref(locale, "sdks/node")}>
            {ui.sdks}
          </Link>
        </nav>

        <div className="top-actions">
          <button
            type="button"
            className="search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label={ui.searchDocumentation}
          >
            <Search size={15} />
            <span>{ui.searchDocs}</span>
            <kbd>⌘K</kbd>
          </button>
          <div className="language-select">
            <Languages size={15} aria-hidden="true" />
            <select
              value={locale}
              onChange={(event) => changeLocale(event.target.value)}
              aria-label={ui.language}
            >
              {DOCS_LOCALE_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? ui.switchToLightTheme
                : ui.switchToDarkTheme
            }
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            className="dashboard-link"
            href="https://agihalo.com"
            target="_blank"
            rel="noreferrer"
          >
            {ui.dashboard}
            <ExternalLink size={14} />
          </a>
        </div>
      </header>

      <aside className="desktop-sidebar">{sidebar}</aside>

      <main className="doc-main" id="main-content">
        <article>
          <div className="article-kicker">
            <span>{current.group}</span>
            {current.status === "preview" ? <em>{ui.preview}</em> : null}
          </div>
          <div className="article-title-row">
            <div>
              <h1>{current.title}</h1>
              <p className="article-description">{current.description}</p>
            </div>
            <button
              type="button"
              className="copy-page"
              onClick={copyPageLink}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? ui.linkCopied : ui.copyPage}
            </button>
          </div>
          <div className="article-content">
            <DocsLocaleProvider locale={locale}>
              {children}
            </DocsLocaleProvider>
          </div>
          <nav className="article-pagination" aria-label={ui.previousAndNext}>
            {previous ? (
              <Link href={getLocalizedDocHref(locale, previous.slug)}>
                <span>
                  <ArrowLeft size={15} />
                  {ui.previous}
                </span>
                <strong>{previous.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={getLocalizedDocHref(locale, next.slug)}
                className="next"
              >
                <span>
                  {ui.next}
                  <ArrowRight size={15} />
                </span>
                <strong>{next.title}</strong>
              </Link>
            ) : null}
          </nav>
          <footer className="article-footer">
            <span>{ui.haloDocumentation}</span>
            <a href="mailto:contact@agihalo.com">{ui.reportIssue}</a>
          </footer>
        </article>
      </main>

      <aside className="toc-panel">
        <nav aria-label={ui.onThisPage}>
          <h2>{ui.onThisPage}</h2>
          <ul>
            {toc.map((item) => (
              <li key={item.id} data-level={item.level || 2}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {mobileNavOpen ? (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <button
            className="drawer-backdrop"
            type="button"
            aria-label={ui.closeNavigation}
            onClick={() => setMobileNavOpen(false)}
          />
          <aside>
            <div className="drawer-header">
              <strong>{ui.documentation}</strong>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label={ui.closeNavigation}
              >
                <X size={19} />
              </button>
            </div>
            {sidebar}
          </aside>
        </div>
      ) : null}

      {searchOpen ? (
        <div className="search-overlay" role="dialog" aria-modal="true">
          <button
            className="search-backdrop"
            type="button"
            aria-label={ui.closeSearch}
            onClick={closeSearch}
          />
          <section className="search-dialog">
            <div className="search-input-row">
              <Search size={18} />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={ui.searchPlaceholder}
                aria-label={ui.searchDocumentation}
              />
              <button
                type="button"
                onClick={closeSearch}
                aria-label={ui.closeSearch}
              >
                <X size={18} />
              </button>
            </div>
            <div className="search-results">
              <small>{query ? ui.results : ui.quickLinks}</small>
              {searchResults.length ? (
                searchResults.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={getLocalizedDocHref(locale, entry.slug)}
                    onClick={closeSearch}
                  >
                    <div>
                      <strong>{entry.title}</strong>
                      <span>{entry.description}</span>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                ))
              ) : (
                <p>
                  {ui.noResultsPrefix}
                  {query}
                  {ui.noResultsSuffix}
                </p>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
