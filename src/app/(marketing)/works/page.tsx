import type { Metadata } from "next";

import { websiteServerApi } from "@/features/website/api/server";
import { buildPageMetadata } from "@/features/website/lib/seo";
import WorksPage from "@/features/website/pages/works";
import { WEBSITE_ROUTES } from "@/features/website/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("works", WEBSITE_ROUTES.works);
}

export default async function Page() {
  const works = await websiteServerApi.getAllWorks();
  return <WorksPage works={works} />;
}
