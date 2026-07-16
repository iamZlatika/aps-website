import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import {
  LOGIN_MODAL_VALUE,
  MODAL_PARAM,
} from "@/features/website/lib/modalParams";
import { WEBSITE_LINKS } from "@/features/website/navigation";

import { useEmailVerify } from "./useEmailVerify";

const EmailVerifyPage = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const verifyUrl = searchParams.get("verify_url");

  const hasUrl = !!verifyUrl;
  const { isLoading, isSuccess, isError } = useEmailVerify(verifyUrl);

  useEffect(() => {
    if (isSuccess) {
      router.replace(
        `${WEBSITE_LINKS.home}?${MODAL_PARAM}=${LOGIN_MODAL_VALUE}`,
      );
    }
  }, [isSuccess, router]);

  return (
    <div className="flex min-h-[calc(100vh-var(--ws-header-height))] items-center justify-center p-6">
      <div className="w-full max-w-[400px] text-center">
        {isLoading && (
          <>
            <Loader2 className="mx-auto mb-5 size-12 animate-spin text-ws-ember-bright" />
            <p className="text-[15px] text-ws-ink-soft">
              {t("emailVerify.loading")}
            </p>
          </>
        )}

        {isSuccess && (
          <>
            <CheckCircle className="mx-auto mb-5 size-12 text-ws-green" />
            <p className="text-[15px] text-ws-ink-soft">
              {t("emailVerify.redirecting")}
            </p>
          </>
        )}

        {(!hasUrl || isError) && (
          <>
            <XCircle className="mx-auto mb-5 size-12 text-ws-red-bright" />
            <h1 className="text-[22px] font-semibold text-ws-ink">
              {t("emailVerify.errorTitle")}
            </h1>
            <p className="mt-2 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
              {t("emailVerify.errorSubtitle")}
            </p>
            <button
              type="button"
              className="ws-btn ws-btn-primary mx-auto mt-6 justify-center"
              onClick={() =>
                router.push(
                  `${WEBSITE_LINKS.home}?${MODAL_PARAM}=${LOGIN_MODAL_VALUE}`,
                )
              }
            >
              {t("emailVerify.goToLogin")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerifyPage;
