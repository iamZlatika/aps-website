import { z } from "zod";

import { t } from "@/shared/lib/i18n/t";
import { phoneField } from "@/shared/lib/zod-helpers";

export const createAddPhoneSchema = () =>
  z.object({
    phone: phoneField(),
  });

export type AddPhoneFormValues = z.infer<
  ReturnType<typeof createAddPhoneSchema>
>;

export const createVerifyPhoneCodeSchema = () =>
  z.object({
    code: z.string().regex(/^\d{4}$/, {
      message: t("validation.code_invalid"),
    }),
  });

export type VerifyPhoneCodeFormValues = z.infer<
  ReturnType<typeof createVerifyPhoneCodeSchema>
>;
