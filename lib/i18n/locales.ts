export const DOCS_LOCALES = ["en", "ko", "zh", "ja"] as const;

export type DocsLocale = (typeof DOCS_LOCALES)[number];

export const DEFAULT_DOCS_LOCALE: DocsLocale = "en";

export interface DocsLocaleOption {
  code: DocsLocale;
  label: string;
  htmlLang: string;
}

export const DOCS_LOCALE_OPTIONS: DocsLocaleOption[] = [
  { code: "en", label: "English", htmlLang: "en" },
  { code: "ko", label: "한국어", htmlLang: "ko" },
  { code: "zh", label: "中文", htmlLang: "zh-CN" },
  { code: "ja", label: "日本語", htmlLang: "ja" },
];

export interface DocsUiStrings {
  documentationPages: string;
  haloDocsHome: string;
  openNavigation: string;
  documentationSections: string;
  guides: string;
  apiReference: string;
  sdks: string;
  searchDocumentation: string;
  searchDocs: string;
  switchToLightTheme: string;
  switchToDarkTheme: string;
  dashboard: string;
  preview: string;
  linkCopied: string;
  copyPage: string;
  previous: string;
  next: string;
  previousAndNext: string;
  haloDocumentation: string;
  reportIssue: string;
  onThisPage: string;
  documentation: string;
  closeNavigation: string;
  searchPlaceholder: string;
  closeSearch: string;
  results: string;
  quickLinks: string;
  noResultsPrefix: string;
  noResultsSuffix: string;
  language: string;
  codeExamples: string;
  copyCode: string;
  copied: string;
  copy: string;
}

