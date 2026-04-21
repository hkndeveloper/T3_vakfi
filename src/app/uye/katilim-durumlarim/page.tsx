import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { Calendar, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function MemberAttendancePage() {
  const session = await requirePermission("member.view");

  const eventParticipants = await prisma.eventParticipant.findMany({
    where: { userId: session.user.id },
    include: {
      event: {
        include: { community: true }
      }
    }
  });

  const attendedCount = eventParticipants.filter(ep => ep.attendanceStatus === "ATTENDED").length;
  const absentCount = eventParticipants.filter(ep => ep.attendanceStatus === "ABSENT").length;
  const excusedCount = eventParticipants.filter(ep => ep.attendanceStatus === "EXCUSED").length;
  const pendingCount = eventParticipants.filter(ep => !ep.attendanceStatus || ep.attendanceStatus === "INVITED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="t3-panel-elevated p-6">
        <h1 className="text-2xl font-semibold text-t3-navy font-montserrat">Katılım Durumlarım</h1>
        <p className="text-sm text-slate-500 mt-1">Etkinlik katılım durumlarınızı görüntüleyin</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="t3-card p-5">
          <div className="h-10 w-10 rounded-t3 bg-t3-cyan/10 flex items-center justify-center text-t3-cyan mb-4">
            <Calendar className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Toplam Etkinlik</p>
          <p className="text-2xl font-semibold text-t3-navy">{eventParticipants.length}</p>
        </div>

        <div className="t3-card p-5">
          <div className="h-10 w-10 rounded-t3 bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
            <CheckCircle className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Katıldı</p>
          <p className="text-2xl font-semibold text-t3-navy">{attendedCount}</p>
        </div>

        <div className="t3-card p-5">
          <div className="h-10 w-10 rounded-t3 bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
            <XCircle className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Katılmadı</p>
          <p className="text-2xl font-semibold text-t3-navy">{absentCount}</p>
        </div>

        <div className="t3-card p-5">
          <div className="h-10 w-10 rounded-t3 bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
            <AlertCircle className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Mazeretli</p>
          <p className="text-2xl font-semibold text-t3-navy">{excusedCount}</p>
        </div>
      </div>

      {/* Attendance List */}
      <div className="t3-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-5 w-5 text-t3-navy" />
          <h2 className="text-lg font-semibold text-t3-navy font-montserrat">Katılım Geçmişi</h2>
        </div>

        {eventParticipants.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-semibold">Henüz etkinlik kaydı bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-3">
            {eventParticipants.map((ep) => {
              const event = ep.event;
              return (
                <div key={ep.id} className="t3-card p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-t3-navy font-montserrat uppercase tracking-wider">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(event.eventDate).toLocaleDateString("tr-TR")}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <span>{event.community.shortName}</span>
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-t3 text-xs font-semibold",
                      ep.attendanceStatus === "ATTENDED" 
                        ? "bg-emerald-50 text-emerald-600" 
                        : ep.attendanceStatus === "ABSENT" 
                        ? "bg-red-50 text-red-600"
                        : ep.attendanceStatus === "EXCUSED"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-slate-100 text-slate-500"
                    )}>
                      {ep.attendanceStatus === "ATTENDED" ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Katıldı
                        </>
                      ) : ep.attendanceStatus === "ABSENT" ? (
                        <>
                          <XCircle className="h-4 w-4" />
                          Katılmadı
                        </>
                      ) : ep.attendanceStatus === "EXCUSED" ? (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          Mazeretli
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4" />
                          Beklemede
                        </>
                      )}
                    </div>
                  </div>
                  {ep.excuseNote && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60">
                      <p className="text-xs text-slate-500">
                        <span className="font-semibold">Mazeret:</span> {ep.excuseNote}
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
