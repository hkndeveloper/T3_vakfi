import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/permissions";
import { 
  History, 
  User, 
  Activity, 
  Globe, 
  Clock,
  ShieldAlert,
  Search,
  Filter,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  Target,
  Database,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; action?: string }>;
}) {
  await requireSuperAdmin();
  const { q: search, action: actionFilter } = await searchParams;

  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      AND: [
        search ? {
          OR: [
            { action: { contains: search, mode: "insensitive" } },
            { user: { name: { contains: search, mode: "insensitive" } } },
          ],
        } : {},
        actionFilter ? { action: { contains: actionFilter, mode: "insensitive" } } : {},
      ],
    },
    include: { user: true },
    take: 100,
  });

  const totalLogs = await prisma.activityLog.count();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <ShieldAlert className="h-4 w-4 text-corporate-orange" /> GÜVENLİK DENETİMİ
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-6xl text-slate-950 leading-tight uppercase italic">
              SİSTEM <br />
              <span className="text-corporate-blue italic">LOGLARI</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Sistem üzerindeki tüm kullanıcı aktivitelerini, kritik işlem geçmişlerini ve erişim kayıtlarını <span className="text-slate-950 font-bold decoration-corporate-blue decoration-4 underline underline-offset-4">kurumsal standartlarda</span> izleyin.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">TOPLAM KAYIT</p>
              <p className="text-6xl font-black tracking-tighter text-slate-950 leading-none">{totalLogs}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <Database className="h-32 w-32" />
        </div>
      </div>

      <div className="space-y-8 md:space-y-10 px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-2 md:px-4">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-950 shadow-sm">
               <History className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <div>
              <h2 className="t3-heading text-2xl md:text-3xl text-slate-950 tracking-tighter">İşlem Kayıtları</h2>
              <p className="t3-label text-[9px] md:text-[10px]">SİSTEM ÜZERİNDEKİ SON HAREKETLER</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <form className="relative group/search w-full md:w-80">
              <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within/search:text-corporate-blue transition-colors" />
              <input 
                type="text"
                name="q"
                defaultValue={search ?? ""}
                placeholder="İşlem veya kullanıcı ara..." 
                className="pl-11 md:pl-14 pr-4 md:pr-8 py-3.5 md:py-5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue/30 transition-all w-full shadow-sm" 
              />
            </form>
            {search && (
              <a href="/admin/sistem-loglari" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2 shrink-0">
                Temizle
              </a>
            )}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block t3-panel overflow-hidden bg-slate-50/30">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100/50">
                <tr>
                  <th className="px-10 py-7 text-left t3-label">Operatör</th>
                  <th className="px-10 py-7 text-left t3-label">Aksiyon Tipi</th>
                  <th className="px-10 py-7 text-left t3-label">Hedef Matris</th>
                  <th className="px-10 py-7 text-right t3-label">Erişim Künyesi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                          <User className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-950 text-base tracking-tight uppercase group-hover:text-corporate-blue transition-colors">{log.user?.name || "LOG_SİSTEM"}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{log.user?.email || "OTOMATİK SÜREÇ"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white text-slate-950 text-[10px] font-black border border-slate-200 uppercase tracking-widest shadow-sm group-hover:bg-corporate-blue group-hover:text-white group-hover:border-corporate-blue transition-all">
                        <Activity className="h-4 w-4" />
                        {log.action.replace(".", " / ")}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.modelType || "GENEL_ERİŞİM"}</span>
                        <span className="text-[10px] font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 max-w-fit shadow-sm truncate">
                          {log.modelId || "NULL_ID"}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right space-y-2">
                      <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest justify-end">
                        <Globe className="h-3.5 w-3.5 text-corporate-orange" /> {log.ipAddress || "127.0.0.1"}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-black text-slate-950 uppercase tracking-tight justify-end italic">
                        <Clock className="h-3.5 w-3.5 text-corporate-blue" /> {new Date(log.createdAt).toLocaleString("tr-TR")}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-4 px-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-950 text-xs uppercase">{log.user?.name || "LOG_SİSTEM"}</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase">{new Date(log.createdAt).toLocaleTimeString("tr-TR")}</span>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-corporate-blue/10 text-corporate-blue text-[8px] font-black uppercase tracking-widest">
                  {log.action.split(".").pop()}
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DETAY</span>
                   <span className="text-[9px] font-bold text-slate-900 truncate max-w-[200px]">{log.modelType || "GENEL"} - {log.modelId || "N/A"}</span>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase px-1">
                   <div className="flex items-center gap-1.5">
                      <Globe className="h-3 w-3 text-corporate-orange" /> {log.ipAddress || "127.0.0.1"}
                   </div>
                   <div className="flex items-center gap-1.5 ml-auto italic">
                      <Clock className="h-3 w-3 text-corporate-blue" /> {new Date(log.createdAt).toLocaleDateString("tr-TR")}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 md:p-10 bg-slate-100/50 rounded-xl md:rounded-t3-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mx-2 md:mx-0">
           <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">SİSTEM DENETİM MATRİSİ V1.0</p>
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8 w-full sm:w-auto">
              <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-widest">
                 <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-500" /> 
                 GÜVENLİK AKTİF
              </div>
              <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-widest sm:border-l border-slate-300 sm:pl-8">
                 <Cpu className="h-3.5 w-3.5 md:h-4 md:w-4 text-corporate-blue" /> 
                 CANLI İZLEME
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
