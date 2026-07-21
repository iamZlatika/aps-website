import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

const SITE_NAME = "APS Service";

type SeoKey =
  | "home"
  | "priceList"
  | "works"
  | "reviews"
  | "about"
  | "contacts"
  | "warranty";

export async function buildPageMetadata(
  key: SeoKey,
  path: string,
): Promise<Metadata> {
  const [t, locale] = await Promise.all([getTranslations("seo"), getLocale()]);
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const url = `${siteUrl}${path}`;
  const ogImage = `${siteUrl}/hero.webp`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
