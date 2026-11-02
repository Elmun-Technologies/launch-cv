import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminUsersPage } from "./list-client";

export default async function Page() {
  const admin = await requireAdmin("users");
  if (!admin) redirect("/admin-panel/access-denied");
  return <AdminUsersPage email={admin.email} />;
}