const UI_STRINGS: Record<DocsLocale, DocsUiStrings> = {
  en: {
    documentationPages: "Documentation pages",
    haloDocsHome: "HALO Docs home",
    openNavigation: "Open documentation navigation",
    documentationSections: "Documentation sections",
    guides: "Guides",
    apiReference: "API Reference",
    sdks: "SDKs",
    searchDocumentation: "Search documentation",
    searchDocs: "Search docs",
    switchToLightTheme: "Switch to light theme",
    switchToDarkTheme: "Switch to dark theme",
    dashboard: "Dashboard",
    preview: "Preview",
    linkCopied: "Link copied",
    copyPage: "Copy page",
    previous: "Previous",
    next: "Next",
    previousAndNext: "Previous and next pages",
    haloDocumentation: "HALO documentation",
    reportIssue: "Report an issue",
    onThisPage: "On this page",
    documentation: "Documentation",
    closeNavigation: "Close navigation",
    searchPlaceholder: "Search guides, APIs, and SDKs…",
    closeSearch: "Close search",
    results: "RESULTS",
    quickLinks: "QUICK LINKS",
    noResultsPrefix: "No documentation matched “",
    noResultsSuffix: "”.",
    language: "Language",
    codeExamples: "Code examples",
    copyCode: "Copy code",
    copied: "Copied",
    copy: "Copy",
  },
  ko: {
    documentationPages: "문서 페이지",
    haloDocsHome: "HALO 문서 홈",
    openNavigation: "문서 메뉴 열기",
    documentationSections: "문서 섹션",
    guides: "가이드",
    apiReference: "API 레퍼런스",
    sdks: "SDK",
    searchDocumentation: "문서 검색",
    searchDocs: "문서 검색",
    switchToLightTheme: "라이트 테마로 전환",
    switchToDarkTheme: "다크 테마로 전환",
    dashboard: "대시보드",
    preview: "미리보기",
    linkCopied: "링크 복사됨",
    copyPage: "페이지 링크 복사",
    previous: "이전",
    next: "다음",
    previousAndNext: "이전 및 다음 페이지",
    haloDocumentation: "HALO 문서",
    reportIssue: "문제 신고",
    onThisPage: "이 페이지에서",
    documentation: "문서",
    closeNavigation: "메뉴 닫기",
    searchPlaceholder: "가이드, API, SDK 검색…",
    closeSearch: "검색 닫기",
    results: "검색 결과",
    quickLinks: "빠른 링크",
    noResultsPrefix: "“",
    noResultsSuffix: "”와 일치하는 문서가 없습니다.",
    language: "언어",
    codeExamples: "코드 예제",
    copyCode: "코드 복사",
    copied: "복사됨",
    copy: "복사",
  },
  zh: {
    documentationPages: "文档页面",
    haloDocsHome: "HALO 文档首页",
    openNavigation: "打开文档导航",
    documentationSections: "文档章节",
    guides: "指南",
    apiReference: "API 参考",
    sdks: "SDK",
    searchDocumentation: "搜索文档",
    searchDocs: "搜索文档",
    switchToLightTheme: "切换到浅色主题",
    switchToDarkTheme: "切换到深色主题",
    dashboard: "控制台",
    preview: "预览",
    linkCopied: "链接已复制",
    copyPage: "复制页面链接",
    previous: "上一页",
    next: "下一页",
    previousAndNext: "上一页和下一页",
    haloDocumentation: "HALO 文档",
    reportIssue: "报告问题",
    onThisPage: "本页内容",
    documentation: "文档",
    closeNavigation: "关闭导航",
    searchPlaceholder: "搜索指南、API 和 SDK…",
    closeSearch: "关闭搜索",
    results: "搜索结果",
    quickLinks: "快速链接",
    noResultsPrefix: "没有找到与“",
    noResultsSuffix: "”匹配的文档。",
    language: "语言",
    codeExamples: "代码示例",
    copyCode: "复制代码",
    copied: "已复制",
    copy: "复制",
  },
  ja: {
    documentationPages: "ドキュメントページ",
    haloDocsHome: "HALO ドキュメントホーム",
    openNavigation: "ドキュメントメニューを開く",
    documentationSections: "ドキュメントセクション",
    guides: "ガイド",
    apiReference: "API リファレンス",
    sdks: "SDK",
    searchDocumentation: "ドキュメントを検索",
    searchDocs: "ドキュメントを検索",
    switchToLightTheme: "ライトテーマに切り替え",
    switchToDarkTheme: "ダークテーマに切り替え",
    dashboard: "ダッシュボード",
    preview: "プレビュー",
    linkCopied: "リンクをコピーしました",
    copyPage: "ページリンクをコピー",
    previous: "前へ",
    next: "次へ",
    previousAndNext: "前後のページ",
    haloDocumentation: "HALO ドキュメント",
    reportIssue: "問題を報告",
    onThisPage: "このページの内容",
    documentation: "ドキュメント",
    closeNavigation: "メニューを閉じる",
    searchPlaceholder: "ガイド、API、SDK を検索…",
    closeSearch: "検索を閉じる",
    results: "検索結果",
    quickLinks: "クイックリンク",
    noResultsPrefix: "「",
    noResultsSuffix: "」に一致するドキュメントはありません。",
    language: "言語",
    codeExamples: "コード例",
    copyCode: "コードをコピー",
    copied: "コピー済み",
    copy: "コピー",
  },
};

export const isDocsLocale = (value: string): value is DocsLocale =>
  DOCS_LOCALES.includes(value as DocsLocale);

export const getDocsUi = (locale: DocsLocale): DocsUiStrings =>
  UI_STRINGS[locale];

export const getDocsLocaleOption = (locale: DocsLocale): DocsLocaleOption =>
  DOCS_LOCALE_OPTIONS.find((option) => option.code === locale) ||
  DOCS_LOCALE_OPTIONS[0];

export const getLocalizedDocHref = (
  locale: DocsLocale,
  slug: string
): string => (locale === DEFAULT_DOCS_LOCALE ? `/${slug}` : `/${locale}/${slug}`);

export const parseLocalizedDocSlug = (
  segments: string[]
): { locale: DocsLocale; slug: string } => {
  const [first, ...rest] = segments;
  if (first && first !== DEFAULT_DOCS_LOCALE && isDocsLocale(first)) {
    return { locale: first, slug: rest.join("/") };
  }
  return { locale: DEFAULT_DOCS_LOCALE, slug: segments.join("/") };
};

