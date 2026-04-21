import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { 
  Megaphone, 
  Bell, 
  Users, 
  Target, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SubmitButton } from "@/components/ui/SubmitButton";

async function createAnnouncementAction(formData: FormData) {
  "use server";
  const session = await requirePermission("announcement.publish");

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const targetType = String(formData.get("targetType") ?? "").trim();
  const communityIdRaw = String(formData.get("communityId") ?? "").trim();
  const endDateRaw = String(formData.get("endDate") ?? "").trim();
  const isImportant = String(formData.get("isImportant") ?? "") === "on";

  if (!title || !content || !targetType) return;

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      targetType: targetType as
        | "ALL_USERS"
        | "PRESIDENTS"
        | "COMMUNITY_MEMBERS"
        | "MANAGEMENT_TEAM",
      communityId: communityIdRaw || null,
      publishedBy: session.user.id,
      startDate: new Date(),
      endDate: endDateRaw ? new Date(endDateRaw) : null,
      isImportant,
    },
  });

  let recipientUserIds: string[] = [];
  if (targetType === "ALL_USERS") {
    const users = await prisma.user.findMany({ select: { id: true }, where: { isActive: true } });
    recipientUserIds = users.map((u) => u.id);
  } else if (targetType === "PRESIDENTS") {
    const presidents = await prisma.userRole.findMany({
      where: { role: { code: "president" } },
      select: { userId: true },
    });
    recipientUserIds = [...new Set(presidents.map((p) => p.userId))];
  } else if (targetType === "COMMUNITY_MEMBERS" && communityIdRaw) {
    const members = await prisma.communityMember.findMany({
      where: { communityId: communityIdRaw, status: "ACTIVE" },
      select: { userId: true },
    });
    recipientUserIds = [...new Set(members.map((m) => m.userId))];
  } else if (targetType === "MANAGEMENT_TEAM") {
    const managers = await prisma.userRole.findMany({
      where: { role: { code: "management_team" } },
      select: { userId: true },
    });
    recipientUserIds = [...new Set(managers.map((m) => m.userId))];
  }

  if (recipientUserIds.length > 0) {
    await prisma.notification.createMany({
      data: recipientUserIds.map((userId) => ({
        userId,
        title: `Yeni duyuru: ${announcement.title}`,
        content: announcement.content,
        type: "ANNOUNCEMENT",
      })),
      skipDuplicates: true,
    });
  }

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: "announcement.publish",
      modelType: "Announcement",
      modelId: announcement.id,
    },
  });

  revalidatePath("/admin/duyurular");
  revalidatePath("/baskan/duyurular");
  revalidatePath("/bildirimler");
}

