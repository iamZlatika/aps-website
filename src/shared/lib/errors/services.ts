import { toast } from "sonner";

import { getSharedServerMessageMap } from "@/shared/lib/errors/serverMessageMap";
import { t } from "@/shared/lib/i18n/t";
import { captureError } from "@/shared/lib/sentry";

export class ApiError<T = unknown> extends Error {
  readonly __apiError = true as const;
  readonly status?: number;
  readonly data?: T;

  constructor(message: string, status?: number, data?: T) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function isApiError<T = unknown>(error: unknown): error is ApiError<T> {
  return (
    error instanceof ApiError ||
    (typeof error === "object" &&
      error !== null &&
      "__apiError" in error &&
      (error as ApiError).__apiError)
  );
}

export function notifyError(error: unknown, fallback = t("errors.unknown")) {
  if (!isApiError(error)) {
    captureError(error, { source: "notifyError" });
    toast.error(fallback);
    return;
  }

  if (error.status === 403) {
    toast.error(t("errors.forbidden_action"));
    return;
  }

  const SERVER_MESSAGE_MAP: Record<string, string> = {
    ...getSharedServerMessageMap(),
    "The image failed to upload.": t("errors.image_upload_failed"),
  };

  const message =
    SERVER_MESSAGE_MAP[error.message] ?? error.message ?? fallback;
  toast.error(message);
}
