import { useSuspenseQuery } from "@tanstack/react-query";

import { type PriceListItem } from "@/entities/price-list/types";
import { priceListApi } from "@/features/price-list/api";
import { queryKeys } from "@/shared/api/queryKeys";

type UsePriceListResult = {
  priceList: PriceListItem[];
};

export const usePriceList = (
  categories: readonly string[],
): UsePriceListResult => {
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.website.priceList([...categories]),
    queryFn: () => priceListApi.getPriceList([...categories]),
  });

  return { priceList: data };
};
