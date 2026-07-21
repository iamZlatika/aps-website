import { useEffect, useState } from "react";

import { THEME_STORAGE_KEY } from "@/shared/lib/constants";
import { storageGet, storageSet } from "@/shared/lib/storage";
import {
  WEBSITE_THEMES,
  type WebsiteTheme,
  type WebsiteThemeContextValue,
  type WebsiteThemeResolved,
} from "@/widgets/site-shell/websiteTheme";

function readSavedTheme(): WebsiteTheme | null {
  const saved = storageGet(THEME_STORAGE_KEY);
  if (
    saved === WEBSITE_THEMES.LIGHT ||
    saved === WEBSITE_THEMES.DARK ||
    saved === WEBSITE_THEMES.SYSTEM
  )
    return saved;
  return null;
}

function resolveTheme(
  theme: WebsiteTheme,
  systemDark: boolean,
): WebsiteThemeResolved {
  if (theme === WEBSITE_THEMES.SYSTEM) return systemDark ? "dark" : "light";
  return theme;
}

export const useWebsiteThemeManager = (): WebsiteThemeContextValue => {
  // Both start at the same value the server renders (no `window`/
  // `localStorage` there) and get corrected in effects right after mount —
  // reading localStorage in the useState initializer would make the very
  // first client render diverge from the server-rendered HTML.
  const [theme, setThemeState] = useState<WebsiteTheme>(WEBSITE_THEMES.SYSTEM);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const saved = readSavedTheme();
    if (saved) setThemeState(saved);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme = (next: WebsiteTheme) => {
    setThemeState(next);
    storageSet(THEME_STORAGE_KEY, next);
  };

  return { theme, resolvedTheme: resolveTheme(theme, systemDark), setTheme };
};
