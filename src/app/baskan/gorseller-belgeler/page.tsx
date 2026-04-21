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
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

async function deleteMediaFileAction(formData: FormData) {
  "use server";
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const fileId = String(formData.get("fileId") ?? "").trim();
  if (!fileId) return;

  const mediaFile = await prisma.mediaFile.findFirst({
    where: { 
      id: fileId,
      report: { communityId }
    }
  });

  if (mediaFile) {
    await prisma.mediaFile.delete({ where: { id: fileId } });
    
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "media.delete",
        modelType: "MediaFile",
        modelId: fileId,
      },
    });
  }

  revalidatePath("/baskan/gorseller-belgeler");
}

async function deleteDocumentAction(formData: FormData) {
  "use server";
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const docId = String(formData.get("docId") ?? "").trim();
  if (!docId) return;

  const document = await prisma.document.findFirst({
    where: { 
      id: docId,
      report: { communityId }
    }
  });

  if (document) {
    await prisma.document.delete({ where: { id: docId } });
    
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "document.delete",
        modelType: "Document",
        modelId: docId,
      },
    });
  }

  revalidatePath("/baskan/gorseller-belgeler");
}

export default async function PresidentMediaDocumentsPage() {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const [community, mediaFiles, documents] = await Promise.all([
    prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, name: true, shortName: true },
    }),
    prisma.mediaFile.findMany({
      where: {
        report: { communityId }
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        report: true
      }
    }),
    prisma.document.findMany({
      where: {
        report: { communityId }
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        report: true
      }
    })
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="t3-panel-elevated p-6">
        <div>
          <h1 className="text-2xl font-semibold text-t3-navy font-montserrat">Görsel ve Belge Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-1">{community?.name} topluluğunun tüm faaliyet görsellerini ve resmi belgelerini yönetin</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="t3-card p-5 flex flex-col justify-center">
           <div className="h-10 w-10 rounded-t3 bg-t3-cyan/10 flex items-center justify-center text-t3-cyan mb-4">
              <ImageIcon className="h-5 w-5" />
           </div>
           <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Toplam Medya</p>
           <h3 className="text-2xl font-semibold text-t3-navy">{mediaFiles.length}</h3>
        </div>

        <div className="t3-card p-5 flex flex-col justify-center">
           <div className="h-10 w-10 rounded-t3 bg-t3-orange/10 flex items-center justify-center text-t3-orange mb-4">
              <FileText className="h-5 w-5" />
           </div>
           <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Toplam Belge</p>
           <h3 className="text-2xl font-semibold text-t3-navy">{documents.length}</h3>
        </div>

        <div className="t3-card p-5 flex flex-col justify-center bg-t3-navy text-white">
           <div className="h-10 w-10 rounded-t3 bg-white/10 flex items-center justify-center text-t3-cyan mb-4">
              <FolderOpen className="h-5 w-5" />
           </div>
           <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1">Toplam Dosya</p>
           <h3 className="text-2xl font-semibold text-white">{mediaFiles.length + documents.length}</h3>
        </div>
      </div>

      {/* Media Files Section */}
      <div className="t3-panel">
        <div className="flex items-center justify-between px-6 py-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-t3-navy font-montserrat">Faaliyet Görselleri</h2>
            <p className="text-xs text-slate-500 mt-1">{mediaFiles.length} dosya</p>
          </div>
          <button className="t3-button t3-button-secondary flex items-center gap-2 px-4 py-2">
             <Filter className="h-4 w-4" /> Filtrele
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4 px-6 pb-6">
          {mediaFiles.map((media) => (
            <div key={media.id} className="group t3-card p-4">
              <div className="aspect-square rounded-t3 bg-slate-50 overflow-hidden mb-3 relative">
                {media.fileType.startsWith("image") ? (
                  <img 
                    src={media.filePath} 
                    alt={media.fileName} 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-slate-100">
                    <ImageIcon className="h-8 w-8 text-slate-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-t3-navy/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                  <a 
                    href={media.filePath} 
                    target="_blank"
                    className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-t3-navy hover:scale-110 transition-transform"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                  <a 
                    href={media.filePath} 
                    download
                    className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-t3-navy hover:scale-110 transition-transform"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <form action={deleteMediaFileAction}>
                    <input type="hidden" name="fileId" value={media.id} />
                    <button 
                      type="submit"
                      className="h-8 w-8 rounded-full bg-t3-red flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-t3-navy uppercase tracking-wider truncate">{media.fileName}</p>
                <div className="flex items-center justify-between">
                   <span className="text-[9px] text-slate-400 font-semibold uppercase">{media.fileType}</span>
                   <div className="flex items-center gap-1.5 text-[9px] text-slate-300 font-semibold uppercase">
                      <Calendar className="h-3 w-3" /> {new Date(media.createdAt).toLocaleDateString("tr-TR")}
                   </div>
                </div>
                {media.report && (
                   <p className="text-[9px] text-t3-cyan font-semibold uppercase tracking-wider truncate">@{media.report.title}</p>
                )}
              </div>
            </div>
          ))}
          
          {mediaFiles.length === 0 && (
            <div className="col-span-4 t3-card p-12 text-center">
               <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-t3 bg-slate-50 flex items-center justify-center">
                     <ImageIcon className="h-8 w-8 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-sm">Henüz medya dosyası yüklenmedi</p>
                  <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mt-1">Rapor oluştururken medya yükleyebilirsiniz</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Documents Section */}
      <div className="t3-panel">
        <div className="flex items-center justify-between px-6 py-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-t3-navy font-montserrat">Resmi Belgeler</h2>
            <p className="text-xs text-slate-500 mt-1">{documents.length} dosya</p>
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-t3-navy uppercase tracking-wider">Belge Detayı</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-t3-navy uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-t3-navy uppercase tracking-wider">İlgili Rapor</th>
                <th className="px-6 py-3 text-right text-[11px] font-semibold text-t3-navy uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {documents.map((doc) => (
                <tr key={doc.id} className="t3-table-row">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-t3 bg-t3-orange/5 text-t3-orange flex items-center justify-center">
                         <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-t3-navy text-sm uppercase tracking-wider">{doc.title}</p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{doc.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="t3-badge bg-t3-orange/10 text-t3-orange">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {doc.report && (
                      <div className="flex items-center gap-2">
                         <FileText className="h-4 w-4 text-t3-cyan" />
                         <span className="text-[10px] font-semibold text-t3-navy uppercase truncate max-w-[150px]">{doc.report.title}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a 
                        href={doc.filePath} 
                        target="_blank"
                        className="h-8 w-8 rounded-t3 bg-white border border-slate-200/60 flex items-center justify-center text-t3-navy hover:bg-t3-navy hover:text-white transition-all"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <a 
                        href={doc.filePath} 
                        download
                        className="h-8 w-8 rounded-t3 bg-white border border-slate-200/60 flex items-center justify-center text-t3-navy hover:bg-t3-navy hover:text-white transition-all"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <form action={deleteDocumentAction}>
                        <input type="hidden" name="docId" value={doc.id} />
                        <button 
                          type="submit"
                          className="h-8 w-8 rounded-t3 bg-t3-red flex items-center justify-center text-white hover:scale-110 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                     <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-t3 bg-slate-50 flex items-center justify-center">
                           <FileText className="h-8 w-8 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-semibold uppercase tracking-wider text-sm">Henüz belge yüklenmedi</p>
                        <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mt-1">Rapor oluştururken belge yükleyebilirsiniz</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
