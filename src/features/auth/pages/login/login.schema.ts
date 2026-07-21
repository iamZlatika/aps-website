import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants";
import { t } from "@/shared/lib/i18n/t";

export const createLoginSchema = () =>
  z.object({
    email: z.string().refine((val) => emailRegex.test(val), {
      message: t("validation.email_invalid"),
    }),
    password: z.string().min(8, { message: t("validation.password_min") }),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
