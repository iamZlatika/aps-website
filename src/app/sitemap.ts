import type { MetadataRoute } from "next";

import { WEBSITE_ROUTES } from "@/features/website/routes";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

const INDEXED_ROUTES = [
  WEBSITE_ROUTES.home,
  WEBSITE_ROUTES.about,
  WEBSITE_ROUTES.contacts,
  WEBSITE_ROUTES.works,
  WEBSITE_ROUTES.reviews,
  WEBSITE_ROUTES.priceList,
  WEBSITE_ROUTES.warranty,
];

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXED_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
