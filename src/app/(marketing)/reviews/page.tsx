import type { Metadata } from "next";

import ReviewsPage from "@/features/reviews";
import { buildPageMetadata } from "@/shared/lib/seo";
import { WEBSITE_ROUTES } from "@/widgets/site-shell/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("reviews", WEBSITE_ROUTES.reviews);
}

export default function Page() {
  return <ReviewsPage />;
}
