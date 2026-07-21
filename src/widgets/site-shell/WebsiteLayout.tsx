"use client";

import "@/widgets/site-shell/styles/website.css";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { lazy, type ReactNode, Suspense, useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";

import { type Location } from "@/entities/location/types";
import { CUSTOMER_ACCOUNT_LINKS } from "@/features/account/navigation";
import { LocationsContext } from "@/features/locations/context";
import { PullToRefreshBackdrop } from "@/shared/components/PullToRefreshBackdrop";
import { PullToRefreshIndicator } from "@/shared/components/PullToRefreshIndicator";
import { PullToRefreshLoaderFrame } from "@/shared/components/PullToRefreshLoaderFrame";
import { usePullToRefresh } from "@/shared/hooks/usePullToRefresh";
import { captureErrorWithId } from "@/shared/lib/sentry";
import { cn } from "@/shared/lib/utils";
import { WebsiteErrorFallback } from "@/widgets/site-shell/ErrorFallback";
import { Footer } from "@/widgets/site-shell/Footer";
import { Header } from "@/widgets/site-shell/Header";
import { MobileLocationCards } from "@/widgets/site-shell/Header/mobile/MobileLocationCards";
import { useMobileNav } from "@/widgets/site-shell/hooks/useMobileNav";
import { useWebsiteThemeManager } from "@/widgets/site-shell/hooks/useWebsiteThemeManager";
import { WebsiteLoader } from "@/widgets/site-shell/Loader";
import { WebsiteThemeContext } from "@/widgets/site-shell/websiteTheme";

const ForgotPasswordModal = lazy(() =>
  import("@/features/auth/pages/forgot/ForgotPasswordModal").then((m) => ({
    default: m.ForgotPasswordModal,
  })),
);
const LoginModal = lazy(() =>
  import("@/features/auth/pages/login/LoginModal").then((m) => ({
    default: m.LoginModal,
  })),
);
const RegistrationModal = lazy(() =>
  import("@/features/auth/pages/registration/RegistrationModal").then((m) => ({
    default: m.RegistrationModal,
  })),
);

interface WebsiteLayoutProps {
  children: ReactNode;
  locations: Location[];
}

export const WebsiteLayout = ({ children, locations }: WebsiteLayoutProps) => {
  const t = useTranslations();
  const pathname = usePathname();
  const themeValue = useWebsiteThemeManager();
  const { isOpen: isNavOpen, open: openNav, close: closeNav } = useMobileNav();
  const rootRef = useRef<HTMLDivElement>(null);
  const { progress, status } = usePullToRefresh(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let resizeObserver: ResizeObserver | null = null;

    const attachToHeader = (header: HTMLElement) => {
      resizeObserver = new ResizeObserver(() => {
        root.style.setProperty(
          "--ws-header-height",
          `${header.offsetHeight}px`,
        );
      });
      resizeObserver.observe(header);
    };

    const header = root.querySelector<HTMLElement>(":scope > header");
    if (header) {
      attachToHeader(header);
      return () => resizeObserver?.disconnect();
    }

    const mutationObserver = new MutationObserver(() => {
      const h = root.querySelector<HTMLElement>(":scope > header");
      if (h) {
        mutationObserver.disconnect();
        attachToHeader(h);
      }
    });
    mutationObserver.observe(root, { childList: true });

    return () => {
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <LocationsContext.Provider value={locations}>
      <WebsiteThemeContext.Provider value={themeValue}>
        <div
          ref={rootRef}
          className={cn(
            "website relative flex min-h-screen flex-col",
            themeValue.resolvedTheme === "light" && "light",
          )}
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-ws-md focus:bg-ws-bg-2 focus:px-4 focus:py-2 focus:text-ws-ink focus:outline focus:outline-ws-ember-bright"
          >
            {t("nav.skipToContent")}
          </a>
          <Suspense
            fallback={
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ws-bg">
                <WebsiteLoader />
              </div>
            }
          >
            <ErrorBoundary
              FallbackComponent={WebsiteErrorFallback}
              resetKeys={[pathname]}
              onError={(error, info) =>
                captureErrorWithId(error, {
                  componentStack: info.componentStack,
                })
              }
            >
              <Header
                isNavOpen={isNavOpen}
                openNav={openNav}
                closeNav={closeNav}
              />
              <div className="relative flex flex-1 flex-col">
                <PullToRefreshBackdrop status={status} />
                <PullToRefreshIndicator
                  status={status}
                  progress={progress}
                  refreshingLabel={t("pullToRefresh.refreshing")}
                >
                  <PullToRefreshLoaderFrame scaleClassName="scale-[0.6]">
                    <WebsiteLoader />
                  </PullToRefreshLoaderFrame>
                </PullToRefreshIndicator>
                <div className="flex flex-1 flex-col translate-y-[var(--pull-distance)]">
                  <div className="ws-wrap w-full">
                    <MobileLocationCards />
                  </div>
                  <main id="main-content" className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </div>
            </ErrorBoundary>
          </Suspense>
          <Suspense fallback={null}>
            <LoginModal redirectTo={CUSTOMER_ACCOUNT_LINKS.root()} />
            <RegistrationModal />
            <ForgotPasswordModal />
          </Suspense>
          <Toaster richColors position="top-right" />
        </div>
      </WebsiteThemeContext.Provider>
    </LocationsContext.Provider>
  );
};

export default WebsiteLayout;
