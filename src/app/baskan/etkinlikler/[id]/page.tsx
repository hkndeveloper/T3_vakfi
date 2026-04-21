import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { notFound } from "next/navigation";
import { AttendanceManager } from "@/components/attendance/AttendanceManager";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowLeft,
  Zap,
  Users,
  ShieldCheck,
  Building2,
  FileText,
  ChevronRight,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PresidentEventDetailPage({ params }: PageProps) {
  const session = await requireCommunityManager();
  const { id } = await params;

  const event = await prisma.event.findFirst({
    where: { 
      id, 
      communityId: { in: session.user.communityIds } 
    },
    include: {
      community: true,
      participants: true,
      _count: {
        select: { reports: true, participants: true }
      }
    }
  });

  if (!event) notFound();

  // Topluluk üyelerini getir (yoklama listesi için)
  const members = await prisma.communityMember.findMany({
    where: { communityId: event.communityId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          studentNumber: true
        }
      }
    }
  });

  const memberAttendance = members.map(m => ({
    ...m.user,
    attendanceStatus: event.participants.find(p => p.userId === m.user.id)?.attendanceStatus
  }));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-6 group">
        <Link 
          href="/baskan/etkinlikler"
          className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-950 hover:bg-slate-950 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ETKİNLİK YÖNETİMİ / {event.community.shortName}</p>
          <h2 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic leading-none mt-1">{event.title}</h2>
        </div>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-10 md:p-14 border border-slate-200 group">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-4 mb-8">
               <span className={cn(
                 "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all animate-pulse",
                 event.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-corporate-orange border-orange-100"
               )}>
                 <ShieldCheck className="inline-block h-4 w-4 mr-2" /> {event.status}
               </span>
               <span className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-sm">
                  {event.type}
               </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-tight uppercase mb-10 text-slate-950">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-slate-600">
               <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
                  <Calendar className="h-5 w-5 text-corporate-blue" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{new Date(event.eventDate).toLocaleDateString("tr-TR")}</span>
               </div>
               <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
                  <Clock className="h-5 w-5 text-corporate-orange" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{event.startTime || "BELİRTİLMEDİ"}</span>
               </div>
               <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
                  <MapPin className="h-5 w-5 text-corporate-blue" />
                  <span className="text-[11px] font-black uppercase tracking-widest truncate max-w-[200px]">{event.location || "SAHA"}</span>
               </div>
            </div>
          </div>
          
          <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-corporate-blue/5 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
             <Zap className="h-32 w-32" />
          </div>
        </div>

        <div className="t3-panel p-10 flex flex-col justify-center relative overflow-hidden group bg-slate-50/50">
           <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue mb-6 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                 <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-950 tracking-tighter italic uppercase">KATILIM</h3>
              <p className="t3-label mt-1">Kayıtlı Katılımcı</p>
              <div className="mt-8">
                 <span className="text-6xl font-black text-slate-950 tracking-tighter leading-none italic">{event._count.participants}</span>
                 <p className="text-[10px] text-corporate-blue font-black mt-4 uppercase tracking-widest">ÜYE İŞARETLENDİ</p>
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-corporate-blue/5 blur-3xl pointer-events-none" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Management Controls */}
        <div className="lg:col-span-1 space-y-10">
           <div className="t3-panel p-10 bg-slate-50/30">
              <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-widest mb-8 border-l-4 border-corporate-orange pl-5 italic">Yönetim Paketi</h4>
              
              <div className="space-y-6">
                 <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">// RAPOR DURUMU</p>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-black text-slate-950 uppercase italic">{event._count.reports > 0 ? "RAPORLANDI" : "BEKLENİYOR"}</span>
                       <Link 
                         href="/baskan/raporlar" 
                         className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-corporate-orange hover:bg-slate-950 hover:text-white transition-all"
                       >
                          <FileText className="h-6 w-6" />
                       </Link>
                    </div>
                 </div>

                 <Link 
                   href="/baskan/etkinlikler"
                   className="w-full h-16 rounded-xl bg-slate-950 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center"
                 >
                    ETKİNLİKLERE DÖN
                 </Link>
              </div>
           </div>

           <div className="t3-panel p-10 bg-slate-950 text-white relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                    <ShieldCheck className="h-7 w-7 text-corporate-orange" />
                 </div>
                 <div>
                    <h5 className="font-black text-sm uppercase tracking-tight italic">Onay Notu</h5>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none mt-1">Admin Geri Bildirimi</p>
                 </div>
              </div>
              <p className="text-xs text-white/60 italic leading-relaxed border-t border-white/10 pt-6">
                 {event.reviewNote || "Admin tarafından henüz bir inceleme notu bırakılmamıştır."}
              </p>
              <Building2 className="absolute -right-6 -bottom-6 h-32 w-32 opacity-[0.05] -rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
           </div>
        </div>

        {/* Attendance Area */}
        <div className="lg:col-span-2 space-y-10">
           <div className="flex flex-wrap items-center justify-between gap-6 px-4">
              <h3 className="t3-heading text-3xl text-slate-950 tracking-tighter italic uppercase">Yoklama & Katılımcılar</h3>
              <div className="flex items-center gap-3 bg-corporate-blue/5 px-5 py-2.5 rounded-xl border border-corporate-blue/10">
                 <UserCheck className="h-5 w-5 text-corporate-blue" />
                 <span className="text-[11px] font-black text-corporate-blue uppercase tracking-widest">{memberAttendance.length} TOPLAM ÜYE LİSTELENDİ</span>
              </div>
           </div>

           <div className="t3-panel-elevated bg-white border-2 border-slate-100 shadow-2xl p-4">
              <AttendanceManager eventId={event.id} members={memberAttendance as any} />
           </div>
        </div>
      </div>
    </div>
  );
}
