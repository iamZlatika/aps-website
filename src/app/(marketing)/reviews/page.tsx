import type { Metadata } from "next";

import { buildPageMetadata } from "@/features/website/lib/seo";
import ReviewsPage from "@/features/website/pages/reviews";
import { WEBSITE_ROUTES } from "@/features/website/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("reviews", WEBSITE_ROUTES.reviews);
}

export default function Page() {
  return <ReviewsPage />;
}
