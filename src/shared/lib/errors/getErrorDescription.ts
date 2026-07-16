import { t } from "@/shared/lib/i18n/t";

export function getErrorDescription(
  error: unknown,
  eventId?: string,
): string | undefined {
  if (process.env.NODE_ENV !== "production") {
    if (error instanceof Error) return error.message;
    try {
      return typeof error === "string" ? error : JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  if (eventId) {
    return `${t("errors.error_id")}: ${eventId}`;
  }

  return undefined;
}
