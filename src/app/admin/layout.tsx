import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { Sidebar } from "@/components/layout/Sidebar";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/universiteler", label: "Üniversiteler", icon: "School", requiredPermission: "user.view" },
  { href: "/admin/topluluklar", label: "Topluluklar", icon: "Building2", requiredPermission: "user.view" },
  { href: "/admin/etkinlik-onaylari", label: "Etkinlik Onayları", icon: "ClipboardCheck", requiredPermission: "event.approve" },
  { href: "/admin/katilim-izleme", label: "Katılım İzleme", icon: "Navigation", requiredPermission: "attendance.manage" },
  { href: "/admin/rapor-onaylari", label: "Rapor Onayları", icon: "FileCheck2", requiredPermission: "report.approve" },
  { href: "/admin/medya-belgeler", label: "Medya & Belgeler", icon: "FolderOpen", requiredPermission: "media.view" },
  { href: "/admin/sistem-loglari", label: "Sistem Logları", icon: "History", requiredPermission: "admin.view" },
  { href: "/admin/duyurular", label: "Duyurular", icon: "Megaphone", requiredPermission: "announcement.publish" },
  { href: "/admin/bildirimler", label: "Bildirimlerim", icon: "Bell" },
  { href: "/admin/istatistikler", label: "İstatistikler", icon: "LineChart", requiredPermission: "stats.view" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "Users", requiredPermission: "user.view" },
  { href: "/admin/roller", label: "Rol & Yetki", icon: "ShieldCheck", requiredPermission: "role.assign" },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: "Settings", requiredPermission: "admin.view" },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requirePermission("admin.view");

  const [pendingEvents, pendingReports, unreadNotifications] = await Promise.all([
    prisma.event.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.report.count({ where: { status: "SUBMITTED" } }),
    prisma.notification.count({ where: { userId: session.user.id, isRead: false } }),
  ]);

  // Filter items based on role-based permissions
  const filteredNavItems = navItems.map((item) => {
    let badge = undefined;
    if (item.href === "/admin/etkinlik-onaylari") badge = pendingEvents;
    if (item.href === "/admin/rapor-onaylari") badge = pendingReports;
    if (item.href === "/admin/bildirimler") badge = unreadNotifications;
    return { ...item, badge };
  }).filter((item) => {
    if (!item.requiredPermission) return true;
    return session.user.permissions.includes(item.requiredPermission);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col lg:flex-row w-full gap-0 lg:gap-4">
        <Sidebar 
          items={filteredNavItems} 
          title="Admin Panel" 
          subtitle="Sistem Merkezi" 
        />
        
        <main className="flex-1 min-w-0 p-6 pt-28 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
