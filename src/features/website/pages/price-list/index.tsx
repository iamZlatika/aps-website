import { getTranslations } from "next-intl/server";

import { websiteServerApi } from "@/features/website/api/server";
import { PriceListContent } from "@/features/website/pages/price-list/PriceListContent";

import { groupPriceListByCategory } from "./service";

const PriceListPage = async () => {
  const t = await getTranslations();
  const priceList = await websiteServerApi.getAllPriceList();
  const groups = groupPriceListByCategory(priceList);

  return (
    <section
      className="ws-section ws-contacts-section"
      aria-labelledby="price-list-heading"
    >
      <div className="ws-wrap">
        <header className="mb-5">
          <p className="ws-section-eyebrow">{t("priceModal.eyebrow")}</p>
          <h1 id="price-list-heading" className="ws-section-title">
            {t("pricePage.heading")}{" "}
            <strong>{t("pricePage.headingBold")}</strong>
          </h1>
        </header>

        <PriceListContent groups={groups} />
      </div>
    </section>
  );
};

export default PriceListPage;
