import { useTranslations } from "next-intl";
import { useState } from "react";

import { type Work } from "@/entities/work/types";
import { useLocalize } from "@/shared/hooks/useLocalize";
import { type LightboxImage } from "@/widgets/lightbox/utils";
import {
  buildLightboxImages,
  buildWorkDeviceLabel,
  type PhotoLabels,
} from "@/widgets/work-card/photoGallery";

type WorkGallery = {
  allImages: LightboxImage[];
  lightboxIndex: number | null;
  openLightbox: (url: string) => void;
  closeLightbox: () => void;
};

export const useWorkGallery = (work: Work): WorkGallery => {
  const t = useTranslations();
  const localize = useLocalize();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const labels: PhotoLabels = {
    before: t("works.tagBefore"),
    after: t("works.tagAfter"),
    upgrade: t("works.tagUpgrade"),
  };

  const deviceLabel = buildWorkDeviceLabel(
    work,
    localize(work.type.nameRu, work.type.nameUk),
  );
  const allImages = buildLightboxImages(work, labels, deviceLabel);

  const openLightbox = (url: string): void => {
    const index = allImages.findIndex((img) => img.url === url);
    setLightboxIndex(index >= 0 ? index : 0);
  };

  const closeLightbox = (): void => setLightboxIndex(null);

  return { allImages, lightboxIndex, openLightbox, closeLightbox };
};
