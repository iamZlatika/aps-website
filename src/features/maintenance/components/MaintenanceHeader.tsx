import { LangSwitch } from "@/shared/components/ui/LangSwitch";
import { ThemeSwitch } from "@/shared/components/ui/ThemeSwitch";
import { WebsiteLogo } from "@/shared/components/ui/WebsiteLogo";

export const MaintenanceHeader = () => {
  return (
    <header className="ws-wrap flex items-center justify-between gap-[18px] py-[22px]">
      <WebsiteLogo />
      <div className="flex items-center gap-[10px]">
        <LangSwitch />
        <ThemeSwitch />
      </div>
    </header>
  );
};
