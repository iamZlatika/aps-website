import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

export function captureError(
  error: unknown,
  context?: Record<string, unknown>,
) {
  if (isProd) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error("[Sentry would capture]:", error, context);
  }
}

export function captureErrorWithId(
  error: unknown,
  context?: Record<string, unknown>,
): string | null {
  if (isProd) {
    return Sentry.captureException(error, { extra: context });
  }
  console.error("[Sentry would capture]:", error, context);
  return null;
}
