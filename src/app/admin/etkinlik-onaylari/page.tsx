import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { 
  Calendar, 
  MapPin, 
  User, 
  Building2, 
  CheckCircle2, 
  XSquare, 
  RefreshCcw,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Clock,
  Sparkles,
  FileText,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

import { reviewEventAction } from "@/actions/admin-actions";

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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-corporate-blue" /> OPERASYONEL DENETİM MERKEZİ
            </div>
            <h1 className="text-4xl font-black tracking-tighter sm:text-6xl text-slate-950 leading-none uppercase italic">
              ETKİNLİK <br />
              <span className="text-corporate-blue">ONAYLARl</span>
            </h1>
            <p className="mt-8 text-xl text-slate-600 font-medium leading-relaxed">
              Topluluklar tarafından planlanan faaliyetleri <span className="text-slate-950 font-bold">kurumsal vizyona uygunluk</span> açısından denetleyin ve onay sürecini yönetin.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">BEKLEYEN İŞ</p>
              <p className={cn("text-6xl font-black tracking-tighter leading-none", pendingEvents.length > 0 ? "text-corporate-orange" : "text-slate-950")}>{pendingEvents.length}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <Calendar className="h-32 w-32" />
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div>
            <h2 className="t3-heading text-3xl text-slate-950 tracking-tighter">İnceleme Havuzu</h2>
            <div className="flex items-center gap-3 mt-4">
               <div className="h-1.5 w-12 rounded-full bg-corporate-orange" />
               <p className="t3-label">ONAY BEKLEYEN ETKİNLİK PROJELERİ</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <form className="relative group">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-corporate-orange transition-colors" />
              <input 
                name="q"
                type="text" 
                defaultValue={search}
                placeholder="Topluluk veya Etkinlik ara..." 
                className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all w-72 shadow-sm text-slate-950" 
              />
            </form>
            {(search) && (
              <a href="/admin/etkinlik-onaylari" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2">
                Temizle
              </a>
            )}
          </div>
        </div>

        {pendingEvents.length === 0 ? (
          <div className="t3-panel-elevated p-20 text-center bg-slate-50/50 border-dashed border-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 border border-slate-200 shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-950 tracking-tight uppercase italic">Kuyruk Boşaltıldı</h3>
            <p className="t3-label mt-4 max-w-sm mx-auto">Şu an için sisteme düşen yeni bir etkinlik onay talebi bulunmamaktadır.</p>
          </div>
        ) : null}

        <div className="grid gap-8">
          {pendingEvents.map((event) => (
            <article key={event.id} className="t3-panel group overflow-hidden border-l-[12px] border-l-corporate-blue bg-slate-50/30">
               <div className="p-8 md:p-12">
                 <div className="flex flex-wrap items-start justify-between gap-10 pb-8 border-b border-slate-200">
                   <div className="space-y-6">
                     <div className="flex items-center gap-4 flex-wrap">
                       <h2 className="text-3xl font-black text-slate-950 tracking-tight leading-tight group-hover:text-corporate-blue transition-colors uppercase italic">{event.title}</h2>
                       <span className="px-4 py-1.5 bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-lg shadow-sm">{event.type}</span>
                     </div>
                     <div className="flex flex-wrap items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                          <Building2 className="h-4 w-4 text-corporate-blue" />
                          <span className="text-slate-950">{event.community.university.name} / {event.community.name}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                           <User className="h-4 w-4 text-corporate-orange" />
                           <span className="text-slate-950">{event.creator.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Clock className="h-4 w-4 text-slate-300" />
                           <span>{new Date(event.createdAt).toLocaleString("tr-TR")}</span>
                        </div>
                     </div>
                   </div>
                   <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                      <ChevronRight className="h-8 w-8" />
                   </div>
                 </div>

                 <div className="mt-12 grid lg:grid-cols-12 gap-12">
                   <div className="lg:col-span-7 space-y-10">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] flex items-center gap-3">
                           <FileText className="h-4 w-4 text-corporate-blue" /> FAALİYET ÖZETİ & KAPSAM
                        </h4>
                        <div className="p-8 bg-white border border-slate-200 rounded-2xl text-slate-600 font-medium leading-relaxed text-sm shadow-sm transition-all group-hover:border-corporate-blue/30">
                          {event.description || "Kampüs yetkilisi tarafından bir açıklama detaylandırılmamış."}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-6">
                        <div className="px-8 py-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm">
                          <Calendar className="h-5 w-5 text-corporate-blue" />
                          <span className="text-base font-black text-slate-950 tracking-tighter">{new Date(event.eventDate).toLocaleDateString("tr-TR")}</span>
                        </div>
                        {event.location && (
                          <div className="px-8 py-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm">
                            <MapPin className="h-5 w-5 text-corporate-orange" />
                            <span className="text-base font-black text-slate-950 tracking-tighter">{event.location}</span>
                          </div>
                        )}
                      </div>
                   </div>

                   <form action={reviewEventAction} className="lg:col-span-5 space-y-8 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 h-1 w-full bg-corporate-blue" />
                     <input type="hidden" name="eventId" value={event.id} />
                     <div className="space-y-4">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.2em]">
                          <MessageSquare className="h-4 w-4 text-corporate-blue" /> DENETÇİ NOTLARI
                        </label>
                        <textarea
                          name="reviewNote"
                          rows={3}
                          placeholder="Birim başkanına iletilecek değerlendirme notu..."
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none resize-none"
                        />
                     </div>
                     <div className="space-y-3">
                        <button
                          name="decision"
                          value="APPROVED"
                          className="t3-button t3-button-primary w-full py-5 text-sm"
                        >
                          <CheckCircle2 className="h-5 w-5" /> PROJEYİ ONAYLA
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                           <button
                             name="decision"
                             value="DRAFT"
                             className="t3-button t3-button-accent w-full px-2 py-4"
                           >
                             <RefreshCcw className="h-4 w-4" /> REVİZYON İSTE
                           </button>
                           <button
                             name="decision"
                             value="REJECTED"
                             className="t3-button bg-rose-600 text-white hover:bg-rose-700 w-full px-2 py-4"
                           >
                             <XSquare className="h-4 w-4" /> KESİN RED
                           </button>
                        </div>
                     </div>
                   </form>
                 </div>
               </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
