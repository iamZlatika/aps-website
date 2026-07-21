import type { Metadata } from "next";

import PriceListPage from "@/features/price-list";
import { buildPageMetadata } from "@/shared/lib/seo";
import { WEBSITE_ROUTES } from "@/widgets/site-shell/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("priceList", WEBSITE_ROUTES.priceList);
}

export default function Page() {
  return <PriceListPage />;
}
