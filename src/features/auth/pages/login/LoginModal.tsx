import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AuthModalBrand } from "@/features/auth/components/AuthModalBrand";
import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";
import { useAuthModal } from "@/features/auth/hooks/useAuthModal";
import { customerAuthService } from "@/features/auth/lib/authService";
import { type AuthResponse } from "@/features/auth/types";
import { WebsiteModal } from "@/shared/components/ui/WebsiteModal";

import { LoginForm } from "./LoginForm";

interface LoginModalProps {
  redirectTo: string;
}

export const LoginModal = ({ redirectTo }: LoginModalProps) => {
  const t = useTranslations();
  const { isLoginOpen, openRegister, openForgot, close } = useAuthModal();
  const router = useRouter();

  const handleSuccess = (data: AuthResponse) => {
    customerAuthService.setToken(data.token);
    close();
    router.push(redirectTo);
  };

  return (
    <WebsiteModal open={isLoginOpen} onClose={close} maxWidth="max-w-[440px]">
      <div className="overflow-y-auto p-[34px_34px_28px]">
        <AuthModalBrand />

        <h2 className="text-balance text-[26px] font-light leading-[1.15] tracking-[-0.018em] text-ws-ink">
          {t("login.titleLine")}{" "}
          <b className="font-semibold text-ws-cream">{t("login.titleBold")}</b>
        </h2>
        <p className="mt-2 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
          {t("login.subtitle")}
        </p>

        <LoginForm onSuccess={handleSuccess} onForgotPassword={openForgot} />

        <div className="my-5 flex items-center gap-[14px] text-[12px] tracking-[.04em] text-ws-ink-mute">
          <span className="h-px flex-1 bg-ws-line" />
          {t("login.orDivider")}
          <span className="h-px flex-1 bg-ws-line" />
        </div>

        <GoogleSignInButton />

        <div className="mt-[18px] text-center text-[13.5px] text-ws-ink-soft">
          {t("login.noAccount")}{" "}
          <button
            type="button"
            className="font-semibold text-ws-ember-bright hover:underline"
            onClick={openRegister}
          >
            {t("login.register")}
          </button>
        </div>
      </div>
    </WebsiteModal>
  );
};
