import { useTranslations } from "next-intl";

import { ContactModalContent } from "@/features/website/components/ContactModalContent";
import { DEVICE_ICONS } from "@/features/website/components/DeviceIcons";

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