export default async function AdminAnnouncementsPage() {
  await requirePermission("announcement.publish");

  const [announcements, communities] = await Promise.all([
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.community.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <Megaphone className="h-4 w-4 text-corporate-orange" /> KURUMSAL DUYURULAR
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              HABER <br />
              <span className="text-corporate-blue italic">MERKEZİ</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Admin merkezden tüm sisteme veya hedef gruplara yönelik duyurular yayınlayın, önemli gelişmeleri <span className="text-slate-950 font-bold decoration-corporate-blue decoration-4 underline underline-offset-4">kurumsal standartlarda</span> paylaşın.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">AKTİF YAYIN</p>
              <p className="text-5xl font-black text-slate-950 tracking-tighter leading-none italic">{announcements.length}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <Bell className="h-32 w-32" />
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
         {/* Creation Form */}
         <div className="lg:col-span-2 t3-panel p-10 md:p-12 space-y-10 bg-slate-50/50 h-fit">
            <div className="flex items-center gap-6 pb-8 border-b border-slate-200">
               <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                  <Send className="h-7 w-7" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic">Duyuru Yayınla</h2>
                  <p className="t3-label">HEDEF KİTLE BAZLI BİLGİLENDİRME</p>
               </div>
            </div>

            <form action={createAnnouncementAction} className="space-y-8">
               <div className="space-y-6">
                  <div className="space-y-3">
                     <label className="text-[11px] font-black text-slate-950 uppercase tracking-widest px-1">Duyuru Başlığı</label>
                     <input name="title" placeholder="Stratejik başlık girin..." className="w-full rounded-2xl border border-slate-200 bg-white px-8 py-5 text-sm font-bold text-slate-950 outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue/30 transition-all shadow-sm" required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-slate-950 uppercase tracking-widest px-1">Hedef Kitle</label>
                       <select name="targetType" className="w-full rounded-2xl border border-slate-200 bg-white px-8 py-5 text-sm font-bold text-slate-950 outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue/30 transition-all shadow-sm appearance-none cursor-pointer" required>
                          <option value="">Seçim Yapın</option>
                          <option value="ALL_USERS">Tüm Kullanıcılar</option>
                          <option value="PRESIDENTS">Sadece Başkanlar</option>
                          <option value="COMMUNITY_MEMBERS">Topluluk Üyeleri</option>
                          <option value="MANAGEMENT_TEAM">Yönetim Ekibi</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-slate-950 uppercase tracking-widest px-1">Bitiş Tarihi</label>
                       <input name="endDate" type="date" className="w-full rounded-2xl border border-slate-200 bg-white px-8 py-5 text-sm font-bold text-slate-950 outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue/30 transition-all shadow-sm" />
                    </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[11px] font-black text-slate-950 uppercase tracking-widest px-1">İlgili Topluluk</label>
                     <select name="communityId" className="w-full rounded-2xl border border-slate-200 bg-white px-8 py-5 text-sm font-bold text-slate-950 outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue/30 transition-all shadow-sm appearance-none cursor-pointer">
                        <option value="">Genel Duyuru (Seçim Yok)</option>
                        {communities.map((community) => (
                           <option key={community.id} value={community.id}>{community.name}</option>
                        ))}
                     </select>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[11px] font-black text-slate-950 uppercase tracking-widest px-1">İçerik Detayları</label>
                     <textarea name="content" placeholder="Mesajınızı kurumsal bir dille buraya yazın..." rows={4} className="w-full rounded-3xl border border-slate-200 bg-white px-8 py-6 text-sm font-bold text-slate-950 outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue/30 transition-all shadow-sm resize-none" required />
                  </div>
               </div>

               <div className="flex items-center gap-5 p-6 rounded-2xl border border-slate-200 bg-white group/opt cursor-pointer hover:border-corporate-orange transition-all shadow-sm">
                  <div className="relative flex items-center">
                    <input id="isImportant" type="checkbox" name="isImportant" className="peer h-7 w-7 border-2 border-slate-200 rounded-lg text-corporate-orange focus:ring-corporate-orange transition-all appearance-none checked:bg-corporate-orange checked:border-corporate-orange" />
                    <Sparkles className="absolute left-1.5 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <label htmlFor="isImportant" className="flex flex-col cursor-pointer">
                    <span className="text-sm font-black text-slate-950 uppercase tracking-tighter italic">Kritik Duyuru</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 group-hover/opt:text-corporate-orange/80 transition-colors">VURGULANMIŞ OLARAK GÖSTERİLİR</span>
                  </label>
               </div>

               <SubmitButton 
                 label="DUYURUYU ŞİMDİ YAYINLA" 
                 className="w-full flex items-center justify-center gap-4 rounded-xl bg-slate-950 px-10 py-6 text-sm font-black text-white hover:bg-corporate-blue transition-all active:scale-[0.98] uppercase tracking-widest shadow-xl shadow-slate-950/10" 
               />
            </form>
         </div>

         {/* Latest Announcements */}
         <div className="lg:col-span-3 space-y-10">
            <div className="flex items-center justify-between px-4">
               <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                     <Bell className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="t3-heading text-3xl text-slate-950 tracking-tighter">Aktif Duyurular</h2>
                    <p className="t3-label">SİSTEM ÜZERİNDEKİ GÜNCEL AKIŞ</p>
                  </div>
               </div>
            </div>

            {announcements.length === 0 ? (
               <div className="t3-panel-elevated p-28 text-center bg-slate-50/50 border-dashed border-2">
                  <div className="mx-auto w-24 h-24 rounded-full bg-white flex items-center justify-center mb-10 border border-slate-200 shadow-sm">
                     <AlertTriangle className="h-12 w-12 text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tight uppercase italic">Duyuru Bulunmuyor</h3>
                  <p className="t3-label mt-5">Henüz sistem trafiğine eklenmiş bir duyuru kaydı yok.</p>
               </div>
            ) : (
               <div className="space-y-8 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar px-2">
                  {announcements.map((a) => (
                     <article key={a.id} className={cn(
                        "t3-panel group overflow-hidden relative transition-all hover:bg-slate-50/30",
                        a.isImportant ? "border-l-[16px] border-l-corporate-orange" : "border-l-[16px] border-l-corporate-blue"
                     )}>
                        <div className="p-10 md:p-12">
                          <div className="flex flex-wrap items-start justify-between gap-8 mb-8 pb-8 border-b border-slate-200">
                             <div className="space-y-4">
                                <div className="flex items-center gap-4 flex-wrap">
                                   <ReportTypeBadge type={a.targetType} />
                                   {a.isImportant && (
                                     <span className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20">
                                       <Sparkles className="h-3 w-3" /> KRİTİK
                                     </span>
                                   )}
                                </div>
                                <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic leading-tight group-hover:text-corporate-blue transition-colors">
                                   {a.title}
                                </h3>
                             </div>
                             <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300 group-hover:bg-slate-950 group-hover:text-white transition-all">
                                <ChevronRight className="h-7 w-7" />
                             </div>
                          </div>
                          
                          <div className="space-y-8">
                             <p className="text-lg text-slate-600 font-medium leading-relaxed bg-white/50 p-8 rounded-2xl border border-slate-100 group-hover:border-slate-200 transition-all">
                                {a.content}
                             </p>
                             <div className="flex flex-wrap items-center gap-10 text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">
                                <div className="flex items-center gap-3">
                                   <Calendar className="h-4 w-4 text-corporate-blue" />
                                   <span>YAYIN: {new Date(a.startDate).toLocaleDateString("tr-TR")}</span>
                                </div>
                                {a.endDate && (
                                   <div className="flex items-center gap-3 border-l border-slate-200 pl-10">
                                      <Clock className="h-4 w-4 text-corporate-orange" />
                                      <span>BİTİŞ: {new Date(a.endDate).toLocaleDateString("tr-TR")}</span>
                                   </div>
                                )}
                             </div>
                          </div>
                        </div>
                        
                        {/* Decorative watermark */}
                        <div className="absolute -right-10 -bottom-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                           <Megaphone className="h-48 w-48 rotate-12" />
                        </div>
                     </article>
                  ))}
               </div>
            )}
         </div>
      </div>
    </div>
  );
}

function ReportTypeBadge({ type }: { type: string }) {
  const types: Record<string, { label: string; color: string }> = {
    ALL_USERS: { label: "GENEL", color: "bg-slate-950 text-white" },
    PRESIDENTS: { label: "BAŞKANLAR", color: "bg-corporate-orange text-white" },
    COMMUNITY_MEMBERS: { label: "ÜYELER", color: "bg-corporate-blue text-white" },
    MANAGEMENT_TEAM: { label: "YÖNETİM", color: "bg-indigo-600 text-white" },
  };
  const config = types[type as keyof typeof types] || { label: type, color: "bg-slate-100 text-slate-600" };
  return (
    <span className={cn(
      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
      config.color
    )}>
      {config.label}
    </span>
  );
}
