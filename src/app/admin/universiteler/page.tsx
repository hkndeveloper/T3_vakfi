import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/permissions";
import { UniversityForm } from "@/components/forms/UniversityForm";
import { 
  School, 
  MapPin, 
  Users, 
  Building2, 
  Search,
  Filter,
  ArrowUpRight,
  Zap,
  TrendingUp,
  LayoutDashboard,
  ChevronRight,
  Globe,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminUniversitiesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireSuperAdmin();
  const { q: search } = await searchParams;
  
  const universities = await prisma.university.findMany({
    where: search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } }
      ]
    } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { communities: true, users: true } },
    },
  });

  const totalUni = universities.length;
  const activeUni = universities.filter(u => u.status === "ACTIVE").length;

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section - RESPONSIVE */}
      <div className="relative overflow-hidden rounded-xl md:rounded-t3-xl bg-slate-100/50 p-6 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 md:gap-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-1.5 md:px-5 md:py-2 text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-6 md:mb-10 shadow-sm">
              <Globe className="h-3.5 w-3.5 md:h-4 md:w-4 text-corporate-blue" /> KAMPÜS AĞI OPERASYONLARI
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] uppercase text-slate-950 italic">
              ÜNİVERSİTE <br />
              <span className="text-corporate-blue">DİZİNİ</span>
            </h1>
            <p className="mt-6 md:mt-10 text-base md:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Vakıf ekosistemine dahil tüm akademik paydaşları, kampüs verilerini ve topluluk gelişim istatistiklerini <span className="text-slate-950 font-bold">kurumsal standartlarda</span> denetleyin.
            </p>
          </div>
          
          <div className="flex flex-row lg:flex-col xl:flex-row gap-4 md:gap-8 w-full lg:w-auto">
            <div className="flex-1 group/stat rounded-xl md:rounded-2xl bg-white px-6 py-6 md:px-12 md:py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 md:mb-4">TAM ENVANTER</p>
              <p className="text-3xl md:text-6xl font-black tracking-tighter text-slate-950 leading-none">{totalUni}</p>
            </div>
            <div className="flex-1 group/stat rounded-xl md:rounded-2xl bg-white px-6 py-6 md:px-12 md:py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[8px] md:text-[10px] font-black text-corporate-orange uppercase tracking-[0.3em] mb-2 md:mb-4">AKTİF MERKEZ</p>
              <p className="text-3xl md:text-6xl font-black text-corporate-orange tracking-tighter leading-none">{activeUni}</p>
            </div>
          </div>
        </div>
        
        {/* Background Decorative */}
        <div className="absolute -right-20 -top-20 h-64 md:h-[500px] w-64 md:w-[500px] rounded-full bg-corporate-blue/[0.03] blur-[80px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 hidden md:flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <School className="h-32 w-32" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 px-4 md:px-0">
        <div className="lg:col-span-1">
          <div className="t3-panel-elevated p-6 md:p-8 bg-slate-50/50">
             <h3 className="t3-heading text-lg md:text-xl mb-6 md:mb-8 text-slate-950">Yeni Üniversite Ekle</h3>
             <UniversityForm />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8 md:space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-2 md:px-4">
            <div>
              <h2 className="t3-heading text-2xl md:text-3xl text-slate-950 tracking-tighter">Anlaşmalı Kurumlar</h2>
              <div className="flex items-center gap-3 mt-2 md:mt-4">
                 <div className="h-1 md:h-1.5 w-10 md:w-12 rounded-full bg-corporate-orange" />
                 <p className="t3-label text-[8px] md:text-[10px]">{totalUni} AKADEMİK PAYDAŞ LİSTELENİYOR</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <form className="relative group w-full md:w-80">
                <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within:text-corporate-blue transition-colors" />
                <input 
                  name="q"
                  type="text" 
                  defaultValue={search}
                  placeholder="Üniversite veya şehir..." 
                  className="pl-11 md:pl-14 pr-4 md:pr-8 py-3.5 md:py-4.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue/30 transition-all w-full shadow-sm text-slate-950" 
                />
              </form>
              {(search) && (
                <a href="/admin/universiteler" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2 shadow-none shrink-0">
                  Temizle
                </a>
              )}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block t3-panel overflow-hidden bg-slate-50/30">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-100/50">
                  <tr>
                    <th className="px-10 py-8 text-left t3-label">Kurumsal Kimlik</th>
                    <th className="px-10 py-8 text-left t3-label">Metrik Analizi</th>
                    <th className="px-10 py-8 text-center t3-label">Operasyonel Durum</th>
                    <th className="px-10 py-8 text-right t3-label">Kontrol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {universities.map((item) => (
                    <tr key={item.id} className="hover:bg-white transition-all group">
                      <td className="px-10 py-9">
                        <div className="flex items-center gap-7">
                          <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm transition-all duration-300 group-hover:bg-slate-950 group-hover:text-white group-hover:scale-110">
                            <School className="h-8 w-8" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className="font-black text-slate-950 text-xl tracking-tight leading-none group-hover:text-corporate-blue transition-colors">{item.name}</span>
                            <span className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                              <MapPin className="h-4 w-4 text-corporate-blue" /> {item.city}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-9">
                        <div className="flex items-center gap-10">
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">BİRİM</span>
                            <span className="text-xl font-black text-slate-950 flex items-center gap-2 leading-none">
                              <div className="h-2 w-2 rounded-full bg-corporate-blue" /> {item._count.communities}
                            </span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">ÜYE</span>
                            <span className="text-xl font-black text-slate-950 flex items-center gap-2 leading-none">
                              <div className="h-2 w-2 rounded-full bg-corporate-orange" /> {item._count.users}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-9">
                        <div className="flex justify-center">
                          <StatusBadge status={item.status} />
                        </div>
                      </td>
                      <td className="px-10 py-9 text-right">
                        <Link 
                          href={`/admin/universiteler/${item.id}`}
                          className="h-14 w-14 rounded-full bg-white text-slate-950 hover:bg-corporate-blue hover:text-white shadow-sm transition-all active:scale-90 flex items-center justify-center ml-auto group/btn border border-slate-200"
                        >
                          <ChevronRight className="h-7 w-7 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {universities.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm shadow-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
                      <School className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-950 text-sm leading-tight">{item.name}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{item.city}</span>
                    </div>
                  </div>
                  <Link 
                    href={`/admin/universiteler/${item.id}`}
                    className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0"
                  >
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TOPLULUK</span>
                    <span className="text-lg font-black text-slate-950">{item._count.communities} Birim</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ÜYELER</span>
                    <span className="text-lg font-black text-slate-950">{item._count.users} Kişi</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                   <StatusBadge status={item.status} />
                </div>
              </div>
            ))}

            {universities.length === 0 && (
              <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="flex flex-col items-center gap-6">
                    <LayoutDashboard className="h-12 w-12 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Henüz kayıtlı üniversite bulunmamaktadır.</p>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "ACTIVE";
  return (
    <span className={cn(
      "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all",
      isActive 
        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
        : "bg-slate-100 text-slate-500 border-slate-200"
    )}>
      <span className={cn(
        "h-2 w-2 rounded-full",
        isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
      )} />
      {isActive ? "AKTİF PAYDAŞ" : "PASİF KAYIT"}
    </span>
  );
}


