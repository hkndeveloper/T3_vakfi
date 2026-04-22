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
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Globe,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PresidentProfileEditModal } from "@/components/forms/PresidentProfileEditModal";
import { Instagram, Twitter, Mail as MailIcon } from "lucide-react";

export default async function MyCommunityPage() {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

    if (!communityId) return null;

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

    if (!community) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-outfit pb-20">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
            <Building2 className="h-4 w-4 text-corporate-blue" /> KURUMSAL KİMLİK
          </div>
          <div className="flex flex-wrap items-end justify-between gap-10">
            <div className="max-w-2xl text-left">
              <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
                {community.shortName} <br />
                <span className="text-corporate-blue italic">ÜSSÜ</span>
              </h1>
              <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
                {community.name} ekosisteminin kurumsal verilerini, akademik entegrasyonlarını ve performans metriklerini <span className="text-slate-950 font-bold underline decoration-corporate-blue/30 decoration-4 underline-offset-4">profesyonel standartlarda</span> denetleyin.
              </p>
            </div>
            
            <div className="pb-4 shrink-0">
               <PresidentProfileEditModal community={community as any} />
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <Star className="h-32 w-32" />
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
          <StatCard icon={Users} label="AKTİF EKOSİSTEM KAYNAĞI" value={String(community._count.members ?? 0)} color="indigo" trend="+12%" />
          <StatCard icon={Trophy} label="OPERASYONEL HACİM" value={String(community._count.createdEvents ?? 0)} color="amber" trend="BU DÖNEM" />
          <StatCard icon={FileText} label="BELGELENMİŞ ÇIKTILAR" value={String(community._count.reports ?? 0)} color="indigo" trend="ONAYLI" />
        </div>

        {/* Social & Contact Grid */}
        <div className="grid gap-8 md:grid-cols-4 pt-4">
           <LinkCard icon={MailIcon} label="KURUMSAL İLETİŞİM" value={(community as any).contactEmail || "TANIMLANMADI"} href={(community as any).contactEmail ? `mailto:${(community as any).contactEmail}` : undefined} />
           <LinkCard icon={Instagram} label="INSTAGRAM" value={(community as any).instagram || "TANIMLANMADI"} href={(community as any).instagram ? `https://instagram.com/${(community as any).instagram.replace('@', '')}` : undefined} />
           <LinkCard icon={Twitter} label="X (TWITTER)" value={(community as any).twitter || "TANIMLANMADI"} href={(community as any).twitter ? `https://twitter.com/${(community as any).twitter.replace('@', '')}` : undefined} />
           <LinkCard icon={Globe} label="WEB PORTALI" value={(community as any).website || "TANIMLANMADI"} href={(community as any).website} />
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

function LinkCard({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
  const content = (
    <div className="rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900/50 p-8 transition-all hover:scale-[1.05] hover:shadow-xl group">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-xs font-bold text-indigo-950 dark:text-white truncate max-w-[150px]">{value}</p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>;
  }

  return content;
}

function InfoCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: "indigo" | "amber" }) {
  return (
    <div className={cn(
      "t3-panel p-10 flex items-center gap-8 group transition-all hover:translate-x-3",
      color === "indigo" ? "border-l-[12px] border-l-corporate-blue" : "border-l-[12px] border-l-corporate-orange"
    )}>
      <div className={cn(
        "h-14 w-14 rounded-2xl flex items-center justify-center border shadow-sm transition-transform duration-500 group-hover:scale-110",
        color === "indigo" ? "bg-blue-50 text-corporate-blue border-blue-100" : "bg-orange-50 text-corporate-orange border-orange-100"
      )}>
         <Icon className="h-7 w-7" />
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        <p className="t3-label">{label}</p>
        <p className="text-2xl font-black text-slate-950 leading-none tracking-tighter italic uppercase truncate">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend }: { icon: any; label: string; value: string; color: "indigo" | "amber", trend?: string }) {
  return (
    <div className="t3-panel p-12 flex flex-col items-center justify-center text-center group relative overflow-hidden bg-white">
      <div className="relative z-10 flex flex-col items-center">
        <div className={cn(
          "h-16 w-16 rounded-2xl flex items-center justify-center border shadow-sm mb-8 transition-transform duration-500 group-hover:-translate-y-2",
          color === "indigo" ? "bg-blue-50 text-corporate-blue border-blue-100" : "bg-orange-50 text-corporate-orange border-orange-100"
        )}>
           <Icon className="h-8 w-8" />
        </div>
        <span className="t3-label mb-4 opacity-70 group-hover:opacity-100 transition-opacity">{label}</span>
        <span className="text-6xl font-black text-slate-950 tracking-tighter leading-none italic group-hover:scale-110 transition-transform duration-700">{value}</span>
        {trend && (
           <div className="mt-8 px-5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[9px] font-black tracking-widest uppercase text-slate-400">
              {trend} ANALİZİ
           </div>
        )}
      </div>
      
      <Icon className="absolute -right-10 -bottom-10 h-32 w-32 opacity-[0.02] rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
    </div>
  );
}
