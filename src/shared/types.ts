export const USER_STATUSES = {
  ACTIVE: "active",
  BLOCKED: "blocked",
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export const USER_LANGUAGES = {
  UK: "uk",
  RU: "ru",
} as const;

export type UserLanguage = (typeof USER_LANGUAGES)[keyof typeof USER_LANGUAGES];

export const STATUS_COLORS = {
  Red: "red",
  Fuchsia: "fuchsia",
  Pink: "pink",
  Violet: "violet",
  Blue: "blue",
  Sky: "sky",
  Green: "green",
  Yellow: "yellow",
  Orange: "orange",
  Black: "black",
  Gray: "gray",
} as const;

export type StatusColor = (typeof STATUS_COLORS)[keyof typeof STATUS_COLORS];

export const PAYMENTS = {
  PREPAYMENT: "prepayment",
  PAYMENT: "payment",
  REFUND: "refund",
} as const;

export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
} as const;

export type PaymentType = (typeof PAYMENTS)[keyof typeof PAYMENTS];
export type PaymentMethodType =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export const DOCUMENTS_TYPES = ["intake_receipt", "closing_receipt"] as const;
export type DocumentType = (typeof DOCUMENTS_TYPES)[number];

export const WEEK_DAYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];
