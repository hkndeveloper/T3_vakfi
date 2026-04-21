import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/permissions";
import { CommunityForm } from "@/components/forms/CommunityForm";
import { 
  Building2, 
  School, 
  Users, 
  Search, 
  Filter,
  User,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  LayoutDashboard,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminCommunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; universityId?: string }>;
}) {
  await requireSuperAdmin();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const universityId = typeof params.universityId === "string" ? params.universityId : "";

  let universities: { id: string; name: string }[] = [];
  let communities: any[] = [];

  try {
    const results = await Promise.all([
      prisma.university.findMany({ 
        where: { status: "ACTIVE" },
        orderBy: { name: "asc" },
        select: { id: true, name: true }
      }),
      prisma.community.findMany({
        where: {
          AND: [
            query ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { shortName: { contains: query, mode: "insensitive" } }
              ]
            } : {},
            universityId ? { universityId } : {}
          ]
        },
        orderBy: { createdAt: "desc" },
        include: {
          university: true,
          _count: { select: { members: true } },
        },
        take: 100
      }),
    ]);
    universities = results[0];
    communities = results[1];
  } catch (error) {
    console.error("Data fetching error:", error);
  }

  const totalComm = communities.length;
  const activeComm = communities.filter(c => c.status === "ACTIVE").length;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-corporate-orange" /> BÖLGESEL EKOSİSTEM YÖNETİMİ
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              TOPLULUK <br />
              <span className="text-corporate-orange">DİREKTÖRLÜĞÜ</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
              Üniversiteler bünyesindeki T3 topluluklarını, yönetim kadrolarını ve kurumsal büyüme verilerini <span className="text-slate-950 font-bold underline decoration-corporate-orange/30 underline-offset-4 decoration-4">merkezi sistem</span> üzerinden denetleyin.
            </p>
          </div>
          
          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-corporate-orange uppercase tracking-[0.3em] mb-4">AKTİF BİRİM</p>
              <p className="text-6xl font-black tracking-tighter text-slate-950 leading-none">{activeComm}</p>
            </div>
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-corporate-blue uppercase tracking-[0.3em] mb-4">TOPLAM AĞ</p>
              <p className="text-6xl font-black text-corporate-blue tracking-tighter leading-none">{totalComm}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-orange/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <Building2 className="h-32 w-32" />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="t3-panel-elevated p-8 bg-slate-50/50">
             <h3 className="t3-heading text-xl mb-8 text-slate-950">Yeni Birim Tanımla</h3>
             <CommunityForm universities={universities} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-6 px-4">
            <div>
              <h2 className="t3-heading text-3xl text-slate-950 tracking-tighter">Kayıtlı Birimler</h2>
              <div className="flex items-center gap-3 mt-3">
                 <div className="h-1.5 w-12 rounded-full bg-corporate-orange" />
                 <p className="t3-label">{totalComm} TOPLULUK AKTİF OLARAK İZLENİYOR</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <form className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-corporate-orange transition-colors" />
                <input 
                  name="q"
                  type="text" 
                  defaultValue={query}
                  placeholder="Birim veya üniversite ara..." 
                  className="pl-14 pr-8 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange/30 transition-all w-80 shadow-sm" 
                />
              </form>
              <form className="flex items-center gap-4">
                <select 
                  name="universityId"
                  defaultValue={universityId}
                  onChange={(e) => e.target.form?.submit()}
                  className="h-14 pl-6 pr-12 rounded-2xl border border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-8 focus:ring-corporate-blue/5 transition-all appearance-none cursor-pointer shadow-sm"
                >
                  <option value="">TÜM ÜNİVERSİTELER</option>
                  {universities.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <div className="h-14 w-14 rounded-2xl border border-slate-200 bg-slate-50 text-slate-950 flex items-center justify-center shadow-sm">
                  <Filter className="h-6 w-6" />
                </div>
              </form>
              {(query || universityId) && (
                <Link href="/admin/topluluklar" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2">
                  Temizle
                </Link>
              )}
            </div>
          </div>

          <div className="t3-panel overflow-hidden bg-slate-50/30">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-100/50">
                  <tr>
                    <th className="px-10 py-8 text-left t3-label">Topluluk Kimliği</th>
                    <th className="px-10 py-8 text-left t3-label">Lokasyon & Rehberlik</th>
                    <th className="px-10 py-8 text-center t3-label">Kurumsal Güç</th>
                    <th className="px-10 py-8 text-right t3-label">Kontrol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {communities.map((item) => (
                    <tr key={item.id} className="hover:bg-white transition-all group">
                      <td className="px-10 py-9">
                        <div className="flex items-center gap-7">
                          <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm transition-all duration-300 group-hover:bg-slate-950 group-hover:text-white group-hover:scale-110">
                            <Building2 className="h-8 w-8" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <span className="font-black text-slate-950 text-xl tracking-tight leading-none group-hover:text-corporate-orange transition-colors">{item.name}</span>
                              <span className="px-3 py-1.5 rounded-lg bg-orange-50 text-[10px] font-black text-corporate-orange uppercase tracking-[0.15em] border border-orange-100 group-hover:bg-corporate-orange group-hover:text-white transition-all">{item.shortName}</span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest line-clamp-1 max-w-[250px]">{item.description || "// KURUMSAL TANIM YUKLENMEDİ"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-9">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3 text-slate-950 font-black text-xs uppercase tracking-tight">
                            <School className="h-4 w-4 text-corporate-blue" />
                            <span className="truncate max-w-[180px]">{item.university.name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                            <User className="h-4 w-4 text-corporate-orange" />
                            <span className="truncate max-w-[150px]">{item.advisorName || "DANIŞMAN ATANMADI"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-9">
                        <div className="flex justify-center">
                          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-100 group-hover:bg-corporate-blue group-hover:text-white transition-all border border-slate-200 shadow-sm">
                            <Users className="h-4 w-4 text-slate-400 group-hover:text-white/70" />
                            <span className="font-black text-slate-950 group-hover:text-white text-lg tracking-tighter leading-none">{item._count.members}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-9 text-right">
                        <Link 
                          href={`/admin/topluluklar/${item.id}`}
                          className="h-12 w-12 rounded-full bg-white text-slate-950 hover:bg-corporate-orange hover:text-white shadow-sm transition-all active:scale-90 flex items-center justify-center ml-auto group/btn border border-slate-200"
                        >
                          <ChevronRight className="h-6 w-6 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {communities.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-10 py-28 text-center text-slate-400">
                         <div className="flex flex-col items-center gap-6">
                            <LayoutDashboard className="h-16 w-16 opacity-10" />
                            <p className="t3-label">Henüz kayıtlı bir topluluk bulunmamaktadır.</p>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

