import axios, { type AxiosError } from "axios";

import { customerAuthService } from "@/features/auth/lib/authService";
import { SharedRoutes } from "@/shared/api/routes";
import { isSecurityBlockedResponse } from "@/shared/api/securityBlock";
import { type ServerErrorResponse } from "@/shared/api/types";
import { ApiError } from "@/shared/lib/errors/services";
import { t } from "@/shared/lib/i18n/t";
import { captureError } from "@/shared/lib/sentry";

declare module "axios" {
  export interface AxiosRequestConfig {
    silentErrorStatuses?: number[];
  }
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = customerAuthService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ServerErrorResponse>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    // These are forced full-page redirects (session expired, blocked,
    // maintenance) rather than router.push()-style client navigation —
    // an axios interceptor runs outside React, with no access to the
    // App Router's useRouter() hook, and a hard reload is the correct
    // reset here anyway (clears all in-memory state).
    if (status === 401 && customerAuthService.getToken()) {
      customerAuthService.clearToken();
      window.location.href = "/";
    }

    if (isSecurityBlockedResponse(status, data?.message)) {
      window.location.href = SharedRoutes.blocked();
    }

    if (status === 503) {
      window.location.href = SharedRoutes.maintenance();
    }

    const isNetworkError = !error.response && error.code === "ERR_NETWORK";
    const message = isNetworkError
      ? t("errors.network")
      : data?.message || error.message || t("errors.unknown");

    const apiError = new ApiError(message, status, data);

    const isSilencedStatus =
      status !== undefined &&
      (error.config?.silentErrorStatuses ?? []).includes(status);

    if (
      status !== 401 &&
      status !== 403 &&
      status !== 422 &&
      status !== 503 &&
      !isSilencedStatus
    ) {
      captureError(apiError, {
        url: error.config?.url,
        method: error.config?.method,
        status,
        isNetworkError,
      });
    }

    return Promise.reject(apiError);
  },
);
