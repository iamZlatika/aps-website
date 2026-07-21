import { ReviewsResponseDtoSchema } from "@/features/reviews/api/dto";
import { REVIEWS_API } from "@/features/reviews/api/endpoints";
import { mapReviewDtoToReview } from "@/features/reviews/lib/adapters";
import { type Review } from "@/features/reviews/types";
import { parseDto } from "@/shared/api/parseDto";
import { getServer } from "@/shared/api/server";

export const reviewsServerApi = {
  getReviews: async (locationId: number): Promise<Review[]> => {
    const response = await getServer<unknown>(REVIEWS_API.reviews(locationId));
    const validated = parseDto(ReviewsResponseDtoSchema, response);
    return validated.data.map(mapReviewDtoToReview);
  },
};
