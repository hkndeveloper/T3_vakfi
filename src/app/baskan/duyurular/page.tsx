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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-outfit pb-20">
      {/* T3 Premium Hero Section */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-indigo-950 p-12 md:p-16 text-white shadow-2xl group border border-white/5">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/30 px-5 py-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-10 animate-pulse-subtle">
            <Megaphone className="h-4 w-4 fill-amber-500" /> İLETİŞİM MERKEZİ
          </div>
          <h1 className="text-6xl font-black tracking-tighter sm:text-7xl font-montserrat leading-[0.9] uppercase">
            DUYURU <br />
            <span className="text-indigo-400 italic border-b-8 border-amber-500/30">OPERASYONU</span>
          </h1>
          <p className="mt-10 text-xl text-slate-300/80 font-medium max-w-2xl leading-relaxed">
            Topluluk ekosisteminize anlık duyurular yayınlayın, stratejik gelişmeleri paylaşın ve merkezi duyuru akışını kurumsal standartlarda yönetin.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-indigo-500/10 opacity-30 blur-[130px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-5 scale-150 transform group-hover:rotate-12 transition-transform duration-1000">
           <Bell className="h-40 w-40" />
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 items-start">
        {/* Publish Form */}
        <div className="lg:col-span-12 xl:col-span-5 rounded-[4rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-12 md:p-14 shadow-2xl dark:shadow-black/40 relative overflow-hidden group/form border-t-[16px] border-t-indigo-600">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 relative z-10">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-3xl bg-indigo-600 p-5 text-white shadow-xl shadow-indigo-600/20 group-hover/form:scale-110 transition-transform duration-500">
                 <Send className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-indigo-950 dark:text-white font-montserrat uppercase tracking-tight leading-none">YENİ YAYIN</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.25em] mt-3">Anlık topluluk bildirimi oluşturun.</p>
              </div>
            </div>
          </div>

          <form action={publishCommunityAnnouncementAction} className="space-y-10 relative z-10">
            <div className="space-y-4">
               <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] px-1 font-montserrat">
                  <Megaphone className="h-4 w-4 text-indigo-600" /> DUYURU BAŞLIĞI
               </label>
               <input name="title" placeholder="Stratejik duyuru başlığını girin..." className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600" required />
            </div>
            <div className="space-y-4">
               <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] px-1 font-montserrat">
                  <Calendar className="h-4 w-4 text-amber-500" /> GEÇERLİLİK TARİHİ
               </label>
               <input name="endDate" type="date" className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none shadow-sm" />
            </div>
            <div className="space-y-4">
               <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] px-1 font-montserrat">
                  <MessageSquare className="h-4 w-4 text-indigo-600" /> MESAJ İÇERİĞİ
               </label>
               <textarea
                 name="content"
                 placeholder="Duyuru metnini teknik ve profesyonel bir dille buraya aktarın..."
                 rows={5}
                 className="w-full rounded-[2.5rem] border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-8 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none resize-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600"
                 required
               />
            </div>
            <label className="flex items-center justify-between p-8 rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all group/check shadow-sm">
              <div className="flex items-center gap-6">
                 <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                    <Pin className="h-5 w-5 text-amber-500 group-hover/check:rotate-12 transition-transform" />
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-widest font-montserrat">KRİTİK DUYURU</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">VİTRİN ALANINDA ÖNCELİKLİ GÖSTERİLİR.</span>
                 </div>
              </div>
              <input type="checkbox" name="isImportant" className="h-6 w-6 rounded-lg border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500 transition-all" />
            </label>
            <button className="w-full h-20 rounded-[2.5rem] bg-indigo-950 dark:bg-indigo-600 text-base font-black text-white shadow-2xl dark:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.25em] border border-white/10">SİSTEME SERVİS ET</button>
          </form>
          
          <Zap className="absolute -right-10 -bottom-10 h-40 w-40 opacity-[0.02] dark:opacity-[0.05] -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" />
        </div>

        {/* Feed */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-10">
           <div className="flex flex-wrap items-center justify-between gap-6 px-10">
              <div>
                <h3 className="text-3xl font-black text-indigo-950 dark:text-white tracking-tight font-montserrat uppercase leading-none">Global Akış</h3>
                <div className="flex items-center gap-3 mt-4">
                   <div className="h-1.5 w-16 rounded-full bg-amber-500" />
                   <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.25em]">{announcements.length} AKTİF BİLDİRİM</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-3xl bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-white/5">
                 <Bell className="h-7 w-7" />
              </div>
           </div>
           
           <div className="grid gap-8">
              {announcements.map((a) => (
                <article key={a.id} className={cn(
                  "group rounded-[3.5rem] border p-12 transition-all hover:translate-x-3 relative overflow-hidden",
                  a.isImportant 
                    ? "bg-white dark:bg-slate-900 border-amber-500/20 shadow-2xl dark:shadow-black/40 border-l-[12px] border-l-amber-500" 
                    : "bg-white dark:bg-slate-900 border-slate-50 dark:border-white/5 shadow-xl dark:shadow-black/20 border-l-[12px] border-l-indigo-600"
                )}>
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                       <span className={cn(
                         "px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                         a.isImportant 
                           ? "bg-amber-500/10 text-amber-600 border-amber-500/20" 
                           : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                       )}>
                         {a.isImportant ? "KRİTİK" : "OPERASYONEL"}
                       </span>
                       <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-5 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                          <Calendar className="h-3.5 w-3.5 text-amber-500" /> {new Date(a.createdAt).toLocaleDateString("tr-TR")}
                       </div>
                    </div>
                    <h4 className="text-3xl font-black text-indigo-950 dark:text-white font-montserrat tracking-tight uppercase group-hover:text-indigo-600 dark:group-hover:text-amber-500 transition-colors leading-[1.1]">{a.title}</h4>
                    <p className="mt-8 text-base text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{a.content}</p>
                    
                    <div className="mt-10 pt-8 border-t border-slate-50 dark:border-white/5 flex flex-wrap items-center justify-between gap-6">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                             <Users className="h-5 w-5 text-indigo-600" />
                          </div>
                          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-montserrat">SEGMENT: {a.targetType.replace("_", " ")}</span>
                       </div>
                       <ArrowRight className="h-7 w-7 text-slate-200 dark:text-slate-800 opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                  
                  {/* Watermark icon */}
                  <div className="absolute -right-6 -bottom-6 opacity-[0.02] dark:opacity-[0.05] group-hover:opacity-[0.08] transition-opacity rotate-12">
                     <MessageSquare className="h-48 w-48" />
                  </div>
                </article>
              ))}
              
              {announcements.length === 0 && (
                <div className="rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-24 text-center shadow-inner">
                   <div className="flex flex-col items-center gap-10">
                      <div className="h-24 w-24 rounded-[3rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-700 shadow-inner">
                         <Megaphone className="h-12 w-12" />
                      </div>
                      <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.25em] text-sm">AKTİF BİLDİRİM VE DUYURU BULUNMAMAKTADIR.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
