import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { 
  Bell, 
  Calendar, 
  AlertCircle, 
  Info, 
  Megaphone,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function MemberAnnouncementsPage() {
  const session = await requirePermission("member.view");

  const membership = await prisma.communityMember.findFirst({
    where: { userId: session.user.id, status: "ACTIVE" },
    include: { community: true }
  });

  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [
        { targetType: "ALL_USERS" },
        { targetType: "COMMUNITY_MEMBERS", communityId: membership?.communityId || undefined },
      ],
      AND: [
        {
          OR: [
            { startDate: { lte: new Date() } },
          ]
        },
        {
          OR: [
            { endDate: null },
            { endDate: { gte: new Date() } }
          ]
        }
      ]
    },
    include: { community: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
            <Megaphone className="h-4 w-4 text-corporate-orange" /> BİLGİ MERKEZİ
          </div>
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
            GÜNCEL <br />
            <span className="text-corporate-blue italic">DUYURULAR</span>
          </h1>
          <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
            Topluluk ekosistemindeki stratejik gelişmeleri, etkinlik bildirimlerini ve kurumsal duyuruları <span className="text-slate-950 font-bold decoration-corporate-blue decoration-4 underline underline-offset-4">anlık olarak</span> takip edin.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <Bell className="h-32 w-32" />
        </div>
      </div>

      <div className="space-y-8">
        {announcements.length === 0 ? (
          <div className="t3-panel-elevated p-28 text-center bg-slate-50/50 border-dashed border-2">
             <div className="flex flex-col items-center gap-10">
                <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-slate-200 border border-slate-200 shadow-sm">
                   <Megaphone className="h-12 w-12" />
                </div>
                <p className="t3-label">AKTİF BİLDİRİM VE DUYURU BULUNMAMAKTADIR</p>
             </div>
          </div>
        ) : (
          <div className="grid gap-10">
            {announcements.map((announcement) => (
              <article key={announcement.id} className={cn(
                "t3-panel group p-10 md:p-12 transition-all hover:bg-slate-50/50 relative overflow-hidden",
                announcement.isImportant 
                  ? "border-l-[16px] border-l-corporate-orange bg-orange-50/10" 
                  : "border-l-[16px] border-l-slate-950 bg-slate-50/30"
              )}>
                <div className="relative z-10 flex flex-wrap lg:flex-nowrap gap-10">
                  <div className={cn(
                    "h-20 w-20 shrink-0 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110",
                    announcement.isImportant 
                      ? "bg-corporate-orange text-white" 
                      : "bg-slate-950 text-white"
                  )}>
                    {announcement.isImportant ? (
                      <AlertCircle className="h-10 w-10" />
                    ) : (
                      <Bell className="h-10 w-10" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                       <div className="flex items-center gap-4">
                          <span className={cn(
                             "px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                             announcement.isImportant 
                               ? "bg-white text-corporate-orange border-orange-100" 
                               : "bg-white text-slate-950 border-slate-200"
                          )}>
                             {announcement.isImportant ? "KRİTİK BİLDİRİM" : "OPERASYONEL MESAJ"}
                          </span>
                       </div>
                       <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-5 py-2 rounded-xl border border-slate-100 shadow-sm">
                          <Calendar className="h-3.5 w-3.5 text-corporate-blue" />
                          <span>{new Date(announcement.createdAt).toLocaleDateString("tr-TR")}</span>
                       </div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic leading-tight group-hover:text-corporate-blue transition-colors">
                      {announcement.title}
                    </h3>

                    {announcement.community && (
                      <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-xl border border-slate-200 shadow-sm w-fit">
                         <Building2 className="h-4 w-4 text-corporate-blue" />
                         <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest italic">{announcement.community.name}</span>
                      </div>
                    )}

                    <div className="max-w-4xl relative">
                      <p className="text-lg text-slate-600 font-medium leading-relaxed bg-white/50 p-8 rounded-2xl border border-slate-100 italic">
                        "{announcement.content}"
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-2 text-slate-200">
                          <Sparkles className="h-5 w-5" />
                       </div>
                       <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-950 shadow-sm group-hover:bg-slate-950 group-hover:text-white transition-all">
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                       </div>
                    </div>
                  </div>
                </div>
                
                <Zap className="absolute -right-10 -bottom-10 h-48 w-48 opacity-[0.02] -rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
