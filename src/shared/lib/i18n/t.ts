import Cookies from "js-cookie";

import ru from "@/messages/ru.json";
import uk from "@/messages/uk.json";
import { LANG_STORAGE_KEY } from "@/shared/lib/constants";
import { USER_LANGUAGES } from "@/shared/types";

const DICTS = { ru, uk } as const;

function getValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// Client-side-only translator for non-component code (zod schemas, error
// mapping, toast copy) that can't call the useTranslations() hook. Reads
// the same locale cookie next-intl's server config uses, so both agree.
export function t(key: string): string {
  const locale =
    Cookies.get(LANG_STORAGE_KEY) === USER_LANGUAGES.RU ? "ru" : "uk";
  const value = getValue(DICTS[locale], key);
  return typeof value === "string" ? value : key;
}
