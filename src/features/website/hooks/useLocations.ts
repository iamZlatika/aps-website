import { type Location } from "@/entities/location/types";
import { useLocationsContext } from "@/features/website/locationsContext";

type UseLocationsResult = {
  locations: Location[];
};

export const useLocations = (): UseLocationsResult => {
  const locations = useLocationsContext();
  return { locations };
};
