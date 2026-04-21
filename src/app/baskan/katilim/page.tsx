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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-outfit pb-20">
      {/* T3 Premium Hero Section */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-indigo-950 p-12 md:p-16 text-white shadow-2xl group border border-white/5">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/30 px-5 py-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-10 animate-pulse-subtle">
            <ClipboardList className="h-4 w-4 fill-amber-500" /> SAHA OPERASYONU
          </div>
          <h1 className="text-6xl font-black tracking-tighter sm:text-7xl font-montserrat leading-[0.9] uppercase">
            KATILIM & <br />
            <span className="text-indigo-400 italic border-b-8 border-amber-500/30">DİJİTAL YOKLAMA</span>
          </h1>
          <p className="mt-10 text-xl text-slate-300/80 font-medium max-w-2xl leading-relaxed">
            Onaylı operasyonların katılımcı hiyerarşisini yönetin, dijital yoklama protokollerini uygulayın ve üye mazeretlerini kurumsal standartlarda denetleyin.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-indigo-500/10 opacity-30 blur-[130px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-5 scale-150 transform group-hover:rotate-12 transition-transform duration-1000">
           <UserCheck className="h-40 w-40" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4 px-4">
        <form className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            name="q"
            type="text" 
            defaultValue={search}
            placeholder="Faaliyet ismine göre ara..." 
            className="pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all w-72 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-black/20 text-indigo-950 dark:text-white" 
          />
        </form>
        {(search) && (
          <a href="/baskan/katilim" className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] hover:underline px-4 py-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl transition-colors">
            Filtreyi Temizle
          </a>
        )}
      </div>

      <div className="grid gap-12">
        {events.length === 0 ? (
          <div className="rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-white/5 p-32 text-center bg-white dark:bg-slate-900 shadow-2xl dark:shadow-black/20">
            <div className="mx-auto w-32 h-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-10 shadow-inner border border-slate-100 dark:border-white/5">
              <ClipboardList className="h-16 w-16 text-slate-200 dark:text-slate-700" />
            </div>
            <h3 className="text-2xl font-black text-indigo-950 dark:text-white uppercase tracking-tight font-montserrat">YOKLAMA YAPILACAK FAALİYET BULUNAMADI</h3>
            <p className="text-slate-400 dark:text-slate-500 font-bold mt-6 max-w-md mx-auto leading-relaxed uppercase tracking-wider text-xs">Dijital yoklama yapabilmek için önce onaylanmış veya tamamlanmış bir etkinliğinizin olması gerekir.</p>
          </div>
        ) : (
          events.map((event) => {
            const invited = event.participants.length;
            const attended = event.participants.filter((p) => p.attendanceStatus === "ATTENDED").length;
            const absent = event.participants.filter((p) => p.attendanceStatus === "ABSENT").length;
            const excused = event.participants.filter((p) => p.attendanceStatus === "EXCUSED").length;

            return (
              <section key={event.id} className="rounded-[4rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-12 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] dark:shadow-black/40 border-t-[16px] border-t-indigo-600 group overflow-hidden relative">
                <div className="flex flex-wrap items-start justify-between gap-10 mb-12 relative z-10">
                  <div className="space-y-6">
                    <h2 className="text-4xl font-black text-indigo-950 dark:text-white tracking-tighter font-montserrat uppercase group-hover:text-indigo-600 transition-colors leading-[0.95]">{event.title}</h2>
                    <div className="flex flex-wrap items-center gap-6">
                       <span className="flex items-center gap-3 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] bg-slate-50 dark:bg-indigo-950/30 px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-indigo-900/40">
                          <Calendar className="h-4 w-4 text-amber-500" /> {new Date(event.eventDate).toLocaleDateString("tr-TR")}
                       </span>
                       <span className="flex items-center gap-3 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
                          <MapPin className="h-4 w-4 text-indigo-600" /> {event.location || "MERKEZ KAMPÜS"}
                       </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatBadge label="DAVETLİ" value={invited} theme="indigo" />
                    <StatBadge label="KATILDI" value={attended} theme="emerald" />
                    <StatBadge label="GELMEDİ" value={absent} theme="red" />
                    <StatBadge label="MAZERET" value={excused} theme="amber" />
                  </div>
                </div>

                {/* Invite Interface */}
                <div className="p-10 rounded-[3rem] bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 mb-12 relative overflow-hidden group/invite shadow-inner">
                  <div className="relative z-10 flex flex-wrap items-center gap-8">
                     <div className="h-14 w-14 rounded-2xl bg-indigo-600 p-4 text-white shadow-xl shadow-indigo-600/20 group-hover/invite:scale-110 transition-transform">
                        <UserPlus className="h-6 w-6" />
                     </div>
                     <div className="flex-1 min-w-[300px]">
                        <p className="text-[10px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] mb-4 font-montserrat">OPERASYONEL DAVET KANALI</p>
                        <form action={inviteMemberAction} className="flex gap-4">
                           <input type="hidden" name="eventId" value={event.id} />
                           <select name="userId" className="flex-1 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-800 px-8 py-5 text-sm font-bold text-indigo-950 dark:text-white focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none appearance-none cursor-pointer shadow-sm" required>
                             <option value="">LİSTEDEN PERSONEL SEÇİN...</option>
                             {members.map((member) => (
                               <option key={`${event.id}-${member.userId}`} value={member.userId}>
                                 {member.user.name.toUpperCase()} ({member.user.email})
                               </option>
                             ))}
                           </select>
                           <button className="px-10 py-5 rounded-2xl bg-indigo-950 dark:bg-indigo-700 text-[11px] font-black text-white hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-950/20 uppercase tracking-[0.25em] border border-white/10">KATILIMCI EKLE</button>
                        </form>
                     </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/30">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-white/5">
                    <thead className="bg-slate-100/50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-10 py-7 text-left text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] font-montserrat">KATILIMCI ÜYE</th>
                        <th className="px-10 py-7 text-center text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] font-montserrat">DİJİTAL SİCİL</th>
                        <th className="px-10 py-7 text-center text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] font-montserrat">ANLIK DURUM</th>
                        <th className="px-10 py-7 text-right text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] font-montserrat">DENETİM KONTROLÜ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/5 bg-white dark:bg-slate-900">
                      {event.participants.map((p) => (
                        <tr key={p.id} className="hover:bg-indigo-500/[0.02] dark:hover:bg-white/[0.02] transition-all group/row">
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                  {p.user.name.charAt(0).toUpperCase()}
                               </div>
                               <div className="flex flex-col gap-1.5">
                                 <span className="font-black text-indigo-950 dark:text-white text-base font-montserrat uppercase tracking-tight group-hover/row:text-indigo-600 transition-colors leading-none">{p.user.name}</span>
                                 <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{p.user.email}</span>
                               </div>
                            </div>
                          </td>
                          <td className="px-10 py-8 text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest uppercase">
                             {p.inviteStatus}
                          </td>
                          <td className="px-10 py-8 text-center font-montserrat">
                            <StatusIndicator status={p.attendanceStatus} />
                          </td>
                          <td className="px-10 py-8">
                            <form action={markAttendanceAction} className="flex items-center justify-end gap-3 px-1">
                              <input type="hidden" name="participantId" value={p.id} />
                              <select
                                name="attendanceStatus"
                                className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-800 px-6 py-3.5 text-[10px] font-black text-indigo-950 dark:text-white focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none uppercase tracking-widest cursor-pointer shadow-sm"
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
                                className="w-32 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-800 px-6 py-3.5 text-[10px] font-black text-indigo-950 dark:text-white focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none uppercase placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner"
                              />
                              <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-950 dark:bg-indigo-600 text-white shadow-xl shadow-indigo-950/20 hover:scale-110 active:scale-90 transition-all group/btn border border-white/10">
                                 <CheckCircle2 className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                      {event.participants.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-10 py-20 text-center text-slate-300 dark:text-slate-700 font-black uppercase tracking-widest text-[11px]">SİSTEMDE KAYITLI KATILIMCI BULUNAMADI</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <Zap className="absolute -right-10 -bottom-10 h-40 w-40 opacity-[0.02] dark:opacity-[0.05] -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" />
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
     PENDING: { label: "BEKLEMEDE", color: "text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-white/5", dot: "bg-slate-300 dark:bg-slate-600" },
     ATTENDED: { label: "KATILDI", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" },
     ABSENT: { label: "GELMEDİ", color: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20", dot: "bg-red-600 shadow-[0_0_12px_rgba(239,68,68,0.5)]" },
     EXCUSED: { label: "MAZERETLİ", color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]" },
  };
  const config = configs[status] || configs.PENDING;
  return (
    <div className={cn("inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl border text-[9px] font-black uppercase tracking-[0.25em] shadow-sm", config.color)}>
       <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
       {config.label}
    </div>
  );
}

function StatBadge({ label, value, theme }: { label: string; value: number; theme: "indigo" | "emerald" | "red" | "amber" }) {
  const themes = {
     indigo: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40",
     emerald: "bg-emerald-100/50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40",
     red: "bg-red-100/50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/40",
     amber: "bg-amber-100/50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40",
  };
  return (
    <div className={cn("rounded-3xl border px-8 py-4 transition-all hover:scale-105 flex flex-col items-center justify-center min-w-[110px] shadow-sm", themes[theme])}>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 font-montserrat">{label}</span>
      <span className="text-3xl font-black font-montserrat leading-none tracking-tighter italic">{value}</span>
    </div>
  );
}
