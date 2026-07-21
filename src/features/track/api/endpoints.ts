const BASE = "/api";

export const TRACK_API = {
  track: (token: string) => `${BASE}/orders/track/${token}`,
  status: (orderNumber: string) => `${BASE}/orders/status/${orderNumber}`,
} as const;
