"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { type Location } from "@/entities/location/types";
import { ReviewBranchNote } from "@/features/website/pages/reviews/ReviewBranchNote";
import { ReviewBranchTabs } from "@/features/website/pages/reviews/ReviewBranchTabs";
import { ReviewCard } from "@/features/website/pages/reviews/ReviewCard";
import { ReviewsAside } from "@/features/website/pages/reviews/ReviewsAside";
import { type Review } from "@/features/website/types";
import { useLocalize } from "@/shared/hooks/useLocalize";

const REVIEWS_WALL_PANEL_ID = "reviews-wall-panel";

type LocationReviews = {
  locationId: number;
  reviews: Review[];
};

interface ReviewsContentProps {
  locations: Location[];
  allReviews: LocationReviews[];
}

export const ReviewsContent = ({
  locations,
  allReviews,
}: ReviewsContentProps) => {
  const t = useTranslations();
  const localize = useLocalize();
  const [activeLocationId, setActiveLocationId] = useState(locations[0]?.id);

  if (locations.length === 0) {
    return null;
  }

  const activeLocation =
    locations.find((location) => location.id === activeLocationId) ??
    locations[0];
  const activeReviews =
    allReviews.find((entry) => entry.locationId === activeLocation.id)
      ?.reviews ?? [];
  const reviewCounts = new Map(
    allReviews.map((entry) => [entry.locationId, entry.reviews.length]),
  );
  const activeAddress = localize(
    activeLocation.addressRu,
    activeLocation.addressUa,
  );

  return (
    <div className="ws-rv3">
      <ReviewsAside activeLocation={activeLocation} reviews={activeReviews} />
      <div className="min-w-0">
        <ReviewBranchTabs
          locations={locations}
          reviewCounts={reviewCounts}
          activeLocationId={activeLocation.id}
          panelId={REVIEWS_WALL_PANEL_ID}
          onSelect={setActiveLocationId}
        />
        <ReviewBranchNote address={activeAddress} />
        <div
          id={REVIEWS_WALL_PANEL_ID}
          role="tabpanel"
          aria-labelledby={`review-tab-${activeLocation.id}`}
          tabIndex={0}
          className="ws-rv3-wall"
        >
          {activeReviews.length > 0 ? (
            activeReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <p className="text-ws-sm text-ws-ink-mute">{t("reviews.empty")}</p>
          )}
        </div>
      </div>
    </div>
  );
};
