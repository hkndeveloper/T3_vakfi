import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/permissions";

export default async function NotificationsPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/giris");

  // Redirect based on role to keep the sidebar context
  const userRoles = session.user.roles || [];
  if (userRoles.includes("super_admin") || userRoles.includes("admin")) {
    redirect("/admin/bildirimler");
  } else if (userRoles.includes("community_manager")) {
    redirect("/baskan/bildirimler");
  } else {
    redirect("/uye/bildirimler");
  }
}
