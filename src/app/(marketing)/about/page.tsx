import type { Metadata } from "next";

import AboutPage from "@/features/about";
import { buildPageMetadata } from "@/shared/lib/seo";
import { WEBSITE_ROUTES } from "@/widgets/site-shell/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("about", WEBSITE_ROUTES.about);
}

export default function Page() {
  return <AboutPage />;
}
