import "./globals.css";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";

import { Providers } from "@/app/providers";
import { WebsiteLayout } from "@/features/website/components/WebsiteLayout";

export const metadata: Metadata = {
  title: "APS",
  description: "APS",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <WebsiteLayout>{children}</WebsiteLayout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
