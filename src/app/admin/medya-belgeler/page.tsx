import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
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
  Building2,
  Zap,
  Sparkles,
  LayoutDashboard,
  FileSearch,
  Filter,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminMediaDocumentsPage() {
  await requirePermission("media.view");

  // Fetch media files and documents from database
  const [mediaFiles, documents] = await Promise.all([
    prisma.mediaFile.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        report: {
          include: {
            community: true
          }
        }
      }
    }),
    prisma.document.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        report: {
          include: {
            community: true
          }
        }
      }
    })
  ]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200 group">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <FolderOpen className="h-4 w-4 text-corporate-blue" /> KURUMSAL ARŞİV DENETİMİ
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              MEDYA & <br />
              <span className="text-corporate-blue italic">BELGELER</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Tüm topluluk faaliyetlerine ait görsel kanıtları ve resmi belgeleri <span className="text-slate-950 font-bold decoration-corporate-blue decoration-4 underline underline-offset-4">merkezi dokümantasyon</span> standartlarında denetleyin.
            </p>
          </div>
          
          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-10 py-8 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
               <ImageIcon className="h-6 w-6 text-corporate-blue mx-auto mb-4" />
               <p className="text-5xl font-black tracking-tighter text-slate-950 leading-none">{mediaFiles.length}</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 italic">MEDYA</p>
            </div>
            <div className="group/stat rounded-2xl bg-white px-10 py-8 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
               <FileText className="h-6 w-6 text-corporate-orange mx-auto mb-4" />
               <p className="text-5xl font-black tracking-tighter text-slate-950 leading-none">{documents.length}</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 italic">BELGE</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform transition-transform group-hover:scale-110 duration-1000">
           <FolderOpen className="h-32 w-32" />
        </div>
      </div>

      {/* Media Files Section */}
      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-5">
             <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                <ImageIcon className="h-7 w-7" />
             </div>
             <div>
               <h2 className="t3-heading text-3xl text-slate-950 tracking-tighter italic uppercase underline decoration-corporate-orange decoration-4 underline-offset-8">Görsel Kanıtlar</h2>
               <p className="t3-label mt-2">SAHADAN GELEN FOTOĞRAFLAR VE VİDEO KAYITLARI</p>
             </div>
          </div>
          <div className="flex gap-4">
             <button className="h-16 px-8 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-black text-slate-950 hover:bg-white transition-all shadow-sm flex items-center gap-3">
               <Filter className="h-5 w-5" /> FİLTRELE
             </button>
             <button className="h-16 px-8 rounded-xl bg-slate-950 text-[11px] font-black text-white hover:bg-corporate-blue transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3">
               <Upload className="h-5 w-5 text-corporate-orange" /> SİSTEME YÜKLE
             </button>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 px-2">
          {mediaFiles.map((media) => (
            <div key={media.id} className="group t3-panel hover:bg-slate-50 transition-all p-5 overflow-hidden">
              <div className="aspect-[4/3] rounded-xl bg-slate-100 overflow-hidden mb-5 relative border border-slate-200 shadow-sm">
                {media.fileType.startsWith("image") ? (
                  <img 
                    src={media.filePath} 
                    alt={media.fileName} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-slate-100">
                    <ImageIcon className="h-12 w-12 text-slate-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <a 
                    href={media.filePath} 
                    target="_blank"
                    className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-950 hover:bg-corporate-blue hover:text-white transition-all shadow-xl"
                  >
                    <Eye className="h-5 w-5" />
                  </a>
                  <a 
                    href={media.filePath} 
                    download
                    className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-950 hover:bg-corporate-orange hover:text-white transition-all shadow-xl"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[11px] font-black text-slate-950 uppercase tracking-widest truncate italic border-b border-slate-100 pb-2">{media.fileName}</p>
                <div className="flex flex-col gap-2">
                   {media.report && (
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] text-corporate-blue font-black uppercase tracking-tight">@{media.report.community.shortName}</span>
                         <span className="text-[9px] text-slate-400 font-bold uppercase">{media.fileType.split('/')[1]}</span>
                      </div>
                   )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-tight italic">
                   <Calendar className="h-3.5 w-3.5 text-corporate-orange" /> {new Date(media.createdAt).toLocaleDateString("tr-TR")}
                </div>
              </div>
            </div>
          ))}
          
          {mediaFiles.length === 0 && (
            <div className="col-span-full t3-panel-elevated p-28 text-center bg-slate-50/50 border-dashed border-2">
               <div className="flex flex-col items-center gap-8">
                  <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                     <ImageIcon className="h-10 w-10 text-slate-200" />
                  </div>
                  <p className="t3-label mt-5 uppercase">Henüz medya dosyası yüklenmedi</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Documents Section */}
      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-5">
             <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-corporate-orange shadow-sm">
                <FileSearch className="h-7 w-7" />
             </div>
             <div>
               <h2 className="t3-heading text-3xl text-slate-950 tracking-tighter italic uppercase underline decoration-corporate-blue decoration-4 underline-offset-8">Resmi Belgeler</h2>
               <p className="t3-label mt-2">DİLEKÇELER, TUTANAKLAR VE PROTOKOLLER ARŞİVİ</p>
             </div>
          </div>
        </div>

        <div className="t3-panel overflow-hidden bg-slate-50/30">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100/50">
                <tr>
                  <th className="px-10 py-7 text-left t3-label">Belge Kimliği</th>
                  <th className="px-10 py-7 text-left t3-label">Kategorizasyon</th>
                  <th className="px-10 py-7 text-left t3-label">İlgili Birim</th>
                  <th className="px-10 py-7 text-right t3-label">Operasyon</th>
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
                          <p className="font-black text-slate-950 text-base uppercase tracking-tight group-hover:text-corporate-orange transition-colors italic">{doc.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-corporate-blue" /> {new Date(doc.createdAt).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-950 uppercase tracking-widest group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                        <Zap className="h-3.5 w-3.5 text-corporate-blue" /> {doc.category}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      {doc.report && (
                        <div className="flex items-center gap-3">
                           <Building2 className="h-4 w-4 text-corporate-blue" />
                           <span className="text-[11px] font-black text-slate-950 uppercase italic tracking-tight">{doc.report.community.shortName}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center justify-end gap-3">
                        <a 
                          href={doc.filePath} 
                          target="_blank"
                          className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-950 hover:bg-slate-950 hover:text-white transition-all shadow-sm group/btn"
                        >
                          <Eye className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                        </a>
                        <a 
                          href={doc.filePath} 
                          download
                          className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-950 hover:bg-corporate-orange hover:text-white transition-all shadow-sm group/btn"
                        >
                          <Download className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-10 py-24 text-center">
                       <div className="flex flex-col items-center gap-8">
                          <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm opacity-20">
                             <FileText className="h-10 w-10" />
                          </div>
                          <p className="t3-label">HENÜZ ARŞİVE EKLENMİŞ BİR BELGE BULUNMAMAKTADIR</p>
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
