"use client";

import { useEffect, useRef } from "react";

import { type PriceGroup } from "@/features/price-list/service";
import { usePricePageNav } from "@/features/price-list/usePricePageNav";

import { PriceNavBar } from "./components/PriceNavBar";
import { PricePageCta } from "./components/PricePageCta";
import { PriceSectionCard } from "./components/PriceSectionCard";

interface PriceListContentProps {
  groups: PriceGroup[];
}

export const PriceListContent = ({ groups }: PriceListContentProps) => {
  const { activeKey, registerSection, scrollTo } = usePricePageNav(
    groups[0]?.category.key ?? "",
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const navEl = navRef.current;
    const containerEl = containerRef.current;
    if (!navEl || !containerEl) return;
    const observer = new ResizeObserver(() => {
      containerEl.style.setProperty(
        "--ws-price-nav-height",
        `${navEl.offsetHeight}px`,
      );
    });
    observer.observe(navEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="lg:grid lg:grid-cols-[248px_1fr] lg:items-start lg:gap-12"
    >
      <PriceNavBar
        groups={groups}
        activeKey={activeKey}
        onSelect={scrollTo}
        navRef={navRef}
      />
      <div>
        <div className="flex flex-col gap-[18px]">
          {groups.map((g) => (
            <PriceSectionCard
              key={g.category.key}
              group={g}
              sectionRef={registerSection(g.category.key)}
            />
          ))}
        </div>
        <PricePageCta />
      </div>
    </div>
  );
};
