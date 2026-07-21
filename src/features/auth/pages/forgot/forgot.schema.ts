import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants";
import { t } from "@/shared/lib/i18n/t";

export const createForgotSchema = () =>
  z.object({
    email: z.string().refine((val) => emailRegex.test(val), {
      message: t("validation.email_invalid"),
    }),
  });

export type ForgotFormValues = z.infer<ReturnType<typeof createForgotSchema>>;
