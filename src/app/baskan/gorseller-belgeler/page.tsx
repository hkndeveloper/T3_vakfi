import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { 
  Image as ImageIcon, 
  FileText, 
  Upload, 
  FolderOpen, 
  Download,
  Trash2,
  Eye,
  Calendar,
  ShieldCheck,
  Zap,
  Sparkles,
  LayoutDashboard,
  FileSearch,
  Filter,
  ChevronRight,
  Plus,
  History,
  Target,
  PlusCircle
} from "lucide-react";
import { MediaUploadModal } from "@/components/forms/MediaUploadModal";
import { deleteMediaAction, deleteDocumentAction } from "@/actions/media-actions";
import { cn } from "@/lib/utils";

async function deleteMediaFileFormAction(formData: FormData) {
  "use server";
  const fileId = String(formData.get("fileId") ?? "").trim();
  if (!fileId) return;
  await deleteMediaAction(fileId);
}

async function deleteDocumentFormAction(formData: FormData) {
  "use server";
  const docId = String(formData.get("docId") ?? "").trim();
  if (!docId) return;
  await deleteDocumentAction(docId);
}

export default async function PresidentMediaDocumentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];
  const { q: search } = await searchParams;

  const [community, mediaFiles, documents] = await Promise.all([
    prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, name: true, shortName: true },
    }),
    prisma.mediaFile.findMany({
      where: {
        report: { communityId },
        ...(search ? { fileName: { contains: search, mode: "insensitive" } } : {})
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        report: true
      }
    }),
    prisma.document.findMany({
      where: {
        report: { communityId },
        ...(search ? { fileName: { contains: search, mode: "insensitive" } } : {})
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        report: true
      }
    })
  ]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-outfit pb-20">
      {/* T3 Premium Hero Section */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-indigo-950 p-12 md:p-16 text-white shadow-2xl group border border-white/5">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-5 py-2.5 text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-10">
            <FolderOpen className="h-4 w-4" /> KURUMSAL ARŞİV SİSTEMİ
          </div>
          <h1 className="text-6xl font-black tracking-tighter sm:text-7xl font-montserrat leading-[0.9] uppercase italic">
            GÖRSEL & <br />
            <span className="text-indigo-400 border-b-8 border-indigo-500/30">DOKÜMANTASYON</span>
          </h1>
          <p className="mt-10 text-xl text-slate-300/80 font-medium max-w-2xl leading-relaxed">
            {community?.name} topluluğunun tüm operasyonel kanıtlarını ve resmi yazılarını <span className="text-white font-bold decoration-amber-500 decoration-4 underline underline-offset-8">merkezi dijital arşivde</span> yedekleyin ve yönetin.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-indigo-500/10 opacity-30 blur-[130px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
        <div className="absolute bottom-10 right-10 flex flex-col items-end gap-6 z-20">
           <MediaUploadModal 
             communityId={communityId}
             trigger={
               <button className="flex items-center gap-3 px-10 py-5 bg-white text-indigo-950 rounded-3xl text-sm font-black hover:bg-indigo-50 transition-all shadow-2xl shadow-black/20 group/btn active:scale-95 uppercase tracking-widest italic">
                 <PlusCircle className="h-6 w-6 text-indigo-600 group-hover/btn:rotate-90 transition-transform duration-500" /> 
                 YENİ DOSYA YÜKLE
               </button>
             }
           />
           <div className="flex items-center gap-2 opacity-10 scale-150 transform group-hover:rotate-12 transition-transform duration-1000">
              <ImageIcon className="h-40 w-40" />
           </div>
        </div>
      </div>

      {/* Statistics Analytics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:scale-[1.02] transition-transform">
           <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 mb-6 font-black italic">
             <ImageIcon className="h-7 w-7" />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GÖRSEL KANIT</p>
           <p className="text-4xl font-black text-slate-950 dark:text-white leading-none italic">{mediaFiles.length}</p>
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:scale-[1.02] transition-transform">
           <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 mb-6 font-black italic">
             <FileText className="h-7 w-7" />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">RESMİ BELGE</p>
           <p className="text-4xl font-black text-slate-950 dark:text-white leading-none italic">{documents.length}</p>
        </div>

        <div className="rounded-[2.5rem] bg-indigo-950 p-8 border border-white/10 shadow-2xl shadow-indigo-600/10 hover:scale-[1.02] transition-transform col-span-2">
           <div className="h-14 w-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-6 font-black italic">
             <History className="h-7 w-7" />
           </div>
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">ARŞİV HACMİ</p>
           <div className="flex items-center gap-4">
              <p className="text-4xl font-black text-white leading-none italic">{mediaFiles.length + documents.length}</p>
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest bg-indigo-800 px-3 py-1 rounded-lg">AKTİF DOSYA</span>
           </div>
        </div>
      </div>

      {/* Media Files Section */}
      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-950 dark:text-white shadow-sm">
               <ImageIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-950 dark:text-white font-montserrat uppercase tracking-tight italic underline decoration-indigo-500 decoration-8 underline-offset-8">Faaliyet Galerisi</h2>
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] mt-3">Sahadan gelen tüm görsel veriler</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <form className="relative group">
              <FileSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-corporate-blue transition-colors" />
              <input 
                name="q"
                type="text" 
                defaultValue={search}
                placeholder="Dosya adı ara..." 
                className="pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all w-64 shadow-sm text-slate-950 dark:text-white" 
              />
            </form>
            {(search) && (
              <a href="/baskan/gorseller-belgeler" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2">
                Temizle
              </a>
            )}
          </div>
        </div>

        {mediaFiles.length === 0 ? (
          <div className="rounded-[3.5rem] border-4 border-dashed border-slate-100 dark:border-white/5 p-24 text-center bg-slate-50/20">
             <ImageIcon className="h-16 w-16 text-slate-200 mx-auto mb-8" />
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Henüz galeriye bir görsel eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {mediaFiles.map((media) => (
              <div key={media.id} className="group relative rounded-[2.5rem] bg-white dark:bg-slate-950 p-5 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/40 dark:shadow-black/60 transition-all hover:-translate-y-2 overflow-hidden">
                <div className="aspect-square rounded-[2rem] bg-slate-50 dark:bg-slate-900 overflow-hidden mb-5 relative border border-slate-100 dark:border-white/5">
                  {media.fileType.startsWith("image") ? (
                    <img 
                      src={media.filePath} 
                      alt={media.fileName} 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <ImageIcon className="h-12 w-12 text-slate-300 dark:text-slate-700" />
                    </div>
                  )}
                  
                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-indigo-950/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                    <a href={media.filePath} target="_blank" className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-950 hover:bg-white/90 transition-all shadow-xl">
                      <Eye className="h-5 w-5" />
                    </a>
                    <a href={media.filePath} download className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-all shadow-xl">
                      <Download className="h-5 w-5" />
                    </a>
                    <form action={deleteMediaFileFormAction}>
                      <input type="hidden" name="fileId" value={media.id} />
                      <button type="submit" className="h-12 w-12 rounded-xl bg-rose-600 flex items-center justify-center text-white hover:bg-rose-700 transition-all shadow-xl">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-widest truncate italic border-b border-slate-50 dark:border-white/5 pb-2">{media.fileName}</p>
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-tight">@{community?.shortName}</span>
                     <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                        <Calendar className="h-3 w-3" /> {new Date(media.createdAt).toLocaleDateString("tr-TR")}
                     </div>
                  </div>
                  {media.report && (
                    <p className="text-[9px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-wider truncate mt-2">{media.report.title}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documents Section */}
      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-950 dark:text-white shadow-sm">
               <FileSearch className="h-8 w-8 text-amber-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-950 dark:text-white font-montserrat uppercase tracking-tight italic underline decoration-amber-500 decoration-8 underline-offset-8">Resmi Dokümanlar</h2>
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] mt-3">İdari yazışmalar ve kurumsal rapor belgeleri</p>
            </div>
          </div>
        </div>

        <div className="rounded-[3.5rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-2xl dark:shadow-black/60 overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-50 dark:divide-white/5">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                <tr>
                  <th className="px-10 py-8 text-left text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] font-montserrat">BELGE KİMLİĞİ</th>
                  <th className="px-10 py-8 text-left text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] font-montserrat">KATEGORİ</th>
                  <th className="px-10 py-8 text-right text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] font-montserrat">AKSİYON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5 bg-white dark:bg-slate-900">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-indigo-500/[0.02] dark:hover:bg-white/[0.02] transition-all group">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-6">
                          <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 border border-amber-100 dark:border-amber-900/40 group-hover:scale-110 transition-transform">
                             <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-black text-indigo-950 dark:text-white text-base tracking-tight font-montserrat uppercase group-hover:text-amber-500 transition-colors leading-none italic">{doc.title}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-2">{new Date(doc.createdAt).toLocaleString("tr-TR")}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <span className="px-5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all shadow-sm">
                          {doc.category}
                       </span>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center justify-end gap-3">
                          <a href={doc.filePath} target="_blank" className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-center text-indigo-950 dark:text-white hover:bg-slate-950 hover:text-white transition-all shadow-sm">
                             <Eye className="h-5 w-5" />
                          </a>
                          <a href={doc.filePath} download className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-center text-indigo-950 dark:text-white hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                             <Download className="h-5 w-5" />
                          </a>
                          <form action={deleteDocumentFormAction}>
                             <input type="hidden" name="docId" value={doc.id} />
                             <button type="submit" className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                                <Trash2 className="h-5 w-5" />
                             </button>
                          </form>
                       </div>
                    </td>
                  </tr>
                ))}
                
                {documents.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-10 py-24 text-center">
                       <div className="flex flex-col items-center gap-8">
                          <div className="h-24 w-24 rounded-[3rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-700 shadow-inner">
                             <FileSearch className="h-12 w-12" />
                          </div>
                          <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.25em] text-sm">ARŞİVE KAYITLI RESMİ BELGE BULUNAMADI.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
