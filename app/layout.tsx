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
    icon: "/halo-mark.svg",
  },
};

const themeScript = `
  (() => {
    try {
      const stored = localStorage.getItem("halo-docs-theme");
      const theme = stored === "light" || stored === "dark"
        ? stored
        : matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
      document.documentElement.dataset.theme = theme;
    } catch {}
  })();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
