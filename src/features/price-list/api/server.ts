import { mapPriceListItemDtoToPriceListItem } from "@/entities/price-list/adapters";
import { type PriceListItem } from "@/entities/price-list/types";
import { PriceListResponseDtoSchema } from "@/features/price-list/api/dto";
import { PRICE_LIST_API } from "@/features/price-list/api/endpoints";
import { parseDto } from "@/shared/api/parseDto";
import { getServer } from "@/shared/api/server";

export const priceListServerApi = {
  getAllPriceList: async (): Promise<PriceListItem[]> => {
    const firstResponse = await getServer<unknown>(
      `${PRICE_LIST_API.priceList()}?per_page=100&page=1`,
    );
    const firstValidated = parseDto(PriceListResponseDtoSchema, firstResponse);
    const { last_page: lastPage } = firstValidated.meta;

    const remainingPages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) => {
        const page = index + 2;
        return getServer<unknown>(
          `${PRICE_LIST_API.priceList()}?per_page=100&page=${page}`,
        ).then((response) => parseDto(PriceListResponseDtoSchema, response));
      }),
    );

    return [firstValidated, ...remainingPages].flatMap((validated) =>
      validated.data.map(mapPriceListItemDtoToPriceListItem),
    );
  },
};
