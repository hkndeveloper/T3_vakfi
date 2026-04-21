import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  ClipboardCheck, 
  Bell,
} from "lucide-react";

const navItems = [
  { href: "/uye", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/uye/profilim", label: "Profilim", icon: "User" },
  { href: "/uye/etkinliklerim", label: "Etkinliklerim", icon: "Calendar", requiredPermission: "event.view" },
  { href: "/uye/katilim-durumlarim", label: "Katılım Durumlarım", icon: "ClipboardCheck", requiredPermission: "attendance.view" },
  { href: "/uye/duyurular", label: "Duyurular", icon: "Megaphone", requiredPermission: "announcement.view" },
  { href: "/bildirimler", label: "Bildirimlerim", icon: "Bell" },
];

export default async function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requirePermission("member.view");

  const unreadNotifications = await prisma.notification.count({ 
    where: { userId: session.user.id, isRead: false } 
  });

  // Filter items based on role-based permissions
  const filteredNavItems = navItems.map((item) => {
    let badge = undefined;
    if (item.href === "/bildirimler") badge = unreadNotifications;
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
          title="Üye Paneli" 
          subtitle="Topluluk Üyesi" 
        />
        
        <main className="flex-1 min-w-0 p-6 pt-28 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
