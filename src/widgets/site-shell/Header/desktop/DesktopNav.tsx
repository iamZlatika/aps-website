import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { LangSwitch } from "@/shared/components/ui/LangSwitch";
import { ThemeSwitch } from "@/shared/components/ui/ThemeSwitch";
import { WebsiteLogo } from "@/shared/components/ui/WebsiteLogo";
import { cn } from "@/shared/lib/utils";
import { HeaderAuthArea } from "@/widgets/site-shell/Header/HeaderAuthArea";
import { NAV_TABS } from "@/widgets/site-shell/Header/HeaderData";

export const DesktopNav = () => {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav className="hidden items-center justify-between gap-2 border-b border-ws-line-soft py-[14px] md:flex">
      <div className="flex items-center gap-7">
        <WebsiteLogo className="text-ws-ink" />

        <ul className="flex h-[53px] items-center gap-[2px] rounded-full border border-ws-line bg-white/[0.015] px-[5px]">
          {NAV_TABS.map(({ labelKey, to, end }) => {
            const isActive = end ? pathname === to : pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  href={to}
                  className={cn(
                    "whitespace-nowrap rounded-full px-[18px] py-[10px] text-ws-base font-medium no-underline transition-colors duration-200",
                    isActive
                      ? "bg-ws-cream font-semibold text-ws-bg"
                      : "text-ws-ink-soft hover:text-ws-ink",
                  )}
                >
                  {t(labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <LangSwitch />
        <ThemeSwitch />
        <HeaderAuthArea />
      </div>
    </nav>
  );
};
