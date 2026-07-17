import { type Location } from "@/entities/location/types";
import { type PriceListItem } from "@/entities/price-list/types";
import { mapWorkDtoToWork } from "@/entities/work/adapters";
import { WorksResponseDtoSchema } from "@/entities/work/dto";
import { type Work } from "@/entities/work/types";
import {
  type LandingDto,
  LandingDtoSchema,
  type LocationsResponseDto,
  LocationsResponseDtoSchema,
  PriceListResponseDtoSchema,
  ReviewsResponseDtoSchema,
} from "@/features/website/api/dto";
import { WEBSITE_API } from "@/features/website/api/endpoints";
import {
  mapLandingDtoToLandingData,
  mapLocationDtoToLocation,
  mapPriceListItemDtoToPriceListItem,
  mapReviewDtoToReview,
} from "@/features/website/lib/adapters";
import { type LandingData, type Review } from "@/features/website/types";
import { parseDto } from "@/shared/api/parseDto";
import { getServer } from "@/shared/api/server";

export const websiteServerApi = {
  getLanding: async (): Promise<LandingData> => {
    const response = await getServer<{ data: LandingDto }>(
      WEBSITE_API.landing(),
    );
    const validated = parseDto(LandingDtoSchema, response.data);
    return mapLandingDtoToLandingData(validated);
  },

  getLocationsInfo: async (): Promise<Location[]> => {
    const response = await getServer<LocationsResponseDto>(
      WEBSITE_API.locations(),
    );
    const validated = parseDto(LocationsResponseDtoSchema, response);
    return validated.data.map(mapLocationDtoToLocation);
  },

  getAllWorks: async (): Promise<Work[]> => {
    const works: Work[] = [];
    let page = 1;
    let lastPage = 1;

    do {
      const response = await getServer<unknown>(
        `${WEBSITE_API.landingWorks()}?page=${page}`,
      );
      const validated = parseDto(WorksResponseDtoSchema, response);
      works.push(...validated.data.map(mapWorkDtoToWork));
      lastPage = validated.meta.last_page;
      page += 1;
    } while (page <= lastPage);

    return works;
  },

  getAllPriceList: async (): Promise<PriceListItem[]> => {
    const items: PriceListItem[] = [];
    let page = 1;
    let lastPage = 1;

    do {
      const response = await getServer<unknown>(
        `${WEBSITE_API.priceList()}?per_page=100&page=${page}`,
      );
      const validated = parseDto(PriceListResponseDtoSchema, response);
      items.push(...validated.data.map(mapPriceListItemDtoToPriceListItem));
      lastPage = validated.meta.last_page;
      page += 1;
    } while (page <= lastPage);

    return items;
  },

  getReviews: async (locationId: number): Promise<Review[]> => {
    const response = await getServer<unknown>(WEBSITE_API.reviews(locationId));
    const validated = parseDto(ReviewsResponseDtoSchema, response);
    return validated.data.map(mapReviewDtoToReview);
  },
};
