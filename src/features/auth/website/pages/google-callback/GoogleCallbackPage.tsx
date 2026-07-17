"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";

import { customerAuthService } from "@/features/auth/lib/authService";
import { CUSTOMER_ACCOUNT_LINKS } from "@/features/website/modules/account/navigation";
import { WEBSITE_LINKS } from "@/features/website/navigation";
import { queryKeys } from "@/shared/api/queryKeys";

import { useGoogleCallback } from "./useGoogleCallback";

const GoogleCallbackPage = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const { data, isLoading, isSuccess, isError } = useGoogleCallback(code);

  useEffect(() => {
    if (error) {
      toast.error(t("googleCallback.accessDenied"));
      router.replace(WEBSITE_LINKS.home);
    }
  }, [error, router, t]);

  useEffect(() => {
    if (isSuccess && data) {
      customerAuthService.setToken(data.token);
      queryClient.setQueryData(queryKeys.customer.me(), data.customer);
      router.replace(CUSTOMER_ACCOUNT_LINKS.root());
    }
  }, [isSuccess, data, router, queryClient]);

  useEffect(() => {
    if (isError) {
      toast.error(t("googleCallback.failed"));
      router.replace(WEBSITE_LINKS.home);
    }
  }, [isError, router, t]);

  return (
    <div className="flex min-h-[calc(100vh-var(--ws-header-height))] items-center justify-center p-6">
      <div className="w-full max-w-[400px] text-center" role="status">
        {isLoading && (
          <>
            <Loader2
              className="mx-auto mb-5 size-12 animate-spin text-ws-ember-bright"
              aria-hidden="true"
            />
            <p className="text-[15px] text-ws-ink-soft">
              {t("googleCallback.loading")}
            </p>
          </>
        )}

        {isError && (
          <>
            <XCircle
              className="mx-auto mb-5 size-12 text-ws-red-bright"
              aria-hidden="true"
            />
            <p className="text-[15px] text-ws-ink-soft">
              {t("googleCallback.redirecting")}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
