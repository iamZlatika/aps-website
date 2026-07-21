import type { Metadata } from "next";

import WorksPage from "@/features/works";
import { worksServerApi } from "@/features/works/api/server";
import { buildPageMetadata } from "@/shared/lib/seo";
import { WEBSITE_ROUTES } from "@/widgets/site-shell/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("works", WEBSITE_ROUTES.works);
}

export default async function Page() {
  const works = await worksServerApi.getAllWorks();
  return <WorksPage works={works} />;
}
