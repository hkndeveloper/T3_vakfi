import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { EventForm } from "@/components/forms/EventForm";
import { 
  CalendarDays, 
  MapPin, 
  Tag, 
  Clock, 
  CheckCircle2, 
  Clock3, 
  AlertCircle, 
  XCircle,
  Trophy,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Zap,
  LayoutDashboard,
  ArrowRight,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { EventFilter } from "@/components/baskan/EventFilter";

export default async function PresidentEventsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];
  const { q: search, status: statusFilter } = await searchParams;

  const [community, events] = await Promise.all([
    prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, name: true, shortName: true },
    }),
    prisma.event.findMany({
      where: { 
        communityId,
        ...(search ? {
          title: { contains: search, mode: "insensitive" }
        } : {}),
        ...(statusFilter ? { status: statusFilter as any } : {})
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <Zap className="h-4 w-4 text-corporate-orange" /> OPERASYON MERKEZİ
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              ETKİNLİK <br />
              <span className="text-corporate-blue italic">AJANDASI</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              {community?.shortName} ekosisteminin tüm gelecek planlarını, onay süreçlerini ve geçmiş operasyonlarını <span className="text-slate-950 font-bold decoration-corporate-blue decoration-4 underline underline-offset-4">kurumsal standartlarda</span> buradan yönetin.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">PLANLI AKSİYON</p>
              <p className="text-5xl font-black text-slate-950 tracking-tighter leading-none italic">{events.length}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <Calendar className="h-32 w-32" />
        </div>
      </div>

      <div className="t3-panel p-10 md:p-12 bg-slate-50/30">
        <EventForm />
      </div>

      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                <Sparkles className="h-7 w-7" />
             </div>
             <div>
                <h2 className="t3-heading text-3xl text-slate-950 tracking-tighter">Operasyonel Kayıtlar</h2>
                <p className="t3-label">SİSTEME KAYITLI AKTİF FAALİYETLER</p>
             </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <EventFilter 
              initialSearch={search || ""} 
              initialStatus={statusFilter || ""} 
            />
          </div>
        </div>

        <div className="t3-panel overflow-hidden bg-slate-50/30">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100/50">
                <tr>
                  <th className="px-10 py-8 text-left t3-label">OPERASYON DETAYI</th>
                  <th className="px-10 py-8 text-left t3-label">ZAMAN & KONUM</th>
                  <th className="px-10 py-8 text-center t3-label">KATEGORİZASYON</th>
                  <th className="px-10 py-8 text-center t3-label">SİSTEM DURUMU</th>
                  <th className="px-10 py-8 text-right t3-label">AKSİYON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-28 text-center">
                       <div className="flex flex-col items-center gap-6 text-slate-400">
                          <LayoutDashboard className="h-16 w-16 opacity-10" />
                          <p className="t3-label">SİSTEMDE KAYITLI OPERASYON BULUNAMADI</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-white transition-all group">
                      <td className="px-10 py-9">
                        <div className="flex flex-col gap-4">
                          <span className="font-black text-slate-950 text-xl tracking-tight leading-none group-hover:text-corporate-blue transition-colors uppercase italic">{event.title}</span>
                          {event.reviewNote && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100 max-w-sm">
                              <AlertCircle className="h-4 w-4 text-corporate-orange mt-0.5 shrink-0" />
                              <p className="text-[10px] text-corporate-orange font-black uppercase tracking-tight leading-relaxed">DENETİM NOTU: {event.reviewNote}</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-9">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 text-slate-950 font-black text-xs uppercase tracking-tight">
                            <CalendarDays className="h-4 w-4 text-corporate-blue" />
                            <span>{new Date(event.eventDate).toLocaleDateString("tr-TR")}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] px-1">
                              <MapPin className="h-3.5 w-3.5 text-corporate-orange" />
                              <span className="truncate max-w-[150px]">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-9">
                        <div className="flex justify-center">
                          <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-950 text-[10px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                            <Tag className="h-4 w-4 text-slate-400 group-hover:text-white/50" />
                            {getEventTypeText(event.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-9">
                        <div className="flex justify-center">
                          <StatusBadge status={event.status} />
                        </div>
                      </td>
                      <td className="px-10 py-9">
                        <div className="flex justify-end">
                          <Link 
                            href={`/baskan/etkinlikler/${event.id}`}
                            className="h-12 w-12 rounded-full bg-white text-slate-950 flex items-center justify-center hover:bg-corporate-blue hover:text-white shadow-sm transition-all group/btn border border-slate-200"
                          >
                             <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; icon: any; color: string; dot: string }> = {
    DRAFT: { label: "TASLAK", icon: Clock3, color: "bg-slate-50 text-slate-500 border-slate-100", dot: "bg-slate-300" },
    PENDING_APPROVAL: { label: "DENETİMDE", icon: Clock, color: "bg-orange-50 text-corporate-orange border-orange-100", dot: "bg-corporate-orange animate-pulse shadow-[0_0_12px_rgba(234,88,12,0.4)]" },
    APPROVED: { label: "ONAYLANDI", icon: CheckCircle2, color: "bg-blue-50 text-corporate-blue border-blue-100", dot: "bg-corporate-blue shadow-[0_0_12px_rgba(37,99,235,0.4)]" },
    REJECTED: { label: "REVİZYON", icon: XCircle, color: "bg-rose-50 text-rose-600 border-rose-100", dot: "bg-rose-600" },
    COMPLETED: { label: "TAMAMLANDI", icon: Trophy, color: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" },
    CANCELED: { label: "İPTAL", icon: XCircle, color: "bg-slate-100 text-slate-500 border-slate-200", dot: "bg-slate-400" },
  };

  const config = configs[status] || configs.DRAFT;

  return (
    <span className={cn(
      "inline-flex items-center gap-3 rounded-2xl border px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm font-outfit bg-white",
      config.color
    )}>
      <span className={cn("h-2 w-2 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

function getEventTypeText(type: string) {
  const types: Record<string, string> = {
    EDUCATION: "Eğitim",
    SEMINAR: "Seminer",
    WORKSHOP: "Atölye",
    MEETING: "Toplantı",
    COMPETITION: "Yarışma",
    SOCIAL: "Sosyal Etkinlik",
    BOOTH: "Tanıtım Standı",
    TECHNICAL_TRIP: "Teknik Gezi",
  };
  return (types[type] || type).toUpperCase();
}
