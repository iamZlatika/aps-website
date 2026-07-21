import { homeServerApi } from "@/features/home/api/server";
import { DevicesSection } from "@/features/home/components/devices";
import { Hero } from "@/features/home/components/hero";
import { PcBuildSection } from "@/features/home/components/pc-build";

export const HomePage = async () => {
  const landing = await homeServerApi.getLanding();

  return (
    <>
      <Hero activeCount={landing.activeCount} />
      <DevicesSection landing={landing} />
      <PcBuildSection />
    </>
  );
};

export default HomePage;
