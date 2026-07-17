import { websiteServerApi } from "@/features/website/api/server";
import WorksPage from "@/features/website/pages/works";

export default async function Page() {
  const works = await websiteServerApi.getAllWorks();
  return <WorksPage works={works} />;
}
