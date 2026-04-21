import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/permissions";
import { notFound } from "next/navigation";
import { UniversityEditForm } from "@/components/forms/UniversityEditForm";
import { 
  School, 
  MapPin, 
  Users, 
  Building2, 
  ArrowLeft,
  Zap,
  TrendingUp,
  Activity,
  ChevronRight,
  Globe,
  PieChart,
  History,
  Target
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UniversityDetailPage({ params }: PageProps) {
  await requireSuperAdmin();
  const { id } = await params;

  const university = await prisma.university.findUnique({
    where: { id },
    include: {
      communities: {
        include: {
          _count: { select: { members: true, createdEvents: true, reports: true } }
        }
      },
      _count: {
        select: { communities: true, users: true }
      }
    }
  });

  if (!university) notFound();

  const [approvedEventsCount, approvedReportsCount] = await Promise.all([
    prisma.event.count({
      where: { community: { universityId: id }, status: "APPROVED" }
    }),
    prisma.report.count({
      where: { community: { universityId: id }, status: "APPROVED" }
    }),
  ]);

  const totalEvents = university.communities.reduce((acc, c) => acc + c._count.createdEvents, 0);
  const totalReports = university.communities.reduce((acc, c) => acc + c._count.reports, 0);

  const corporateScore = totalEvents > 0 
    ? Math.round(((approvedEventsCount / totalEvents) * 70) + ((approvedReportsCount / Math.max(1, totalReports)) * 30))
    : 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Back Button & Breadcrumb */}
      <div className="flex items-center gap-6 group">
        <Link 
          href="/admin/universiteler"
          className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-950 hover:bg-slate-950 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">KAMPÜS EKOSİSTEMİ / DERİN ANALİZ</p>
          <h2 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic leading-none mt-1">{university.name}</h2>
        </div>
      </div>

      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="col-span-1 lg:col-span-2 relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200 group">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-12 shadow-sm">
              <Target className="h-4 w-4 text-corporate-orange" /> KAMPÜS PERFORMANS ANALİZİ
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              {university.name} <br />
              <span className="text-corporate-blue italic uppercase">{university.city}</span>
            </h1>
            <div className="flex flex-wrap gap-14 mt-14">
               <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                     <Building2 className="h-4 w-4 text-corporate-blue" /> Topluluklar
                  </span>
                  <span className="text-6xl font-black tracking-tighter text-slate-950 italic">{university._count.communities}</span>
               </div>
               <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                     <Users className="h-4 w-4 text-corporate-orange" /> Kurumsal Üye
                  </span>
                  <span className="text-6xl font-black tracking-tighter text-slate-950 italic">{university._count.users}</span>
               </div>
            </div>
          </div>
          
          <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-12 right-12 flex items-center gap-2 opacity-[0.03] scale-150 transform group-hover:rotate-12 transition-transform duration-1000">
             <School className="h-40 w-40" />
          </div>
        </div>

        <div className="t3-panel p-12 flex flex-col justify-center relative overflow-hidden group bg-slate-50/50">
           <div className="relative z-10">
              <div className="h-20 w-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-orange mb-10 shadow-sm group-hover:bg-slate-950 group-hover:text-white transition-all">
                 <TrendingUp className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">KURUMSAL SKOR</h3>
              <p className="t3-label mt-4">OPERASYONEL KAPASİTE</p>
              <div className="mt-12 flex items-end gap-3">
                 <span className="text-7xl font-black text-slate-950 tracking-tighter leading-none italic">%{corporateScore}</span>
                 <p className={cn(
                   "text-[11px] font-black mb-1 uppercase tracking-widest flex items-center gap-1.5 px-4 py-2 rounded-xl border",
                   corporateScore > 50 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100"
                 )}>
                    <Activity className="h-3.5 w-3.5" /> {corporateScore > 50 ? "YÜKSEK" : "GELİŞTİRİLMELİ"}
                 </p>
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-corporate-orange/5 blur-3xl pointer-events-none" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left: Edit Form */}
        <div className="lg:col-span-1 space-y-10">
           <div className="t3-panel p-10 bg-slate-50/30">
              <UniversityEditForm university={university} />
           </div>
           
           <div className="t3-panel p-10 bg-slate-950 text-white relative overflow-hidden group">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-10 border-l-4 border-corporate-orange pl-5 italic">Kampüs Erişimi</h4>
              <div className="space-y-6">
                 <div className="p-7 rounded-2xl bg-white/5 border border-white/10 group/link hover:bg-white hover:text-slate-950 transition-all cursor-pointer">
                    <p className="text-[10px] text-white/50 group-hover/link:text-slate-400 font-black uppercase tracking-[0.3em] mb-2 leading-none">Sistem Dokümanı</p>
                    <p className="text-sm font-black uppercase tracking-widest italic">Hızlı Erişim Panelini Aç</p>
                 </div>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                <Globe className="h-24 w-24" />
              </div>
           </div>
        </div>

        {/* Right: Communities Content */}
        <div className="lg:col-span-2 space-y-10">
           <div className="flex flex-wrap items-center justify-between gap-6 px-4">
              <div>
                <h3 className="t3-heading text-3xl text-slate-950 tracking-tighter italic uppercase">Birim Ekosistemi</h3>
                <p className="t3-label">KAMPÜS BÜNYESİNDEKİ TÜM AKTİF TOPLULUKLAR</p>
              </div>
              <div className="h-1.5 w-24 rounded-full bg-corporate-blue/10" />
           </div>

           <div className="grid md:grid-cols-2 gap-8">
              {university.communities.map((community) => (
                 <Link 
                   href={`/admin/topluluklar/${community.id}`}
                   key={community.id} 
                   className="t3-panel group p-10 bg-white hover:bg-slate-50 transition-all border-l-[16px] border-l-slate-200 hover:border-l-corporate-blue overflow-hidden shadow-sm"
                 >
                    <div className="relative z-10 flex flex-col h-full">
                       <div className="flex items-center justify-between mb-10">
                          <div className="h-16 w-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-950 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                             <Building2 className="h-8 w-8" />
                          </div>
                          <div className={cn(
                             "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all",
                             community.status === "ACTIVE" 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                : "bg-slate-50 text-slate-400 border-slate-200"
                          )}>
                             {community.status === "ACTIVE" ? "AKTİF BİRİM" : "PASİF"}
                          </div>
                       </div>
                       
                       <h4 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic italic group-hover:text-corporate-blue transition-colors leading-tight">{community.name}</h4>
                       <p className="mt-3 text-[11px] text-slate-400 font-black uppercase tracking-[0.3em]">@{community.shortName}</p>
                       
                       <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="flex -space-x-3">
                                {[1,2,3].map(i => (
                                   <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 shadow-sm" />
                                ))}
                             </div>
                             <span className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] italic">{community._count.members} ÜYE</span>
                          </div>
                          <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-slate-950 group-hover:bg-white transition-all">
                             <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                       </div>
                    </div>
                    {/* Watermark */}
                    <Zap className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000" />
                 </Link>
              ))}
              
              {university.communities.length === 0 && (
                 <div className="col-span-2 t3-panel-elevated p-28 text-center bg-slate-50/50 border-dashed border-2">
                    <History className="h-12 w-12 text-slate-200 mx-auto mb-6" />
                    <p className="t3-label">BU KAMPÜSE BAĞLI HENÜZ KURUMSAL BİR TOPLULUK YAPILANDIRMASI BULUNMAMAKTADIR</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

