import { websiteServerApi } from "@/features/website/api/server";
import { DevicesSection } from "@/features/website/pages/home/components/devices";
import { Hero } from "@/features/website/pages/home/components/hero";
import { PcBuildSection } from "@/features/website/pages/home/components/pc-build";

export const HomePage = async () => {
  const landing = await websiteServerApi.getLanding();

  return (
    <>
      <Hero activeCount={landing.activeCount} />
      <DevicesSection landing={landing} />
      <PcBuildSection />
    </>
  );
};

export default HomePage;
