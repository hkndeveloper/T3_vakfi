import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { 
  Building2, 
  GraduationCap, 
  Users, 
  Trophy, 
  FileText, 
  UserCircle, 
  Zap, 
  Sparkles, 
  ChevronRight,
  Target,
  LayoutDashboard,
  ShieldCheck,
  Star,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function MyCommunityPage() {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const community = await prisma.community.findUnique({
    where: { id: communityId },
    include: {
      university: true,
      _count: {
        select: {
          members: true,
          createdEvents: true,
          reports: true,
        },
      },
    },
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-outfit pb-20">
      {/* T3 Premium Hero Section */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-indigo-950 p-12 md:p-16 text-white shadow-2xl group border border-white/5">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/30 px-5 py-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-10 animate-pulse-subtle">
            <Building2 className="h-4 w-4 fill-amber-500" /> KURUMSAL KİMLİK
          </div>
          <h1 className="text-6xl font-black tracking-tighter sm:text-7xl font-montserrat leading-[0.9] uppercase">
            {community?.shortName || "TOPLULUĞUM"} <br />
            <span className="text-indigo-400 italic border-b-8 border-amber-500/30">ÜSSÜ</span>
          </h1>
          <p className="mt-10 text-xl text-slate-300/80 font-medium max-w-2xl leading-relaxed">
            {community?.name} ekosisteminin kurumsal verilerini, akademik entegrasyonlarını ve performans metriklerini profesyonel standartlarda denetleyin.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-indigo-500/10 opacity-30 blur-[130px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-10 scale-150 transform group-hover:rotate-12 transition-transform duration-1000">
           <Star className="h-40 w-40 fill-white" />
        </div>
      </div>

      <div className="grid gap-10">
        <div className="grid gap-8 md:grid-cols-2">
          <InfoCard icon={Target} label="STRATEJİK İSİMLENDİRME" value={community?.name ?? "-"} color="indigo" />
          <InfoCard icon={Zap} label="OPERASYONEL KOD" value={community?.shortName ?? "-"} color="amber" />
          <InfoCard icon={GraduationCap} label="AKADEMİK MERKEZ" value={community?.university.name ?? "-"} color="indigo" />
          <InfoCard icon={UserCircle} label="AKADEMİK DANIŞMAN" value={community?.advisorName ?? "-"} color="amber" />
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid gap-8 md:grid-cols-3 pt-6">
          <StatCard icon={Users} label="AKTİF EKOSİSTEM KAYNAĞI" value={String(community?._count.members ?? 0)} color="indigo" trend="+12%" />
          <StatCard icon={Trophy} label="OPERASYONEL HACİM" value={String(community?._count.createdEvents ?? 0)} color="amber" trend="BU DÖNEM" />
          <StatCard icon={FileText} label="BELGELENMİŞ ÇIKTILAR" value={String(community?._count.reports ?? 0)} color="indigo" trend="ONAYLI" />
        </div>
      </div>
      
      {/* Footer Insight Section */}
      <div className="rounded-[4rem] bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 p-12 flex flex-col items-center text-center gap-8 relative overflow-hidden group/footer shadow-inner">
         <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-3 bg-indigo-600/10 px-6 py-2 rounded-full border border-indigo-600/20 mb-4 animate-bounce">
               <ShieldCheck className="h-5 w-5 text-indigo-600" />
               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] font-montserrat">KURUMSAL DENETİM SEVİYESİ: AKTİF</span>
            </div>
            <h4 className="text-2xl font-black text-indigo-950 dark:text-white uppercase tracking-tight font-montserrat leading-none">PROFESYONEL STANDARTLAR</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Topluluk verileri ve istatistiksel segmentasyon T3 Vakfı denetim protokollerine göre anlık olarak optimize edilerek raporlanmaya hazırdır.
            </p>
         </div>
         <div className="flex items-center gap-2 text-indigo-400 dark:text-indigo-600 opacity-20">
            <Sparkles className="h-10 w-10 animate-pulse" />
            <Sparkles className="h-6 w-6 animate-pulse delay-75" />
            <Sparkles className="h-8 w-8 animate-pulse delay-150" />
         </div>
         
         <div className="absolute -left-10 -bottom-10 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: "indigo" | "amber" }) {
  const configs = {
    indigo: "border-l-indigo-600 bg-white dark:bg-slate-900 shadow-xl dark:shadow-black/20",
    amber: "border-l-amber-500 bg-white dark:bg-slate-900 shadow-xl dark:shadow-black/20",
  };
  
  const iconConfigs = {
    indigo: "bg-indigo-600 shadow-indigo-600/20 text-white",
    amber: "bg-amber-500 shadow-amber-500/20 text-white",
  };

  return (
    <div className={cn("rounded-[2.5rem] border border-slate-50 dark:border-white/5 p-10 transition-all hover:translate-x-3 border-l-[10px] group", configs[color])}>
      <div className="flex items-center gap-8">
        <div className={cn("h-16 w-16 rounded-[1.25rem] flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", iconConfigs[color])}>
           <Icon className="h-8 w-8" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-montserrat">{label}</p>
          <p className="text-2xl font-black text-indigo-950 dark:text-white leading-none tracking-tight font-montserrat uppercase shrink-0 transition-colors group-hover:text-indigo-600 dark:group-hover:text-amber-500">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend }: { icon: any; label: string; value: string; color: "indigo" | "amber", trend?: string }) {
  const configs = {
    indigo: "bg-indigo-950 text-white shadow-indigo-950/20",
    amber: "bg-amber-500 text-white shadow-amber-500/20",
  };

  return (
    <div className={cn("rounded-[3.5rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl transition-all hover:scale-[1.05] active:scale-95 group relative overflow-hidden", configs[color])}>
      <div className="relative z-10 flex flex-col items-center">
        <div className="h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-10 transition-transform duration-500 group-hover:-translate-y-2">
           <Icon className="h-10 w-10 opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.3em] mb-4 font-montserrat opacity-70 group-hover:opacity-100 transition-opacity">{label}</span>
        <span className="text-7xl font-black font-montserrat tracking-tighter leading-none italic group-hover:scale-110 transition-transform duration-700">{value}</span>
        {trend && (
           <div className="mt-8 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-[9px] font-black tracking-widest uppercase">
              {trend} ANALİZİ
           </div>
        )}
      </div>
      
      {/* Background Graphic */}
      <Icon className="absolute -right-10 -bottom-10 h-48 w-48 opacity-10 rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
    </div>
  );
}
