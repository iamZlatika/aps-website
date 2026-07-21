import { Suspense } from "react";

import { useCustomerAuth } from "@/features/auth/hooks/useCustomerAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { HeaderCabinetButton } from "@/widgets/site-shell/Header/HeaderCabinetButton";
import { HeaderUserBadge } from "@/widgets/site-shell/Header/HeaderUserBadge";
import { WEBSITE_LINKS } from "@/widgets/site-shell/navigation";

interface HeaderAuthAreaProps {
  buttonClassName?: string;
  showUserName?: boolean;
}

interface HeaderLoggedInAreaProps {
  showUserName?: boolean;
}

const HeaderLoggedInArea = ({ showUserName }: HeaderLoggedInAreaProps) => {
  const { logout, isLoggingOut } = useLogout(WEBSITE_LINKS.home);

  return (
    <Suspense
      fallback={
        <div
          className="size-[42px] animate-pulse rounded-full bg-ws-line"
          aria-hidden="true"
        />
      }
    >
      <HeaderUserBadge
        logout={logout}
        isLoggingOut={isLoggingOut}
        showUserName={showUserName}
      />
    </Suspense>
  );
};

export const HeaderAuthArea = ({
  buttonClassName,
  showUserName,
}: HeaderAuthAreaProps) => {
  const { isAuthenticated } = useCustomerAuth();

  if (!isAuthenticated) {
    return <HeaderCabinetButton className={buttonClassName} />;
  }

  return <HeaderLoggedInArea showUserName={showUserName} />;
};
