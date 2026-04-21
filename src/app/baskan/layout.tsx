import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { Sidebar } from "@/components/layout/Sidebar";

const navItems = [
  { href: "/baskan", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/baskan/toplulugum", label: "Topluluğum", icon: "Building", requiredPermission: "member.view" },
  { href: "/baskan/uyeler", label: "Üyeler", icon: "Users", requiredPermission: "member.view" },
  { href: "/baskan/etkinlikler", label: "Etkinlikler", icon: "Calendar", requiredPermission: "event.create" },
  { href: "/baskan/katilim", label: "Katılım", icon: "ClipboardCheck", requiredPermission: "attendance.manage" },
  { href: "/baskan/raporlar", label: "Raporlar", icon: "FileText", requiredPermission: "report.create" },
  { href: "/baskan/gorseller-belgeler", label: "Görseller & Belgeler", icon: "FolderOpen", requiredPermission: "media.upload" },
  { href: "/baskan/duyurular", label: "Duyurular", icon: "Megaphone", requiredPermission: "announcement.view" },
  { href: "/bildirimler", label: "Bildirimlerim", icon: "Bell" },
  { href: "/baskan/istatistikler", label: "İstatistikler", icon: "LineChart", requiredPermission: "stats.view" },
];

export default async function PresidentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const [revisionEvents, revisionReports, unreadNotifications] = await Promise.all([
    prisma.event.count({ where: { communityId, status: "DRAFT", reviewNote: { not: null } } }),
    prisma.report.count({ where: { communityId, status: "REVISION_REQUESTED" } }),
    prisma.notification.count({ where: { userId: session.user.id, isRead: false } }),
  ]);

  // Filter items based on role-based permissions
  const filteredNavItems = navItems.map((item) => {
    let badge = undefined;
    if (item.href === "/baskan/etkinlikler") badge = revisionEvents;
    if (item.href === "/baskan/raporlar") badge = revisionReports;
    if (item.href === "/bildirimler") badge = unreadNotifications;
    return { ...item, badge };
  }).filter((item) => {
    if (!item.requiredPermission) return true;
    return session.user.permissions.includes(item.requiredPermission);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex w-full gap-4">
        <Sidebar 
          items={filteredNavItems} 
          title="Başkan Paneli" 
          subtitle="Topluluk Yönetimi" 
        />
        
        <main className="flex-1 min-w-0 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
