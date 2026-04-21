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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-corporate-orange" /> RAPOR DENETİM PANELİ
            </div>
            <h1 className="text-6xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              FAALİYET <br />
              <span className="text-corporate-blue">ANALİZİ</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Gerçekleştirilen operasyonların kanıtlarını inceleyin, katılım verilerini doğrulayın ve toplulukların <span className="text-slate-950 font-bold">kurumsal performans</span> puanlarını belirleyin.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-corporate-orange uppercase tracking-[0.3em] mb-4">İNCELEME BEKLEYEN</p>
              <p className="text-6xl font-black tracking-tighter text-corporate-orange leading-none">{reports.length}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-orange/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <FileSearch className="h-40 w-40" />
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div>
            <h2 className="t3-heading text-4xl text-slate-950 tracking-tighter">Rapor Havuzu</h2>
            <div className="flex items-center gap-3 mt-4">
               <div className="h-1.5 w-16 rounded-full bg-corporate-orange" />
               <p className="t3-label">{reports.length} DOSYA KARAR BEKLİYOR</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <form className="relative group">
              <FileSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-corporate-orange transition-colors" />
              <input 
                name="q"
                type="text" 
                defaultValue={search}
                placeholder="Topluluk veya Rapor ara..." 
                className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all w-72 shadow-sm text-slate-950" 
              />
            </form>
            {(search) && (
              <a href="/admin/rapor-onaylari" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2">
                Temizle
              </a>
            )}
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="t3-panel-elevated p-28 text-center bg-slate-50/50 border-dashed border-2">
            <div className="mx-auto w-24 h-24 rounded-full bg-white flex items-center justify-center mb-10 border border-slate-200 shadow-sm">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-950 tracking-tight uppercase italic">Denetim Tamamlandı</h3>
            <p className="t3-label mt-5 max-w-sm mx-auto">Şu an için onay bekleyen herhangi bir faaliyet raporu bulunmamaktadır.</p>
          </div>
        ) : null}

        <div className="grid gap-12">
          {reports.map((report) => (
            <article key={report.id} className="t3-panel group overflow-hidden border-l-[16px] border-l-corporate-orange bg-slate-50/30">
               <div className="p-10 md:p-14">
                 <div className="flex flex-wrap items-start justify-between gap-10 pb-10 border-b border-slate-200">
                   <div className="space-y-6">
                     <div className="flex items-center gap-5 flex-wrap">
                       <h2 className="text-3xl font-black text-slate-950 tracking-tighter leading-tight group-hover:text-corporate-orange transition-colors uppercase italic">{report.title}</h2>
                       <ReportTypeBadge type={report.reportType} />
                     </div>
                     <div className="flex flex-wrap items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                          <Building2 className="h-4 w-4 text-corporate-orange" />
                          <span className="text-slate-950">{report.community.university.name} / {report.community.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <User className="h-4 w-4 text-corporate-blue" />
                           <span className="text-slate-700">{report.creator.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Clock className="h-4 w-4 text-slate-300" />
                           <span>{new Date(report.createdAt).toLocaleString("tr-TR")}</span>
                        </div>
                     </div>
                   </div>
                   <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                      <ChevronRight className="h-8 w-8" />
                   </div>
                 </div>

                 <div className="mt-12 grid lg:grid-cols-2 gap-16">
                   <div className="space-y-12">
                      <div className="space-y-5">
                        <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.3em] flex items-center gap-3">
                           <FileText className="h-4 w-4 text-corporate-blue" /> RAPOR İÇERİĞİ & ÖZETİ
                        </h4>
                        <div className="p-10 rounded-2xl bg-white border border-slate-200 text-slate-600 font-medium leading-relaxed text-lg shadow-sm transition-all group-hover:border-corporate-orange/30">
                          {report.summary}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-6">
                        <div className="px-8 py-5 bg-white shadow-sm rounded-2xl border border-slate-200 flex items-center gap-5">
                          <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-corporate-blue border border-slate-100">
                             <TrendingUp className="h-6 w-6" />
                          </div>
                          <span className="text-lg font-black text-slate-950 tracking-tighter">{report.participantCount || 0} ÜYE KATILIMI</span>
                        </div>
                        <div className="px-8 py-5 bg-white shadow-sm rounded-2xl border border-slate-200 flex items-center gap-5 group/item cursor-pointer hover:border-corporate-orange/50 transition-all">
                          <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-corporate-orange border border-slate-100 group-hover/item:scale-110 transition-transform">
                             <ImageIcon className="h-6 w-6" />
                          </div>
                          <span className="text-lg font-black text-slate-950 tracking-tighter">{report.mediaFiles.length} GÖRSEL</span>
                        </div>
                        <div className="px-8 py-5 bg-white shadow-sm rounded-2xl border border-slate-200 flex items-center gap-5 group/item cursor-pointer hover:border-corporate-blue/50 transition-all">
                          <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-corporate-blue border border-slate-100 group-hover/item:scale-110 transition-transform">
                             <Paperclip className="h-6 w-6" />
                          </div>
                          <span className="text-lg font-black text-slate-950 tracking-tighter">{report.documents.length} BELGE</span>
                        </div>
                      </div>
                   </div>

                   <ReportReviewForm reportId={report.id} />
                 </div>
               </div>
               
               {/* Visual Watermark */}
               <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000">
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
      "flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all",
      config.color
    )}>
      <span className={cn("h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]", config.indicator)} />
      {config.label}
    </span>
  );
}
