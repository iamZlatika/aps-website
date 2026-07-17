import type { Metadata } from "next";

import { buildPageMetadata } from "@/features/website/lib/seo";
import { HomePage } from "@/features/website/pages/home";
import { WEBSITE_ROUTES } from "@/features/website/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home", WEBSITE_ROUTES.home);
}

export default function Page() {
  return <HomePage />;
}
