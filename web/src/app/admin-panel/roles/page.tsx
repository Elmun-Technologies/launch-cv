import { redirect } from "next/navigation";

/** Roles moved to Admin → Security (team, roles, 2FA). */
export default function AdminRolesPage() {
  redirect("/admin-panel/security");
}
