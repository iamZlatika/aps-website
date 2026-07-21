import { z } from "zod";

import { t } from "@/shared/lib/i18n/t";

export const createTrackOrderSchema = () =>
  z.object({
    orderNumber: z
      .string()
      .regex(/^APS-\d{4}-\d{6}$/, t("trackModal.invalidFormat")),
  });

export type TrackOrderValues = z.infer<
  ReturnType<typeof createTrackOrderSchema>
>;
