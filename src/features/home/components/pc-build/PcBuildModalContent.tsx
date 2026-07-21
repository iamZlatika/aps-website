import { useTranslations } from "next-intl";

import { DEVICE_ICONS } from "@/shared/components/ui/DeviceIcons";
import { ContactModalContent } from "@/widgets/site-shell/ContactModalContent";

export const PcBuildModalContent = () => {
  const t = useTranslations();

  return (
    <ContactModalContent
      icon={DEVICE_ICONS.computers}
      eyebrow={t("pcBuild.eyebrow")}
      title={t("pcBuild.modalTitle")}
      text={t("pcBuild.modalText")}
    />
  );
};
