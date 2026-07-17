import { websiteServerApi } from "@/features/website/api/server";
import { buildReviewsJsonLd } from "@/features/website/lib/jsonLd";
import { ReviewsContent } from "@/features/website/pages/reviews/ReviewsContent";

const ReviewsPage = async () => {
  const locations = await websiteServerApi.getLocationsInfo();
  const allReviews = await Promise.all(
    locations.map(async (location) => ({
      locationId: location.id,
      reviews: await websiteServerApi.getReviews(location.id),
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
