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
  { href: "/uye/etkinliklerim", label: "Etkinliklerim", icon: "Calendar", requiredPermission: "member.view" },
  { href: "/uye/katilim-durumlarim", label: "Katılım Durumlarım", icon: "ClipboardCheck", requiredPermission: "member.view" },
  { href: "/uye/duyurular", label: "Duyurular", icon: "Bell" },
];

export default async function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requirePermission("member.view");

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
