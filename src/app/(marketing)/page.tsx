import type { Metadata } from "next";

import { HomePage } from "@/features/home";
import { buildPageMetadata } from "@/shared/lib/seo";
import { WEBSITE_ROUTES } from "@/widgets/site-shell/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home", WEBSITE_ROUTES.home);
}

export default function Page() {
  return <HomePage />;
}
