import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminState } from "@/lib/admin-guard";
import { TwoFactorForm } from "./two-factor-form";

export const metadata: Metadata = {
  title: "Admin sign-in check",
  robots: { index: false, follow: false },
};

export default async function AdminTwoFactorPage() {
  const s = await adminState();
  if (s.state === "anonymous") redirect("/login?next=/admin-2fa");
  if (s.state === "not_staff") redirect("/admin-panel/access-denied");
  if (s.state === "ok" || s.state === "forbidden") redirect("/admin-panel");
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eeecf4] px-4 py-12 text-[#121226]">
      <TwoFactorForm mode={s.state === "setup_2fa" ? "setup" : "verify"} email={s.staff.email} />
    </main>
  );
}
