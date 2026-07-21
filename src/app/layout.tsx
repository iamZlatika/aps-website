import "./globals.css";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";

import { Providers } from "@/app/providers";
import { locationsServerApi } from "@/features/locations/api/server";
import { buildOrganizationJsonLd } from "@/shared/lib/jsonLd";
import { WebsiteLayout } from "@/widgets/site-shell/WebsiteLayout";

export const metadata: Metadata = {
  title: "APS",
  description: "APS",
  icons: {
    icon: [
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/favicon-256.png", sizes: "256x256", type: "image/png" },
      { url: "/icons/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: {
      url: "/icons/favicon-192.png",
      sizes: "192x192",
      type: "image/png",
    },
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const [locale, messages, locations] = await Promise.all([
    getLocale(),
    getMessages(),
    locationsServerApi.getLocationsInfo(),
  ]);

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildOrganizationJsonLd()),
          }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <WebsiteLayout locations={locations}>{children}</WebsiteLayout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
