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
  ArrowRight,
  TrendingUp,
  BarChart3,
  Zap,
  Activity,
  Clock,
  User,
} from "lucide-react";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { cn } from "@/lib/utils";

export default async function AdminPage() {
  await requireSuperAdmin();

  const [
    totalUsers,
    totalRoles,
    totalCommunities,
    totalUniversities,
    pendingEvents,
    pendingReports,
    universityStats,
    recentLogs,
    totalEvents,
    totalApprovedReports,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.role.count(),
    prisma.community.count(),
    prisma.university.count(),
    prisma.event.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.report.count({ where: { status: { in: ["SUBMITTED", "IN_REVIEW"] } } }),
    prisma.university.findMany({
      include: { _count: { select: { users: true } } },
      take: 5,
      orderBy: { users: { _count: "desc" } },
    }),
    // Gerçek sistem logu — son 5 kritik işlem
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
      take: 5,
    }),
    prisma.event.count(),
    prisma.report.count({ where: { status: "APPROVED" } }),
  ]);

  const chartData = universityStats.map((u) => ({
    name: u.name,
    value: u._count.users,
  }));

  // Genel onay oranı (hafif bir "sistem sağlığı" metriği)
  const approvalRate =
    totalEvents > 0
      ? Math.round(((totalEvents - pendingEvents) / totalEvents) * 100)
      : 100;

  return (
    <div className="space-y-8 md:space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 bg-white min-h-screen">
      {/* Soft Executive Hero Header - RESPONSIVE */}
      <div className="relative overflow-hidden bg-[#f1f5f9] p-6 md:p-20 rounded-xl md:rounded-t3-xl border border-slate-200">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/[0.05] to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 bg-white text-slate-950 text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] mb-6 md:mb-10 rounded-lg border border-slate-200 shadow-sm">
            <ShieldCheck className="h-3 w-3 text-corporate-blue" /> SİSTEM YÖNETİM MERKEZİ
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-950 leading-[0.9] uppercase italic">
            YÖNETİM <br />
            <span className="text-corporate-blue">PANELİ</span>
          </h1>
          <p className="mt-6 md:mt-8 text-slate-600 font-medium max-w-2xl text-base md:text-xl leading-relaxed">
            T3 Vakfı Topluluk Yönetim Sistemi üzerinden tüm operasyonel süreçleri{" "}
            <span className="text-slate-950 font-bold underline decoration-corporate-blue/30 decoration-4 underline-offset-4">
              gerçek zamanlı
            </span>{" "}
            izleyin ve yönetin.
          </p>
        </div>
      </div>

      {/* Stats Grid - RESPONSIVE */}
      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 px-4 md:px-0">
        <StatWidget label="Toplam Kullanıcı" value={totalUsers} icon={Users} color="blue" />
        <StatWidget label="Aktif Roller" value={totalRoles} icon={ShieldCheck} color="slate" />
        <StatWidget label="Kayıtlı Üni" value={totalUniversities} icon={School} color="blue" />
        <StatWidget label="Topluluk Sayısı" value={totalCommunities} icon={Building2} color="slate" />
        <StatWidget label="Bekleyen Etkinlik" value={pendingEvents} icon={ClipboardCheck} color="orange" alert={pendingEvents > 0} />
        <StatWidget label="Bekleyen Rapor" value={pendingReports} icon={FileCheck2} color="red" alert={pendingReports > 0} />
      </div>

      <div className="grid gap-8 lg:grid-cols-12 px-4 md:px-0">
        <div className="lg:col-span-8 space-y-8 md:space-y-12">
          {/* Main Chart */}
          <div className="t3-panel p-6 md:p-12 bg-slate-50/50 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 md:mb-12">
              <div>
                <h2 className="t3-heading text-lg md:text-2xl text-slate-950">Üniversite Dağılımı</h2>
                <p className="t3-label mt-2 md:mt-3">En aktif ilk 5 kampüs verisi</p>
              </div>
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm shrink-0">
                <BarChart3 className="h-6 w-6 md:h-7 md:w-7" />
              </div>
            </div>
            {chartData.length > 0 && chartData.some((d) => d.value > 0) ? (
              <div className="h-[250px] md:h-[400px] w-full">
                <AttendanceChart data={chartData} />
              </div>
            ) : (
              <div className="h-[250px] md:h-[300px] flex flex-col items-center justify-center gap-4 text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <BarChart3 className="h-12 w-12 md:h-16 md:w-16 opacity-30" />
                <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em]">Henüz Kullanıcı Verisi Yok</p>
                <Link href="/admin/universiteler" className="text-[9px] md:text-[10px] font-black text-corporate-blue uppercase tracking-widest hover:underline">
                  Üniversite Ekle →
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions Grid */}
          <div className="space-y-6 md:space-y-8">
            <h2 className="t3-heading text-lg md:text-xl ml-2 text-slate-950">Hızlı Operasyonlar</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              <AdminNavCard href="/admin/universiteler" label="Üniversiteler" icon={School} />
              <AdminNavCard href="/admin/topluluklar" label="Topluluklar" icon={Building2} />
              <AdminNavCard href="/admin/kullanicilar" label="Kullanıcılar" icon={Users} />
              <AdminNavCard href="/admin/etkinlik-onaylari" label="Etkinlik Onayları" icon={ClipboardCheck} highlight={pendingEvents > 0} />
              <AdminNavCard href="/admin/rapor-onaylari" label="Rapor Onayları" icon={FileCheck2} highlight={pendingReports > 0} />
              <AdminNavCard href="/admin/roller" label="Rol & Yetki" icon={ShieldCheck} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8 md:space-y-12">
          {/* Sistem Logları Kartı */}
          <div className="t3-panel-elevated p-8 md:p-10 relative overflow-hidden group bg-[#f8fafc] border-slate-200">
            <div className="absolute top-0 right-0 p-4 opacity-[0.05] md:opacity-[0.08] group-hover:opacity-15 transition-opacity">
              <History className="h-32 w-32 md:h-44 md:w-44 text-slate-400" />
            </div>
            <div className="relative z-10">
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-corporate-blue mb-6 md:mb-10 border border-slate-200 shadow-sm">
                <Activity className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <h3 className="t3-heading text-lg md:text-xl mb-4 md:mb-5 text-slate-950">Sistem Logları</h3>
              <p className="text-sm md:text-md text-slate-600 mb-8 md:mb-12 leading-relaxed font-medium">
                Tüm yetkili işlemlerini, erişim kayıtlarını ve sistem hatalarını denetleyin.
              </p>
              <Link href="/admin/sistem-loglari" className="t3-button t3-button-primary w-full group py-4 md:py-5">
                <span>LOGLARI İNCELE</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Canlı Sistem Akışı */}
          <div className="t3-panel p-6 md:p-10 space-y-6 md:space-y-8">
            <div className="flex items-center gap-4 md:gap-5 pb-5 md:pb-6 border-b border-slate-200">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                <Zap className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <h3 className="t3-heading text-[11px] md:text-sm text-slate-950 uppercase tracking-wider">Canlı Akış</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                    {recentLogs.length} SON İŞLEM
                  </span>
                </div>
              </div>
            </div>

            {recentLogs.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                    <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                      <User className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-wider truncate">
                        {log.action.replace(".", " › ")}
                      </p>
                      <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">
                        {log.user?.name || "Sistem"} · {log.modelType || "GENEL"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">
                      <Clock className="h-3 w-3" />
                      {new Date(log.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
                <Link href="/admin/sistem-loglari" className="flex items-center justify-center gap-2 text-[9px] md:text-[10px] font-black text-corporate-blue uppercase tracking-widest hover:gap-4 transition-all pt-2">
                  TÜM LOGLAR <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 md:h-10 md:w-10 text-slate-200 mx-auto mb-3" />
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Henüz İşlem Yok</p>
              </div>
            )}

            {/* Sistem Sağlık Metriği */}
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistem Onay Oranı</span>
                <span className={cn(
                  "text-[11px] font-black italic",
                  approvalRate >= 80 ? "text-emerald-600" : approvalRate >= 50 ? "text-corporate-orange" : "text-rose-600"
                )}>
                  %{approvalRate}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000",
                    approvalRate >= 80 ? "bg-emerald-500" : approvalRate >= 50 ? "bg-corporate-orange" : "bg-rose-500"
                  )}
                  style={{ width: `${approvalRate}%` }}
                />
              </div>
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
    <div className={cn("t3-card p-8 border-b-4", alert ? "border-b-corporate-orange" : "border-b-transparent")}>
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
    <Link
      href={href}
      className={cn(
        "t3-card group p-10 flex flex-col items-center justify-center gap-5 text-center relative overflow-hidden",
        highlight ? "border-corporate-orange/30 bg-orange-50/50" : "bg-slate-50/50"
      )}
    >
      <div
        className={cn(
          "h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-slate-200",
          highlight
            ? "bg-corporate-orange text-white"
            : "bg-white text-slate-700 group-hover:bg-corporate-blue group-hover:text-white"
        )}
      >
        <Icon className="h-8 w-8" />
      </div>
      <span
        className={cn(
          "text-[11px] font-black uppercase tracking-[0.2em] transition-colors",
          highlight ? "text-corporate-orange" : "text-slate-600 group-hover:text-slate-950"
        )}
      >
        {label}
      </span>
      {highlight && (
        <span className="absolute top-5 right-5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-corporate-orange opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-corporate-orange"></span>
        </span>
      )}
    </Link>
  );
}
