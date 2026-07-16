import type { useRouter } from "next/navigation";

import { WEBSITE_LINKS } from "@/features/website/navigation";
import { queryClient } from "@/shared/api/queryClient";
import { queryKeys } from "@/shared/api/queryKeys";

import { customerAuthService } from "./authService";

type Router = ReturnType<typeof useRouter>;

let isLoggingOut = false;

export const logout = (router: Router, redirectTo?: string) => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  customerAuthService.clearToken();
  router.push(redirectTo ?? WEBSITE_LINKS.home);

  // Deferred to the next tick: components like HeaderUserBadge are still
  // mounted and subscribed to customer.* queries at this point (push()
  // hasn't unmounted them yet). Removing the cache while they're still
  // active observers makes them refetch immediately with no token.
  setTimeout(() => {
    queryClient.removeQueries({ queryKey: queryKeys.customer.all });
  }, 0);

  queueMicrotask(() => {
    isLoggingOut = false;
  });
};
