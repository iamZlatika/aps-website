import { useLocale } from "next-intl";

export function useLocalize(): (ru: string, ua: string) => string {
  const locale = useLocale();
  const isUk = locale === "uk";
  return (ru, ua) => (isUk ? ua : ru);
}
