import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { 
  Calendar, 
  MapPin, 
  User, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";

import { EventReviewForm } from "@/components/admin/EventReviewForm";
import { AdminGlobalEventForm } from "@/components/admin/AdminGlobalEventForm";

export default async function AdminEventApprovalsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requirePermission("event.approve");
  const { q: search } = await searchParams;

  const pendingEvents = await prisma.event.findMany({
    where: {
      status: "PENDING_APPROVAL",
      ...(search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { community: { name: { contains: search, mode: "insensitive" } } }
        ]
      } : {})
    },
    orderBy: { createdAt: "asc" },
    include: {
      community: {
        include: {
          university: true,
        },
      },
      creator: true,
    },
  });

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section - RESPONSIVE */}
      <div className="relative overflow-hidden rounded-xl md:rounded-t3-xl bg-slate-100/50 p-6 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 md:gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-1.5 md:px-5 md:py-2 text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-6 md:mb-10 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-corporate-blue" /> OPERASYONEL DENETİM MERKEZİ
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 leading-none uppercase italic">
              ETKİNLİK <br />
              <span className="text-corporate-blue">ONAYLARl</span>
            </h1>
            <p className="mt-6 md:mt-8 text-base md:text-xl text-slate-600 font-medium leading-relaxed">
              Topluluklar tarafından planlanan faaliyetleri <span className="text-slate-950 font-bold">kurumsal vizyona uygunluk</span> açısından denetleyin.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <div className="group/stat rounded-xl md:rounded-2xl bg-white px-8 py-6 md:px-12 md:py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-4">BEKLEYEN İŞ</p>
              <p className={cn("text-4xl md:text-6xl font-black tracking-tighter leading-none", pendingEvents.length > 0 ? "text-corporate-orange" : "text-slate-950")}>{pendingEvents.length}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-64 md:h-[500px] w-64 md:w-[500px] rounded-full bg-corporate-blue/5 blur-[80px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 hidden md:flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <Calendar className="h-32 w-32" />
        </div>
      </div>

      <div className="space-y-8 md:space-y-10 px-4 md:px-0">
        <div className="t3-panel p-6 md:p-8 bg-slate-50/40">
          <AdminGlobalEventForm />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-2 md:px-4">
          <div>
            <h2 className="t3-heading text-2xl md:text-3xl text-slate-950 tracking-tighter">İnceleme Havuzu</h2>
            <div className="flex items-center gap-3 mt-2 md:mt-4">
               <div className="h-1 md:h-1.5 w-10 md:w-12 rounded-full bg-corporate-orange" />
               <p className="t3-label text-[9px] md:text-[10px]">ONAY BEKLEYEN ETKİNLİK PROJELERİ</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <form className="relative group w-full md:w-80">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within:text-corporate-orange transition-colors" />
              <input 
                name="q"
                type="text" 
                defaultValue={search}
                placeholder="Etkinlik ara..." 
                className="pl-11 md:pl-12 pr-4 md:pr-6 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all w-full shadow-sm text-slate-950" 
              />
            </form>
            {(search) && (
              <a href="/admin/etkinlik-onaylari" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2 shrink-0">
                Temizle
              </a>
            )}
          </div>
        </div>

        {pendingEvents.length === 0 ? (
          <div className="t3-panel-elevated p-12 md:p-20 text-center bg-slate-50/50 border-dashed border-2">
            <div className="mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center mb-6 border border-slate-200 shadow-sm">
              <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-950 tracking-tight uppercase italic">Kuyruk Boşaltıldı</h3>
            <p className="t3-label mt-4 max-w-sm mx-auto text-[10px]">Şu an için sisteme düşen yeni bir etkinlik onay talebi bulunmamaktadır.</p>
          </div>
        ) : null}

        <div className="grid gap-6 md:gap-8">
          {pendingEvents.map((event) => (
            <article key={event.id} className="t3-panel group overflow-hidden border-l-[8px] md:border-l-[12px] border-l-corporate-blue bg-slate-50/30">
               <div className="p-6 md:p-12">
                 <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-10 pb-6 md:pb-8 border-b border-slate-200">
                   <div className="space-y-4 md:space-y-6">
                     <div className="flex flex-col md:flex-row md:items-center gap-3">
                       <h2 className="text-xl md:text-3xl font-black text-slate-950 tracking-tight leading-tight group-hover:text-corporate-blue transition-colors uppercase italic">{event.title}</h2>
                       <span className="inline-flex w-fit px-3 py-1 bg-white text-slate-950 text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded shadow-sm">{event.type}</span>
                     </div>
                     <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-slate-500">
                        <div className="flex items-center gap-3 bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-slate-200 shadow-sm w-fit">
                          <Building2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-corporate-blue" />
                          <span className="text-slate-950 truncate max-w-[200px] md:max-w-none">
                            {event.community ? `${event.community.university.name} / ${event.community.name}` : "GLOBAL ETKİNLİK"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-slate-200 shadow-sm w-fit">
                           <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-corporate-orange" />
                           <span className="text-slate-950">{event.creator.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Clock className="h-3.5 w-3.5 text-slate-300" />
                           <span>{new Date(event.createdAt).toLocaleString("tr-TR")}</span>
                        </div>
                     </div>
                   </div>
                   <div className="hidden md:flex h-16 w-16 rounded-2xl bg-white border border-slate-200 items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                      <ChevronRight className="h-8 w-8" />
                   </div>
                 </div>

                 <div className="mt-8 md:mt-12 grid lg:grid-cols-12 gap-8 md:gap-12">
                   <div className="lg:col-span-7 space-y-8 md:space-y-10">
                      <div className="space-y-3 md:space-y-4">
                        <h4 className="text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] flex items-center gap-3">
                           <FileText className="h-4 w-4 text-corporate-blue" /> FAALİYET ÖZETİ & KAPSAM
                        </h4>
                        <div className="p-5 md:p-8 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-slate-600 font-medium leading-relaxed text-sm shadow-sm transition-all group-hover:border-corporate-blue/30">
                          {event.description || "Kampüs yetkilisi tarafından bir açıklama detaylandırılmamış."}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                        <div className="px-6 py-4 md:px-8 md:py-5 bg-white border border-slate-200 rounded-xl md:rounded-2xl flex items-center gap-4 shadow-sm">
                          <Calendar className="h-5 w-5 text-corporate-blue" />
                          <span className="text-sm md:text-base font-black text-slate-950 tracking-tighter">{new Date(event.eventDate).toLocaleDateString("tr-TR")}</span>
                        </div>
                        {event.location && (
                          <div className="px-6 py-4 md:px-8 md:py-5 bg-white border border-slate-200 rounded-xl md:rounded-2xl flex items-center gap-4 shadow-sm">
                            <MapPin className="h-5 w-5 text-corporate-orange" />
                            <span className="text-sm md:text-base font-black text-slate-950 tracking-tighter truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                   </div>

                   <div className="lg:col-span-5">
                      <EventReviewForm eventId={event.id} />
                   </div>
                 </div>
               </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
