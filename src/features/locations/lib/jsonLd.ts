import { type Location, type Schedule } from "@/entities/location/types";
import { WEEK_DAYS } from "@/shared/types";

const SITE_NAME = "APS Service";
const OFFICE_PRICE_RANGE = "₴₴";
const OFFICE_IMAGE_PATH = "/office.webp";

const SCHEMA_DAY_NAMES: Record<(typeof WEEK_DAYS)[number], string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

type OpeningHoursSpecification = {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string[];
  opens: string;
  closes: string;
};

export function buildOpeningHoursSpecification(
  schedule: Schedule,
): OpeningHoursSpecification[] {
  const specs: OpeningHoursSpecification[] = [];

  for (const day of WEEK_DAYS) {
    const slot = schedule[day];
    if (!slot) continue;

    const lastSpec = specs[specs.length - 1];
    const sameHoursAsPrevious =
      lastSpec?.opens === slot.from && lastSpec?.closes === slot.to;

    if (sameHoursAsPrevious) {
      lastSpec.dayOfWeek.push(SCHEMA_DAY_NAMES[day]);
    } else {
      specs.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [SCHEMA_DAY_NAMES[day]],
        opens: slot.from,
        closes: slot.to,
      });
    }
  }

  return specs;
}

export function buildLocalBusinessJsonLd(locations: Location[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return locations.map((location) => ({
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: `${SITE_NAME} — ${location.streetRu}, ${location.building}`,
    url: siteUrl,
    image: `${siteUrl}${OFFICE_IMAGE_PATH}`,
    telephone: location.phone,
    priceRange: OFFICE_PRICE_RANGE,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${location.streetRu}, ${location.building}`,
      addressLocality: location.cityRu,
      addressCountry: "UA",
    },
    openingHoursSpecification: buildOpeningHoursSpecification(
      location.schedule,
    ),
  }));
}
