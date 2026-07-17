import type { Metadata } from "next";

import { buildPageMetadata } from "@/features/website/lib/seo";
import WarrantyPage from "@/features/website/pages/warranty";
import { WEBSITE_ROUTES } from "@/features/website/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("warranty", WEBSITE_ROUTES.warranty);
}

export default function Page() {
  return <WarrantyPage />;
}
