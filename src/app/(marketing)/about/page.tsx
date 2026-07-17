import type { Metadata } from "next";

import { buildPageMetadata } from "@/features/website/lib/seo";
import AboutPage from "@/features/website/pages/about";
import { WEBSITE_ROUTES } from "@/features/website/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("about", WEBSITE_ROUTES.about);
}

export default function Page() {
  return <AboutPage />;
}
