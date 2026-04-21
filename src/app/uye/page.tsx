import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { Calendar, CheckCircle, Bell, User, Building2 } from "lucide-react";

export default async function MemberDashboardPage() {
  const session = await requirePermission("member.view");

  const membership = await prisma.communityMember.findFirst({
    where: { userId: session.user.id, status: "ACTIVE" },
    include: { community: { include: { university: true } } }
  });

  const [eventParticipants, announcements] = await Promise.all([
    prisma.eventParticipant.findMany({
      where: { userId: session.user.id },
      include: { event: true },
      take: 5
    }),
    prisma.announcement.findMany({
      where: {
        OR: [
          { targetType: "ALL_USERS" },
          { targetType: "COMMUNITY_MEMBERS" },
          { communityId: membership?.communityId }
        ]
      },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  const attendedCount = eventParticipants.filter(ep => ep.attendanceStatus === "ATTENDED").length;
  const upcomingEvents = eventParticipants.filter(ep => {
    const eventDate = new Date(ep.event.eventDate);
    return eventDate >= new Date();
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <User className="h-4 w-4 text-corporate-blue" /> ÜYE PROFİLİ & ÖZET
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[1] uppercase italic text-slate-950">
              HOŞ GELDİN, <br />
              <span className="text-corporate-orange decoration-corporate-blue decoration-8 underline underline-offset-8">
                {(session.user.name ?? "ÜYE").split(" ")[0]}
              </span>
            </h1>
            <p className="mt-12 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              {membership ? (
                <>
                  <span className="text-slate-950 font-bold">{membership.community.university.name}</span> bünyesindeki <span className="text-slate-950 font-bold underline decoration-corporate-blue/30 decoration-4 underline-offset-4">{membership.community.name}</span> topluluğunda aktif katılım sağlıyorsunuz.
                </>
              ) : (
                "Henüz aktif bir topluluk üyeliğiniz bulunmamaktadır."
              )}
            </p>
          </div>

          <div className="flex gap-8">
             <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">KATILIM SKORU</p>
               <p className="text-6xl font-black tracking-tighter text-slate-950 leading-none">%{eventParticipants.length > 0 ? Math.round((attendedCount / eventParticipants.length) * 100) : 0}</p>
             </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <Building2 className="h-32 w-32" />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="TOPLAM ETKİNLİK" value={eventParticipants.length} icon={Calendar} theme="blue" />
        <StatCard label="KATILDIKLARIM" value={attendedCount} icon={CheckCircle} theme="emerald" />
        <StatCard label="YAKLAŞANLAR" value={upcomingEvents.length} icon={Calendar} theme="orange" />
        <StatCard label="BİLDİRİMLER" value={announcements.length} icon={Bell} theme="blue" />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-12 md:grid-cols-2">
        <div className="t3-panel p-10 md:p-12 bg-slate-50/30 border-l-[16px] border-l-corporate-blue">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                <Calendar className="h-7 w-7" />
              </div>
              <div>
                <h2 className="t3-heading text-2xl text-slate-950">Son Etkinlikler</h2>
                <p className="t3-label">KATILIM DURUMUNUZ VE TAKVİM</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {eventParticipants.slice(0, 5).map((ep) => (
              <div key={ep.id} className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-corporate-blue/30 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-corporate-blue group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-base font-black text-slate-950 truncate uppercase italic tracking-tighter">{ep.event.title}</p>
                  <p className="text-xs text-slate-500 font-bold mt-1">{new Date(ep.event.eventDate).toLocaleDateString("tr-TR")}</p>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                  ep.attendanceStatus === "ATTENDED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                )}>
                  {ep.attendanceStatus === "ATTENDED" ? "KATILDI" : "BEKLEMEDE"}
                </div>
              </div>
            ))}
            {eventParticipants.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                <p className="text-sm text-slate-400 font-black uppercase tracking-widest leading-loose">Henüz size tanımlanmış bir etkinlik bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </div>

        <div className="t3-panel p-10 md:p-12 bg-slate-50/30 border-l-[16px] border-l-corporate-orange">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-orange shadow-sm">
                <Bell className="h-7 w-7" />
              </div>
              <div>
                <h2 className="t3-heading text-2xl text-slate-950">Duyuru Panosu</h2>
                <p className="t3-label">TOPLULUKTAN SON HABERLER</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {announcements.slice(0, 5).map((announcement) => (
              <div key={announcement.id} className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-corporate-orange/30 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-corporate-orange group-hover:scale-110 transition-transform">
                  <Bell className="h-6 w-6" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-base font-black text-slate-950 truncate uppercase italic tracking-tighter">{announcement.title}</p>
                  <p className="text-xs text-slate-500 font-bold mt-1">{new Date(announcement.createdAt).toLocaleDateString("tr-TR")}</p>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                <p className="text-sm text-slate-400 font-black uppercase tracking-widest leading-loose">Şu an için yeni bir duyuru bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, theme }: any) {
  const themes = {
    blue: "text-corporate-blue bg-white border-slate-200 shadow-sm",
    emerald: "text-emerald-500 bg-white border-slate-200 shadow-sm",
    orange: "text-corporate-orange bg-white border-slate-200 shadow-sm",
  };
  const selectedTheme = themes[theme as keyof typeof themes] || themes.blue;

  return (
    <div className="t3-panel p-8 group relative overflow-hidden bg-white hover:-translate-y-2 transition-all">
      <div className={cn("rounded-2xl p-4 w-fit border transition-all group-hover:scale-110 group-hover:bg-slate-50 mb-8", selectedTheme)}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="t3-label">{label}</p>
      <p className="mt-3 text-4xl font-black text-slate-950 tracking-tighter leading-none italic">{value}</p>
      <Icon className="absolute -right-8 -bottom-8 h-24 w-24 opacity-[0.02] rotate-12 group-hover:opacity-[0.05] transition-opacity" />
    </div>
  );
}
