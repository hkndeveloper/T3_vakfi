"use client";

import Link from "next/link";
import { 
  Users, 
  Calendar, 
  FileText, 
  Building2, 
  PlusCircle,
  Bell,
  Star,
  Activity,
  Zap,
  TrendingUp,
  ChevronRight,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AttendanceChart } from "@/components/charts/AttendanceChart";

export function PresidentDashboardClient({
  session,
  community,
  memberCount,
  upcomingEvents,
  pendingReports,
  chartData
}: any) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm"
            >
              <Building2 className="h-4 w-4 text-corporate-blue" /> TOPLULUK YÖNETİMİ
            </motion.div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[1] uppercase italic text-slate-950">
              HOŞ GELDİN, <br />
              <span className="text-corporate-blue decoration-corporate-orange decoration-8 underline underline-offset-8">
                {(session.user.name ?? "BAŞKAN").split(" ")[0]}
              </span>
            </h1>
            <p className="mt-12 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Topluluğunu kurumsal hedeflere ulaştırmak için <span className="text-slate-950 font-bold">stratejik kararlar al</span>, etkinlikleri yönet ve üye performanslarını takip et.
            </p>
          </div>

          <div className="flex items-center gap-10">
            <Link 
              href="/baskan/etkinlikler" 
              className="t3-button t3-button-primary px-12 py-7 text-sm"
            >
              <PlusCircle className="h-6 w-6" /> ETKİNLİK OLUŞTUR
            </Link>
            <Link 
              href="/bildirimler" 
              className="relative h-20 w-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-950 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group/bell"
            >
              <Bell className="h-9 w-9 group-hover/bell:rotate-12 transition-transform" />
              <div className="absolute top-5 right-5 h-4 w-4 rounded-full bg-corporate-orange border-4 border-white animate-bounce shadow-sm" />
            </Link>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <Zap className="h-32 w-32" />
        </div>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <StatWidget label="AKTİF ÜYELER" value={memberCount} icon={Users} theme="blue" trend="+12%" />
        <StatWidget label="BEKLEYEN ETKİNLİK" value={upcomingEvents} icon={Calendar} theme="orange" trend="BU HAFTA" />
        <StatWidget label="DOSYALANACAK RAPOR" value={pendingReports} icon={FileText} theme="blue" alert={pendingReports > 0} />
        
        <div className="t3-panel p-10 flex flex-col justify-between group bg-slate-50/50">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm group-hover:scale-110 transition-transform">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="overflow-hidden">
              <p className="t3-label truncate">{community?.university.shortName}</p>
              <p className="text-2xl font-black text-slate-950 truncate uppercase tracking-tighter italic mt-2">{community?.shortName}</p>
            </div>
          </div>
          <Link href="/baskan/toplulugum" className="mt-10 flex items-center justify-between t3-label hover:text-corporate-blue transition-colors pt-8 border-t border-slate-200">
            <span>PROFİLİ YÖNET</span> <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 t3-panel p-12 md:p-16 bg-white border-l-[16px] border-l-corporate-blue">
          <div className="flex flex-wrap items-center justify-between gap-10 mb-16">
            <div>
              <h2 className="t3-heading text-4xl text-slate-950 tracking-tighter">Ekosistem Analizi</h2>
              <div className="flex items-center gap-3 mt-6">
                 <div className="h-1.5 w-12 rounded-full bg-corporate-orange" />
                 <p className="t3-label">BÖLÜM BAZLI ÜYE DAĞILIMI</p>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
              <Activity className="h-8 w-8" />
            </div>
          </div>
          <div className="h-[450px]">
             <AttendanceChart data={chartData} />
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <QuickActionCard 
            title="SİSTEM YÖNETİMİ" 
            desc="Üye hiyerarşisini belirle, yetkilendirmeleri yap ve topluluk çekirdek kadrosunu oluştur." 
            href="/baskan/uyeler" 
            icon={Users}
            cta="ÜYELERİ YÖNET"
            theme="blue"
          />
          <QuickActionCard 
            title="DİJİTAL YOKLAMA" 
            desc="Etkinliklerin katılım verilerini anlık olarak sisteme işle ve başarı puanlarını yükselt." 
            href="/baskan/katilim" 
            icon={Target}
            cta="YOKLAMA BAŞLAT"
            theme="orange"
          />
          <div className="t3-panel-elevated p-12 bg-slate-950 text-white relative overflow-hidden group/perf min-h-[250px]">
            <div className="relative z-10">
              <Star className="h-12 w-12 text-corporate-orange fill-corporate-orange mb-10 group-hover/perf:scale-110 transition-transform" />
              <h3 className="text-4xl font-black tracking-tighter uppercase italic leading-none">KURUMSAL KARNE</h3>
              <p className="mt-8 text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Topluluğunun bu dönemki genel performans skoru <span className="text-white">%92</span> seviyesinde. Kurumsal hiyerarşide <span className="text-corporate-orange italic text-base">12. SIRADASIN!</span></p>
              <div className="mt-10 h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-corporate-orange w-[92%] rounded-full shadow-[0_0_20px_rgba(242,109,33,0.5)]" />
              </div>
            </div>
            <TrendingUp className="absolute -right-10 -bottom-10 h-48 w-48 opacity-[0.05] rotate-12 group-hover/perf:rotate-0 transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatWidget({ label, value, icon: Icon, theme, alert, trend }: any) {
  const themes = {
    blue: "bg-white text-corporate-blue border-slate-200 shadow-sm",
    orange: "bg-white text-corporate-orange border-slate-200 shadow-sm",
  };
  const selectedTheme = themes[theme as keyof typeof themes] || themes.blue;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={cn(
        "t3-panel p-10 group relative overflow-hidden bg-white",
        alert ? "border-rose-500 shadow-lg shadow-rose-500/5 ring-1 ring-rose-500" : ""
      )}
    >
      <div className={cn("rounded-2xl p-5 w-fit border transition-all group-hover:scale-110 group-hover:bg-slate-50", selectedTheme)}>
        <Icon className="h-8 w-8" />
      </div>
      <div className="mt-10">
        <div className="flex items-center justify-between">
           <p className="t3-label">{label}</p>
           {trend && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 italic">{trend}</span>}
        </div>
        <p className="mt-4 text-5xl font-black text-slate-950 tracking-tighter leading-none italic">{value}</p>
      </div>
      
      <Icon className="absolute -right-10 -bottom-10 h-32 w-32 opacity-[0.02] rotate-12 group-hover:opacity-[0.05] transition-opacity" />
    </motion.div>
  );
}

function QuickActionCard({ title, desc, href, icon: Icon, cta, theme = "blue" }: any) {
  const themes = {
    blue: "bg-white text-corporate-blue border-slate-200 group-hover:border-corporate-blue/30",
    orange: "bg-white text-corporate-orange border-slate-200 group-hover:border-corporate-orange/30",
  };

  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ x: 10 }}
        className="t3-panel p-10 group flex items-start gap-8 bg-slate-50/30 transition-all"
      >
        <div className={cn("rounded-2xl p-6 border transition-all duration-500 bg-white shadow-sm", themes[theme as keyof typeof themes])}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.2em] leading-none mb-5 italic">{title}</h3>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">{desc}</p>
          <div className={cn(
            "mt-10 flex items-center justify-between t3-label pt-6 border-t border-slate-200 transition-colors",
            theme === "blue" ? "group-hover:text-corporate-blue" : "group-hover:text-corporate-orange"
          )}>
            <span>{cta}</span> <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
