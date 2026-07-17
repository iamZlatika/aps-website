import type { Metadata } from "next";

import { buildPageMetadata } from "@/features/website/lib/seo";
import PriceListPage from "@/features/website/pages/price-list";
import { WEBSITE_ROUTES } from "@/features/website/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("priceList", WEBSITE_ROUTES.priceList);
}

export default function Page() {
  return <PriceListPage />;
}
