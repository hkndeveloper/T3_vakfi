import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/permissions";
import { notFound } from "next/navigation";
import { CommunityEditForm } from "@/components/forms/CommunityEditForm";
import { CommunityDetailClient } from "@/components/admin/CommunityDetailClient";
import { 
  Building2, 
  School, 
  Users, 
  ArrowLeft,
  Zap,
  Calendar,
  FileText,
  ChevronRight,
  UserCheck,
  Star,
  Activity,
  History
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CommunityDetailPage({ params }: PageProps) {
  await requireSuperAdmin();
  const { id } = await params;

  const community = await prisma.community.findUnique({
    where: { id },
    include: {
      university: true,
      _count: {
        select: { members: true, createdEvents: true, reports: true }
      },
      createdEvents: {
        orderBy: { eventDate: "desc" },
        take: 5
      },
      userRoles: {
        where: { role: { code: "president" } },
        include: { user: true }
      }
    }
  });

  if (!community) notFound();

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    where: { isActive: true },
    take: 100
  });

  const currentPresident = community.userRoles[0]?.user;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Header & Navigation */}
      <div className="flex items-center gap-6 group">
        <Link 
          href="/admin/topluluklar"
          className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-950 hover:bg-slate-950 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TOPLULUK YÖNETİMİ / {community.shortName}</p>
          <h2 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic leading-none mt-1">{community.name}</h2>
        </div>
      </div>

      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-10 md:p-14 border border-slate-200 group">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] mb-10 shadow-sm">
              <Zap className="h-3.5 w-3.5 text-corporate-orange" /> BİRİM ANALİZİ
            </div>
            <div className="flex items-center gap-4 text-slate-600 mb-6 bg-white w-fit px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
               <School className="h-5 w-5 text-corporate-blue" />
               <span className="text-[11px] font-black uppercase tracking-widest">{community.university.name}</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-6xl leading-tight uppercase text-slate-950 italic">
              {community.shortName} <br />
              <span className="text-corporate-blue italic">TOPLULUĞU</span>
            </h1>
          </div>
          
          <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-corporate-blue/5 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] transform group-hover:scale-110 transition-transform">
             <Building2 className="h-40 w-40" />
          </div>
        </div>

        <div className="t3-panel p-8 flex flex-col justify-between relative overflow-hidden group bg-slate-50/50">
           <div className="relative z-10">
              <div className="h-14 w-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue mb-6 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                 <Users className="h-7 w-7" />
              </div>
              <p className="t3-label">Toplam Kurumsal Üye</p>
              <h3 className="text-5xl font-black text-slate-950 tracking-tighter leading-none italic mt-2">{community._count.members}</h3>
           </div>
           <Link href="/admin/kullanicilar" className="text-[10px] font-black text-corporate-blue uppercase tracking-widest flex items-center gap-2 mt-8 group-hover:gap-3 transition-all">
              ÜYE LİSTESİ <ChevronRight className="h-3 w-3" />
           </Link>
        </div>

        <div className="t3-panel p-8 flex flex-col justify-between relative overflow-hidden group bg-slate-50/50">
           <div className="relative z-10">
              <div className="h-14 w-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-corporate-orange mb-6 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                 <Calendar className="h-7 w-7" />
              </div>
              <p className="t3-label">Toplam Etkinlik</p>
              <h3 className="text-5xl font-black text-slate-950 tracking-tighter leading-none italic mt-2">{community._count.createdEvents}</h3>
           </div>
           <div className="text-[10px] text-corporate-orange font-black uppercase tracking-widest flex items-center gap-2 mt-8">
              <div className="h-1.5 w-6 rounded-full bg-corporate-orange shadow-sm" />
              GÜÇ SKORU: HIGH
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Control Panel */}
        <div className="lg:col-span-1 space-y-10">
           <div className="t3-panel p-10 bg-slate-50/30">
              <CommunityEditForm community={community} />
           </div>
           
           <div className="t3-panel p-10 bg-slate-50/30">
              <CommunityDetailClient 
                 communityId={community.id} 
                 users={users} 
                 currentPresidentName={currentPresident?.name} 
              />
           </div>

           <div className="t3-panel p-10 bg-slate-950 text-white relative overflow-hidden group">
              <h4 className="text-sm font-black uppercase tracking-widest mb-8 border-l-4 border-corporate-orange pl-4 italic">Hızlı Erişim</h4>
              <Link 
                href="/admin/rapor-onaylari"
                className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-slate-950 transition-all group/link"
              >
                <div className="flex items-center gap-4">
                   <FileText className="h-6 w-6 text-corporate-orange" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Rapor Onayları</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-30 group-hover/link:translate-x-1 transition-all" />
              </Link>
              <Activity className="absolute -right-6 -bottom-6 h-32 w-32 opacity-[0.05] -rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
           </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex flex-wrap items-center justify-between gap-6 px-4">
              <div className="flex flex-col">
                 <h3 className="t3-heading text-3xl text-slate-950 tracking-tighter">Son Faaliyet Akışı</h3>
                 <p className="t3-label">TOPLULUĞUN SON 5 KURUMSAL ETKİNLİĞİ</p>
              </div>
              <div className="flex items-center gap-3 bg-corporate-blue/5 px-4 py-2 rounded-xl border border-corporate-blue/10 font-bold">
                 <Activity className="h-4 w-4 text-corporate-blue animate-pulse" />
                 <span className="text-[10px] font-black text-corporate-blue uppercase tracking-widest">CANLI VERİ AKIŞI</span>
              </div>
           </div>

           <div className="grid gap-6">
              {community.createdEvents.map((event) => (
                 <div key={event.id} className="t3-panel group flex items-center gap-8 p-8 bg-white hover:bg-slate-50 transition-all border-l-[12px] border-l-slate-200 hover:border-l-corporate-blue">
                    <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                       <span className="text-[10px] font-black text-slate-400 group-hover:text-white/50 uppercase leading-none mb-1">
                          {new Date(event.eventDate).toLocaleString("tr-TR", { month: "short" })}
                       </span>
                       <span className="text-2xl font-black text-slate-950 group-hover:text-white leading-none italic">
                          {new Date(event.eventDate).getDate()}
                       </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <div className="flex flex-wrap items-center gap-4 mb-3">
                          <span className={cn(
                             "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all shadow-sm",
                             event.status === "APPROVED" 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                : "bg-orange-50 text-corporate-orange border-orange-100"
                          )}>
                             {event.status === "APPROVED" ? "ONAYLANDI" : "İNCELEMEDE"}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">@{event.location}</span>
                       </div>
                       <h4 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic group-hover:text-corporate-blue transition-colors truncate">{event.title}</h4>
                    </div>
                    
                    <div className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-slate-950 group-hover:bg-white transition-all shadow-sm">
                       <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                 </div>
              ))}
              
              {community.createdEvents.length === 0 && (
                 <div className="t3-panel-elevated p-24 text-center bg-slate-50/50 border-dashed border-2">
                    <History className="h-12 w-12 text-slate-200 mx-auto mb-6" />
                    <p className="t3-label">BU TOPLULUĞA AİT GEÇMİŞ BİR KAYIT BULUNAMADI</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

