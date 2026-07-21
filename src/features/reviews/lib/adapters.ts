import { type ReviewDto } from "@/features/reviews/api/dto";
import { type Review } from "@/features/reviews/types";

export function mapReviewDtoToReview(dto: ReviewDto): Review {
  return {
    id: dto.id,
    authorName: dto.author_name,
    authorPhotoUrl: dto.author_photo_url,
    rating: dto.rating,
    text: dto.text,
    publishedAt: dto.published_at,
  };
}
