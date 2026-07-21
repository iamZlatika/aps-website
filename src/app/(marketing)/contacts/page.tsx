import type { Metadata } from "next";

import { ContactsPage } from "@/features/contacts";
import { buildPageMetadata } from "@/shared/lib/seo";
import { WEBSITE_ROUTES } from "@/widgets/site-shell/routes";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contacts", WEBSITE_ROUTES.contacts);
}

export default function Page() {
  return <ContactsPage />;
}
