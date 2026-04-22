import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { 
  Users as UsersIcon, 
  UserPlus, 
  ShieldAlert, 
  Search, 
  Mail, 
  Lock, 
  UserCircle2, 
  Building2,
  Fingerprint,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sparkles,
  LayoutDashboard,
  Filter,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserCreationForm, RoleAssignmentForm } from "@/components/admin/UserManagementForms";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("user.view");
  const { q: search } = await searchParams;

  const [users, roles, communities, activeUserCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      where: search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      include: {
        userRoles: {
          include: { role: true, community: true },
        },
      },
      take: 100,
    }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
    prisma.community.findMany({ orderBy: { name: "asc" }, take: 200 }),
    prisma.user.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section - RESPONSIVE */}
      <div className="relative overflow-hidden rounded-xl md:rounded-t3-xl bg-slate-100/50 p-6 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 md:gap-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-1.5 md:px-5 md:py-2 text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-6 md:mb-10 shadow-sm">
              <Fingerprint className="h-3.5 w-3.5 md:h-4 md:w-4 text-corporate-blue" /> KİMLİK & ERİŞİM YÖNETİMİ
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] uppercase text-slate-950 italic">
              YÖNETİM <br />
              <span className="text-corporate-blue">KADROSU</span>
            </h1>
            <p className="mt-6 md:mt-10 text-base md:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Platform hiyerarşisini, topluluk yetkilerini ve yönetici erişimlerini <span className="text-slate-950 font-bold underline decoration-corporate-blue/30 underline-offset-4 decoration-4">kurumsal güvenlik</span> standartlarında denetleyin.
            </p>
          </div>

          <div className="flex flex-row lg:flex-col xl:flex-row gap-4 md:gap-8 w-full lg:w-auto">
            <div className="flex-1 group/stat rounded-xl md:rounded-2xl bg-white px-6 py-6 md:px-12 md:py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 md:mb-4">AKTİF OTURUM</p>
              <p className="text-3xl md:text-6xl font-black tracking-tighter text-slate-950 leading-none">{activeUserCount}</p>
            </div>
            <div className="flex-1 group/stat rounded-xl md:rounded-2xl bg-white px-6 py-6 md:px-12 md:py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[8px] md:text-[10px] font-black text-corporate-blue uppercase tracking-[0.3em] mb-2 md:mb-4">TOPLAM KAYIT</p>
              <p className="text-3xl md:text-6xl font-black text-corporate-blue tracking-tighter leading-none">{users.length}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-64 md:h-[500px] w-64 md:w-[500px] rounded-full bg-corporate-blue/5 blur-[80px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 hidden md:flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <UsersIcon className="h-32 w-32" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-12 px-4 md:px-0">
        {/* User Creation Form */}
        <UserCreationForm />

        {/* Authorization Panel */}
        <RoleAssignmentForm users={users} roles={roles} communities={communities} />
      </div>

      <div className="space-y-6 md:space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4 md:px-10">
          <div>
            <h2 className="t3-heading text-2xl md:text-4xl text-slate-950 tracking-tighter">Veri Matrisi</h2>
            <div className="flex items-center gap-3 mt-2 md:mt-4">
               <div className="h-1 w-12 md:h-1.5 md:w-16 rounded-full bg-corporate-blue" />
               <p className="t3-label text-[8px] md:text-[10px]">{users.length} PROFIL LİSTELENİYOR{search ? ` — "${search}" araması` : ""}</p>
            </div>
          </div>
          <form className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
             <div className="relative group/search flex-1 md:flex-none">
                <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within/search:text-corporate-blue transition-colors" />
                <input 
                  type="text"
                  name="q"
                  defaultValue={search ?? ""}
                  placeholder="Ad, e-posta..." 
                  className="pl-11 md:pl-14 pr-4 md:pr-8 py-3.5 md:py-5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue/30 transition-all w-full md:w-80 shadow-sm" 
                />
             </div>
             <button type="submit" className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-corporate-blue text-white hover:bg-blue-700 transition-all flex items-center justify-center shadow-sm shrink-0">
                <Search className="h-5 w-5 md:h-6 md:w-6" />
             </button>
             {search && (
               <a href="/admin/kullanicilar" className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-slate-100 text-slate-950 hover:bg-white transition-all flex items-center justify-center shadow-sm border border-slate-200 text-[10px] md:text-xs font-black shrink-0">
                 ✕
               </a>
             )}
          </form>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block t3-panel overflow-hidden bg-slate-50/30">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100/50">
                <tr>
                  <th className="px-12 py-9 text-left t3-label">Kimlik Kunyesi</th>
                  <th className="px-12 py-9 text-left t3-label">İletişim Kanalı</th>
                  <th className="px-12 py-9 text-left t3-label">Durum</th>
                  <th className="px-12 py-9 text-left t3-label">Yetki Matrisi</th>
                  <th className="px-12 py-9 text-right t3-label">Kontrol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white transition-all group">
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-corporate-blue font-black text-xl border border-slate-200 group-hover:bg-slate-950 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <span className="font-black text-slate-950 text-xl tracking-tight uppercase group-hover:text-corporate-blue transition-colors">{user.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-slate-600 font-bold uppercase tracking-widest bg-white px-5 py-2.5 rounded-2xl border border-slate-200 max-w-fit shadow-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <div className={cn(
                        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all",
                        user.isActive 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      )}>
                        <div className={cn("h-2 w-2 rounded-full", user.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                        {user.isActive ? "AKTİF" : "ENGELİ"}
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex flex-wrap gap-3">
                        {user.userRoles.length > 0 ? (
                          user.userRoles.map((userRole) => (
                            <span key={`${userRole.userId}-${userRole.roleId}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-950 text-[10px] font-black border border-slate-200 uppercase tracking-tight group-hover:bg-corporate-blue group-hover:text-white group-hover:border-corporate-blue transition-all shadow-sm">
                              {userRole.role.name}
                              {userRole.community && <span className="opacity-40 text-[9px] border-l border-slate-200 pl-3 ml-2">@{userRole.community.shortName}</span>}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[10px] font-black uppercase italic tracking-[0.3em]">YETKİSİZ ERİŞİM</span>
                        )}
                      </div>
                    </td>
                    <td className="px-12 py-10 text-right">
                       <Link 
                         href={`/admin/kullanicilar/${user.id}`}
                         className="h-14 w-14 rounded-full bg-white text-slate-950 hover:bg-corporate-blue hover:text-white shadow-sm transition-all active:scale-90 flex items-center justify-center ml-auto group/btn border border-slate-200"
                       >
                          <ChevronRight className="h-7 w-7 group-hover/btn:translate-x-1 transition-transform" />
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card List View */}
        <div className="md:hidden space-y-4 px-4 overflow-x-hidden">
          {users.map((user) => (
            <div key={user.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-corporate-blue font-black text-lg border border-slate-200">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-950 text-sm uppercase tracking-tight">{user.name}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{user.email}</span>
                  </div>
                </div>
                <Link 
                  href={`/admin/kullanicilar/${user.id}`}
                  className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200"
                >
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border",
                  user.isActive 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : "bg-rose-50 text-rose-700 border-rose-100"
                )}>
                  <div className={cn("h-1.5 w-1.5 rounded-full", user.isActive ? "bg-emerald-500" : "bg-rose-500")} />
                  {user.isActive ? "AKTİF" : "ENGELİ"}
                </div>
                
                {user.userRoles.map((userRole) => (
                  <span key={`${userRole.userId}-${userRole.roleId}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-950 text-[9px] font-black border border-slate-200 uppercase">
                    {userRole.role.name}
                  </span>
                ))}
                {user.userRoles.length === 0 && (
                  <span className="text-[9px] font-black text-slate-400 uppercase italic">YETKİSİZ</span>
                )}
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
               <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
               <p className="text-[10px] font-black uppercase tracking-widest">Kayıt bulunamadı</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

