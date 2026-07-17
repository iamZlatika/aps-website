import type { Metadata } from "next";

import { TrackPage } from "@/features/website/pages/track";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TrackPage />;
}
