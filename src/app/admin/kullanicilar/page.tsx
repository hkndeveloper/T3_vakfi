import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { SubmitButton } from "@/components/ui/SubmitButton";
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

async function createUserAction(formData: FormData) {
  "use server";
  await requirePermission("user.create");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || password.length < 8) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      isActive: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "user.create",
    },
  });

  revalidatePath("/admin/kullanicilar");
}

async function assignRoleAction(formData: FormData) {
  "use server";
  await requirePermission("role.assign");

  const userId = String(formData.get("userId") ?? "").trim();
  const roleId = String(formData.get("roleId") ?? "").trim();
  const communityIdValue = String(formData.get("communityId") ?? "").trim();
  const communityId = communityIdValue || null;

  if (!userId || !roleId) {
    return;
  }

  const existing = await prisma.userRole.findFirst({
    where: {
      userId,
      roleId,
      communityId,
    },
  });

  if (!existing) {
    await prisma.userRole.create({
      data: {
        userId,
        roleId,
        communityId,
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      userId,
      action: "role.assign",
      modelType: "UserRole",
      modelId: `${userId}:${roleId}`,
    },
  });

  revalidatePath("/admin/kullanicilar");
}

export default async function AdminUsersPage() {
  await requirePermission("user.view");

  const [users, roles, communities] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        userRoles: {
          include: {
            role: true,
            community: true,
          },
        },
      },
      take: 100,
    }),
    prisma.role.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.community.findMany({
      orderBy: { name: "asc" },
      take: 200,
    }),
  ]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section - FIXED LIGHT */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <Fingerprint className="h-4 w-4 text-corporate-blue" /> KİMLİK & ERİŞİM YÖNETİMİ
            </div>
            <h1 className="text-6xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              YÖNETİM <br />
              <span className="text-corporate-blue">KADROSU</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Platform hiyerarşisini, topluluk yetkilerini ve yönetici erişimlerini <span className="text-slate-950 font-bold underline decoration-corporate-blue/30 underline-offset-4 decoration-4">kurumsal güvenlik</span> standartlarında merkezi olarak denetleyin.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">AKTİF OTURUM</p>
              <p className="text-6xl font-black tracking-tighter text-slate-950 leading-none">24</p>
            </div>
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-corporate-blue uppercase tracking-[0.3em] mb-4">TOPLAM KAYIT</p>
              <p className="text-6xl font-black text-corporate-blue tracking-tighter leading-none">{users.length}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <UsersIcon className="h-32 w-32" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* User Creation Form */}
        <div className="t3-panel-elevated p-12 bg-slate-50/50 relative overflow-hidden group/card border-l-[12px] border-l-corporate-blue">
          <div className="flex items-center gap-7 mb-12">
            <div className="h-16 w-16 rounded-2xl bg-corporate-blue flex items-center justify-center text-white shadow-lg shadow-corporate-blue/20 group-hover/card:scale-110 transition-all duration-500">
              <UserPlus className="h-8 w-8" />
            </div>
            <div>
              <h2 className="t3-heading text-2xl text-slate-950">Profil Oluştur</h2>
              <p className="t3-label mt-3">Yeni bir kurumsal kullanıcı tanımlayın.</p>
            </div>
          </div>
          <form action={createUserAction} className="grid gap-8">
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Tam İsim Soyisim</label>
               <div className="relative group/input">
                 <UserCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/input:text-corporate-blue transition-colors" />
                 <input
                   name="name"
                   placeholder="Örn: Mehmet Emin Özdemir"
                   className="w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-6 py-5 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none"
                   required
                 />
               </div>
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Kurumsal E-Posta</label>
               <div className="relative group/input">
                 <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/input:text-corporate-blue transition-colors" />
                 <input
                   name="email"
                   type="email"
                   placeholder="ad.soyad@t3vakfi.org"
                   className="w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-6 py-5 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none"
                   required
                 />
               </div>
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Geçici Erişim Anahtarı</label>
               <div className="relative group/input">
                 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/input:text-corporate-blue transition-colors" />
                 <input
                   name="password"
                   type="password"
                   placeholder="••••••••"
                   className="w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-6 py-5 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none"
                   minLength={8}
                   required
                 />
               </div>
            </div>
            <SubmitButton label="HESABI SİSTEME TANIMLA" className="t3-button t3-button-primary w-full py-6" />
          </form>
        </div>

        {/* Authorization Panel */}
        <div className="t3-panel-elevated p-12 bg-orange-50/30 relative overflow-hidden group/card border-l-[12px] border-l-corporate-orange">
          <div className="flex items-center gap-7 mb-12">
            <div className="h-16 w-16 rounded-2xl bg-corporate-orange flex items-center justify-center text-white shadow-lg shadow-corporate-orange/20 group-hover/card:scale-110 transition-all duration-500">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h2 className="t3-heading text-2xl text-slate-950">Yetki Delegasyonu</h2>
              <p className="t3-label mt-3">Hiyerarşik rol ve birim ataması yapın.</p>
            </div>
          </div>
          <form action={assignRoleAction} className="grid gap-8">
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Hedef Kullanıcı</label>
               <div className="relative group/input">
                 <UserCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/input:text-corporate-orange transition-colors" />
                 <select
                   name="userId"
                   className="w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-10 py-5 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all outline-none appearance-none cursor-pointer"
                   required
                 >
                   <option value="">Kullanıcı Listesi...</option>
                   {users.map((user) => (
                     <option key={user.id} value={user.id}>
                       {user.name} ({user.email.split('@')[0]})
                     </option>
                   ))}
                 </select>
               </div>
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Kurumsal Rol</label>
               <div className="relative group/input">
                 <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/input:text-corporate-orange transition-colors" />
                 <select
                   name="roleId"
                   className="w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-10 py-5 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all outline-none appearance-none cursor-pointer"
                   required
                 >
                   <option value="">Yetki Seviyesi...</option>
                   {roles.map((role) => (
                     <option key={role.id} value={role.id}>
                       {role.name}
                     </option>
                   ))}
                 </select>
               </div>
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Operasyonel Birim</label>
               <div className="relative group/input">
                 <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/input:text-corporate-orange transition-colors" />
                 <select name="communityId" className="w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-10 py-5 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all outline-none appearance-none cursor-pointer">
                   <option value="">Global Yetki (Tüm Sistem)</option>
                   {communities.map((community) => (
                     <option key={community.id} value={community.id}>
                       {community.name}
                     </option>
                   ))}
                 </select>
               </div>
            </div>
            <SubmitButton label="DELAGASYONU TAMAMLA" className="t3-button t3-button-accent w-full py-6" />
          </form>
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-10">
          <div>
            <h2 className="t3-heading text-4xl text-slate-950 tracking-tighter">Veri Matrisi</h2>
            <div className="flex items-center gap-3 mt-4">
               <div className="h-1.5 w-16 rounded-full bg-corporate-blue" />
               <p className="t3-label">{users.length} AKTİF PROFiL DENETLENİYOR</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative group/search">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/search:text-corporate-blue transition-colors" />
                <input 
                  type="text" 
                  placeholder="Kullanıcı veya rol ara..." 
                  className="pl-14 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue/30 transition-all w-80 shadow-sm" 
                />
             </div>
             <button className="h-16 w-16 rounded-2xl bg-slate-100 text-slate-950 hover:bg-white transition-all flex items-center justify-center shadow-sm border border-slate-200">
                <Filter className="h-6 w-6" />
             </button>
          </div>
        </div>

        <div className="t3-panel overflow-hidden bg-slate-50/30">
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
      </div>
    </div>
  );
}

