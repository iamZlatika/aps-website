import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { CUSTOMER_AUTH_COOKIE_NAME } from "@/features/auth/lib/authService";
import { LOGIN_MODAL_VALUE, MODAL_PARAM } from "@/shared/lib/modalParams";
import { WEBSITE_LINKS } from "@/widgets/site-shell/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface CabinetLayoutProps {
  children: ReactNode;
}

export default async function CabinetLayout({ children }: CabinetLayoutProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect(`${WEBSITE_LINKS.home}?${MODAL_PARAM}=${LOGIN_MODAL_VALUE}`);
  }

  return children;
}
