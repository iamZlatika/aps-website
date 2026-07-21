import Link from "next/link";
import { useTranslations } from "next-intl";

import { WEBSITE_LINKS } from "@/widgets/site-shell/navigation";
import { cn } from "@/shared/lib/utils";

interface WebsiteLogoProps {
  className?: string;
}

export const WebsiteLogo = ({ className }: WebsiteLogoProps) => {
  const t = useTranslations();

  return (
    <Link
      href={WEBSITE_LINKS.home}
      aria-label="APS service"
      className={cn("flex items-center gap-3 no-underline", className)}
    >
      <img
        src="/default.png"
        alt="APS service logo"
        width="56"
        height="56"
        className="block h-14 w-auto shrink-0"
      />
      <span className="text-ws-xl font-bold leading-none tracking-[-0.01em]">
        APS
        <span className="font-medium text-ws-ink-mute"> service</span>
        <small className="mt-1 block text-ws-2xs font-medium tracking-[0.02em] text-ws-ember-bright">
          {t("nav.logoSubtitle")}
        </small>
      </span>
    </Link>
  );
};
