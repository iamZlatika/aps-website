const BASE = "/api";

export const LOCATIONS_API = {
  locations: () => `${BASE}/dictionaries/locations`,
} as const;
