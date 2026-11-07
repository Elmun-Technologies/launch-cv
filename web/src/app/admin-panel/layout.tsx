import type { Metadata } from "next";
import type { ReactNode } from "react";
import { adminState } from "@/lib/admin-guard";
import { ReauthProvider } from "@/components/admin/reauth";
import { getSettings } from "@/lib/app-settings";

// Admin area — never index or follow. robots.txt disallows crawling, but a
// noindex tag is what actually keeps these URLs out of search results if they
// are ever discovered via an external link.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const s = await adminState();
  const staff = "staff" in s ? s.staff : null;
  const { security } = await getSettings();
  return (
    <ReauthProvider hasPassword={staff?.hasPassword ?? true} hasTotp={staff?.totpEnabled ?? false} emailOwnerOnKeyChange={security.emailOwnerOnKeyChange}>
      {children}
    </ReauthProvider>
  );
}
