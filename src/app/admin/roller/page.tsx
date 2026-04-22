import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { 
  ShieldCheck, 
  Key, 
  Users, 
  Fingerprint, 
  Shield, 
  Lock, 
  Zap,
  LayoutDashboard,
  Sparkles,
  ChevronRight,
  Target,
  FileKey
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminRolesPage() {
  await requirePermission("role.assign");

  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" },
    include: {
      permission: {
        include: {
          permission: true,
        },
      },
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section - RESPONSIVE */}
      <div className="relative overflow-hidden rounded-xl md:rounded-t3-xl bg-slate-100/50 p-6 md:p-16 border border-slate-200 group">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-1.5 md:px-5 md:py-2 text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] mb-6 md:mb-10 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-corporate-blue" /> GÜVENLİK MERKEZİ
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase text-slate-950 italic">
            ROLLER VE <br />
            <span className="text-corporate-orange italic">YETKİLER</span>
          </h1>
          <p className="mt-6 md:mt-10 text-base md:text-xl text-slate-600 font-medium max-w-2xl leading-relaxed">
            Sistemdeki erişim seviyelerini kurumsal standartlarda tanımlayın, rol bazlı yetki matrislerini denetleyin.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-64 md:h-[400px] w-64 md:w-[400px] rounded-full bg-corporate-blue/5 blur-[80px] md:blur-[100px] pointer-events-none group-hover:bg-corporate-blue/10 transition-all duration-1000" />
        <div className="absolute bottom-10 right-10 hidden md:flex items-center gap-2 opacity-[0.03] transform group-hover:scale-110 transition-transform">
           <Fingerprint className="h-24 w-24" />
        </div>
      </div>

      <div className="space-y-6 md:space-y-10 px-4 md:px-0">
        <div className="flex items-center justify-between px-2 md:px-4">
          <div>
            <h2 className="t3-heading text-2xl md:text-4xl text-slate-950 tracking-tighter italic uppercase">Yetki Matrisi</h2>
            <div className="flex items-center gap-3 mt-2 md:mt-4">
               <div className="h-1 md:h-1.5 w-10 md:w-16 rounded-full bg-corporate-blue" />
               <p className="t3-label text-[9px] md:text-[10px]">{roles.length} AKTİF ROL TANIMI</p>
            </div>
          </div>
          <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
             <Key className="h-6 w-6 md:h-7 md:w-7" />
          </div>
        </div>

        <div className="grid gap-6 md:gap-10 md:grid-cols-2">
          {roles.map((role) => (
            <article key={role.id} className="t3-panel group p-6 md:p-14 bg-white hover:bg-slate-50 transition-all border-l-[8px] md:border-l-[16px] border-l-slate-200 hover:border-l-corporate-blue relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 hidden md:block">
                 <Shield className="h-48 w-48" />
              </div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8 md:mb-12">
                  <div className="space-y-3 md:space-y-4">
                    <h2 className="text-2xl md:text-4xl font-black text-slate-950 tracking-tighter leading-tight uppercase italic group-hover:text-corporate-blue transition-colors">{role.name}</h2>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-lg shadow-sm">
                       <Target className="h-3.5 w-3.5" /> KOD: {role.code}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                     <span className="flex items-center gap-2 bg-white border border-slate-200 text-slate-950 px-4 py-2 md:px-5 md:py-3 rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest shadow-sm transition-all group-hover:border-corporate-blue/30 italic">
                       <Users className="h-4 w-4 text-corporate-blue" /> {role._count.users} ÜYE
                     </span>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-1 italic">ERİŞİM YETKİLERİ</h4>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {role.permission.length ? (
                      role.permission.map((item) => (
                        <span
                          key={item.permissionId}
                          className="px-3 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl bg-white text-slate-950 text-[9px] md:text-[10px] font-black border border-slate-200 uppercase tracking-tight group-hover:border-corporate-blue/30 transition-all flex items-center gap-2 md:gap-3 shadow-sm"
                        >
                          <Lock className="h-3 w-3 md:h-4 md:w-4 text-corporate-blue opacity-40 group-hover:opacity-100 transition-opacity" />
                          {item.permission.code.replace(".", " / ")}
                        </span>
                      ))
                    ) : (
                      <span className="t3-label px-1 italic text-[9px]">TANIMLANMIŞ YETKİ BULUNMUYOR</span>
                    )}
                  </div>
                </div>

                <div className="mt-8 md:mt-14 pt-6 md:pt-10 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex -space-x-3">
                      {[...Array(Math.min(3, role._count.users))].map((_, i) => (
                        <div key={i} className="h-8 w-8 md:h-12 md:w-12 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                           <Users className="h-3.5 w-3.5 md:h-5 md:w-5" />
                        </div>
                      ))}
                   </div>
                   <div className="h-10 w-10 md:h-14 md:w-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-slate-950 group-hover:bg-white transition-all shadow-sm">
                      <ChevronRight className="h-6 w-6 md:h-8 md:w-8 group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
