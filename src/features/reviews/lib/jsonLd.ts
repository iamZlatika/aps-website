import { type Review } from "@/features/reviews/types";

const SITE_NAME = "APS Service";

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
