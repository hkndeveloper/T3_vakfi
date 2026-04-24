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
import { CommunityFilter } from "@/components/admin/CommunityFilter";

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
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section - RESPONSIVE */}
      <div className="relative overflow-hidden rounded-xl md:rounded-t3-xl bg-slate-100/50 p-6 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 md:gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-1.5 md:px-5 md:py-2 text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-6 md:mb-10 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-corporate-orange" /> BÖLGESEL EKOSİSTEM YÖNETİMİ
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] uppercase text-slate-950 italic">
              TOPLULUK <br />
              <span className="text-corporate-orange">DİREKTÖRLÜĞÜ</span>
            </h1>
            <p className="mt-6 md:mt-10 text-base md:text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
              Üniversiteler bünyesindeki T3 topluluklarını, yönetim kadrolarını ve kurumsal büyüme verilerini <span className="text-slate-950 font-bold underline decoration-corporate-orange/30 underline-offset-4 decoration-4">merkezi sistem</span> üzerinden denetleyin.
            </p>
          </div>
          
          <div className="flex flex-row lg:flex-col xl:flex-row gap-4 md:gap-8 w-full lg:w-auto">
            <div className="flex-1 group/stat rounded-xl md:rounded-2xl bg-white px-6 py-6 md:px-12 md:py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[8px] md:text-[10px] font-black text-corporate-orange uppercase tracking-[0.3em] mb-2 md:mb-4">AKTİF BİRİM</p>
              <p className="text-3xl md:text-6xl font-black tracking-tighter text-slate-950 leading-none">{activeComm}</p>
            </div>
            <div className="flex-1 group/stat rounded-xl md:rounded-2xl bg-white px-6 py-6 md:px-12 md:py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[8px] md:text-[10px] font-black text-corporate-blue uppercase tracking-[0.3em] mb-2 md:mb-4">TOPLAM AĞ</p>
              <p className="text-3xl md:text-6xl font-black text-corporate-blue tracking-tighter leading-none">{totalComm}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-64 md:h-[500px] w-64 md:w-[500px] rounded-full bg-corporate-orange/5 blur-[80px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 hidden md:flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <Building2 className="h-32 w-32" />
        </div>
      </div>

      <div className="space-y-10 px-4 md:px-0">
        <div className="space-y-8 md:space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-2 md:px-4">
            <div>
              <h2 className="t3-heading text-2xl md:text-3xl text-slate-950 tracking-tighter">Kayıtlı Birimler</h2>
              <div className="flex items-center gap-3 mt-2 md:mt-3">
                 <div className="h-1 md:h-1.5 w-10 md:w-12 rounded-full bg-corporate-orange" />
                 <p className="t3-label text-[8px] md:text-[10px]">{totalComm} TOPLULUK AKTİF OLARAK İZLENİYOR</p>
              </div>
            </div>
            <CommunityFilter 
              universities={universities} 
              initialQuery={query} 
              initialUniversityId={universityId} 
            />
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block t3-panel overflow-hidden bg-slate-50/30">
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
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            {communities.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm shadow-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-950 text-sm leading-tight">{item.name}</span>
                        <span className="px-2 py-0.5 rounded bg-orange-50 text-[8px] font-black text-corporate-orange border border-orange-100">{item.shortName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 line-clamp-1">{item.university.name}</span>
                    </div>
                  </div>
                  <Link 
                    href={`/admin/topluluklar/${item.id}`}
                    className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0"
                  >
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">DANIŞMAN</span>
                    <span className="text-xs font-black text-slate-950 line-clamp-1">{item.advisorName || "ATANMADI"}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ÜYELER</span>
                    <span className="text-lg font-black text-slate-950">{item._count.members} Kişi</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                   <div className={cn(
                     "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border",
                     item.status === "ACTIVE" 
                       ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                       : "bg-slate-50 text-slate-500 border-slate-100"
                   )}>
                     <div className={cn("h-1.5 w-1.5 rounded-full", item.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                     {item.status === "ACTIVE" ? "AKTİF BİRİM" : "PASİF"}
                   </div>
                </div>
              </div>
            ))}

            {communities.length === 0 && (
              <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="flex flex-col items-center gap-6">
                    <LayoutDashboard className="h-12 w-12 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Henüz kayıtlı bir topluluk bulunmamaktadır.</p>
                  </div>
              </div>
            )}
          </div>
        </div>

        <section className="relative overflow-hidden rounded-2xl md:rounded-[2rem] border border-slate-200 bg-slate-100/60 p-6 md:p-10 shadow-sm">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-corporate-orange/8 blur-[90px] pointer-events-none" />
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

          <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] xl:items-start">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 md:p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-[9px] font-black uppercase tracking-[0.24em] text-corporate-orange">
                <Building2 className="h-3.5 w-3.5" />
                Yeni Birim Akışı
              </div>
              <h3 className="mt-5 text-2xl md:text-3xl font-black tracking-tighter uppercase italic text-slate-950">
                Topluluk Ekleme
                <br />
                <span className="text-corporate-orange">Alanını Genişlettik</span>
              </h3>
              <p className="mt-5 text-sm md:text-base font-medium leading-relaxed text-slate-600">
                Form artık yan sütunda sıkışmıyor. Üniversite bağlantısı, iletişim alanları ve kurumsal tanımı tek bakışta daha rahat doldurabileceğiniz yatay bir akışta yer alıyor.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="t3-label text-[8px] md:text-[9px]">AKTİF BİRİM</p>
                  <p className="mt-2 text-3xl font-black tracking-tighter text-slate-950">{activeComm}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="t3-label text-[8px] md:text-[9px]">TOPLAM AĞ</p>
                  <p className="mt-2 text-3xl font-black tracking-tighter text-corporate-blue">{totalComm}</p>
                </div>
              </div>
            </div>

            <div className="min-w-0">
              <CommunityForm universities={universities} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
