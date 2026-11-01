import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminUsersPage } from "./list-client";

export default async function Page() {
  if (!(await requireAdmin("users"))) redirect("/admin-panel/access-denied");
  return <AdminUsersPage />;
}
