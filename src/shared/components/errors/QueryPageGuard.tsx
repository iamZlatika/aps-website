import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import PageError from "@/shared/components/errors/ErrorPage";
import { isApiError } from "@/shared/lib/errors/services";

interface QueryPageGuardProps {
  isError: boolean;
  error: unknown;
  onRetry?: () => void;

  isLoading?: boolean;
  loadingFallback?: ReactNode;

  title?: string;
  unknownMessage?: string;
  buttonClassName?: string;

  children: ReactNode;
}

export function QueryPageGuard({
  isError,
  error,
  onRetry,
  isLoading,
  loadingFallback = null,
  title,
  unknownMessage,
  buttonClassName,
  children,
}: QueryPageGuardProps) {
  const t = useTranslations();

  if (isLoading) return loadingFallback;

  if (isError) {
    return (
      <PageError
        title={title ?? t("errors.failed_to_load")}
        description={
          isApiError(error)
            ? error.message
            : (unknownMessage ?? t("errors.unknown"))
        }
        onRetry={onRetry}
        buttonLabel={t("errors.retry")}
        buttonClassName={buttonClassName}
      />
    );
  }

  return children;
}
