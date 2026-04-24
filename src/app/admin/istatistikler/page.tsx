import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { 
  BarChart4, 
  TrendingUp, 
  Users, 
  Building2, 
  GraduationCap, 
  Filter,
  LayoutDashboard,
  Sparkles,
  Activity,
  Database,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminStatsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requirePermission("stats.view");
  const params = await searchParams;
  const department = typeof params.department === "string" ? params.department : "";
  const grade = typeof params.grade === "string" ? params.grade : "";

  const [usersByUniversity, usersByDepartment, , eventCountsByCommunity, topActiveCommunity, upcomingEvents, recentReports] =
    await Promise.all([
      prisma.university.findMany({
        include: { _count: { select: { users: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.user.groupBy({
        by: ["department"],
        _count: { _all: true },
        where: { department: department || undefined },
      }),
      prisma.user.groupBy({
        by: ["grade"],
        _count: { _all: true },
        where: { grade: grade ? Number(grade) : undefined },
      }),
      prisma.community.findMany({
        include: { _count: { select: { createdEvents: true } }, university: true },
        orderBy: { name: "asc" },
      }),
      prisma.community.findFirst({
        include: { _count: { select: { createdEvents: true } }, university: true },
        orderBy: { createdEvents: { _count: "desc" } },
      }),
      // Spec: yaklaşan etkinlikler
      prisma.event.findMany({
        where: { status: "APPROVED", eventDate: { gte: new Date() } },
        orderBy: { eventDate: "asc" },
        take: 5,
        include: { community: { select: { shortName: true } } },
      }),
      // Spec: son yüklenen raporlar
      prisma.report.findMany({
        where: { status: { in: ["SUBMITTED", "IN_REVIEW"] } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { community: { select: { shortName: true } } },
      }),
    ]);

  const maxUsers = Math.max(...usersByUniversity.map(u => u._count.users), 1);
  const maxEvents = Math.max(...eventCountsByCommunity.map(u => u._count.createdEvents), 1);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <TrendingUp className="h-4 w-4 text-corporate-orange" /> İSTATİSTİKSEL VERİ MERKEZİ
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              ANALİTİK <br />
              <span className="text-corporate-blue italic">DASBOARD</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Ekosistem verilerini, büyüme metriklerini ve topluluk performanslarını <span className="text-slate-950 font-bold decoration-corporate-blue decoration-4 underline underline-offset-4">kurumsal standartlarda</span> derinlemesine analiz edin.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">VERİ KAYDI</p>
              <div className="flex items-center justify-center gap-3">
                 <p className="text-5xl font-black text-slate-950 tracking-tighter leading-none italic uppercase">CANLI</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <BarChart4 className="h-32 w-32" />
        </div>
      </div>

      <form className="t3-panel p-10 md:p-12 space-y-10 bg-slate-50/50">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-200">
           <div className="flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                 <Filter className="h-7 w-7" />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic">Matris Filtreleme</h2>
                 <p className="t3-label">VERİ MADENCİLİĞİ İÇİN SORGU PARAMETRELERİNİ GİRİN</p>
              </div>
           </div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
             <label className="text-[11px] font-black text-slate-950 uppercase tracking-widest px-1">Bölüm Sorgula</label>
             <div className="relative group/input">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-corporate-blue transition-colors" />
                <input
                  name="department"
                  defaultValue={department}
                  placeholder="Bölüm adı..."
                  className="w-full rounded-2xl border border-slate-200 bg-white pl-16 pr-6 py-5 text-sm font-bold text-slate-950 outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue/30 transition-all shadow-sm"
                />
             </div>
          </div>
          <div className="space-y-3">
             <label className="text-[11px] font-black text-slate-950 uppercase tracking-widest px-1">Sınıf Düzeyi</label>
             <div className="relative group/input">
                <GraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-corporate-orange transition-colors" />
                <input
                  name="grade"
                  defaultValue={grade}
                  placeholder="Sınıf (1-4)..."
                  className="w-full rounded-2xl border border-slate-200 bg-white pl-16 pr-6 py-5 text-sm font-bold text-slate-950 outline-none focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange/30 transition-all shadow-sm"
                />
             </div>
          </div>
          <div className="flex items-end">
             <button className="w-full h-[62px] rounded-xl bg-slate-950 text-[11px] font-black text-white shadow-xl shadow-slate-950/10 hover:bg-corporate-blue transition-all active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-3">
                <Database className="h-5 w-5 text-corporate-orange" /> SORGULAMAYI BAŞLAT
             </button>
          </div>
        </div>
      </form>

      <section className="grid gap-12 lg:grid-cols-2">
        {/* Population Stats */}
        <div className="t3-panel p-10 md:p-12 space-y-12 bg-slate-50/30 group">
          <div className="flex items-center justify-between gap-6 pb-8 border-b border-slate-200">
             <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm group-hover:bg-slate-950 group-hover:text-white transition-all">
                   <Users className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic">Üye Popülasyonu</h3>
                  <p className="t3-label">CAMPUS INDEX ANALİZİ</p>
                </div>
             </div>
          </div>
          <div className="space-y-8">
            {usersByUniversity.map((u) => (
              <div key={u.id} className="space-y-4">
                <div className="flex items-center justify-between font-black text-[11px] text-slate-950 uppercase tracking-[0.2em] px-2">
                  <span className="flex items-center gap-2">
                     <div className="h-1.5 w-1.5 rounded-full bg-corporate-blue" />
                     {u.name}
                  </span>
                  <span className="text-corporate-orange">{u._count.users} ÜYE</span>
                </div>
                <div className="h-4 w-full bg-slate-200/50 rounded-full overflow-hidden p-1 shadow-inner">
                   <div className="h-full bg-corporate-blue rounded-full transition-all duration-[1.5s] ease-out shadow-lg shadow-corporate-blue/20 relative" style={{ width: `${(u._count.users / maxUsers) * 100}%` }}>
                      <div className="absolute top-0 right-0 h-full w-4 bg-white/20 animate-pulse" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Stats */}
        <div className="t3-panel p-10 md:p-12 space-y-12 bg-slate-50/30 group">
          <div className="flex items-center justify-between gap-6 pb-8 border-b border-slate-200">
             <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-orange shadow-sm group-hover:bg-slate-950 group-hover:text-white transition-all">
                   <Activity className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic">Birim Üretkenliği</h3>
                  <p className="t3-label">EVENT INDEX ANALİZİ</p>
                </div>
             </div>
          </div>
          <div className="space-y-8">
            {eventCountsByCommunity.map((community) => (
              <div key={community.id} className="space-y-4">
                <div className="flex items-center justify-between font-black text-[11px] text-slate-950 uppercase tracking-[0.2em] px-2">
                   <div className="flex flex-col">
                      <span className="truncate max-w-[200px] leading-none">{community.shortName}</span>
                      <span className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest">{community.university.name}</span>
                   </div>
                   <span className="text-corporate-blue">{community._count.createdEvents} ETKİNLİK</span>
                </div>
                <div className="h-4 w-full bg-slate-200/50 rounded-full overflow-hidden p-1 shadow-inner">
                   <div className="h-full bg-corporate-orange rounded-full transition-all duration-[1.5s] ease-out shadow-lg shadow-corporate-orange/20 relative" style={{ width: `${(community._count.createdEvents / maxEvents) * 100}%` }}>
                      <div className="absolute top-0 right-0 h-full w-4 bg-white/20 animate-pulse" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution & Matrix */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-12">
          <div className="t3-panel p-10 space-y-10 bg-slate-50/50">
            <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
               <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                  <Building2 className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic">Birim Dağılımı</h3>
            </div>
            <div className="grid gap-6">
              {usersByDepartment.map((item) => (
                <div key={item.department ?? "none"} className="flex items-center justify-between p-7 rounded-2xl bg-white border border-slate-200 hover:border-corporate-blue transition-all hover:bg-slate-50 group/row shadow-sm">
                  <span className="text-sm font-black text-slate-950 uppercase tracking-tight group-hover/row:text-corporate-blue transition-colors">{item.department ?? "TANIMSIZ"}</span>
                  <span className="bg-slate-950 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-950/10">
                    {item._count._all} KAYIT
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="t3-panel p-10 space-y-10 bg-[#fefce8]/50 text-slate-950 relative overflow-hidden group/top border-amber-200">
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-6 pb-6 border-b border-amber-200/30">
                 <div className="h-12 w-12 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-corporate-orange shadow-sm">
                    <Sparkles className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-black tracking-tighter uppercase italic">Performans Lideri</h3>
              </div>
              
              {topActiveCommunity && (
                <div className="space-y-8">
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600/60">ŞAMPİYON EKOSİSTEM</span>
                      <h4 className="text-4xl font-black uppercase tracking-tighter leading-none mt-4 text-slate-950">{topActiveCommunity.name}</h4>
                      <div className="flex items-center gap-3 mt-4">
                        <div className="h-1.5 w-12 rounded-full bg-corporate-blue" />
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{topActiveCommunity.university.name}</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-8 pt-8 border-t border-amber-200/30">
                      <div>
                         <p className="text-3xl font-black italic tracking-tighter text-corporate-orange">{topActiveCommunity._count.createdEvents}</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">TOPLAM AKSİYON</p>
                      </div>
                      <div className="flex items-end justify-end">
                         <div className="h-14 w-14 rounded-full bg-white border border-amber-100 flex items-center justify-center text-corporate-orange shadow-sm animate-bounce">
                            <TrendingUp className="h-7 w-7" />
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
            
            <BarChart4 className="absolute -right-10 -bottom-10 h-64 w-64 opacity-[0.03] rotate-12 transition-transform duration-1000 group-hover/top:rotate-0 text-amber-950" />
          </div>
        </div>
      </section>

      {/* Yaklaşan Etkinlikler + Son Raporlar */}
      <section className="grid gap-12 lg:grid-cols-2">
        {/* Yaklaşan Etkinlikler */}
        <div className="t3-panel p-10 space-y-8">
          <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
            <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic">Yaklaşan Etkinlikler</h3>
              <p className="t3-label">ONAYLANMIŞ VE PLANLANMIŞ</p>
            </div>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-corporate-blue/20 hover:bg-white transition-all group">
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[9px] font-black text-slate-400 uppercase leading-none">
                      {new Date(event.eventDate).toLocaleString("tr-TR", { month: "short" }).toUpperCase()}
                    </span>
                    <span className="text-xl font-black text-slate-950 leading-none">
                      {new Date(event.eventDate).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-950 uppercase tracking-tight truncate group-hover:text-corporate-blue transition-colors">{event.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {event.scope === "GLOBAL" ? "GLOBAL HAVUZ" : event.community?.shortName ?? "TOPLULUK"}
                    </p>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shrink-0">ONAYLANDI</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <LayoutDashboard className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-[11px] font-black uppercase tracking-[0.3em]">Yaklaşan Etkinlik Yok</p>
            </div>
          )}
        </div>

        {/* Son Gelen Raporlar */}
        <div className="t3-panel p-10 space-y-8">
          <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
            <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-corporate-orange shadow-sm">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic">Bekleyen Raporlar</h3>
              <p className="t3-label">İNCELEMEYE ALINACAK</p>
            </div>
          </div>
          {recentReports.length > 0 ? (
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-corporate-orange/20 hover:bg-white transition-all group">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-corporate-orange/10 border border-corporate-orange/20 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-corporate-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-950 uppercase tracking-tight truncate group-hover:text-corporate-orange transition-colors">{report.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{report.community.shortName}</p>
                  </div>
                  <span className={cn(
                    "text-[9px] font-black px-3 py-1.5 rounded-lg border shrink-0",
                    report.status === "IN_REVIEW"
                      ? "text-blue-600 bg-blue-50 border-blue-100"
                      : "text-amber-600 bg-amber-50 border-amber-100"
                  )}>
                    {report.status === "IN_REVIEW" ? "İNCELENİYOR" : "ONAY BEKLİYOR"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-[11px] font-black uppercase tracking-[0.3em]">Bekleyen Rapor Yok</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
