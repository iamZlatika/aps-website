import { z } from "zod";

import { LocationDtoSchema } from "@/entities/location/dto";

export const LocationsResponseDtoSchema = z.object({
  data: z.array(LocationDtoSchema),
});
export type LocationsResponseDto = z.infer<typeof LocationsResponseDtoSchema>;
