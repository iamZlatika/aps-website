import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { LANG_STORAGE_KEY } from "@/shared/lib/constants";
import { USER_LANGUAGES, type UserLanguage } from "@/shared/types";

// Locale has no URL segment (matches the old SPA's runtime-toggle UX) —
// it's read from a cookie so both the server render and the client agree
// on the first paint. Website's own default is uk, not the app-wide ru.
const DEFAULT_LOCALE: UserLanguage = USER_LANGUAGES.UK;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const saved = cookieStore.get(LANG_STORAGE_KEY)?.value;
  const locale: UserLanguage =
    saved === USER_LANGUAGES.RU || saved === USER_LANGUAGES.UK
      ? saved
      : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
