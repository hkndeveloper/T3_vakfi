import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { ReportForm } from "@/components/forms/ReportForm";
import { MediaUploadForm } from "@/components/forms/MediaUploadForm";
import { SubmitReportButton } from "@/components/forms/SubmitReportButton";
import { 
  FileText, 
  Image as ImageIcon, 
  Paperclip, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  LayoutDashboard,
  FileSearch,
  ArrowUpRight,
  Zap,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function PresidentReportsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];
  const { q: search } = await searchParams;

  const [events, reports] = await Promise.all([
    prisma.event.findMany({
      where: { communityId },
      orderBy: { eventDate: "desc" },
      select: { id: true, title: true },
      take: 100,
    }),
    prisma.report.findMany({
      where: { 
        communityId,
        ...(search ? { title: { contains: search, mode: "insensitive" } } : {})
      },
      orderBy: { createdAt: "desc" },
      include: {
        event: true,
        mediaFiles: true,
        documents: true,
      },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <Zap className="h-4 w-4 text-corporate-orange" /> KURUMSAL ARŞİV
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              RAPOR <br />
              <span className="text-corporate-blue italic">DENETİMİ</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Topluluk faaliyetlerini profesyonel standartlarda belgelendirin, medya dosyalarını sisteme entegre edin ve onay süreçlerini <span className="text-slate-950 font-bold decoration-corporate-blue decoration-4 underline underline-offset-4">kurumsal hiyerarşide</span> takip edin.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">KAYITLI DOSYA</p>
              <p className="text-5xl font-black text-slate-950 tracking-tighter leading-none italic">{reports.length}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <FileText className="h-32 w-32" />
        </div>
      </div>

      <div className="t3-panel p-10 md:p-12 bg-slate-50/30">
        <ReportForm events={events} />
      </div>

      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                <FileSearch className="h-7 w-7" />
             </div>
             <div>
                <h2 className="t3-heading text-3xl text-slate-950 tracking-tighter">Rapor Veritabanı</h2>
                <p className="t3-label">SİSTEM ÜZERİNDEKİ TÜM KURUMSAL KAYITLAR</p>
             </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <form className="relative group">
              <FileSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-corporate-blue transition-colors" />
              <input 
                name="q"
                type="text" 
                defaultValue={search}
                placeholder="Rapor ara..." 
                className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all w-64 shadow-sm text-slate-950" 
              />
            </form>
            {(search) && (
              <a href="/baskan/raporlar" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2">
                Temizle
              </a>
            )}
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="t3-panel-elevated p-28 text-center bg-slate-50/50 border-dashed border-2">
            <div className="mx-auto w-24 h-24 rounded-full bg-white flex items-center justify-center mb-10 border border-slate-200 shadow-sm">
              <FileText className="h-12 w-12 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-950 tracking-tight uppercase italic">Veri Girişi Bulunmuyor</h3>
            <p className="t3-label mt-5">İlk raporunuzu oluşturarak topluluk geçmişini inşa etmeye başlayın.</p>
          </div>
        ) : (
          <div className="grid gap-12">
            {reports.map((report) => (
              <div key={report.id} className="t3-panel group overflow-hidden relative transition-all hover:bg-slate-50/30 border-l-[16px] border-l-corporate-blue">
                <div className="p-10 md:p-12">
                  <div className="flex flex-wrap items-start justify-between gap-10 border-b border-slate-200 pb-10">
                    <div className="space-y-6 flex-1">
                      <div className="flex flex-wrap items-center gap-6">
                        <Link href={`/baskan/raporlar/${report.id}`} className="group/title">
                           <h3 className="text-3xl font-black text-slate-950 tracking-tighter leading-tight group-hover:text-corporate-blue transition-colors uppercase italic">{report.title}</h3>
                        </Link>
                        <ReportTypeBadge type={report.reportType} />
                      </div>
                      <div className="flex flex-wrap items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-4 w-4 text-corporate-orange" />
                          <span>{report.participantCount || 0} KATILIMCI</span>
                        </div>
                        {report.event && (
                          <div className="flex items-center gap-3 border-l border-slate-200 pl-8">
                            <ShieldCheck className="h-4 w-4 text-corporate-blue" />
                            <span>{report.event.title.toUpperCase()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-8">
                           <Clock className="h-4 w-4 text-slate-300" />
                           <span>{new Date(report.createdAt).toLocaleDateString("tr-TR")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-8">
                      <ReportStatusBadge status={report.status} />
                      {(report.status === "DRAFT" || report.status === "REVISION_REQUESTED") ? (
                        <SubmitReportButton reportId={report.id} />
                      ) : (
                        <Link 
                          href={`/baskan/raporlar/${report.id}`}
                          className="h-12 w-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-950 hover:bg-corporate-blue hover:text-white transition-all group/btn"
                        >
                           <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="mt-10 relative">
                     <p className="text-lg text-slate-600 leading-relaxed font-medium bg-white/50 p-8 rounded-2xl border border-slate-100 italic">
                      "{report.summary}"
                     </p>
                  </div>

                  {report.adminNote && (
                    <div className="mt-10 p-8 rounded-2xl bg-orange-50 border border-orange-100 flex gap-6 animate-in slide-in-from-left-4 duration-700">
                      <div className="h-12 w-12 rounded-xl bg-corporate-orange flex items-center justify-center shrink-0 shadow-lg shadow-corporate-orange/20">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[10px] font-black text-corporate-orange uppercase tracking-[0.3em] mb-1">DENETİM GERİ BİLDİRİMİ</p>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">{report.adminNote}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-12 grid gap-12 md:grid-cols-2 pt-10 border-t border-slate-100">
                    <div className="space-y-6">
                      <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-950 uppercase tracking-[0.3em]">
                        <ImageIcon className="h-4 w-4 text-corporate-blue" /> MEDYA KANITLARI ({report.mediaFiles.length})
                      </h4>
                      {report.mediaFiles.length > 0 ? (
                        <div className="grid grid-cols-4 gap-4">
                          {report.mediaFiles.map((media) => (
                            <a 
                              key={media.id} 
                              href={media.filePath} 
                              target="_blank" 
                              className="group/media relative aspect-square rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:scale-105"
                            >
                              {media.fileType.startsWith("image") ? (
                                <img src={media.filePath} alt={media.fileName} className="h-full w-full object-cover transition-transform duration-1000 group-hover/media:scale-110" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                                  <FileText className="h-8 w-8" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover/media:opacity-100 transition-all duration-300 flex items-center justify-center translate-y-2 group-hover/media:translate-y-0">
                                <ExternalLink className="h-6 w-6 text-white" />
                              </div>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="p-10 rounded-2xl border border-dashed border-slate-200 text-center bg-slate-50/50">
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">DOSYA EKLENMEDİ</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-950 uppercase tracking-[0.3em]">
                        <Paperclip className="h-4 w-4 text-corporate-orange" /> RESMİ DOKÜMANTASYON ({report.documents.length})
                      </h4>
                      {report.documents.length > 0 ? (
                        <div className="grid gap-4">
                          {report.documents.map((doc) => (
                            <a 
                              key={doc.id} 
                              href={doc.filePath} 
                              target="_blank" 
                              className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-corporate-blue transition-all group/doc"
                            >
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all">
                                  <FileText className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-black text-slate-950 truncate max-w-[180px] uppercase tracking-tight">{doc.title}</span>
                              </div>
                              <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-corporate-blue transition-all" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="p-10 rounded-2xl border border-dashed border-slate-200 text-center bg-slate-50/50">
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">BELGE EKLENMEDİ</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {(report.status === "DRAFT" || report.status === "REVISION_REQUESTED") && (
                    <div className="mt-12 pt-10 border-t border-slate-100">
                       <div className="flex items-center gap-4 mb-8 px-2">
                         <Sparkles className="h-5 w-5 text-corporate-blue" />
                         <span className="text-[11px] font-black text-slate-950 uppercase tracking-[0.3em]">Ek Kanıt Yükleme Terminali</span>
                       </div>
                      <div className="t3-panel bg-slate-50/50 p-10 border-dashed">
                        <MediaUploadForm reportId={report.id} communityId={communityId} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReportTypeBadge({ type }: { type: string }) {
  const types: Record<string, { label: string; color: string; indicator: string }> = {
    EVENT: { label: "ETKİNLİK", color: "bg-blue-50 text-corporate-blue border-blue-100", indicator: "bg-corporate-blue shadow-[0_0_10px_rgba(37,99,235,0.3)]" },
    MONTHLY: { label: "AYLIK", color: "bg-orange-50 text-corporate-orange border-orange-100", indicator: "bg-corporate-orange shadow-[0_0_10px_rgba(234,88,12,0.3)]" },
    TERM: { label: "DÖNEM", color: "bg-slate-50 text-slate-700 border-slate-200", indicator: "bg-slate-500" },
  };
  const config = types[type] || { label: type, color: "bg-slate-100 text-slate-700 border-slate-100", indicator: "bg-slate-500" };
  return (
    <span className={cn(
      "flex items-center gap-3 px-5 py-2.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] transition-all shadow-sm bg-white",
      config.color
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.indicator)} />
      {config.label}
    </span>
  );
}

function ReportStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; icon: any; color: string; dot: string }> = {
    DRAFT: { label: "TASLAK", icon: Clock, color: "bg-slate-50 text-slate-500 border-slate-100", dot: "bg-slate-300" },
    SUBMITTED: { label: "DENETİMDE", icon: Clock, color: "bg-orange-50 text-corporate-orange border-orange-100", dot: "bg-corporate-orange animate-pulse shadow-[0_0_12px_rgba(234,88,12,0.4)]" },
    APPROVED: { label: "ONAYLANDI", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" },
    REJECTED: { label: "REDDEDİLDİ", icon: AlertCircle, color: "bg-rose-50 text-rose-600 border-rose-100", dot: "bg-rose-600" },
    REVISION_REQUESTED: { label: "REVİZYON", icon: AlertCircle, color: "bg-orange-50 text-corporate-orange border-orange-100", dot: "bg-corporate-orange animate-bounce shadow-[0_0_15px_rgba(234,88,12,0.5)]" },
  };

  const config = configs[status] || configs.DRAFT;

  return (
    <span className={cn(
      "inline-flex items-center gap-4 rounded-2xl border px-8 py-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all shadow-sm font-outfit",
      config.color
    )}>
      <span className={cn("h-2.5 w-2.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
