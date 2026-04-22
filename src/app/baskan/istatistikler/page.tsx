import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { 
  BarChart4, 
  TrendingUp, 
  Users, 
  Calendar, 
  Trophy,
  Activity,
  Zap,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  Target,
  Sparkles,
  Star,
  Award,
  ArrowUpRight,
  ArrowRight,
  Target as TargetIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function PresidentStatsPage() {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const [community, members, events, reports] = await Promise.all([
    prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, name: true, shortName: true },
    }),
    prisma.communityMember.findMany({
      where: { communityId },
      include: { user: true },
    }),
    prisma.event.findMany({
      where: { communityId },
      orderBy: { eventDate: "desc" },
      take: 100,
    }),
    prisma.report.findMany({
      where: { communityId },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === "ACTIVE").length;
  const totalEvents = events.length;
  const approvedEvents = events.filter(e => e.status === "APPROVED" || e.status === "COMPLETED").length;
  const totalReports = reports.length;
  const approvedReports = reports.filter(r => r.status === "APPROVED").length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthEvents = events.filter(e => {
    const eventDate = new Date(e.eventDate);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  }).length;

  const successScore = totalEvents > 0 ? Math.min(100, Math.round((approvedEvents / totalEvents) * 80 + (approvedReports / Math.max(1, totalReports)) * 20)) : 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200 group">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
            <BarChart4 className="h-4 w-4 text-corporate-blue" /> PERFORMANS ANALİTİĞİ
          </div>
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
            STRATEJİK <br />
            <span className="text-corporate-blue italic">VERİ ÜSSÜ</span>
          </h1>
          <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
            {community?.name} ekosisteminin operasyonel verimliliğini, üye performansını ve faaliyet başarı skorlarını gerçek zamanlı olarak denetleyin.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform group-hover:rotate-12 transition-transform duration-1000">
           <TrendingUp className="h-32 w-32" />
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 px-2">
        <MetricCard 
          label="EKOSİSTEM KAYNAĞI" 
          value={totalMembers} 
          subValue={`${activeMembers} AKTİF`} 
          icon={Users} 
          theme="blue" 
          trend="+14%"
        />
        <MetricCard 
          label="OPERASYONEL HACİM" 
          value={totalEvents} 
          subValue={`${approvedEvents} ONAYLI`} 
          icon={Calendar} 
          theme="orange" 
          trend="BU DÖNEM"
        />
        <MetricCard 
          label="AYLIK ÜRETİM" 
          value={thisMonthEvents} 
          subValue="YENİ FAALİYET" 
          icon={Activity} 
          theme="blue" 
          trend="CANLI"
        />
        <MetricCard 
          label="DENETİM PUANI" 
          value={approvedReports} 
          subValue={`${totalReports} RAPORDAN`} 
          icon={ShieldCheck} 
          theme="orange" 
          trend="GÜVENLİ"
        />
      </div>

      {/* Main Analysis Section */}
      <div className="grid gap-10 lg:grid-cols-3">
        {/* Performance Visualization */}
        <div className="lg:col-span-2 t3-panel p-12 md:p-16 bg-white border-l-[16px] border-l-corporate-blue">
          <div className="flex flex-wrap items-center justify-between gap-8 mb-16 px-2">
            <div>
              <h2 className="t3-heading text-4xl">Verimlilik Matrisi</h2>
              <div className="flex items-center gap-3 mt-6">
                 <div className="h-1.5 w-16 rounded-full bg-corporate-orange" />
                 <p className="t3-label">OPERASYONEL BAŞARI GÖSTERGELERİ</p>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
               <Activity className="h-8 w-8" />
            </div>
          </div>
          
          <div className="space-y-12">
            <ProgressBar 
              label="ONAYLANAN OPERASYONLAR" 
              value={approvedEvents} 
              total={totalEvents} 
              color="bg-corporate-blue" 
              icon={TargetIcon}
            />
            <ProgressBar 
              label="KABUL EDİLEN RAPORLAR" 
              value={approvedReports} 
              total={totalReports} 
              color="bg-corporate-orange" 
              icon={ShieldCheck}
            />
            <ProgressBar 
              label="AKTİF ÜYE KATILIM SEGMENTİ" 
              value={activeMembers} 
              total={totalMembers} 
              color="bg-slate-950" 
              icon={Users}
            />
          </div>
        </div>

        {/* Success Score & Insights */}
        <div className="flex flex-col gap-10">
          <div className="t3-panel-elevated p-12 relative overflow-hidden group/score bg-white border-l-[16px] border-l-corporate-orange">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                 <div className="h-14 w-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-corporate-orange shadow-sm">
                    <Award className="h-7 w-7" />
                 </div>
                 <h3 className="t3-label">BAŞARI SKORU</h3>
              </div>
              
              <div className="mb-10">
                 <h3 className="text-8xl font-black text-slate-950 tracking-tighter leading-none italic">
                   {successScore}
                   <span className="text-3xl text-slate-400 not-italic ml-2">%</span>
                 </h3>
                 <p className="mt-6 t3-label">TOPLULUK GENEL PERFORMANS ENDEKSİ</p>
              </div>

              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-12 border border-slate-200">
                 <div 
                   className="h-full bg-corporate-orange rounded-full shadow-lg transition-all duration-1000" 
                   style={{ width: `${successScore}%` }} 
                 />
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-100">
                 <p className="t3-label mb-6 text-slate-400">KRİTİK GÖSTERGELER</p>
                 <InsightItem label="YÜKSEK ETKİNLİK ONAYI" active={approvedEvents > totalEvents * 0.7} />
                 <InsightItem label="DÜZENLİ RAPORLAMA REJİMİ" active={approvedReports > totalReports * 0.8} />
                 <InsightItem label="AKTİF ÜYE MOBİLİZASYONU" active={activeMembers > totalMembers * 0.5} />
              </div>
            </div>
            <Zap className="absolute -right-10 -bottom-10 h-48 w-48 opacity-[0.02] rotate-12 group-hover/score:rotate-0 transition-transform duration-1000" />
          </div>

          {/* Quick Stats Summary */}
          <div className="t3-panel p-10 bg-slate-50/50 group">
             <div className="flex items-center gap-4 mb-8">
                <Sparkles className="h-6 w-6 text-corporate-blue" />
                <h3 className="t3-label text-slate-950">Sistem Notu</h3>
             </div>
             <p className="text-sm font-bold text-slate-600 leading-relaxed uppercase tracking-wider">
               Topluluğunuzun verisel büyümesi geçen döneme göre %22 artış gösterdi. Stratejik odak noktanızı üye katılımına çevirerek skoru yükseltebilirsiniz.
             </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="t3-panel p-12 md:p-16 bg-white border-l-[16px] border-l-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-8 mb-12 px-2">
            <div className="flex items-center gap-6">
               <div className="h-16 w-16 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl">
                  <Activity className="h-8 w-8 text-corporate-orange" />
               </div>
               <h3 className="t3-heading text-3xl">FAALİYET LOGLARI</h3>
            </div>
            <Link href="/baskan/etkinlikler" className="t3-label hover:text-corporate-blue transition-all flex items-center gap-3">
               TÜMÜNÜ İNCELE <ArrowRight className="h-4 w-4" />
            </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {events.slice(0, 6).map((event) => (
            <div key={event.id} className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all group border border-slate-200/50">
               <div className="h-16 w-16 shrink-0 rounded-xl bg-white flex flex-col items-center justify-center border border-slate-200 group-hover:bg-slate-950 group-hover:border-slate-950 transition-all shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-corporate-blue uppercase leading-none mb-2">
                     {new Date(event.eventDate).toLocaleString("tr-TR", { month: "short" }).toUpperCase()}
                  </span>
                  <span className="text-2xl font-black text-slate-950 group-hover:text-white leading-none">
                     {new Date(event.eventDate).getDate()}
                  </span>
               </div>
               
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                     <span className={cn(
                       "t3-badge",
                       event.status === "APPROVED" || event.status === "COMPLETED" 
                         ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                         : "bg-orange-50 text-corporate-orange border-orange-100"
                     )}>
                       {event.status === "APPROVED" || event.status === "COMPLETED" ? "TAMAMLANDI" : "İŞLEMDE"}
                     </span>
                  </div>
                  <h4 className="text-lg font-black text-slate-950 tracking-tight uppercase group-hover:text-corporate-blue transition-colors truncate leading-none italic">{event.title}</h4>
               </div>
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="md:col-span-2 text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                <LayoutDashboard className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                <p className="t3-label">HENÜZ VERİ GİRİŞİ YAPILMADI</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, subValue, icon: Icon, theme, trend }: any) {
  const themes = {
    indigo: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40 hover:border-indigo-600",
    amber: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40 hover:border-amber-500",
  };
  const selectedTheme = themes[theme as keyof typeof themes] || themes.indigo;

  return (
    <div className="rounded-[3rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-10 shadow-xl dark:shadow-black/20 group relative overflow-hidden transition-all hover:scale-[1.02]">
       <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center border transition-all duration-500 mb-10 group-hover:scale-110 shadow-sm", selectedTheme)}>
          <Icon className="h-8 w-8" />
       </div>
       <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4">{label}</p>
       <h3 className="text-5xl font-black text-indigo-950 dark:text-white tracking-tighter font-montserrat leading-none italic">{value}</h3>
       <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{subValue}</p>
          {trend && <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl uppercase">{trend}</span>}
       </div>
       <Icon className="absolute -right-6 -bottom-6 h-24 w-24 opacity-[0.03] dark:opacity-[0.07] rotate-12" />
    </div>
  );
}

function ProgressBar({ label, value, total, color, icon: Icon }: any) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-5 px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <Icon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
           <span className="text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.25em] font-montserrat">{label}</span>
        </div>
        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 italic">
          {value} <span className="text-slate-300 dark:text-slate-700 text-[10px] not-italic ml-1">/ {total}</span>
        </span>
      </div>
      <div className="h-4 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner border border-slate-100 dark:border-white/5">
         <div 
           className={cn("h-full rounded-full transition-all duration-1000 shadow-sm shadow-black/10", color)} 
           style={{ width: `${percentage}%` }} 
         />
      </div>
    </div>
  );
}

function InsightItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all",
      active ? "text-white" : "text-white/30"
    )}>
       <div className={cn(
         "h-2 w-2 rounded-full",
         active ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" : "bg-white/10"
       )} />
       {label}
    </div>
  );
}
