import { requireSuperAdmin } from "@/lib/permissions";
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
  { href: "/admin/universiteler", label: "Üniversiteler", icon: "School" },
  { href: "/admin/topluluklar", label: "Topluluklar", icon: "Building2" },
  { href: "/admin/etkinlik-onaylari", label: "Etkinlik Onayları", icon: "ClipboardCheck" },
  { href: "/admin/katilim-izleme", label: "Katılım İzleme", icon: "Navigation" },
  { href: "/admin/rapor-onaylari", label: "Rapor Onayları", icon: "FileCheck2" },
  { href: "/admin/medya-belgeler", label: "Medya & Belgeler", icon: "FolderOpen" },
  { href: "/admin/sistem-loglari", label: "Sistem Logları", icon: "History" },
  { href: "/admin/duyurular", label: "Duyurular", icon: "Bell" },
  { href: "/admin/istatistikler", label: "İstatistikler", icon: "LineChart" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "Users" },
  { href: "/admin/roller", label: "Rol & Yetki", icon: "ShieldCheck" },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: "Settings" },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireSuperAdmin();

  return (
    <div className="min-h-screen">
      <div className="flex w-full gap-4">
        <Sidebar 
          items={navItems} 
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
