import type { ReactNode } from "react";

import { WebsiteLayout } from "@/features/website/components/WebsiteLayout";

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return <WebsiteLayout>{children}</WebsiteLayout>;
}
