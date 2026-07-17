import type { Metadata } from "next";

import { buildPageMetadata } from "@/features/website/lib/seo";
import { ContactsPage } from "@/features/website/pages/contacts";
import { WEBSITE_ROUTES } from "@/features/website/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contacts", WEBSITE_ROUTES.contacts);
}

export default function Page() {
  return <ContactsPage />;
}
