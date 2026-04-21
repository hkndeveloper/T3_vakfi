import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/permissions";
import { 
  Users, 
  Building2, 
  School, 
  ShieldCheck, 
  ClipboardCheck, 
  FileCheck2, 
  History,
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Zap,
  Activity
} from "lucide-react";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { cn } from "@/lib/utils";

export default async function AdminPage() {
  await requireSuperAdmin();
  
  const [totalUsers, totalRoles, totalCommunities, totalUniversities, pendingEvents, pendingReports, universityStats] = await Promise.all([
    prisma.user.count(),
    prisma.role.count(),
    prisma.community.count(),
    prisma.university.count(),
    prisma.event.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.report.count({ where: { status: { in: ["SUBMITTED", "IN_REVIEW"] } } }),
    prisma.university.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      take: 5,
      orderBy: { users: { _count: 'desc' } }
    })
  ]);

  const chartData = universityStats.map(u => ({
    name: u.name,
    value: u._count.users
  }));

  if (chartData.length === 0) {
    chartData.push({ name: "İTÜ", value: 45 }, { name: "ODTÜ", value: 38 }, { name: "Yeditepe", value: 32 });
  }

  return (
    <div className="space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 bg-white min-h-screen">
      {/* Soft Executive Hero Header - FIXED LIGHT */}
      <div className="relative overflow-hidden bg-[#f1f5f9] p-14 md:p-20 rounded-t3-xl border border-slate-200">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/[0.05] to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-slate-950 text-[10px] font-black uppercase tracking-[0.25em] mb-10 rounded-lg border border-slate-200 shadow-sm">
            <ShieldCheck className="h-3 w-3 text-corporate-blue" /> SİSTEM YÖNETİM MERKEZİ
          </div>
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl text-slate-950 leading-none uppercase italic">
            YÖNETİM <br />
            <span className="text-corporate-blue">PANELİ</span>
          </h1>
          <p className="mt-10 text-slate-600 font-medium max-w-2xl text-xl leading-relaxed">
            T3 Vakfı Topluluk Yönetim Sistemi üzerinden tüm operasyonel süreçleri <span className="text-slate-950 font-bold underline decoration-corporate-blue/30 decoration-4 underline-offset-4">gerçek zamanlı</span> izleyin ve yönetin.
          </p>
        </div>
      </div>

      {/* Stats Grid - Fixed Soft Tints */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatWidget label="Toplam Kullanıcı" value={totalUsers} icon={Users} color="blue" />
        <StatWidget label="Aktif Roller" value={totalRoles} icon={ShieldCheck} color="slate" />
        <StatWidget label="Kayıtlı Üni" value={totalUniversities} icon={School} color="blue" />
        <StatWidget label="Topluluk Sayısı" value={totalCommunities} icon={Building2} color="slate" />
        <StatWidget label="Bekleyen Etkinlik" value={pendingEvents} icon={ClipboardCheck} color="orange" alert={pendingEvents > 0} />
        <StatWidget label="Bekleyen Rapor" value={pendingReports} icon={FileCheck2} color="red" alert={pendingReports > 0} />
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Main Chart Section - Softer Tint */}
          <div className="t3-panel p-12 bg-slate-50/50">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="t3-heading text-2xl text-slate-950">Üniversite Dağılımı</h2>
                <p className="t3-label mt-3">En aktif ilk 5 kampüs verisi</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm">
                <BarChart3 className="h-7 w-7" />
              </div>
            </div>
            <div className="h-[400px] w-full">
              <AttendanceChart data={chartData} />
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="space-y-10">
            <h2 className="t3-heading text-xl ml-2 text-slate-950">Hızlı Operasyonlar</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <AdminNavCard href="/admin/universiteler" label="Üniversiteler" icon={School} />
              <AdminNavCard href="/admin/topluluklar" label="Topluluklar" icon={Building2} />
              <AdminNavCard href="/admin/kullanicilar" label="Kullanıcılar" icon={Users} />
              <AdminNavCard href="/admin/etkinlik-onaylari" label="Etkinlik Onayları" icon={ClipboardCheck} highlight={pendingEvents > 0} />
              <AdminNavCard href="/admin/rapor-onaylari" label="Rapor Onayları" icon={FileCheck2} highlight={pendingReports > 0} />
              <AdminNavCard href="/admin/roller" label="Rol & Yetki" icon={ShieldCheck} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
          {/* Side Module: Logs */}
          <div className="t3-panel-elevated p-10 relative overflow-hidden group bg-[#f8fafc] border-slate-200">
            <div className="absolute top-0 right-0 p-4 opacity-[0.08] group-hover:opacity-15 transition-opacity">
               <History className="h-44 w-44 text-slate-400" />
            </div>
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-corporate-blue mb-10 border border-slate-200 shadow-sm">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="t3-heading text-xl mb-5 text-slate-950">Sistem Logları</h3>
              <p className="text-md text-slate-600 mb-12 leading-relaxed font-medium">
                Tüm yetkili işlemlerini, erişim kayıtlarını ve sistem hatalarını denetleyin.
              </p>
              <Link href="/admin/sistem-loglari" className="t3-button t3-button-primary w-full group py-5">
                <span>LOGLARI İNCELE</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Side Module: AI Insights */}
          {/* Side Module: AI Insights */}
          <div className="t3-panel p-10 bg-[#eff6ff]/50 border-dashed border-blue-200">
            <div className="flex items-center gap-6 mb-10">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-corporate-blue">
                <Zap className="h-8 w-8" />
              </div>
              <div>
                 <h3 className="t3-heading text-sm text-slate-950 uppercase tracking-wider">Analitik Zeka</h3>
                 <p className="text-[10px] text-corporate-blue font-black uppercase tracking-widest mt-2 px-3 py-1 bg-white rounded-full w-fit border border-blue-100 shadow-sm">BETA</p>
              </div>
            </div>
            <p className="text-md text-slate-600 mb-10 leading-relaxed font-medium">Topluluk performans metrikleri ve yapay zeka destekli büyüme tahminleri yakında aktif edilecektir.</p>
            
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white w-fit rounded-xl border border-slate-200 shadow-sm">
               <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
               <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Veri Toplanıyor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatWidget({ label, value, icon: Icon, color, alert }: any) {
  const colors: Record<string, string> = {
    blue: "text-corporate-blue bg-blue-50 border-blue-100",
    orange: "text-corporate-orange bg-orange-50 border-orange-100",
    red: "text-rose-600 bg-rose-50 border-rose-100",
    slate: "text-slate-700 bg-slate-100 border-slate-200",
  };
  const colorClass = colors[color] || colors.slate;

  return (
    <div className={cn(
      "t3-card p-8 border-b-4",
      alert ? "border-b-corporate-orange" : "border-b-transparent"
    )}>
      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border shadow-sm", colorClass)}>
        <Icon className="h-7 w-7" />
      </div>
      <div className="mt-8">
        <p className="t3-label mb-2 text-slate-600">{label}</p>
        <p className="text-4xl font-black tracking-tighter text-slate-950 leading-none uppercase italic">{value}</p>
      </div>
    </div>
  );
}

function AdminNavCard({ href, label, icon: Icon, highlight }: any) {
  return (
    <Link href={href} className={cn(
      "t3-card group p-10 flex flex-col items-center justify-center gap-5 text-center relative overflow-hidden",
      highlight ? "border-corporate-orange/30 bg-orange-50/50" : "bg-slate-50/50"
    )}>
      <div className={cn(
        "h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-slate-200",
        highlight 
          ? "bg-corporate-orange text-white" 
          : "bg-white text-slate-700 group-hover:bg-corporate-blue group-hover:text-white"
      )}>
        <Icon className="h-8 w-8" />
      </div>
      <span className={cn(
        "text-[11px] font-black uppercase tracking-[0.2em] transition-colors",
        highlight ? "text-corporate-orange" : "text-slate-600 group-hover:text-slate-950"
      )}>{label}</span>
      {highlight && (
        <span className="absolute top-5 right-5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-corporate-orange opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-corporate-orange"></span>
        </span>
      )}
    </Link>
  );
}
