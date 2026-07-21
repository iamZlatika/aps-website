import { mapLocationDtoToLocation } from "@/entities/location/adapters";
import { type Location } from "@/entities/location/types";
import {
  type LocationsResponseDto,
  LocationsResponseDtoSchema,
} from "@/features/locations/api/dto";
import { LOCATIONS_API } from "@/features/locations/api/endpoints";
import { parseDto } from "@/shared/api/parseDto";
import { getServer } from "@/shared/api/server";

export const locationsServerApi = {
  getLocationsInfo: async (): Promise<Location[]> => {
    const response = await getServer<LocationsResponseDto>(
      LOCATIONS_API.locations(),
    );
    const validated = parseDto(LocationsResponseDtoSchema, response);
    return validated.data.map(mapLocationDtoToLocation);
  },
};
