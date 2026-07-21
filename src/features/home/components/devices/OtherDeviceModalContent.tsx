import { useTranslations } from "next-intl";

import { DEVICE_ICONS } from "@/shared/components/ui/DeviceIcons";
import { ContactModalContent } from "@/widgets/site-shell/ContactModalContent";

import { type DeviceId } from "./DevicesData";

interface OtherDeviceModalContentProps {
  deviceId: DeviceId;
}

export const OtherDeviceModalContent = ({
  deviceId,
}: OtherDeviceModalContentProps) => {
  const t = useTranslations();

  return (
    <ContactModalContent
      icon={DEVICE_ICONS[deviceId]}
      eyebrow={t("priceModal.eyebrow")}
      title={t(`devices.items.${deviceId}.name`)}
      text={t("priceModal.otherText")}
    />
  );
};
