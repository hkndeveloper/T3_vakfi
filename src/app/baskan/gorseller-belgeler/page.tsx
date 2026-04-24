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

  const [community, mediaFiles, documents, events] = await Promise.all([
    prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, name: true, shortName: true },
    }),
    prisma.mediaFile.findMany({
      where: {
        communityId,
        ...(search ? { fileName: { contains: search, mode: "insensitive" } } : {})
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        community: true,
        report: true,
        event: true,
      }
    }),
    prisma.document.findMany({
      where: {
        communityId,
        ...(search ? { title: { contains: search, mode: "insensitive" } } : {})
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        community: true,
        report: true,
        event: true,
      }
    }),
    prisma.event.findMany({
      where: {
        OR: [
          { communityId },
          { scope: "GLOBAL", status: { in: ["APPROVED", "COMPLETED"] } },
        ],
      },
      orderBy: { eventDate: "desc" },
      select: { id: true, title: true, scope: true },
      take: 100,
    })
  ]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200 group">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <FolderOpen className="h-4 w-4 text-corporate-blue" /> KURUMSAL ARŞİV SİSTEMİ
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              GÖRSEL & <br />
              <span className="text-corporate-blue italic">DOKÜMANTASYON</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              {community?.name} topluluğunun tüm operasyonel kanıtlarını ve resmi yazılarını <span className="text-slate-950 font-bold decoration-corporate-blue decoration-4 underline underline-offset-4">merkezi dijital arşivde</span> yedekleyin ve yönetin.
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-6">
            <MediaUploadModal 
              communityId={communityId}
              events={events}
              trigger={
                <button className="t3-button t3-button-primary px-10 py-5 shadow-xl shadow-corporate-blue/20">
                  <PlusCircle className="h-6 w-6 text-corporate-orange" /> YENİ DOSYA YÜKLE
                </button>
              }
            />
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform group-hover:rotate-12 transition-transform duration-1000">
           <ImageIcon className="h-32 w-32" />
        </div>
      </div>

      {/* Statistics Analytics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-2">
        <div className="t3-panel p-8 flex flex-col items-center text-center bg-white">
           <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-corporate-blue mb-6 shadow-sm">
             <ImageIcon className="h-7 w-7" />
           </div>
           <p className="t3-label mb-1">GÖRSEL KANIT</p>
           <p className="text-4xl font-black text-slate-950 leading-none italic">{mediaFiles.length}</p>
        </div>

        <div className="t3-panel p-8 flex flex-col items-center text-center bg-white">
           <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-corporate-orange mb-6 shadow-sm">
             <FileText className="h-7 w-7" />
           </div>
           <p className="t3-label mb-1">RESMİ BELGE</p>
           <p className="text-4xl font-black text-slate-950 leading-none italic">{documents.length}</p>
        </div>

        <div className="t3-panel-elevated p-8 col-span-2 relative overflow-hidden bg-white">
           <div className="relative z-10 flex items-center gap-8">
              <div className="h-16 w-16 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl">
                <History className="h-8 w-8 text-corporate-orange" />
              </div>
              <div>
                <p className="t3-label mb-1">ARŞİV HACMİ</p>
                <div className="flex items-center gap-4">
                   <p className="text-5xl font-black text-slate-950 leading-none italic">{mediaFiles.length + documents.length}</p>
                   <span className="text-[10px] font-black text-corporate-blue uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">AKTİF DOSYA</span>
                </div>
              </div>
           </div>
           <Zap className="absolute -right-6 -bottom-6 h-24 w-24 opacity-[0.03] rotate-12" />
        </div>
      </div>

      {/* Media Files Section */}
      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
               <ImageIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="t3-heading text-3xl">Faaliyet Galerisi</h2>
              <p className="t3-label mt-2">SAHADAN GELEN TÜM GÖRSEL VERİLER</p>
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
                className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all w-64 shadow-sm text-slate-950" 
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
          <div className="t3-panel-elevated p-28 text-center bg-slate-50/50 border-dashed border-2">
             <ImageIcon className="h-16 w-16 text-slate-200 mx-auto mb-8" />
             <p className="t3-label">Henüz galeriye bir görsel eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 px-2">
            {mediaFiles.map((media) => (
              <div key={media.id} className="group t3-panel hover:bg-slate-50 transition-all p-5 overflow-hidden">
                <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden mb-5 relative border border-slate-200 shadow-sm">
                  {media.fileType.startsWith("image") ? (
                    <img 
                      src={media.filePath} 
                      alt={media.fileName} 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-100">
                      <ImageIcon className="h-12 w-12 text-slate-300" />
                    </div>
                  )}
                  
                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <a href={media.filePath} target="_blank" className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-950 hover:bg-corporate-blue hover:text-white transition-all shadow-xl">
                      <Eye className="h-5 w-5" />
                    </a>
                    <a href={media.filePath} download className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-950 hover:bg-corporate-orange hover:text-white transition-all shadow-xl">
                      <Download className="h-5 w-5" />
                    </a>
                    <form action={deleteMediaFileFormAction}>
                      <input type="hidden" name="fileId" value={media.id} />
                      <button type="submit" className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-xl">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-[11px] font-black text-slate-950 uppercase tracking-widest truncate italic border-b border-slate-100 pb-2">{media.fileName}</p>
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] text-corporate-blue font-black uppercase tracking-tight">@{community?.shortName}</span>
                     <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                        <Calendar className="h-3 w-3 text-corporate-orange" /> {new Date(media.createdAt).toLocaleDateString("tr-TR")}
                     </div>
                  </div>
                  {media.report && (
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider truncate mt-2 italic">{media.report.title}</p>
                  )}
                  {media.event && (
                    <p className="text-[9px] text-corporate-blue font-black uppercase tracking-wider truncate mt-1">
                      {media.event.scope === "GLOBAL" ? `[GLOBAL] ${media.event.title}` : media.event.title}
                    </p>
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
            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-corporate-orange shadow-sm">
               <FileSearch className="h-8 w-8" />
            </div>
            <div>
              <h2 className="t3-heading text-3xl">Resmi Dokümanlar</h2>
              <p className="t3-label mt-2">İDARİ YAZIŞMALAR VE KURUMSAL RAPOR BELGELERİ</p>
            </div>
          </div>
        </div>

        <div className="t3-panel overflow-hidden bg-slate-50/30">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100/50">
                <tr>
                  <th className="px-10 py-7 text-left t3-label">BELGE KİMLİĞİ</th>
                  <th className="px-10 py-7 text-left t3-label">KATEGORİ</th>
                  <th className="px-10 py-7 text-right t3-label">AKSİYON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white transition-all group">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-6">
                          <div className="h-14 w-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-corporate-orange shadow-sm group-hover:bg-slate-950 group-hover:text-white transition-all">
                             <FileText className="h-7 w-7" />
                          </div>
                          <div>
                            <p className="font-black text-slate-950 text-base uppercase tracking-tight group-hover:text-corporate-orange transition-colors italic leading-none">{doc.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{new Date(doc.createdAt).toLocaleString("tr-TR")}</p>
                            {doc.event && (
                              <p className="text-[9px] text-corporate-blue font-black uppercase tracking-wider mt-2">
                                {doc.event.scope === "GLOBAL" ? `[GLOBAL] ${doc.event.title}` : doc.event.title}
                              </p>
                            )}
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <span className="inline-flex items-center px-5 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-950 uppercase tracking-widest group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                          {doc.category}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-3">
                          <a href={doc.filePath} target="_blank" className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-950 hover:bg-slate-950 hover:text-white transition-all shadow-sm">
                             <Eye className="h-5 w-5" />
                          </a>
                          <a href={doc.filePath} download className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-950 hover:bg-corporate-orange hover:text-white transition-all shadow-sm">
                             <Download className="h-5 w-5" />
                          </a>
                          <form action={deleteDocumentFormAction}>
                             <input type="hidden" name="docId" value={doc.id} />
                             <button type="submit" className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
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
                          <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm opacity-20">
                             <FileSearch className="h-10 w-10" />
                          </div>
                          <p className="t3-label">ARŞİVE KAYITLI RESMİ BELGE BULUNAMADI.</p>
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
