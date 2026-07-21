import { stripNonDigits } from "@/shared/lib/utils";

export function formatPhone(raw: string): string {
  const digits = stripNonDigits(raw);
  if (digits.length === 12 && digits.startsWith("380")) {
    return `+380 (${digits.slice(3, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
  }
  return raw;
}

export const MOBILE_OPERATOR_CODES = [
  "50",
  "66",
  "75",
  "95",
  "99", // Vodafone
  "39",
  "67",
  "68",
  "77",
  "96",
  "97",
  "98", // Київстар
  "63",
  "73",
  "93", // lifecell
] as const;

export function isSupportedMobileOperator(phone: string): boolean {
  const code = phone.slice(4, 6);
  return (MOBILE_OPERATOR_CODES as readonly string[]).includes(code);
}

export function extractLocalPhoneDigits(chars: string): string {
  if (chars.length <= 1) return chars;

  const digits = chars.replace(/\D/g, "");
  if (digits.startsWith("380")) return "0" + digits.slice(3);
  if (digits.startsWith("38")) return "0" + digits.slice(2);
  return digits;
}
