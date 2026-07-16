import { useLocale } from "next-intl";

type LocalizedItem = { nameRu: string; nameUa: string };

export function useLocalizedName() {
  const locale = useLocale();
  const isUk = locale === "uk";
  return (item: LocalizedItem) => (isUk ? item.nameUa : item.nameRu);
}
