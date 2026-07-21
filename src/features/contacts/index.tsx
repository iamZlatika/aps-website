import { getLocale, getTranslations } from "next-intl/server";

import { OfficeCard } from "@/features/contacts/OfficeCard";
import { locationsServerApi } from "@/features/locations/api/server";
import { buildLocalBusinessJsonLd } from "@/features/locations/lib/jsonLd";
import { USER_LANGUAGES } from "@/shared/types";

export const ContactsPage = async () => {
  const [t, locale, locations] = await Promise.all([
    getTranslations(),
    getLocale(),
    locationsServerApi.getLocationsInfo(),
  ]);
  const isUk = locale === USER_LANGUAGES.UK;

  const city = locations[0]
    ? isUk
      ? locations[0].cityUa
      : locations[0].cityRu
    : "";

  return (
    <section
      className="ws-section ws-contacts-section"
      aria-labelledby="contacts-heading"
    >
      <div className="ws-wrap">
        {buildLocalBusinessJsonLd(locations).map((jsonLd, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        ))}

        <header className="mb-5">
          <p className="ws-section-eyebrow">{t("contacts.eyebrow")}</p>
          <h1 id="contacts-heading" className="ws-section-title">
            {t("contacts.titlePrefix")}{" "}
            <strong>
              {t("contacts.cityAbbr")} {city}.
            </strong>
          </h1>
        </header>
        {locations.map((location, index) => (
          <OfficeCard
            key={location.id}
            location={location}
            isReverse={index % 2 !== 0}
          />
        ))}
      </div>
    </section>
  );
};

export default ContactsPage;
