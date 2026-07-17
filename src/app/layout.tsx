import "./globals.css";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";

import { Providers } from "@/app/providers";
import { websiteServerApi } from "@/features/website/api/server";
import { WebsiteLayout } from "@/features/website/components/WebsiteLayout";
import { buildOrganizationJsonLd } from "@/features/website/lib/jsonLd";

export const metadata: Metadata = {
  title: "APS",
  description: "APS",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const [locale, messages, locations] = await Promise.all([
    getLocale(),
    getMessages(),
    websiteServerApi.getLocationsInfo(),
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
