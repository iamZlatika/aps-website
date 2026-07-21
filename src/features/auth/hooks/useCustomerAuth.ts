import { useSyncExternalStore } from "react";

import { customerAuthService } from "@/features/auth/lib/authService";

type UseCustomerAuthReturn = {
  isAuthenticated: boolean;
};

const getIsAuthenticated = (): boolean => !!customerAuthService.getToken();
// The cookie isn't readable during the server render pass of a Client
// Component, so the server snapshot is always "logged out" — corrected
// on the client right after hydration via getIsAuthenticated.
const getServerSnapshot = (): boolean => false;

export const useCustomerAuth = (): UseCustomerAuthReturn => {
  const isAuthenticated = useSyncExternalStore(
    customerAuthService.subscribe,
    getIsAuthenticated,
    getServerSnapshot,
  );

  return { isAuthenticated };
};
