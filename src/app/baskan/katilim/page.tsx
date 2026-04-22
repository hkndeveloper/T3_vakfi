import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { 
  UserCheck, 
  UserPlus, 
  ClipboardList, 
  Calendar, 
  MapPin, 
  Search, 
  Filter, 
  LayoutDashboard, 
  Zap, 
  Sparkles, 
  ChevronRight,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ShieldCheck,
  Building2,
  ArrowRight,
  Fingerprint,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

async function inviteMemberAction(formData: FormData) {
  "use server";
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const eventId = String(formData.get("eventId") ?? "").trim();
  const userId = String(formData.get("userId") ?? "").trim();
  if (!eventId || !userId) return;

  const event = await prisma.event.findFirst({
    where: { id: eventId, communityId },
  });
  if (!event) return;

  await prisma.eventParticipant.upsert({
    where: { eventId_userId: { eventId, userId } },
    update: { inviteStatus: "INVITED" },
    create: {
      eventId,
      userId,
      inviteStatus: "INVITED",
      attendanceStatus: "PENDING",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: "attendance.invite",
      modelType: "EventParticipant",
      modelId: `${eventId}:${userId}`,
    },
  });

  revalidatePath("/baskan/katilim");
}

async function markAttendanceAction(formData: FormData) {
  "use server";
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const participantId = String(formData.get("participantId") ?? "").trim();
  const attendanceStatus = String(formData.get("attendanceStatus") ?? "").trim();
  const excuseNote = String(formData.get("excuseNote") ?? "").trim();
  if (!participantId || !attendanceStatus) return;

  const participant = await prisma.eventParticipant.findUnique({
    where: { id: participantId },
    include: { event: true },
  });
  if (!participant || participant.event.communityId !== communityId) return;

  await prisma.eventParticipant.update({
    where: { id: participantId },
    data: {
      attendanceStatus: attendanceStatus as "PENDING" | "ATTENDED" | "ABSENT" | "EXCUSED",
      excuseNote: excuseNote || null,
      markedBy: session.user.id,
      markedAt: new Date(),
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: "attendance.mark",
      modelType: "EventParticipant",
      modelId: participantId,
    },
  });

  revalidatePath("/baskan/katilim");
}

export default async function AttendancePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];
  const { q: search } = await searchParams;

  const [events, members] = await Promise.all([
    prisma.event.findMany({
      where: {
        communityId,
        status: { in: ["APPROVED", "COMPLETED"] },
        ...(search ? { title: { contains: search, mode: "insensitive" } } : {})
      },
      orderBy: { eventDate: "desc" },
      include: {
        participants: {
          include: { user: true },
        },
      },
      take: 50,
    }),
    prisma.communityMember.findMany({
      where: { communityId, status: "ACTIVE" },
      include: { user: true },
      orderBy: { joinedAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <ClipboardList className="h-4 w-4 text-corporate-blue" /> SAHA OPERASYONU
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              KATILIM & <br />
              <span className="text-corporate-blue italic">DİJİTAL YOKLAMA</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Onaylı operasyonların katılımcı hiyerarşisini yönetin, dijital yoklama protokollerini uygulayın ve üye mazeretlerini <span className="text-slate-950 font-bold underline decoration-corporate-blue/30 decoration-4 underline-offset-4">kurumsal standartlarda</span> denetleyin.
            </p>
          </div>
          
          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="t3-label mb-4">AKTİF KAYIT</p>
              <p className="text-5xl font-black text-slate-950 tracking-tighter leading-none italic">{events.length}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <UserCheck className="h-32 w-32" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4 px-4">
        <form className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-corporate-blue transition-colors" />
          <input 
            name="q"
            type="text" 
            defaultValue={search}
            placeholder="Faaliyet ismine göre ara..." 
            className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all w-72 shadow-sm text-slate-950" 
          />
        </form>
        {(search) && (
          <a href="/baskan/katilim" className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] hover:underline px-4 py-3 bg-rose-50 rounded-xl transition-colors">
            Filtreyi Temizle
          </a>
        )}
      </div>

      <div className="grid gap-12">
        {events.length === 0 ? (
          <div className="t3-panel-elevated p-32 text-center bg-slate-50/50 border-dashed border-2">
            <div className="mx-auto w-24 h-24 rounded-3xl bg-white flex items-center justify-center mb-10 border border-slate-200 shadow-sm">
              <ClipboardList className="h-12 w-12 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight italic">YOKLAMA YAPILACAK FAALİYET BULUNAMADI</h3>
            <p className="t3-label mt-6 max-w-md mx-auto leading-relaxed">Dijital yoklama yapabilmek için önce onaylanmış veya tamamlanmış bir etkinliğinizin olması gerekir.</p>
          </div>
        ) : (
          events.map((event) => {
            const invited = event.participants.length;
            const attended = event.participants.filter((p) => p.attendanceStatus === "ATTENDED").length;
            const absent = event.participants.filter((p) => p.attendanceStatus === "ABSENT").length;
            const excused = event.participants.filter((p) => p.attendanceStatus === "EXCUSED").length;

            return (
              <section key={event.id} className="t3-panel p-10 md:p-12 bg-white border-l-[16px] border-l-corporate-blue group overflow-hidden relative">
                <div className="flex flex-wrap items-start justify-between gap-10 mb-12 relative z-10">
                  <div className="space-y-6">
                    <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase group-hover:text-corporate-blue transition-colors leading-[0.95] italic">{event.title}</h2>
                    <div className="flex flex-wrap items-center gap-6">
                       <span className="flex items-center gap-3 t3-label bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100">
                          <Calendar className="h-4 w-4 text-corporate-orange" /> {new Date(event.eventDate).toLocaleDateString("tr-TR")}
                       </span>
                       <span className="flex items-center gap-3 t3-label px-1">
                          <MapPin className="h-4 w-4 text-corporate-blue" /> {event.location || "MERKEZ KAMPÜS"}
                       </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatBadge label="DAVETLİ" value={invited} theme="blue" />
                    <StatBadge label="KATILDI" value={attended} theme="emerald" />
                    <StatBadge label="GELMEDİ" value={absent} theme="red" />
                    <StatBadge label="MAZERET" value={excused} theme="orange" />
                  </div>
                </div>

                {/* Invite Interface */}
                <div className="p-10 rounded-3xl bg-slate-50/50 border border-slate-200 mb-12 relative overflow-hidden group/invite shadow-sm">
                  <div className="relative z-10 flex flex-wrap items-center gap-8">
                     <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm group-hover/invite:scale-110 transition-transform">
                        <UserPlus className="h-7 w-7" />
                     </div>
                     <div className="flex-1 min-w-[300px]">
                        <p className="t3-label mb-4">OPERASYONEL DAVET KANALI</p>
                        <form action={inviteMemberAction} className="flex gap-4">
                           <input type="hidden" name="eventId" value={event.id} />
                           <select name="userId" className="t3-input flex-1 px-8 py-5 text-sm bg-white" required>
                             <option value="">LİSTEDEN PERSONEL SEÇİN...</option>
                             {members.map((member) => (
                               <option key={`${event.id}-${member.userId}`} value={member.userId}>
                                 {member.user.name.toUpperCase()} ({member.user.email})
                               </option>
                             ))}
                           </select>
                           <button className="t3-button t3-button-primary px-10">KATILIMCI EKLE</button>
                        </form>
                     </div>
                  </div>
                </div>

                <div className="t3-panel overflow-hidden bg-slate-50/30">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                      <thead className="bg-slate-100/50">
                        <tr>
                          <th className="px-10 py-7 text-left t3-label">KATILIMCI ÜYE</th>
                          <th className="px-10 py-7 text-center t3-label">DİJİTAL SİCİL</th>
                          <th className="px-10 py-7 text-center t3-label">ANLIK DURUM</th>
                          <th className="px-10 py-7 text-right t3-label">DENETİM KONTROLÜ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 bg-white">
                        {event.participants.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-all group/row">
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-corporate-blue font-bold text-sm shadow-sm group-hover/row:bg-slate-950 group-hover/row:text-white transition-all">
                                    {p.user.name.charAt(0).toUpperCase()}
                                 </div>
                                 <div className="flex flex-col gap-1.5">
                                   <span className="font-black text-slate-950 text-base uppercase tracking-tight group-hover/row:text-corporate-blue transition-colors leading-none italic">{p.user.name}</span>
                                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.user.email}</span>
                                 </div>
                              </div>
                            </td>
                            <td className="px-10 py-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               {p.inviteStatus}
                            </td>
                            <td className="px-10 py-8 text-center">
                              <StatusIndicator status={p.attendanceStatus} />
                            </td>
                            <td className="px-10 py-8">
                              <form action={markAttendanceAction} className="flex items-center justify-end gap-3 px-1">
                                <input type="hidden" name="participantId" value={p.id} />
                                <select
                                  name="attendanceStatus"
                                  className="t3-input px-6 py-3.5 text-[10px] bg-slate-50"
                                  defaultValue={p.attendanceStatus}
                                >
                                  <option value="PENDING">BEKLEMEDE</option>
                                  <option value="ATTENDED">KATILDI</option>
                                  <option value="ABSENT">GELMEDİ</option>
                                  <option value="EXCUSED">MAZERETLİ</option>
                                </select>
                                <input
                                  name="excuseNote"
                                  defaultValue={p.excuseNote ?? ""}
                                  placeholder="NOT..."
                                  className="t3-input w-32 px-6 py-3.5 text-[10px] bg-slate-50"
                                />
                                <button className="t3-button t3-button-primary h-12 w-12 p-0 flex items-center justify-center">
                                   <CheckCircle2 className="h-5 w-5" />
                                </button>
                              </form>
                            </td>
                          </tr>
                        ))}
                        {event.participants.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-10 py-20 text-center t3-label">SİSTEMDE KAYITLI KATILIMCI BULUNAMADI</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <Zap className="absolute -right-10 -bottom-10 h-40 w-40 opacity-[0.02] -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" />
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatusIndicator({ status }: { status: string }) {
  const configs: Record<string, { label: string, color: string, dot: string }> = {
     PENDING: { label: "BEKLEMEDE", color: "text-slate-400 bg-slate-50 border-slate-100", dot: "bg-slate-300" },
     ATTENDED: { label: "KATILDI", color: "text-emerald-600 bg-emerald-50 border-emerald-100", dot: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" },
     ABSENT: { label: "GELMEDİ", color: "text-rose-600 bg-rose-50 border-rose-100", dot: "bg-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.4)]" },
     EXCUSED: { label: "MAZERETLİ", color: "text-corporate-orange bg-orange-50 border-orange-100", dot: "bg-corporate-orange shadow-[0_0_12px_rgba(234,88,12,0.4)]" },
  };
  const config = configs[status] || configs.PENDING;
  return (
    <div className={cn("inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl border text-[9px] font-black uppercase tracking-[0.25em] shadow-sm bg-white font-outfit", config.color)}>
       <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
       {config.label}
    </div>
  );
}

function StatBadge({ label, value, theme }: { label: string; value: number; theme: "blue" | "emerald" | "red" | "orange" }) {
  const themes = {
     blue: "bg-blue-50 text-corporate-blue border-blue-100",
     emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
     red: "bg-rose-50 text-rose-600 border-rose-100",
     orange: "bg-orange-50 text-corporate-orange border-orange-100",
  };
  return (
    <div className={cn("rounded-2xl border px-8 py-4 transition-all hover:scale-105 flex flex-col items-center justify-center min-w-[110px] shadow-sm bg-white", themes[theme])}>
      <span className="t3-label mb-2 opacity-60">{label}</span>
      <span className="text-3xl font-black leading-none tracking-tighter italic font-outfit">{value}</span>
    </div>
  );
}
