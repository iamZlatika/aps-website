import { z } from "zod";

import { phoneRegex } from "@/shared/lib/constants";
import { t } from "@/shared/lib/i18n/t";
import { isSupportedMobileOperator } from "@/shared/lib/phone";

export const zodEnumFromConst = <T extends Record<string, string>>(obj: T) =>
  z.enum(Object.values(obj) as [T[keyof T], ...T[keyof T][]]);

function validatePhoneValue(
  val: string,
  ctx: z.RefinementCtx,
  message?: string,
) {
  if (!phoneRegex.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: message ?? t("validation.phone_invalid"),
    });
    return;
  }
  if (!isSupportedMobileOperator(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t("validation.phone_operator_invalid"),
    });
  }
}

export function phoneField(message?: string) {
  return z
    .string()
    .superRefine((val, ctx) => validatePhoneValue(val, ctx, message));
}

export function optionalPhoneField(message?: string) {
  return z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .superRefine((val, ctx) => {
      if (val === undefined) return;
      validatePhoneValue(val, ctx, message);
    });
}
