import { type ComponentType, type SVGProps } from "react";

import { TelegramIcon } from "@/shared/components/icons/TelegramIcon";
import { ViberIcon } from "@/shared/components/icons/ViberIcon";
import { WhatsappIcon } from "@/shared/components/icons/WhatsappIcon";
import { assertNever } from "@/shared/lib/assertNever";
import { stripNonDigits } from "@/shared/lib/utils";

export const MESSENGER_KEYS = {
  TELEGRAM: "telegram",
  VIBER: "viber",
  WHATSAPP: "whatsapp",
} as const;

export type MessengerKey = (typeof MESSENGER_KEYS)[keyof typeof MESSENGER_KEYS];

export type MessengerConfig = {
  key: MessengerKey;
  hoverClass: string;
  colorClass: string;
};

export const MESSENGER_ICONS: Record<
  MessengerKey,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  telegram: TelegramIcon,
  viber: ViberIcon,
  whatsapp: WhatsappIcon,
};

export const MESSENGERS: MessengerConfig[] = [
  {
    key: "telegram",
    hoverClass: "ws-msg-tg",
    colorClass: "ws-msg-tg-color",
  },
  {
    key: "viber",
    hoverClass: "ws-msg-vb",
    colorClass: "ws-msg-vb-color",
  },
  {
    key: "whatsapp",
    hoverClass: "ws-msg-wa",
    colorClass: "ws-msg-wa-color",
  },
];

export function getMessengerHref(key: MessengerKey, phone: string): string {
  const digits = stripNonDigits(phone);
  if (key === "telegram") return `https://telegram.me/+${digits}`;
  if (key === "viber") return `viber://chat?number=%2B${digits}`;
  if (key === "whatsapp") return `https://wa.me/${digits}`;
  return assertNever(key);
}
