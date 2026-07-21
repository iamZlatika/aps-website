const BASE = "/api";

export const REVIEWS_API = {
  reviews: (locationId: number) => `${BASE}/landing/reviews/${locationId}`,
} as const;
