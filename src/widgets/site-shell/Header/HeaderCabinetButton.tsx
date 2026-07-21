import { User } from "lucide-react";
import { useTranslations } from "next-intl";

import { useModalParam } from "@/shared/hooks/useModalParam";
import { LOGIN_MODAL_VALUE, MODAL_PARAM } from "@/shared/lib/modalParams";
import { cn } from "@/shared/lib/utils";

interface HeaderCabinetButtonProps {
  className?: string;
}

export const HeaderCabinetButton = ({
  className,
}: HeaderCabinetButtonProps) => {
  const t = useTranslations();
  const { set: openModal } = useModalParam(MODAL_PARAM);

  return (
    <button
      type="button"
      onClick={() => openModal(LOGIN_MODAL_VALUE)}
      className={cn(
        "ws-btn-cream inline-flex shrink-0 items-center justify-center gap-2.5",
        className,
      )}
    >
      <User className="size-3.5 shrink-0" />
      <span className="whitespace-nowrap">{t("nav.cabinet")}</span>
    </button>
  );
};
