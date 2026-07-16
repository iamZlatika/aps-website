import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants";
import { t } from "@/shared/lib/i18n/t";
import { phoneField } from "@/shared/lib/zod-helpers";

export const createRegistrationSchema = () =>
  z
    .object({
      name: z.string().min(2, { message: t("validation.field_required") }),
      email: z.string().refine((val) => emailRegex.test(val), {
        message: t("validation.email_invalid"),
      }),
      phone: phoneField(),
      password: z.string().min(8, { message: t("validation.password_min") }),
      passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: t("validation.passwords_dont_match"),
      path: ["passwordConfirmation"],
    });

export type RegistrationFormValues = z.infer<
  ReturnType<typeof createRegistrationSchema>
>;
