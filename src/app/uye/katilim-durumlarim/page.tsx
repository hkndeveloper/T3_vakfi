import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/permissions";
import { notFound } from "next/navigation";
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock,
  History,
  Target,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function MemberAttendancePage() {
  const session = await getCurrentSession();
  if (!session) return notFound();

  const eventParticipants = await prisma.eventParticipant.findMany({
    where: { userId: session.user.id },
    orderBy: { event: { eventDate: "desc" } },
    include: {
      event: {
        include: { community: true }
      }
    }
  });

  const attendedCount = eventParticipants.filter(ep => ep.attendanceStatus === "ATTENDED").length;
  const absentCount = eventParticipants.filter(ep => ep.attendanceStatus === "ABSENT").length;
  const excusedCount = eventParticipants.filter(ep => ep.attendanceStatus === "EXCUSED").length;
  const pendingCount = eventParticipants.filter(ep => !ep.attendanceStatus || ep.attendanceStatus === "INVITED" || ep.attendanceStatus === "PENDING").length;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-outfit pb-20">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
            <Target className="h-4 w-4 text-corporate-blue" /> KATILIM ANALİTİĞİ
          </div>
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
            KATILIM <br />
            <span className="text-corporate-blue italic">KARNEM</span>
          </h1>
          <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
            Kurumsal etkinliklerinizdeki performansınızı takip edin, mazeret süreçlerinizi yönetin ve topluluk profilinizi <span className="text-slate-950 font-bold underline decoration-corporate-blue decoration-4 underline-offset-8">aktif tutun</span>.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <ShieldCheck className="h-32 w-32" />
        </div>
      </div>

      {/* Analytics Statistics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="t3-panel p-8 group hover:-translate-y-2 transition-all">
           <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-corporate-blue mb-6 shadow-sm">
             <Zap className="h-7 w-7" />
           </div>
           <p className="t3-label mb-1">TOPLAM FAALİYET</p>
           <p className="text-4xl font-black text-slate-950 leading-none italic">{eventParticipants.length}</p>
        </div>

        <div className="t3-panel p-8 group hover:-translate-y-2 transition-all">
           <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
             <CheckCircle2 className="h-7 w-7" />
           </div>
           <p className="t3-label mb-1">TAM KATILIM</p>
           <p className="text-4xl font-black text-slate-950 leading-none italic">{attendedCount}</p>
        </div>

        <div className="t3-panel p-8 group hover:-translate-y-2 transition-all">
           <div className="h-14 w-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-6 shadow-sm">
             <XCircle className="h-7 w-7" />
           </div>
           <p className="t3-label mb-1">KATILMADI</p>
           <p className="text-4xl font-black text-slate-950 leading-none italic">{absentCount}</p>
        </div>

        <div className="t3-panel p-8 group hover:-translate-y-2 transition-all">
           <div className="h-14 w-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-corporate-orange mb-6 shadow-sm">
             <AlertCircle className="h-7 w-7" />
           </div>
           <p className="t3-label mb-1">MAZERETLİ</p>
           <p className="text-4xl font-black text-slate-950 leading-none italic">{excusedCount}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                <History className="h-7 w-7" />
             </div>
             <div>
                <h2 className="t3-heading text-3xl text-slate-950 tracking-tighter">Kronolojik Takvim</h2>
                <p className="t3-label">DAHİL OLDUĞUNUZ TÜM KURUMSAL HAREKETLER</p>
             </div>
          </div>
          <div className="px-6 py-3 rounded-2xl bg-orange-50 border border-orange-100 text-corporate-orange text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
             <Sparkles className="h-4 w-4 animate-pulse" /> SON 12 AY ANALİZİ
          </div>
        </div>

        {eventParticipants.length === 0 ? (
          <div className="rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-white/5 p-32 text-center bg-slate-50/30">
            <Clock className="h-16 w-16 text-slate-200 mx-auto mb-8" />
            <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter italic">Henüz Bir Veri Akışı Yok</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-4">Topluluk etkinliklerine katıldıkça burada listelenecektir.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {eventParticipants.map((ep) => {
              const event = ep.event;
              return (
                <div key={ep.id} className="t3-panel p-8 group transition-all border-l-[16px] border-l-corporate-blue bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-8 relative z-10">
                    <div className="flex flex-wrap items-center gap-8 flex-1">
                      {/* Date Icon Card */}
                      <div className="h-16 w-16 shrink-0 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center group-hover:bg-slate-950 transition-all duration-500 shadow-sm">
                        <span className="text-[9px] font-black text-slate-400 group-hover:text-slate-500 uppercase leading-none mb-1">
                          {new Date(event.eventDate).toLocaleString("tr-TR", { month: "short" })}
                        </span>
                        <span className="text-2xl font-black text-slate-950 group-hover:text-white leading-none italic">
                          {new Date(event.eventDate).getDate()}
                        </span>
                      </div>

                      {/* Info Area */}
                      <div className="flex-1 min-w-[240px]">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <span className="px-4 py-1.5 rounded-lg bg-blue-50 text-corporate-blue text-[9px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                            {event.community.shortName}
                          </span>
                          <span className="t3-label flex items-center gap-2">
                             <Calendar className="h-3.5 w-3.5" />
                             {new Date(event.eventDate).toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter leading-none group-hover:text-corporate-blue transition-colors italic">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-10">
                       <div className={cn(
                          "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all flex items-center gap-3",
                          ep.attendanceStatus === "ATTENDED" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : ep.attendanceStatus === "ABSENT" 
                            ? "bg-rose-50 text-rose-600 border-rose-100"
                            : ep.attendanceStatus === "EXCUSED"
                            ? "bg-orange-50 text-corporate-orange border-orange-100"
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        )}>
                          {ep.attendanceStatus === "ATTENDED" ? (
                            <><CheckCircle2 className="h-4 w-4" /> KATILDIM</>
                          ) : ep.attendanceStatus === "ABSENT" ? (
                            <><XCircle className="h-4 w-4" /> KATILMADIM</>
                          ) : ep.attendanceStatus === "EXCUSED" ? (
                            <><AlertCircle className="h-4 w-4" /> MAZERETLİ</>
                          ) : (
                            <><Clock className="h-4 w-4" /> BEKLEMEDE</>
                          )}
                       </div>
                       <Link href="/uye" className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 hover:text-corporate-blue hover:bg-blue-50 transition-all shadow-sm">
                          <ChevronRight className="h-5 w-5" />
                       </Link>
                    </div>
                  </div>
                  
                  {/* Excuse Note Overlay */}
                  {ep.excuseNote && (
                    <div className="mt-8 pt-8 border-t border-slate-100 flex items-start gap-4">
                       <AlertCircle className="h-4 w-4 text-corporate-orange shrink-0 mt-0.5" />
                       <p className="text-xs font-medium text-slate-600 italic">
                          <span className="t3-label mr-3 non-italic text-corporate-orange">İdari Mazeret Notu:</span>
                          {ep.excuseNote}
                       </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
