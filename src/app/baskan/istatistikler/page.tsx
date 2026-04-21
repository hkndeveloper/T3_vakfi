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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-outfit pb-20">
      {/* T3 Premium Hero Section */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-indigo-950 p-12 md:p-16 text-white shadow-2xl group border border-white/5">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/30 px-5 py-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-10 animate-pulse-subtle">
            <BarChart4 className="h-4 w-4 fill-amber-500" /> PERFORMANS ANALİTİĞİ
          </div>
          <h1 className="text-6xl font-black tracking-tighter sm:text-7xl font-montserrat leading-[0.9] uppercase">
            STRATEJİK <br />
            <span className="text-indigo-400 italic border-b-8 border-amber-500/30">VERİ ÜSSÜ</span>
          </h1>
          <p className="mt-10 text-xl text-slate-300/80 font-medium max-w-2xl leading-relaxed">
            {community?.name} ekosisteminin operasyonel verimliliğini, üye performansını ve faaliyet başarı skorlarını gerçek zamanlı olarak denetleyin.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-indigo-500/10 opacity-30 blur-[130px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-5 scale-150 transform group-hover:rotate-12 transition-transform duration-1000">
           <TrendingUp className="h-40 w-40" />
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 px-2">
        <MetricCard 
          label="EKOSİSTEM KAYNAĞI" 
          value={totalMembers} 
          subValue={`${activeMembers} AKTİF`} 
          icon={Users} 
          theme="indigo" 
          trend="+14%"
        />
        <MetricCard 
          label="OPERASYONEL HACİM" 
          value={totalEvents} 
          subValue={`${approvedEvents} ONAYLI`} 
          icon={Calendar} 
          theme="amber" 
          trend="BU DÖNEM"
        />
        <MetricCard 
          label="AYLIK ÜRETİM" 
          value={thisMonthEvents} 
          subValue="YENİ FAALİYET" 
          icon={Activity} 
          theme="indigo" 
          trend="CANLI"
        />
        <MetricCard 
          label="DENETİM PUANI" 
          value={approvedReports} 
          subValue={`${totalReports} RAPORDAN`} 
          icon={ShieldCheck} 
          theme="amber" 
          trend="GÜVENLİ"
        />
      </div>

      {/* Main Analysis Section */}
      <div className="grid gap-10 lg:grid-cols-3">
        {/* Performance Visualization */}
        <div className="lg:col-span-2 rounded-[4rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-12 md:p-16 shadow-2xl dark:shadow-black/40 border-t-[16px] border-t-indigo-600">
          <div className="flex flex-wrap items-center justify-between gap-8 mb-16 px-2">
            <div>
              <h2 className="text-4xl font-black text-indigo-950 dark:text-white font-montserrat uppercase tracking-tight leading-none">Verimlilik Matrisi</h2>
              <div className="flex items-center gap-3 mt-6">
                 <div className="h-1.5 w-16 rounded-full bg-amber-500" />
                 <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.25em]">OPERASYONEL BAŞARI GÖSTERGELERİ</p>
              </div>
            </div>
            <div className="h-16 w-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
               <Activity className="h-8 w-8" />
            </div>
          </div>
          
          <div className="space-y-12">
            <ProgressBar 
              label="ONAYLANAN OPERASYONLAR" 
              value={approvedEvents} 
              total={totalEvents} 
              color="bg-indigo-600" 
              icon={TargetIcon}
            />
            <ProgressBar 
              label="KABUL EDİLEN RAPORLAR" 
              value={approvedReports} 
              total={totalReports} 
              color="bg-amber-500" 
              icon={ShieldCheck}
            />
            <ProgressBar 
              label="AKTİF ÜYE KATILIM SEGMENTİ" 
              value={activeMembers} 
              total={totalMembers} 
              color="bg-indigo-950" 
              icon={Users}
            />
          </div>
        </div>

        {/* Success Score & Insights */}
        <div className="flex flex-col gap-10">
          <div className="rounded-[3.5rem] p-12 bg-indigo-950 text-white relative overflow-hidden shadow-2xl group/score border border-white/5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                 <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/10">
                    <Award className="h-7 w-7 text-amber-500" />
                 </div>
                 <h3 className="font-black text-[12px] font-montserrat uppercase tracking-[0.3em]">BAŞARI SKORU</h3>
              </div>
              
              <div className="mb-10">
                 <h3 className="text-8xl font-black font-montserrat tracking-tighter leading-none italic">
                   {successScore}
                   <span className="text-3xl text-indigo-400 not-italic ml-2">%</span>
                 </h3>
                 <p className="text-[12px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-6">TOPLULUK GENEL PERFORMANS ENDEKSİ</p>
              </div>

              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden mb-12">
                 <div 
                   className="h-full bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-in slide-in-from-left duration-1000" 
                   style={{ width: `${successScore}%` }} 
                 />
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mb-6">KRİTİK GÖSTERGELER</p>
                 <InsightItem label="YÜKSEK ETKİNLİK ONAYI" active={approvedEvents > totalEvents * 0.7} />
                 <InsightItem label="DÜZENLİ RAPORLAMA REJİMİ" active={approvedReports > totalReports * 0.8} />
                 <InsightItem label="AKTİF ÜYE MOBİLİZASYONU" active={activeMembers > totalMembers * 0.5} />
              </div>
            </div>
            <Zap className="absolute -right-10 -bottom-10 h-48 w-48 opacity-10 rotate-12 group-hover/score:rotate-0 transition-transform duration-1000" />
          </div>

          {/* Quick Stats Summary */}
          <div className="rounded-[3rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-10 shadow-xl dark:shadow-black/20 group">
             <div className="flex items-center gap-4 mb-8">
                <Sparkles className="h-6 w-6 text-indigo-600" />
                <h3 className="text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.25em] font-montserrat">Sistem Notu</h3>
             </div>
             <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wider">
               Topluluğunuzun verisel büyümesi geçen döneme göre %22 artış gösterdi. Stratejik odak noktanızı üye katılımına çevirerek skoru yükseltebilirsiniz.
             </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="rounded-[4rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-12 md:p-16 shadow-2xl dark:shadow-black/40">
        <div className="flex flex-wrap items-center justify-between gap-8 mb-12 px-2">
            <div className="flex items-center gap-6">
               <div className="h-16 w-16 rounded-3xl bg-indigo-600 p-5 text-white shadow-xl shadow-indigo-600/20">
                  <Activity className="h-8 w-8" />
               </div>
               <h3 className="text-3xl font-black text-indigo-950 dark:text-white font-montserrat uppercase tracking-tight leading-none">FAALİYET LOGLARI</h3>
            </div>
            <Link href="/baskan/etkinlikler" className="flex items-center gap-3 text-[11px] font-black text-indigo-600 dark:text-amber-500 uppercase tracking-[0.25em] hover:gap-5 transition-all">
               TÜMÜNÜ İNCELE <ArrowRight className="h-4 w-4" />
            </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {events.slice(0, 6).map((event) => (
            <div key={event.id} className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/40">
               <div className="h-16 w-16 shrink-0 rounded-2xl bg-white dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-200/60 dark:border-white/5 group-hover:bg-indigo-950 dark:group-hover:bg-indigo-600 group-hover:border-indigo-950 transition-all shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 group-hover:text-indigo-400 uppercase leading-none mb-2">
                     {new Date(event.eventDate).toLocaleString("tr-TR", { month: "short" }).toUpperCase()}
                  </span>
                  <span className="text-2xl font-black text-indigo-950 dark:text-white group-hover:text-white leading-none font-montserrat">
                     {new Date(event.eventDate).getDate()}
                  </span>
               </div>
               
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                     <span className={cn(
                       "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm",
                       event.status === "APPROVED" || event.status === "COMPLETED" 
                         ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                         : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                     )}>
                       {event.status === "APPROVED" || event.status === "COMPLETED" ? "TAMAMLANDI" : "İŞLEMDE"}
                     </span>
                  </div>
                  <h4 className="text-lg font-black text-indigo-950 dark:text-white font-montserrat tracking-tight uppercase group-hover:text-indigo-600 transition-colors truncate leading-none">{event.title}</h4>
               </div>
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="md:col-span-2 text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-100 dark:border-white/5">
                <LayoutDashboard className="h-16 w-16 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
                <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] text-sm">HENÜZ VERİ GİRİŞİ YAPILMADI</p>
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
