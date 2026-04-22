import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  ImageIcon, 
  Paperclip, 
  TrendingUp, 
  Building2, 
  User, 
  FileSearch, 
  Fingerprint 
} from "lucide-react";
import { cn } from "@/lib/utils";

import { ReportReviewForm } from "@/components/admin/ReportReviewForm";

export default async function AdminReportApprovalsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requirePermission("report.approve");
  const { q: search } = await searchParams;

  const reports = await prisma.report.findMany({
    where: {
      status: { in: ["SUBMITTED", "IN_REVIEW"] },
      ...(search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { community: { name: { contains: search, mode: "insensitive" } } }
        ]
      } : {})
    },
    orderBy: { createdAt: "asc" },
    include: {
      community: {
        include: {
          university: true,
        },
      },
      creator: true,
      mediaFiles: true,
      documents: true,
    },
  });

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section - RESPONSIVE */}
      <div className="relative overflow-hidden rounded-xl md:rounded-t3-xl bg-slate-100/50 p-6 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 md:gap-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-1.5 md:px-5 md:py-2 text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-6 md:mb-10 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-corporate-orange" /> RAPOR DENETİM PANELİ
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] uppercase text-slate-950 italic">
              FAALİYET <br />
              <span className="text-corporate-blue">ANALİZİ</span>
            </h1>
            <p className="mt-6 md:mt-10 text-base md:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Gerçekleştirilen operasyonların kanıtlarını inceleyin ve toplulukların <span className="text-slate-950 font-bold">kurumsal performans</span> puanlarını belirleyin.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <div className="group/stat rounded-xl md:rounded-2xl bg-white px-8 py-6 md:px-12 md:py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[9px] md:text-[10px] font-black text-corporate-orange uppercase tracking-[0.3em] mb-2 md:mb-4">İNCELENECEK DOSYA</p>
              <p className="text-4xl md:text-6xl font-black tracking-tighter text-corporate-orange leading-none">{reports.length}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-64 md:h-[500px] w-64 md:w-[500px] rounded-full bg-corporate-orange/5 blur-[80px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 hidden md:flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <FileSearch className="h-40 w-40" />
        </div>
      </div>

      <div className="space-y-8 md:space-y-10 px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-2 md:px-4">
          <div>
            <h2 className="t3-heading text-2xl md:text-4xl text-slate-950 tracking-tighter">Rapor Havuzu</h2>
            <div className="flex items-center gap-3 mt-2 md:mt-4">
               <div className="h-1 md:h-1.5 w-10 md:w-16 rounded-full bg-corporate-orange" />
               <p className="t3-label text-[9px] md:text-[10px]">{reports.length} DOSYA KARAR BEKLİYOR</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <form className="relative group w-full md:w-80">
              <FileSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within:text-corporate-orange transition-colors" />
              <input 
                name="q"
                type="text" 
                defaultValue={search}
                placeholder="Rapor ara..." 
                className="pl-11 md:pl-12 pr-4 md:pr-6 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all w-full shadow-sm text-slate-950" 
              />
            </form>
            {(search) && (
              <a href="/admin/rapor-onaylari" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2 shrink-0">
                Temizle
              </a>
            )}
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="t3-panel-elevated p-12 md:p-28 text-center bg-slate-50/50 border-dashed border-2">
            <div className="mx-auto w-16 h-16 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center mb-10 border border-slate-200 shadow-sm">
              <CheckCircle2 className="h-8 md:h-12 w-8 md:w-12 text-emerald-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight uppercase italic">Denetim Tamamlandı</h3>
            <p className="t3-label mt-5 max-w-sm mx-auto text-[10px]">Şu an için onay bekleyen herhangi bir faaliyet raporu bulunmamaktadır.</p>
          </div>
        ) : null}

        <div className="grid gap-8 md:gap-12">
          {reports.map((report) => (
            <article key={report.id} className="t3-panel group overflow-hidden border-l-[8px] md:border-l-[16px] border-l-corporate-orange bg-slate-50/30">
               <div className="p-6 md:p-14">
                 <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-10 pb-6 md:pb-10 border-b border-slate-200">
                   <div className="space-y-4 md:space-y-6">
                     <div className="flex flex-col md:flex-row md:items-center gap-4">
                       <h2 className="text-xl md:text-3xl font-black text-slate-950 tracking-tighter leading-tight group-hover:text-corporate-orange transition-colors uppercase italic">{report.title}</h2>
                       <ReportTypeBadge type={report.reportType} />
                     </div>
                     <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <div className="flex items-center gap-3 bg-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl border border-slate-200 shadow-sm w-fit">
                          <Building2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-corporate-orange" />
                          <span className="text-slate-950 truncate max-w-[200px] md:max-w-none">{report.community.university.name} / {report.community.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-corporate-blue" />
                           <span className="text-slate-700">{report.creator.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-slate-300" />
                           <span>{new Date(report.createdAt).toLocaleString("tr-TR")}</span>
                        </div>
                     </div>
                   </div>
                   <div className="hidden md:flex h-16 w-16 rounded-2xl bg-white border border-slate-200 items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                      <ChevronRight className="h-8 w-8" />
                   </div>
                 </div>

                 <div className="mt-8 md:mt-12 grid lg:grid-cols-2 gap-10 md:gap-16">
                   <div className="space-y-8 md:space-y-12">
                      <div className="space-y-4 md:space-y-5">
                        <h4 className="text-[10px] md:text-[11px] font-black text-slate-950 uppercase tracking-[0.3em] flex items-center gap-3">
                           <FileText className="h-4 w-4 text-corporate-blue" /> RAPOR İÇERİĞİ & ÖZETİ
                        </h4>
                        <div className="p-6 md:p-10 rounded-xl md:rounded-2xl bg-white border border-slate-200 text-slate-600 font-medium leading-relaxed text-base md:text-lg shadow-sm transition-all group-hover:border-corporate-orange/30">
                          {report.summary}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6">
                        <div className="px-6 py-4 md:px-8 md:py-5 bg-white shadow-sm rounded-xl md:rounded-2xl border border-slate-200 flex items-center gap-4 md:gap-5">
                          <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-corporate-blue border border-slate-100">
                             <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
                          </div>
                          <span className="text-base md:text-lg font-black text-slate-950 tracking-tighter">{report.participantCount || 0} ÜYE KATILIMI</span>
                        </div>
                        <div className="px-6 py-4 md:px-8 md:py-5 bg-white shadow-sm rounded-xl md:rounded-2xl border border-slate-200 flex items-center gap-4 md:gap-5 group/item cursor-pointer hover:border-corporate-orange/50 transition-all">
                          <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-corporate-orange border border-slate-100 group-hover/item:scale-110 transition-transform">
                             <ImageIcon className="h-5 w-5 md:h-6 md:w-6" />
                          </div>
                          <span className="text-base md:text-lg font-black text-slate-950 tracking-tighter">{report.mediaFiles.length} GÖRSEL</span>
                        </div>
                        <div className="px-6 py-4 md:px-8 md:py-5 bg-white shadow-sm rounded-xl md:rounded-2xl border border-slate-200 flex items-center gap-4 md:gap-5 group/item cursor-pointer hover:border-corporate-blue/50 transition-all">
                          <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-corporate-blue border border-slate-100 group-hover/item:scale-110 transition-transform">
                             <Paperclip className="h-5 w-5 md:h-6 md:w-6" />
                          </div>
                          <span className="text-base md:text-lg font-black text-slate-950 tracking-tighter">{report.documents.length} BELGE</span>
                        </div>
                      </div>
                   </div>

                   <ReportReviewForm reportId={report.id} />
                 </div>
               </div>
               
               {/* Visual Watermark */}
               <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000 hidden md:block">
                  <Fingerprint className="h-64 w-64" />
               </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportTypeBadge({ type }: { type: string }) {
  const types: Record<string, { label: string; color: string; indicator: string }> = {
    EVENT: { label: "ETKİNLİK", color: "bg-indigo-50 text-indigo-600 border-indigo-100", indicator: "bg-indigo-500" },
    MONTHLY: { label: "AYLIK", color: "bg-amber-50 text-amber-600 border-amber-100", indicator: "bg-amber-500" },
    TERM: { label: "DÖNEM", color: "bg-indigo-500 text-white border-indigo-400", indicator: "bg-white" },
  };
  const config = types[type] || { label: type, color: "bg-slate-100 text-slate-700 border-slate-100", indicator: "bg-slate-500" };
  return (
    <span className={cn(
      "flex items-center gap-2.5 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-2xl border text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all w-fit",
      config.color
    )}>
      <span className={cn("h-1.5 md:h-2 w-1.5 md:w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]", config.indicator)} />
      {config.label}
    </span>
  );
}
