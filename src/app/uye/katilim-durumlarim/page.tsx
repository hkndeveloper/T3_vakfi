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
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-indigo-950 p-12 md:p-16 text-white shadow-2xl border border-white/5 group">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-6 py-2.5 text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-10">
            <Target className="h-4 w-4" /> KATILIM ANALİTİĞİ
          </div>
          <h1 className="text-6xl font-black tracking-tighter sm:text-7xl font-montserrat leading-[0.9] uppercase italic">
            KATILIM <br />
            <span className="text-amber-500 border-b-8 border-amber-500/20">KARNEM</span>
          </h1>
          <p className="mt-10 text-xl text-slate-300/80 font-medium max-w-2xl leading-relaxed">
            Kurumsal etkinliklerinizdeki performansınızı takip edin, mazeret süreçlerinizi yönetin ve topluluk profilinizi <span className="text-white font-bold decoration-amber-500 decoration-4 underline underline-offset-8">aktif tutun</span>.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-indigo-500/10 opacity-30 blur-[130px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-5 scale-150 transform group-hover:rotate-12 transition-transform duration-1000">
           <ShieldCheck className="h-40 w-40" />
        </div>
      </div>

      {/* Analytics Statistics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:scale-[1.02] transition-transform">
           <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 mb-6">
             <Zap className="h-7 w-7" />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOPLAM FAALİYET</p>
           <p className="text-4xl font-black text-slate-950 dark:text-white leading-none italic">{eventParticipants.length}</p>
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:scale-[1.02] transition-transform">
           <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 mb-6">
             <CheckCircle2 className="h-7 w-7" />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TAM KATILIM</p>
           <p className="text-4xl font-black text-slate-950 dark:text-white leading-none italic">{attendedCount}</p>
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:scale-[1.02] transition-transform">
           <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 mb-6">
             <XCircle className="h-7 w-7" />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">KATILMADI</p>
           <p className="text-4xl font-black text-slate-950 dark:text-white leading-none italic">{absentCount}</p>
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:scale-[1.02] transition-transform">
           <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 mb-6">
             <AlertCircle className="h-7 w-7" />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">MAZERETLİ</p>
           <p className="text-4xl font-black text-slate-950 dark:text-white leading-none italic">{excusedCount}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-950 dark:text-white shadow-sm">
               <History className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-950 dark:text-white font-montserrat uppercase tracking-tight">Kronolojik Takvim</h2>
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] mt-2">Dahil olduğunuz tüm kurumsal hareketler</p>
            </div>
          </div>
          <div className="px-6 py-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
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
                <div key={ep.id} className="group relative rounded-[3rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/30 dark:shadow-black/40 hover:border-indigo-500 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-8 relative z-10">
                    <div className="flex flex-wrap items-center gap-8 flex-1">
                      {/* Date Icon Card */}
                      <div className="h-20 w-20 shrink-0 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center group-hover:bg-indigo-950 transition-all duration-500">
                        <span className="text-[11px] font-black text-slate-400 group-hover:text-indigo-400 uppercase leading-none mb-1">
                          {new Date(event.eventDate).toLocaleString("tr-TR", { month: "short" })}
                        </span>
                        <span className="text-3xl font-black text-slate-950 dark:text-white group-hover:text-white leading-none italic font-montserrat">
                          {new Date(event.eventDate).getDate()}
                        </span>
                      </div>

                      {/* Info Area */}
                      <div className="flex-1 min-w-[240px]">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <span className="px-4 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                            {event.community.shortName}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Calendar className="h-3.5 w-3.5" />
                             {new Date(event.eventDate).toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter font-montserrat leading-none group-hover:text-indigo-600 transition-colors italic">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-10">
                       <div className={cn(
                          "px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all flex items-center gap-3",
                          ep.attendanceStatus === "ATTENDED" 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                            : ep.attendanceStatus === "ABSENT" 
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : ep.attendanceStatus === "EXCUSED"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/5"
                        )}>
                          {ep.attendanceStatus === "ATTENDED" ? (
                            <><CheckCircle2 className="h-5 w-5" /> KATILDIM</>
                          ) : ep.attendanceStatus === "ABSENT" ? (
                            <><XCircle className="h-5 w-5" /> KATILMADIM</>
                          ) : ep.attendanceStatus === "EXCUSED" ? (
                            <><AlertCircle className="h-5 w-5" /> MAZERETLİ</>
                          ) : (
                            <><Clock className="h-5 w-5" /> BEKLEMEDE</>
                          )}
                       </div>
                       <Link href="/uye" className="h-14 w-14 rounded-full border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all">
                          <ChevronRight className="h-6 w-6" />
                       </Link>
                    </div>
                  </div>
                  
                  {/* Excuse Note Overlay */}
                  {ep.excuseNote && (
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex items-start gap-4">
                       <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                       <p className="text-sm font-medium text-slate-500 dark:text-slate-400 italic">
                          <span className="font-black text-[10px] text-amber-500 uppercase tracking-widest mr-3 non-italic font-outfit">İdari Mazeret Notu:</span>
                          {ep.excuseNote}
                       </p>
                    </div>
                  )}

                  <div className="absolute bottom-0 right-12 h-1.5 w-0 bg-indigo-500 group-hover:w-32 transition-all duration-700 rounded-full" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
