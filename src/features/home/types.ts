export type CategoryMinPrice = {
  categoryKey: string;
  categoryNameRu: string;
  categoryNameUk: string;
  minPrice: number;
};

export type LandingData = {
  activeCount: number;
  prices: CategoryMinPrice[];
};
