import Cookies from "js-cookie";

export const CUSTOMER_AUTH_COOKIE_NAME = "customer_auth_token";

export type AuthService = {
  getToken: () => string | undefined;
  setToken: (token: string, expiresDays?: number) => void;
  clearToken: () => void;
  subscribe: (listener: () => void) => () => void;
};

const createAuthService = (): AuthService => {
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  return {
    getToken: (): string | undefined => Cookies.get(CUSTOMER_AUTH_COOKIE_NAME),
    setToken: (token: string, expiresDays = 365) => {
      Cookies.set(CUSTOMER_AUTH_COOKIE_NAME, token, {
        expires: expiresDays,
        secure: true,
        sameSite: "strict",
      });
      notify();
    },
    clearToken: () => {
      Cookies.remove(CUSTOMER_AUTH_COOKIE_NAME);
      notify();
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export const customerAuthService = createAuthService();
