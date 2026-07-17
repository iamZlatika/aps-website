import { type Location } from "@/entities/location/types";
import { type Review } from "@/features/website/types";

const SITE_NAME = "APS Service";

export function buildOrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/icons/favicon-512.png`,
  };
}

export function buildLocalBusinessJsonLd(locations: Location[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return locations.map((location) => ({
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: `${SITE_NAME} — ${location.streetRu}, ${location.building}`,
    url: siteUrl,
    telephone: location.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${location.streetRu}, ${location.building}`,
      addressLocality: location.cityRu,
      addressCountry: "UA",
    },
  }));
}

export function buildReviewsJsonLd(reviews: Review[]) {
  if (reviews.length === 0) return null;

  const ratingValue =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: SITE_NAME,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      reviewCount: reviews.length,
    },
    review: reviews.slice(0, 20).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.authorName },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
      },
      ...(review.text ? { reviewBody: review.text } : {}),
    })),
  };
}
