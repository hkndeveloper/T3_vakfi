import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function MemberEventsPage() {
  const session = await requirePermission("member.view");

  const membership = await prisma.communityMember.findFirst({
    where: { userId: session.user.id, status: "ACTIVE" },
    include: { community: true }
  });

  if (!membership) {
    return (
      <div className="space-y-6">
        <div className="t3-panel-elevated p-6">
          <h1 className="text-2xl font-semibold text-t3-navy font-montserrat">Etkinliklerim</h1>
          <p className="text-sm text-slate-500 mt-1">Atanan etkinliklerinizi görüntüleyin</p>
        </div>
        <div className="t3-card p-12 text-center">
          <p className="text-slate-400 font-semibold">Aktif bir topluluk üyeliğiniz bulunmamaktadır</p>
        </div>
      </div>
    );
  }

  const eventParticipants = await prisma.eventParticipant.findMany({
    where: { userId: session.user.id },
    include: {
      event: {
        include: { community: true }
      }
    },
    orderBy: { 
      event: {
        eventDate: "desc"
      }
    }
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
            <Calendar className="h-4 w-4 text-corporate-orange" /> KİŞİSEL TAKVİM
          </div>
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
            ETKİNLİK <br />
            <span className="text-corporate-blue italic">PROGRAMIM</span>
          </h1>
          <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
            Topluluk ekosisteminde size atanan tüm faaliyetleri, katılım durumlarınızı ve operasyonel detayları <span className="text-slate-950 font-bold underline decoration-corporate-blue decoration-4 underline-offset-4">şeffaf bir şekilde</span> takip edin.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-corporate-blue/5 blur-[100px] pointer-events-none" />
      </div>

      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                <Users className="h-7 w-7" />
             </div>
             <div>
                <h2 className="t3-heading text-3xl text-slate-950 tracking-tighter italic">Operasyonel Kayıtlar</h2>
                <p className="t3-label">SİZE ATANAN AKTİF FAALİYETLER</p>
             </div>
          </div>
          <div className="h-1.5 w-24 rounded-full bg-corporate-blue/10" />
        </div>

        <div className="grid gap-8">
          {eventParticipants.length === 0 ? (
            <div className="t3-panel-elevated p-28 text-center bg-slate-50/50 border-dashed border-2">
              <div className="mx-auto w-24 h-24 rounded-full bg-white flex items-center justify-center mb-10 border border-slate-200 shadow-sm">
                <Calendar className="h-12 w-12 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight uppercase italic">Atanmış Etkinlik Yok</h3>
              <p className="t3-label mt-5">Henüz herhangi bir operasyonda görevlendirilmediniz.</p>
            </div>
          ) : (
            eventParticipants.map((ep) => {
              const event = ep.event;
              return (
                <div key={ep.id} className="t3-panel group overflow-hidden relative transition-all hover:bg-slate-50/50 border-l-[16px] border-l-slate-950">
                  <div className="p-10 md:p-12 flex flex-wrap items-center justify-between gap-10">
                    <div className="space-y-6 flex-1">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className={cn(
                          "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm",
                          event.status === "APPROVED" || event.status === "COMPLETED" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-corporate-orange/10 text-corporate-orange border-corporate-orange/20"
                        )}>
                          {event.status === "APPROVED" ? "ONAYLI OPERASYON" : 
                           event.status === "COMPLETED" ? "TAMAMLANDI" : 
                           event.status === "PENDING_APPROVAL" ? "DENETİMDE" : event.status}
                        </span>
                        {!event.community && (
                          <span className="px-4 py-1.5 rounded-lg bg-blue-50 text-corporate-blue text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                            GLOBAL
                          </span>
                        )}
                      </div>
                      <h3 className="text-3xl font-black text-slate-950 tracking-tighter italic uppercase group-hover:text-corporate-blue transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-8 mt-6">
                        <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                          <Calendar className="h-4 w-4 text-corporate-blue" />
                          <span>{new Date(event.eventDate).toLocaleDateString("tr-TR")}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                          <Clock className="h-4 w-4 text-corporate-orange" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
                          <MapPin className="h-4 w-4 text-slate-300" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:w-auto sm:min-w-[180px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">KATILIM DURUMU</p>
                      <div className={cn(
                        "flex flex-col items-center gap-3 transition-all",
                        ep.attendanceStatus === "ATTENDED" 
                          ? "text-emerald-600" 
                          : ep.attendanceStatus === "ABSENT" 
                          ? "text-rose-600"
                          : ep.attendanceStatus === "EXCUSED"
                          ? "text-corporate-orange"
                          : "text-slate-400"
                      )}>
                        {ep.attendanceStatus === "ATTENDED" ? (
                          <>
                            <CheckCircle className="h-10 w-10" />
                            <span className="text-sm font-black uppercase tracking-widest italic">Katıldı</span>
                          </>
                        ) : ep.attendanceStatus === "ABSENT" ? (
                          <>
                            <XCircle className="h-10 w-10" />
                            <span className="text-sm font-black uppercase tracking-widest italic">Katılmadı</span>
                          </>
                        ) : ep.attendanceStatus === "EXCUSED" ? (
                          <>
                            <AlertCircle className="h-10 w-10" />
                            <span className="text-sm font-black uppercase tracking-widest italic">Mazeretli</span>
                          </>
                        ) : (
                          <>
                            <div className="h-10 w-10 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center">
                               <div className="h-3 w-3 rounded-full bg-slate-200 animate-pulse" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest italic">Beklemede</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
