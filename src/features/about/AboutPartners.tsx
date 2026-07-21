import { useTranslations } from "next-intl";

export const AboutPartners = () => {
  const t = useTranslations();
  const rawNetworks = t.raw("about.partnersNetworks");
  const rawCenters = t.raw("about.partnersCenters");
  const partnerNetworks = Array.isArray(rawNetworks)
    ? (rawNetworks as string[])
    : [];
  const partnerCenters = Array.isArray(rawCenters)
    ? (rawCenters as string[])
    : [];

  return (
    <div className="mb-11 grid max-w-[820px] grid-cols-2 gap-4 max-[680px]:grid-cols-1">
      <div className="rounded-[16px] border border-ws-line bg-ws-card px-6 py-[22px]">
        <div className="mb-[14px] text-ws-2xs font-semibold uppercase tracking-[0.14em] text-ws-ember-bright">
          {t("about.partnersNetworksTitle")}
        </div>
        <ul className="flex flex-wrap gap-2">
          {partnerNetworks.map((name) => (
            <li key={name}>
              <span className="inline-flex items-center rounded-full border border-ws-line bg-white/[0.02] px-[13px] py-[7px] text-ws-sm font-medium text-ws-ink">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[16px] border border-ws-line bg-ws-card px-6 py-[22px]">
        <div className="mb-[14px] text-ws-2xs font-semibold uppercase tracking-[0.14em] text-ws-ember-bright">
          {t("about.partnersCentersTitle")}
        </div>
        <ul className="flex flex-wrap gap-2">
          {partnerCenters.map((name) => (
            <li key={name}>
              <span className="inline-flex items-center rounded-full border border-ws-line bg-white/[0.02] px-[13px] py-[7px] text-ws-sm font-medium text-ws-ink">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
