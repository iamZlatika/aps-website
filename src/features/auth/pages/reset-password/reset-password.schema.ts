import { z } from "zod";

import { t } from "@/shared/lib/i18n/t";

export const createResetPasswordSchema = () =>
  z
    .object({
      password: z
        .string()
        .min(8, { message: t("validation.password_min") })
        .max(255, { message: t("validation.password_max") }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwords_dont_match"),
      path: ["confirmPassword"],
    });

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
