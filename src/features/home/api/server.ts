import { type LandingDto, LandingDtoSchema } from "@/features/home/api/dto";
import { HOME_API } from "@/features/home/api/endpoints";
import { mapLandingDtoToLandingData } from "@/features/home/lib/adapters";
import { type LandingData } from "@/features/home/types";
import { parseDto } from "@/shared/api/parseDto";
import { getServer } from "@/shared/api/server";

export const homeServerApi = {
  getLanding: async (): Promise<LandingData> => {
    const response = await getServer<{ data: LandingDto }>(HOME_API.landing());
    const validated = parseDto(LandingDtoSchema, response.data);
    return mapLandingDtoToLandingData(validated);
  },
};
