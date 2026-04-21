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
  { href: "/uye", label: "Giriş", icon: "LayoutDashboard" },
  { href: "/uye/profilim", label: "Profilim", icon: "User" },
  { href: "/uye/etkinliklerim", label: "Etkinliklerim", icon: "Calendar" },
  { href: "/uye/katilim-durumlarim", label: "Katılım Durumlarım", icon: "ClipboardCheck" },
  { href: "/uye/duyurular", label: "Duyurular", icon: "Bell" },
];

export default async function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requirePermission("member.view");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex w-full gap-4">
        <Sidebar 
          items={navItems} 
          title="Üye Paneli" 
          subtitle="Topluluk Üyesi" 
        />
        
        <main className="flex-1 min-w-0 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
