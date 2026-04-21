import { requirePermission } from "@/lib/permissions";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  LayoutDashboard, 
  School, 
  Building2, 
  ClipboardCheck, 
  Navigation, 
  FileCheck2, 
  Bell, 
  LineChart, 
  Users, 
  ShieldCheck,
  History,
  FolderOpen,
  Settings
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/universiteler", label: "Üniversiteler", icon: "School", requiredPermission: "user.view" },
  { href: "/admin/topluluklar", label: "Topluluklar", icon: "Building2", requiredPermission: "user.view" },
  { href: "/admin/etkinlik-onaylari", label: "Etkinlik Onayları", icon: "ClipboardCheck", requiredPermission: "event.approve" },
  { href: "/admin/katilim-izleme", label: "Katılım İzleme", icon: "Navigation", requiredPermission: "attendance.manage" },
  { href: "/admin/rapor-onaylari", label: "Rapor Onayları", icon: "FileCheck2", requiredPermission: "report.approve" },
  { href: "/admin/medya-belgeler", label: "Medya & Belgeler", icon: "FolderOpen", requiredPermission: "media.view" },
  { href: "/admin/sistem-loglari", label: "Sistem Logları", icon: "History" },
  { href: "/admin/duyurular", label: "Duyurular", icon: "Bell", requiredPermission: "announcement.publish" },
  { href: "/admin/istatistikler", label: "İstatistikler", icon: "LineChart", requiredPermission: "stats.view" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "Users", requiredPermission: "user.view" },
  { href: "/admin/roller", label: "Rol & Yetki", icon: "ShieldCheck", requiredPermission: "role.assign" },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: "Settings" },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requirePermission("admin.view");

  // Filter items based on role-based permissions
  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiredPermission) return true;
    return session.user.permissions.includes(item.requiredPermission);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex w-full gap-4">
        <Sidebar 
          items={filteredNavItems} 
          title="Admin Panel" 
          subtitle="Sistem Merkezi" 
        />
        
        <main className="flex-1 min-w-0 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
