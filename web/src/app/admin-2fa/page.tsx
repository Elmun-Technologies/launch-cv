import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminState } from "@/lib/admin-guard";
import { siteFontVars } from "@/lib/site-fonts";
import { SiteLogo } from "@/components/site/brand";
import { TwoFactorForm } from "./two-factor-form";

export const metadata: Metadata = {
  title: "Admin sign-in check",
  robots: { index: false, follow: false },
};

export default async function AdminTwoFactorPage() {
  const s = await adminState();
  if (s.state === "anonymous") redirect("/login?next=/admin-2fa");
  if (s.state === "not_staff" || s.state === "ip_blocked") redirect("/admin-panel/access-denied");
  if (s.state === "ok" || s.state === "forbidden") redirect("/admin-panel");
  return (
    <div className={`lc-site ${siteFontVars} flex min-h-[100dvh] flex-col bg-[#eeecf4] px-4 py-6 text-[#121226] sm:px-8`}>
      <header className="flex items-center gap-2.5">
        <SiteLogo size={32} />
        <span className="rounded-full bg-[#ff7a33] px-2.5 py-[5px] text-[12px] font-bold leading-none text-[#111118]">Admin</span>
      </header>
      <main className="flex flex-1 items-center justify-center py-10">
        <TwoFactorForm mode={s.state === "setup_2fa" ? "setup" : "verify"} email={s.staff.email} />
      </main>
    </div>
  );
}
