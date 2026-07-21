import { locationsServerApi } from "@/features/locations/api/server";
import { reviewsServerApi } from "@/features/reviews/api/server";
import { buildReviewsJsonLd } from "@/features/reviews/lib/jsonLd";
import { ReviewsContent } from "@/features/reviews/ReviewsContent";

const ReviewsPage = async () => {
  const locations = await locationsServerApi.getLocationsInfo();
  const allReviews = await Promise.all(
    locations.map(async (location) => ({
      locationId: location.id,
      reviews: await reviewsServerApi.getReviews(location.id),
    })),
  );
  const reviewsJsonLd = buildReviewsJsonLd(
    allReviews.flatMap((entry) => entry.reviews),
  );

  return (
    <section
      className="ws-section ws-reviews-section"
      aria-labelledby="reviews-heading"
    >
      <div className="ws-wrap">
        {reviewsJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
          />
        )}
        <ReviewsContent locations={locations} allReviews={allReviews} />
      </div>
    </section>
  );
};

export default ReviewsPage;
