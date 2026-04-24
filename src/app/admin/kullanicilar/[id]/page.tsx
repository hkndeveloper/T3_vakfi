import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { notFound } from "next/navigation";
import { UserEditForm } from "@/components/forms/UserEditForm";
import { UserActionButtons } from "@/components/admin/UserActionButtons";
import { 
  UserCircle2, 
  Mail, 
  ShieldCheck, 
  ArrowLeft,
  Zap,
  Fingerprint,
  Building2,
  Calendar,
  Lock,
  ChevronRight,
  ShieldAlert,
  History
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  await requirePermission("user.view");
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      userRoles: {
        include: {
          role: true,
          community: true
        }
      },
      memberships: {
        include: {
          community: true
        }
      },
      _count: {
        select: { logs: true, createdEvents: true }
      }
    }
  });

  if (!user) notFound();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Navigation */}
      <div className="flex items-center gap-6 group">
        <Link 
          href="/admin/kullanicilar"
          className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-950 hover:bg-slate-950 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KULLANICI YÖNETİMİ / PROFİL</p>
          <h2 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic leading-none mt-1">{user.name}</h2>
        </div>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-10 md:p-14 border border-slate-200 group">
          <div className="relative z-10 flex flex-wrap items-center gap-10">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-950 text-4xl md:text-5xl font-black shadow-xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
               {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] mb-4 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-corporate-orange" /> DOĞRULANMIŞ PROFİL
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-tight uppercase mb-6 text-slate-950">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                 <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm text-slate-600">
                    <Mail className="h-4 w-4 text-corporate-blue" /> {user.email}
                 </div>
                 <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-corporate-orange" /> ÜYELİK: {new Date(user.createdAt).getFullYear()}
                 </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-corporate-blue/5 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
             <Fingerprint className="h-32 w-32" />
          </div>
        </div>

        <div className="t3-panel p-10 flex flex-col justify-center relative overflow-hidden group bg-slate-50/50">
           <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue mb-6 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                 <History className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-950 tracking-tighter italic uppercase">ETKİLEŞİM</h3>
              <p className="t3-label mt-1">Sistem Hareket Sayısı</p>
              <div className="mt-8">
                 <span className="text-6xl font-black text-slate-950 tracking-tighter italic leading-none">{user._count.logs}</span>
                 <div className="flex items-center gap-2 mt-4">
                    <div className="h-1.5 w-12 rounded-full bg-corporate-orange/20" />
                    <p className="text-[10px] text-corporate-blue font-black uppercase tracking-widest">SİSTEM LOG KAYDI</p>
                 </div>
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-corporate-blue/5 blur-3xl pointer-events-none" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Profile Settings */}
        <div className="lg:col-span-1 space-y-10">
           <div className="t3-panel p-10 bg-slate-50/30">
              <UserEditForm user={user} />
           </div>
           
           <div className="t3-panel p-10 bg-slate-950 text-white relative overflow-hidden group border-white/10">
              <h4 className="mb-8 border-l-4 border-corporate-orange pl-5 text-[11px] font-black uppercase tracking-widest italic text-white">Güvenlik ve Erişim</h4>
              
              <div className="relative z-10">
                  <UserActionButtons userId={user.id} isActive={user.isActive} />
               </div>

              <ShieldAlert className="absolute -right-6 -bottom-6 h-32 w-32 opacity-[0.05] -rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
           </div>
        </div>

        {/* Roles & Memberships */}
        <div className="lg:col-span-2 space-y-10">
           <div className="flex flex-wrap items-center justify-between gap-6 px-4">
              <div>
                 <h3 className="t3-heading text-3xl text-slate-950 tracking-tighter italic uppercase">Kurumsal Yetkiler</h3>
                 <p className="t3-label">KULLANICI ROL VE ÜYELİK TANIMLARI</p>
              </div>
              <div className="h-1.5 w-24 rounded-full bg-corporate-blue/10" />
           </div>

           <div className="grid md:grid-cols-2 gap-10">
              {/* System Roles */}
              <div className="space-y-6">
                 <p className="text-[11px] font-black text-corporate-blue uppercase tracking-widest px-2 italic">// SİSTEM ROLLERİ</p>
                 <div className="grid gap-6">
                    {user.userRoles.map((ur) => (
                       <div key={ur.id} className="t3-panel group p-8 bg-white hover:bg-slate-50 transition-all border-l-[12px] border-l-slate-200 hover:border-l-corporate-blue relative overflow-hidden">
                          <div className="relative z-10 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-950 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                                   <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col">
                                   <h5 className="text-sm font-black text-slate-950 uppercase tracking-tight leading-none group-hover:text-corporate-blue transition-colors">{ur.role.name}</h5>
                                   <p className="text-[9px] text-slate-400 font-black mt-2 uppercase tracking-widest italic">STATÜ: DOĞRULANDI</p>
                                </div>
                             </div>
                             {ur.community && (
                                <span className="px-3 py-1.5 bg-slate-50 text-slate-950 text-[10px] font-black rounded-lg border border-slate-200 group-hover:border-corporate-blue transition-colors italic">
                                   @{ur.community.shortName}
                                </span>
                             )}
                          </div>
                       </div>
                    ))}
                    {user.userRoles.length === 0 && (
                       <div className="t3-panel-elevated p-12 text-center bg-slate-50/50 border-dashed border-2">
                          <p className="t3-label">HERHANGİ BİR ROL ATANMADI</p>
                       </div>
                    )}
                 </div>
              </div>

              {/* Memberships */}
              <div className="space-y-6">
                 <p className="text-[11px] font-black text-corporate-orange uppercase tracking-widest px-2 italic">// TOPLULUK ÜYELİKLERİ</p>
                 <div className="grid gap-6">
                    {user.memberships.map((m) => (
                       <div key={m.id} className="t3-panel group p-8 bg-white hover:bg-slate-50 transition-all border-l-[12px] border-l-slate-200 hover:border-l-corporate-orange relative overflow-hidden">
                          <div className="relative z-10 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-950 group-hover:bg-corporate-orange group-hover:text-white transition-all shadow-sm">
                                   <Building2 className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col">
                                   <h5 className="text-sm font-black text-slate-950 uppercase tracking-tight leading-none group-hover:text-corporate-orange transition-colors">{m.community.name}</h5>
                                   <p className="text-[9px] text-slate-400 font-black mt-2 uppercase tracking-widest italic">{m.membershipType} ÜYE</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    ))}
                    {user.memberships.length === 0 && (
                       <div className="t3-panel-elevated p-12 text-center bg-slate-50/50 border-dashed border-2">
                          <p className="t3-label">BAĞLI TOPLULUK BULUNMUYOR</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
