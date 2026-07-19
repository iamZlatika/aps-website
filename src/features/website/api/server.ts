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
    const firstResponse = await getServer<unknown>(
      `${WEBSITE_API.landingWorks()}?page=1`,
    );
    const firstValidated = parseDto(WorksResponseDtoSchema, firstResponse);
    const { last_page: lastPage } = firstValidated.meta;

    const remainingPages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) => {
        const page = index + 2;
        return getServer<unknown>(
          `${WEBSITE_API.landingWorks()}?page=${page}`,
        ).then((response) => parseDto(WorksResponseDtoSchema, response));
      }),
    );

    return [firstValidated, ...remainingPages].flatMap((validated) =>
      validated.data.map(mapWorkDtoToWork),
    );
  },

  getAllPriceList: async (): Promise<PriceListItem[]> => {
    const firstResponse = await getServer<unknown>(
      `${WEBSITE_API.priceList()}?per_page=100&page=1`,
    );
    const firstValidated = parseDto(PriceListResponseDtoSchema, firstResponse);
    const { last_page: lastPage } = firstValidated.meta;

    const remainingPages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) => {
        const page = index + 2;
        return getServer<unknown>(
          `${WEBSITE_API.priceList()}?per_page=100&page=${page}`,
        ).then((response) => parseDto(PriceListResponseDtoSchema, response));
      }),
    );

    return [firstValidated, ...remainingPages].flatMap((validated) =>
      validated.data.map(mapPriceListItemDtoToPriceListItem),
    );
  },

  getReviews: async (locationId: number): Promise<Review[]> => {
    const response = await getServer<unknown>(WEBSITE_API.reviews(locationId));
    const validated = parseDto(ReviewsResponseDtoSchema, response);
    return validated.data.map(mapReviewDtoToReview);
  },
};
