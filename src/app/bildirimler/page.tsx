import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/permissions";
import { Bell, CheckCircle2, Inbox, Clock, ShieldCheck, Zap, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

async function markAsReadAction(formData: FormData) {
  "use server";
  const session = await getCurrentSession();
  if (!session) redirect("/giris");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { isRead: true },
  });

  revalidatePath("/bildirimler");
}

export default async function NotificationsPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/giris");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 font-outfit p-8 md:p-12 animate-in fade-in duration-700">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Soft Executive Hero Section */}
        <div className="relative overflow-hidden rounded-t3-xl bg-slate-900 p-12 md:p-16 border border-slate-800 shadow-2xl shadow-slate-900/20">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-5 py-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-10 shadow-sm">
                <Bell className="h-4 w-4 text-corporate-orange" /> SİSTEM İLETİŞİM MERKEZİ
              </div>
              <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-white italic">
                BİLDİRİM <br />
                <span className="text-corporate-blue italic">MERKEZİ</span>
              </h1>
              <p className="mt-10 text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                Onay süreçleri, revizyon talepleri ve sistem güncellemeleri hakkındaki <span className="text-white font-bold decoration-corporate-blue decoration-4 underline underline-offset-4">kritik bildirimleri</span> buradan yönetin.
              </p>
            </div>

            <div className="flex gap-8">
              <div className="group/stat rounded-2xl bg-white/5 px-12 py-10 border border-white/10 transition-all hover:bg-white/10 text-center shadow-sm">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">OKUNMAMIŞ</p>
                <p className={cn("text-6xl font-black tracking-tighter leading-none", unreadCount > 0 ? "text-corporate-orange" : "text-white")}>{unreadCount}</p>
              </div>
            </div>
          </div>
          
          {/* Background Patterns */}
          <Inbox className="absolute -right-10 -bottom-10 h-64 w-64 opacity-[0.03] rotate-12 text-white" />
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-corporate-blue to-corporate-orange" />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-4 pb-6 border-b border-slate-200">
             <div className="flex items-center gap-4">
                <div className="h-1.5 w-12 rounded-full bg-corporate-blue" />
                <h2 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.3em]">BİLDİRİM GEÇMİŞİ</h2>
             </div>
          </div>

          {notifications.length === 0 ? (
            <div className="t3-panel-elevated p-28 text-center bg-white border-dashed border-2">
               <div className="flex flex-col items-center gap-10">
                  <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 border border-slate-100 shadow-sm">
                     <Inbox className="h-12 w-12" />
                  </div>
                  <p className="t3-label">HENÜZ BİR BİLDİRİM ALMADINIZ</p>
               </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {notifications.map((n) => (
                <article 
                  key={n.id} 
                  className={cn(
                    "t3-panel group p-8 md:p-10 transition-all relative overflow-hidden",
                    n.isRead 
                      ? "bg-slate-50/50 border-slate-200 opacity-80" 
                      : "bg-white border-l-[12px] border-l-corporate-blue shadow-xl shadow-blue-500/5"
                  )}
                >
                  <div className="relative z-10 flex flex-wrap items-start justify-between gap-8">
                    <div className="flex gap-8">
                       <div className={cn(
                         "h-16 w-16 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                         n.isRead ? "bg-slate-100 text-slate-400" : "bg-corporate-blue/10 text-corporate-blue shadow-sm border border-corporate-blue/20"
                       )}>
                         {n.type === "EVENT" ? <Zap className="h-7 w-7" /> : <Sparkles className="h-7 w-7" />}
                       </div>
                       
                       <div className="space-y-3">
                         <div className="flex items-center gap-4">
                            <span className={cn(
                               "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                               n.isRead ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-blue-50 text-corporate-blue border-blue-100"
                            )}>
                               {n.type} SİSTEM MESAJI
                            </span>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               <Clock className="h-3.5 w-3.5" />
                               <span>{new Date(n.createdAt).toLocaleString("tr-TR")}</span>
                            </div>
                         </div>
                         <h3 className={cn(
                           "text-2xl font-black tracking-tighter uppercase italic transition-colors",
                           n.isRead ? "text-slate-500" : "text-slate-950 group-hover:text-corporate-blue"
                         )}>
                           {n.title}
                         </h3>
                         <p className={cn(
                           "text-base font-medium leading-relaxed max-w-2xl",
                           n.isRead ? "text-slate-400" : "text-slate-600"
                         )}>
                           {n.content}
                         </p>
                       </div>
                    </div>

                    <div className="flex items-center">
                       {!n.isRead ? (
                         <form action={markAsReadAction}>
                           <input type="hidden" name="id" value={n.id} />
                           <button className="t3-button t3-button-primary px-8 py-4 text-[10px] shadow-lg shadow-corporate-blue/20">
                              OKUNDU OLARAK İŞARETLE
                              <CheckCircle2 className="h-4 w-4" />
                           </button>
                         </form>
                       ) : (
                         <div className="flex items-center gap-3 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck className="h-4 w-4" />
                            GÖRÜLDÜ
                         </div>
                       )}
                    </div>
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
