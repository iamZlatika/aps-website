import { type LandingDto } from "@/features/home/api/dto";
import { type LandingData } from "@/features/home/types";

export function mapLandingDtoToLandingData(dto: LandingDto): LandingData {
  return {
    activeCount: dto.orders.count,
    prices: dto.prices.map((p) => ({
      categoryKey: p.category.key,
      categoryNameRu: p.category.name_ru,
      categoryNameUk: p.category.name_uk,
      minPrice: p.min_price,
    })),
  };
}
