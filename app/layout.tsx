import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.agihalo.com"),
  title: {
    default: "HALO Documentation",
    template: "%s · HALO Docs",
  },
  description:
    "Build with HALO Model Gateway, Memory, Authentication, Services, Keeper, and x402.",
  openGraph: {
    type: "website",
    siteName: "HALO Documentation",
    title: "HALO Documentation",
    description:
      "The project-scoped capability layer for AI products and hardware.",
  },
  twitter: {
    card: "summary",
    title: "HALO Documentation",
    description:
      "Build with HALO Model Gateway, Memory, Authentication, Services, Keeper, and x402.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

const bootstrapScript = `
  (() => {
    const locale = location.pathname.split("/")[1];
    document.documentElement.lang =
      locale === "ko"
        ? "ko"
        : locale === "zh"
          ? "zh-CN"
          : locale === "ja"
            ? "ja"
            : "en";

    try {
      const stored = localStorage.getItem("halo-docs-theme");
      const theme = stored === "light" || stored === "dark"
        ? stored
        : "dark";
      document.documentElement.dataset.theme = theme;
    } catch {}
  })();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
