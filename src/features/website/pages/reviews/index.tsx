import { websiteServerApi } from "@/features/website/api/server";
import { ReviewsContent } from "@/features/website/pages/reviews/ReviewsContent";

const ReviewsPage = async () => {
  const locations = await websiteServerApi.getLocationsInfo();
  const allReviews = await Promise.all(
    locations.map(async (location) => ({
      locationId: location.id,
      reviews: await websiteServerApi.getReviews(location.id),
    })),
  );

  return (
    <section
      className="ws-section ws-reviews-section"
      aria-labelledby="reviews-heading"
    >
      <div className="ws-wrap">
        <ReviewsContent locations={locations} allReviews={allReviews} />
      </div>
    </section>
  );
};

export default ReviewsPage;
