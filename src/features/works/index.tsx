import { getTranslations } from "next-intl/server";

import { type Work } from "@/entities/work/types";
import { WorkCard } from "@/widgets/work-card";

interface WorksPageProps {
  works: Work[];
}

const WorksPage = async ({ works }: WorksPageProps) => {
  const t = await getTranslations();

  return (
    <section
      className="ws-section ws-works-section"
      aria-labelledby="works-heading"
    >
      <div className="ws-wrap">
        <header className="mb-5">
          <p className="ws-section-eyebrow">{t("works.eyebrow")}</p>
          <h1 id="works-heading" className="ws-section-title">
            {t("works.heading")} <strong>{t("works.headingBold")}</strong>
          </h1>
        </header>

        <div className="ws-works-list">
          {works.map((work, i) => (
            <WorkCard key={work.id} work={work} isReverse={i % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorksPage;
