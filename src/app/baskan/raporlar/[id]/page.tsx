import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { MediaUploadForm } from "@/components/forms/MediaUploadForm";
import { SubmitReportButton } from "@/components/forms/SubmitReportButton";
import { 
  FileText, 
  ArrowLeft, 
  Zap, 
  Calendar, 
  Users, 
  Image as ImageIcon, 
  FileCode,
  ShieldCheck,
  Building2,
  Clock,
  ChevronRight,
  ClipboardCheck,
  AlertCircle,
  Pencil,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

async function updateReportAction(formData: FormData) {
  "use server";
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const reportId = String(formData.get("reportId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const participantCountRaw = String(formData.get("participantCount") ?? "").trim();

  if (!reportId || !title) return;

  const report = await prisma.report.findFirst({ where: { id: reportId, communityId } });
  if (!report || !["DRAFT", "REVISION_REQUESTED"].includes(report.status)) return;

  await prisma.report.update({
    where: { id: reportId },
    data: {
      title,
      summary: summary || null,
      content: content || report.content,
      participantCount: participantCountRaw ? Number(participantCountRaw) : null,
    },
  });

  await prisma.activityLog.create({
    data: { userId: session.user.id, action: "report.update", modelType: "Report", modelId: reportId },
  });

  revalidatePath(`/baskan/raporlar/${reportId}`);
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PresidentReportDetailPage({ params }: PageProps) {
  const session = await requireCommunityManager();
  const { id } = await params;

  const report = await prisma.report.findFirst({
    where: { 
      id, 
      communityId: { in: session.user.communityIds } 
    },
    include: {
      community: true,
      event: true,
      mediaFiles: true,
      documents: true,
      creator: true
    }
  });

  if (!report) notFound();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-outfit">
      {/* Header */}
      <div className="flex items-center gap-4 group">
        <Link 
          href="/baskan/raporlar"
          className="h-12 w-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-t3-navy hover:bg-t3-navy hover:text-white transition-all active:scale-95 border border-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RAPOR YÃ–NETÄ°MÄ° / {report.reportType}</p>
          <h2 className="text-xl font-black text-t3-navy font-montserrat uppercase tracking-tight">{report.title}</h2>
        </div>
      </div>

      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-[3rem] bg-t3-navy p-10 md:p-14 text-white shadow-2xl group border border-white/5">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-t3-cyan/20 border border-t3-cyan/30 px-4 py-1.5 text-[10px] font-black text-t3-cyan uppercase tracking-[0.2em] mb-8 animate-pulse">
              <ClipboardCheck className="h-3.5 w-3.5 fill-t3-cyan" /> RAPOR GENEL BAKIÅ
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter font-montserrat leading-tight uppercase mb-8">
              {report.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/70">
               <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <Clock className="h-4 w-4 text-t3-orange" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{report.status}</span>
               </div>
               <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <Building2 className="h-4 w-4 text-t3-cyan" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{report.community.shortName}</span>
               </div>
            </div>
          </div>
          
          <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-t3-cyan/10 opacity-30 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 opacity-5">
             <FileText className="h-32 w-32" />
          </div>
        </div>

        <div className="rounded-[3rem] bg-white border border-slate-100 p-8 shadow-2xl shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden group">
           <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-t3-orange/10 flex items-center justify-center text-t3-orange mb-6">
                 <Users className="h-7 w-7" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">KatÄ±lÄ±mcÄ± SayÄ±sÄ±</p>
              <h3 className="text-4xl font-black text-t3-navy font-montserrat tracking-tighter">{report.participantCount || "0"}</h3>
           </div>
           <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-t3-orange/5 blur-2xl" />
        </div>

        <div className="rounded-[3rem] bg-white border border-slate-100 p-8 shadow-2xl shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden group">
           <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-t3-cyan/10 flex items-center justify-center text-t3-cyan mb-6">
                 <ImageIcon className="h-7 w-7" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Medya & Belge</p>
              <h3 className="text-4xl font-black text-t3-navy font-montserrat tracking-tighter">{report.mediaFiles.length + report.documents.length}</h3>
           </div>
           <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-t3-cyan/5 blur-2xl" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           {/* Summary Section */}
           <div className="rounded-[3rem] bg-white border border-slate-50 p-10 md:p-14 shadow-xl shadow-slate-200/20 relative overflow-hidden">
              <div className="h-1.5 w-40 bg-t3-orange mb-10 rounded-full" />
              <h3 className="text-lg font-black text-t3-navy uppercase tracking-widest mb-8 font-montserrat flex items-center gap-3">
                 <Zap className="h-5 w-5 text-t3-orange" /> Rapor Ã–zeti ve Bulgular
              </h3>
              <div className="space-y-8">
                 <div className="p-8 rounded-[2rem] bg-slate-50 border-l-8 border-t3-cyan shadow-inner italic text-slate-600 font-medium leading-loose">
                    "{report.summary}"
                 </div>
                 <div className="prose prose-slate max-w-none text-slate-500 font-medium leading-relaxed">
                    {report.content.split('\n').map((line, i) => (
                       <p key={i}>{line}</p>
                    ))}
                 </div>
              </div>
           </div>

           {/* Media & Documents List */}
           <div className="space-y-6">
              <h3 className="text-2xl font-black text-t3-navy tracking-tight font-montserrat uppercase px-4">Ekli Dosyalar</h3>
              <div className="grid md:grid-cols-2 gap-6">
                 {report.mediaFiles.map((file) => (
                    <div key={file.id} className="group p-5 rounded-[2rem] bg-white border border-slate-50 shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-t3-orange/5 text-t3-orange flex items-center justify-center">
                             <ImageIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 truncate">
                             <h5 className="text-[11px] font-black uppercase text-t3-navy truncate">{file.fileName}</h5>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{file.fileType}</p>
                          </div>
                       </div>
                    </div>
                 ))}
                 {report.documents.map((doc) => (
                    <div key={doc.id} className="group p-5 rounded-[2rem] bg-white border border-slate-50 shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-t3-cyan/5 text-t3-cyan flex items-center justify-center">
                             <FileCode className="h-6 w-6" />
                          </div>
                          <div className="flex-1 truncate">
                             <h5 className="text-[11px] font-black uppercase text-t3-navy truncate">{doc.title}</h5>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{doc.category}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-8">
           {/* Status Card */}
           <div className={cn(
             "rounded-[2.5rem] p-1 shadow-2xl",
             report.status === "APPROVED" ? "bg-emerald-500" : "bg-t3-orange"
           )}>
              <div className="bg-t3-navy rounded-[2.4rem] p-8 text-white relative overflow-hidden h-full">
                 <div className="flex items-center justify-between mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                       <ShieldCheck className={cn("h-7 w-7", report.status === "APPROVED" ? "text-emerald-400" : "text-t3-orange")} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full border border-white/10">
                       {report.status}
                    </span>
                 </div>
                 <h4 className="text-lg font-black uppercase font-montserrat tracking-tight mb-2">YÃ¶netim Geri Bildirimi</h4>
                 <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Merkez Denetim Notu</p>
                 <div className="flex items-start gap-3 text-sm italic text-white/60 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5">
                    <AlertCircle className="h-5 w-5 shrink-0 opacity-40 mt-0.5 text-t3-orange" />
                    {report.adminNote || "Ä°dari inceleme sÃ¼reci devam ediyor."}
                 </div>
              </div>
           </div>

           {/* Rapor Duzenleme - DRAFT veya REVISION_REQUESTED */
           {(report.status === "DRAFT" || report.status === "REVISION_REQUESTED") && (
             <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-xl shadow-slate-200/20 space-y-5">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Pencil className="h-3 w-3 text-corporate-blue" /> RAPORU DUZENLE
               </p>
               <form action={updateReportAction} className="space-y-4">
                 <input type="hidden" name="reportId" value={report.id} />
                 <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Baslik</label>
                   <input name="title" defaultValue={report.title} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-bold text-slate-950 outline-none focus:border-corporate-blue transition-all" required />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ozet</label>
                   <textarea name="summary" defaultValue={report.summary ?? ""} rows={2} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-bold text-slate-950 outline-none resize-none" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Icerik</label>
                   <textarea name="content" defaultValue={report.content} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-bold text-slate-950 outline-none resize-none" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Katilimci Sayisi</label>
                   <input name="participantCount" type="number" defaultValue={report.participantCount ?? ""} min={0} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-bold text-slate-950 outline-none" />
                 </div>
                 <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-corporate-blue text-white text-[10px] font-black uppercase tracking-widest py-3.5 hover:bg-blue-700 active:scale-95 transition-all">
                   <CheckCircle2 className="h-4 w-4" /> RAPORU GUNCELLE
                 </button>
               </form>
               <div className="pt-2 border-t border-slate-100">
                 <SubmitReportButton reportId={report.id} />
               </div>
               <div className="pt-2">
                 <MediaUploadForm reportId={report.id} />
               </div>
             </div>
           )}

           {/* Event Context Card */}
           {report.event && (
              <Link href={`/baskan/etkinlikler/${report.event.id}`} className="block group">
                 <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-xl shadow-slate-200/20 hover:border-t3-cyan transition-all relative overflow-hidden">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">// Ä°LGÄ°LÄ° PROJE/ETKÄ°NLÄ°K</p>
                    <div className="flex items-center justify-between">
                       <div>
                          <h4 className="text-sm font-black text-t3-navy uppercase tracking-tight group-hover:text-t3-cyan transition-colors">{report.event.title}</h4>
                          <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-tight">
                             <Calendar className="h-3 w-3" />
                             {new Date(report.event.eventDate).toLocaleDateString("tr-TR")}
                          </div>
                       </div>
                       <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-t3-cyan group-hover:scale-110 transition-transform">
                          <ChevronRight className="h-5 w-5" />
                       </div>
                    </div>
                    <div className="absolute bottom-0 right-0 h-1 w-0 bg-t3-cyan group-hover:w-full transition-all duration-700" />
                 </div>
              </Link>
           )}

           <Link 
             href="/baskan/raporlar"
             className="w-full h-16 rounded-2xl bg-t3-navy text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-t3-navy/20 active:scale-95 transition-all flex items-center justify-center"
           >
              RAPORLARA DÃ–N
           </Link>
        </div>
      </div>
    </div>
  );
}
