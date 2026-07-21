import type { Metadata } from "next";

import WarrantyPage from "@/features/warranty";
import { buildPageMetadata } from "@/shared/lib/seo";
import { WEBSITE_ROUTES } from "@/widgets/site-shell/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("warranty", WEBSITE_ROUTES.warranty);
}

export default function Page() {
  return <WarrantyPage />;
}
