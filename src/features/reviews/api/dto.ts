import { z } from "zod";

export const ReviewDtoSchema = z.object({
  id: z.string(),
  author_name: z.string(),
  author_photo_url: z.string(),
  rating: z.number().int().min(1).max(5),
  text: z.string(),
  published_at: z.string(),
});
export type ReviewDto = z.infer<typeof ReviewDtoSchema>;

export const ReviewsResponseDtoSchema = z.object({
  data: z.array(ReviewDtoSchema),
});
export type ReviewsResponseDto = z.infer<typeof ReviewsResponseDtoSchema>;
