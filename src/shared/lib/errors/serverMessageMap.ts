import { t } from "@/shared/lib/i18n/t";

export function getSharedServerMessageMap(): Record<string, string> {
  return {
    "The name has already been taken.": t("errors.name_taken"),
    "The verification code is incorrect or has expired.": t(
      "errors.code_invalid_or_expired",
    ),
    "Too Many Attempts.": t("errors.too_many_attempts"),
    "This phone number is already registered. Please log in instead.": t(
      "errors.phone_already_registered",
    ),
    "The phone must be a valid phone number in format +380XXXXXXXXX.": t(
      "validation.phone_invalid",
    ),
    "The phone must belong to a supported Ukrainian mobile operator.": t(
      "validation.phone_operator_invalid",
    ),
  };
}
