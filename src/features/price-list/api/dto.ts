import { z } from "zod";

import { PriceListItemDtoSchema } from "@/entities/price-list/dto";

export const PriceListResponseDtoSchema = z.object({
  data: z.array(PriceListItemDtoSchema),
  meta: z.object({ last_page: z.number() }),
});
