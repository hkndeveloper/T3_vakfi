import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { 
  Megaphone, 
  Bell, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  LayoutDashboard, 
  Zap, 
  Sparkles, 
  ChevronRight,
  Target,
  Send,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  Pin,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

async function publishCommunityAnnouncementAction(formData: FormData) {
  "use server";
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const endDateRaw = String(formData.get("endDate") ?? "").trim();
  const isImportant = String(formData.get("isImportant") ?? "") === "on";
  if (!title || !content) return;

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      targetType: "COMMUNITY_MEMBERS",
      communityId,
      publishedBy: session.user.id,
      startDate: new Date(),
      endDate: endDateRaw ? new Date(endDateRaw) : null,
      isImportant,
    },
  });

  const members = await prisma.communityMember.findMany({
    where: { communityId, status: "ACTIVE" },
    select: { userId: true },
  });
  const userIds = [...new Set(members.map((m) => m.userId))];

  if (userIds.length > 0) {
    await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        title: `Topluluk duyurusu: ${announcement.title}`,
        content: announcement.content,
        type: "ANNOUNCEMENT",
      })),
    });
  }

  revalidatePath("/baskan/duyurular");
  revalidatePath("/bildirimler");
}

export default async function PresidentAnnouncementsPage() {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [
        { targetType: "ALL_USERS" },
        { targetType: "PRESIDENTS" },
        { targetType: "COMMUNITY_MEMBERS", communityId },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200 group">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
            <Megaphone className="h-4 w-4 text-corporate-blue" /> İLETİŞİM MERKEZİ
          </div>
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
            DUYURU <br />
            <span className="text-corporate-blue italic">OPERASYONU</span>
          </h1>
          <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
            Topluluk ekosisteminize anlık duyurular yayınlayın, stratejik gelişmeleri paylaşın ve merkezi duyuru akışını kurumsal standartlarda yönetin.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform group-hover:rotate-12 transition-transform duration-1000">
           <Bell className="h-32 w-32" />
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 items-start">
        {/* Publish Form */}
        <div className="lg:col-span-12 xl:col-span-5 t3-panel p-12 md:p-14 bg-white border-t-[16px] border-t-corporate-blue group/form relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 relative z-10">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-corporate-blue shadow-sm group-hover/form:scale-110 transition-transform duration-500">
                 <Send className="h-8 w-8" />
              </div>
              <div>
                <h3 className="t3-heading text-3xl">YENİ YAYIN</h3>
                <p className="t3-label mt-3">Anlık topluluk bildirimi oluşturun.</p>
              </div>
            </div>
          </div>

          <form action={publishCommunityAnnouncementAction} className="space-y-10 relative z-10">
            <div className="space-y-4">
               <label className="flex items-center gap-3 t3-label text-slate-950 px-1">
                  <Megaphone className="h-4 w-4 text-corporate-blue" /> DUYURU BAŞLIĞI
               </label>
               <input name="title" placeholder="Stratejik duyuru başlığını girin..." className="t3-input w-full bg-slate-50/50" required />
            </div>
            <div className="space-y-4">
               <label className="flex items-center gap-3 t3-label text-slate-950 px-1">
                  <Calendar className="h-4 w-4 text-corporate-orange" /> GEÇERLİLİK TARİHİ
               </label>
               <input name="endDate" type="date" className="t3-input w-full bg-slate-50/50" />
            </div>
            <div className="space-y-4">
               <label className="flex items-center gap-3 t3-label text-slate-950 px-1">
                  <MessageSquare className="h-4 w-4 text-corporate-blue" /> MESAJ İÇERİĞİ
               </label>
               <textarea
                 name="content"
                 placeholder="Duyuru metnini teknik ve profesyonel bir dille buraya aktarın..."
                 rows={5}
                 className="t3-input w-full bg-slate-50/50 min-h-[200px] resize-none"
                 required
               />
            </div>
            <label className="flex items-center justify-between p-8 rounded-2xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-white transition-all group/check shadow-sm">
              <div className="flex items-center gap-6">
                 <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <Pin className="h-5 w-5 text-corporate-orange group-hover/check:rotate-12 transition-transform" />
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-black text-slate-950 uppercase tracking-widest font-outfit">KRİTİK DUYURU</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight italic">VİTRİN ALANINDA ÖNCELİKLİ GÖSTERİLİR.</span>
                 </div>
              </div>
              <input type="checkbox" name="isImportant" className="h-6 w-6 rounded-lg border-slate-300 text-corporate-orange focus:ring-corporate-orange transition-all" />
            </label>
            <button className="t3-button t3-button-primary w-full h-20 text-base shadow-xl shadow-corporate-blue/20">SİSTEME SERVİS ET</button>
          </form>
          
          <Zap className="absolute -right-10 -bottom-10 h-40 w-40 opacity-[0.02] -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" />
        </div>

        {/* Feed */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-10">
           <div className="flex flex-wrap items-center justify-between gap-6 px-10">
              <div>
                <h3 className="t3-heading text-3xl">Global Akış</h3>
                <div className="flex items-center gap-3 mt-4">
                   <div className="h-1.5 w-16 rounded-full bg-corporate-orange" />
                   <p className="t3-label">{announcements.length} AKTİF BİLDİRİM</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                 <Bell className="h-7 w-7" />
              </div>
           </div>
           
           <div className="grid gap-8">
              {announcements.map((a) => (
                <article key={a.id} className={cn(
                  "group t3-panel p-12 transition-all hover:translate-x-3 relative overflow-hidden bg-white",
                  a.isImportant 
                    ? "border-l-[12px] border-l-corporate-orange shadow-xl shadow-orange-500/5" 
                    : "border-l-[12px] border-l-corporate-blue"
                )}>
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                       <span className={cn(
                         "t3-badge",
                         a.isImportant 
                           ? "bg-orange-50 text-corporate-orange border-orange-100" 
                           : "bg-blue-50 text-corporate-blue border-blue-100"
                       )}>
                         {a.isImportant ? "KRİTİK" : "OPERASYONEL"}
                       </span>
                       <div className="flex items-center gap-4 t3-label bg-slate-50 px-5 py-2 rounded-xl border border-slate-100">
                          <Calendar className="h-3.5 w-3.5 text-corporate-orange" /> {new Date(a.createdAt).toLocaleDateString("tr-TR")}
                       </div>
                    </div>
                    <h4 className="text-3xl font-black text-slate-950 tracking-tight uppercase group-hover:text-corporate-blue transition-colors leading-[1.1] italic">{a.title}</h4>
                    <p className="mt-8 text-base text-slate-600 font-medium leading-relaxed">{a.content}</p>
                    
                    <div className="mt-10 pt-8 border-t border-slate-50 flex flex-wrap items-center justify-between gap-6">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                             <Users className="h-5 w-5 text-slate-400" />
                          </div>
                          <span className="t3-label text-slate-400">SEGMENT: {a.targetType.replace("_", " ")}</span>
                       </div>
                       <ArrowRight className="h-7 w-7 text-slate-200 opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                  
                  {/* Watermark icon */}
                  <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity rotate-12">
                     <MessageSquare className="h-48 w-48" />
                  </div>
                </article>
              ))}
              
              {announcements.length === 0 && (
                <div className="t3-panel-elevated p-24 text-center bg-slate-50/50 border-dashed border-2">
                   <div className="flex flex-col items-center gap-10">
                      <div className="h-24 w-24 rounded-2xl bg-white flex items-center justify-center text-slate-200 border border-slate-200 shadow-sm">
                         <Megaphone className="h-12 w-12" />
                      </div>
                      <p className="t3-label">AKTİF BİLDİRİM VE DUYURU BULUNMAMAKTADIR.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
