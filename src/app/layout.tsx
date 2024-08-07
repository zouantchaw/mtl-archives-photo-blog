import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { clsx } from "clsx/lite";
import { IBM_Plex_Mono } from "next/font/google";
import { Metadata } from "next";
import { BASE_URL, SITE_DESCRIPTION, SITE_TITLE } from "@/site/config";
import AppStateProvider from "@/state/AppStateProvider";
import Nav from "@/site/Nav";
import ToasterWithThemes from "@/toast/ToasterWithThemes";
import PhotoEscapeHandler from "@/photo/PhotoEscapeHandler";
import Footer from "@/site/Footer";
import { Suspense } from "react";
import FooterClient from "@/site/FooterClient";
import NavClient from "@/site/NavClient";
import CommandK from "@/site/CommandK";
import { ThemeProvider } from "next-themes";
import Script from "next/script"; // Import Script from next/script

import "../site/globals.css";
import "../site/sonner.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ibm-plex-mono",
});

const tinybirdDataToken = process.env.NEXT_PUBLIC_TINYBIRD_DATA_TOKEN;

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  ...(BASE_URL && { metadataBase: new URL(BASE_URL) }),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: [
    {
      url: "/favicon.ico",
      rel: "icon",
      type: "image/png",
      sizes: "180x180",
    },
    {
      url: "/favicons/light.png",
      rel: "icon",
      media: "(prefers-color-scheme: light)",
      type: "image/png",
      sizes: "32x32",
    },
    {
      url: "/favicons/dark.png",
      rel: "icon",
      media: "(prefers-color-scheme: dark)",
      type: "image/png",
      sizes: "32x32",
    },
    {
      url: "/favicons/apple-touch-icon.png",
      rel: "icon",
      type: "image/png",
      sizes: "180x180",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // Suppress hydration errors due to
      // next-themes behavior
      suppressHydrationWarning
    >
      <body className={ibmPlexMono.variable}>
        <AppStateProvider>
          <ThemeProvider attribute="class">
            <Script
              src="https://cdn.seline.so/seline.js"
              defer
              data-token="f8d8e231d48eb4b"
            />
            <main className={clsx("mx-3 mb-3", "lg:mx-6 lg:mb-6")}>
              <Suspense fallback={<NavClient />}>
                <Nav />
              </Suspense>
              <div className={clsx("min-h-[16rem] sm:min-h-[30rem]", "mb-12")}>
                {children}
              </div>
              <Suspense fallback={<FooterClient />}>
                <Footer />
              </Suspense>
            </main>
            <CommandK />
          </ThemeProvider>
          <Analytics debug={false} />
          <SpeedInsights debug={false} />
          <PhotoEscapeHandler />
          <ToasterWithThemes />
        </AppStateProvider>
      </body>
    </html>
  );
}
