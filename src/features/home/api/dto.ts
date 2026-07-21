import { z } from "zod";

const LandingCategoryDtoSchema = z.object({
  key: z.string(),
  name_ru: z.string(),
  name_uk: z.string(),
});

const LandingPriceDtoSchema = z.object({
  category: LandingCategoryDtoSchema,
  min_price: z.number(),
});

export const LandingDtoSchema = z.object({
  orders: z.object({ count: z.number() }),
  prices: z.array(LandingPriceDtoSchema),
});

export type LandingDto = z.infer<typeof LandingDtoSchema>;
