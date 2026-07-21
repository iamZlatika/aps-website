import { createContext, useContext } from "react";

import { type Location } from "@/entities/location/types";

export const LocationsContext = createContext<Location[] | null>(null);

export function useLocationsContext(): Location[] {
  const ctx = useContext(LocationsContext);
  if (ctx === null)
    throw new Error("useLocationsContext must be used inside WebsiteLayout");
  return ctx;
}
