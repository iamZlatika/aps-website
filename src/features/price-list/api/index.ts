import { mapPriceListItemDtoToPriceListItem } from "@/entities/price-list/adapters";
import { type PriceListItem } from "@/entities/price-list/types";
import { PriceListResponseDtoSchema } from "@/features/price-list/api/dto";
import { PRICE_LIST_API } from "@/features/price-list/api/endpoints";
import { get } from "@/shared/api/api";
import { parseDto } from "@/shared/api/parseDto";

export const priceListApi = {
  getPriceList: async (categories: string[]): Promise<PriceListItem[]> => {
    const params = new URLSearchParams();
    categories.forEach((cat) => params.append("categories[]", cat));
    params.set("per_page", "100");
    const response = await get<unknown>(
      `${PRICE_LIST_API.priceList()}?${params.toString()}`,
    );
    const validated = parseDto(PriceListResponseDtoSchema, response);
    return validated.data.map(mapPriceListItemDtoToPriceListItem);
  },
};
