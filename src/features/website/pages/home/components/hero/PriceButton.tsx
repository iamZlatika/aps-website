import Link from "next/link";
import { useTranslations } from "next-intl";

import { WEBSITE_LINKS } from "@/features/website/navigation";

export const PriceButton = () => {
  const t = useTranslations();

  return (
    <Link
      href={WEBSITE_LINKS.priceList}
      className="ws-btn ws-btn-ghost justify-center"
    >
      {t("hero.ctaPricelist")}
    </Link>
  );
};
