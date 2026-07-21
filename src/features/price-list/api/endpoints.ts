const BASE = "/api";

export const PRICE_LIST_API = {
  priceList: () => `${BASE}/dictionaries/price-list`,
} as const;
