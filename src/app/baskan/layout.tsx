import { requireCommunityManager } from "@/lib/permissions";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Calendar, 
  ClipboardCheck, 
  FileText, 
  Bell,
  FolderOpen,
  LineChart,
} from "lucide-react";

const navItems = [
  { href: "/baskan", label: "Giriş", icon: "LayoutDashboard" },
  { href: "/baskan/toplulugum", label: "Topluluğum", icon: "Building" },
  { href: "/baskan/uyeler", label: "Üyeler", icon: "Users" },
  { href: "/baskan/etkinlikler", label: "Etkinlikler", icon: "Calendar" },
  { href: "/baskan/katilim", label: "Katılım", icon: "ClipboardCheck" },
  { href: "/baskan/raporlar", label: "Raporlar", icon: "FileText" },
  { href: "/baskan/gorseller-belgeler", label: "Görseller & Belgeler", icon: "FolderOpen" },
  { href: "/baskan/duyurular", label: "Duyurular", icon: "Bell" },
  { href: "/baskan/istatistikler", label: "İstatistikler", icon: "LineChart" },
];

export default async function PresidentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireCommunityManager();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex w-full gap-4">
        <Sidebar 
          items={navItems} 
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
