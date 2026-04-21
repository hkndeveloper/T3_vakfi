import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NotificationsView } from "@/components/notifications/NotificationsView";

async function markAsReadAction(formData: FormData) {
  "use server";
  const session = await requirePermission("member.view");
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { isRead: true },
  });

  revalidatePath("/uye/bildirimler");
}

export default async function MemberNotificationsPage() {
  const session = await requirePermission("member.view");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationsView 
      notifications={notifications} 
      unreadCount={unreadCount} 
      markAsReadAction={markAsReadAction} 
    />
  );
}
