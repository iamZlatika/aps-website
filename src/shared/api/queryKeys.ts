export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    customerResetCheck: (token: string, email: string) =>
      [...queryKeys.auth.all, "customerResetCheck", token, email] as const,
    emailVerify: (verifyUrl: string) =>
      [...queryKeys.auth.all, "emailVerify", verifyUrl] as const,
    googleCallback: (code: string) =>
      [...queryKeys.auth.all, "googleCallback", code] as const,
  },

  // Everything owned by the logged-in customer (profile, orders, etc.)
  // must nest under this root so logout can clear it in one prefix removal.
  customer: {
    all: ["customer"] as const,
    me: () => [...queryKeys.customer.all, "me"] as const,
    orders: (page?: number) =>
      [
        ...queryKeys.customer.all,
        "orders",
        ...(page !== undefined ? [page] : []),
      ] as const,
    orderDetail: (id: number) =>
      [...queryKeys.customer.all, "orders", "detail", id] as const,
  },

  tracking: {
    all: ["tracking"] as const,
    detail: (token: string) =>
      [...queryKeys.tracking.all, "detail", token] as const,
  },

  website: {
    all: ["website"] as const,
    locations: () => ["website", "locations"] as const,
    landing: () => ["website", "landing"] as const,
    priceList: (categories: string[]) =>
      ["website", "price-list", categories] as const,
    priceListAll: () => ["website", "price-list", "all"] as const,
    works: () => ["website", "works"] as const,
    reviews: (locationId: number) =>
      ["website", "reviews", locationId] as const,
  },
} as const;
