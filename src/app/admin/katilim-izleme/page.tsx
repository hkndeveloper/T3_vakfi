import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { 
  Activity, 
  Users, 
  MapPin, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck,
  LayoutDashboard,
  Zap,
  Sparkles,
  ChevronRight,
  TrendingUp,
  UserCheck,
  UserX,
  FileSearch
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminAttendanceMonitorPage() {
  await requirePermission("attendance.manage");

  const events = await prisma.event.findMany({
    where: {
      status: { in: ["APPROVED", "COMPLETED"] },
    },
    orderBy: { eventDate: "desc" },
    include: {
      community: {
        include: { university: true },
      },
      participants: true,
    },
    take: 100,
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <Activity className="h-4 w-4 text-corporate-blue" /> OPERASYONEL ANALİZ
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              KATILIM <br />
              <span className="text-corporate-blue italic">İZLEME</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Tüm topluluklardaki etkinlik performansını ve üye katılım oranlarını <span className="text-slate-950 font-bold decoration-corporate-blue decoration-4 underline underline-offset-4">merkezi denetim sistemi</span> üzerinden gerçek zamanlı izleyin.
            </p>
          </div>
          
          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
               <TrendingUp className="h-6 w-6 text-corporate-blue mx-auto mb-4" />
               <p className="text-5xl font-black tracking-tighter text-slate-950 leading-none">94%</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 italic">AVG INDEX</p>
            </div>
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
               <Users className="h-6 w-6 text-corporate-orange mx-auto mb-4" />
               <p className="text-5xl font-black text-slate-950 tracking-tighter leading-none">{events.length}</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 italic">FAALİYET</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <UserCheck className="h-32 w-32" />
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-5">
             <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                <FileSearch className="h-7 w-7" />
             </div>
             <div>
               <h2 className="t3-heading text-3xl text-slate-950 tracking-tighter italic uppercase underline decoration-corporate-orange decoration-4 underline-offset-8">Veri Havuzu</h2>
               <p className="t3-label mt-2">GERÇEK ZAMANLI KATILIM METRİKLERİ VE PERFORMANS TABLOSU</p>
             </div>
          </div>
          <button className="t3-button t3-button-primary px-8 h-16 shadow-xl shadow-corporate-blue/10">
             <Sparkles className="h-5 w-5" /> FİLTRE MATRİSİ
          </button>
        </div>

        <div className="t3-panel overflow-hidden bg-slate-50/30">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100/50">
                <tr>
                  <th className="px-10 py-7 text-left t3-label">Faaliyet Künyesi</th>
                  <th className="px-10 py-7 text-left t3-label">Topluluk & Kampüs</th>
                  <th className="px-10 py-7 text-center t3-label">Davetli</th>
                  <th className="px-10 py-7 text-center t3-label">Katılım İndeksi</th>
                  <th className="px-10 py-7 text-right t3-label">Durum Analizi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((event) => {
                  const invited = event.participants.length;
                  const attended = event.participants.filter((p) => p.attendanceStatus === "ATTENDED").length;
                  const attendanceRate = invited > 0 ? Math.round((attended / invited) * 100) : 0;

                  return (
                    <tr key={event.id} className="hover:bg-white transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-2">
                          <span className="font-black text-slate-950 text-base tracking-tight uppercase group-hover:text-corporate-blue transition-colors italic">{event.title}</span>
                          <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <Calendar className="h-3.5 w-3.5 text-corporate-blue" /> {new Date(event.eventDate).toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] font-black text-slate-950 uppercase tracking-tight italic">
                            {event.community?.university.name || "MERKEZİ ETKİNLİK"}
                          </span>
                          <span className="text-[10px] font-bold text-corporate-blue uppercase tracking-widest border-s-2 border-corporate-blue pl-2">
                            {event.community?.name || "GLOBAL HAVUZ"}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-slate-100 text-slate-950 font-black text-lg border border-slate-200 shadow-sm group-hover:bg-slate-950 group-hover:text-white transition-all">
                           {invited}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex items-center gap-4 w-full max-w-[140px]">
                            <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner p-0.5">
                               <div className="h-full bg-corporate-blue rounded-full transition-all duration-1000 group-hover:bg-corporate-orange" style={{ width: `${attendanceRate}%` }} />
                            </div>
                            <span className="text-[11px] font-black text-slate-950 italic">{attendanceRate}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <span className={cn(
                           "inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest border rounded-xl shadow-sm transition-all",
                           attendanceRate >= 70 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-corporate-orange border-orange-100"
                         )}>
                           <div className={cn("h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]", attendanceRate >= 70 ? "bg-emerald-500 animate-pulse" : "bg-corporate-orange")} />
                           {attendanceRate >= 70 ? "YÜKSEK SKOR" : "DÜŞÜK SKOR"}
                         </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-10 bg-slate-950 text-white relative overflow-hidden group/footer">
             <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                   <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-corporate-orange">
                      <Zap className="h-7 w-7" />
                   </div>
                   <div>
                      <p className="text-xl font-black tracking-tighter uppercase italic italic">Sistem Raporu</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">HİÇBİR FAALİYET DENETİMSİZ KALMAZ</p>
                   </div>
                </div>
                <div className="flex items-center gap-10">
                   <div className="text-right">
                      <p className="text-2xl font-black italic tracking-tighter text-corporate-blue">94%</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">TOTAL AVG</p>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-black italic tracking-tighter text-emerald-500">OPTIMAL</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">STATUS</p>
                   </div>
                </div>
             </div>
             <Activity className="absolute -right-8 -bottom-8 h-40 w-40 opacity-10 -rotate-12 transition-transform duration-1000 group-hover/footer:rotate-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
