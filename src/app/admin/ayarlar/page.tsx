import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/permissions";
import { 
  Settings, 
  Bell, 
  Mail, 
  ShieldCheck, 
  Database, 
  Globe,
  Lock,
  Save,
  Zap,
  Sparkles,
  LayoutDashboard,
  Server,
  Clock,
  AlertTriangle,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SubmitButton } from "@/components/ui/SubmitButton";

async function updateSettingsAction(formData: FormData) {
  "use server";
  const session = await requireSuperAdmin();

  const siteName = String(formData.get("siteName") ?? "").trim();
  const maintenanceMode = String(formData.get("maintenanceMode") ?? "") === "on" ? "true" : "false";
  const emailNotifications = String(formData.get("emailNotifications") ?? "") === "on" ? "true" : "false";
  const sessionTimeout = String(formData.get("sessionTimeout") ?? "").trim();

  const settingsToUpdate = [
    { key: "site_name", value: siteName },
    { key: "maintenance_mode", value: maintenanceMode },
    { key: "email_notifications", value: emailNotifications },
    { key: "session_timeout", value: sessionTimeout },
  ];

  await Promise.all(
    settingsToUpdate.map((s) =>
      prisma.systemSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: { key: s.key, value: s.value, group: "GENERAL" },
      })
    )
  );

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: "settings.update",
      modelType: "SystemSettings",
      modelId: "global",
    },
  });

  revalidatePath("/admin/ayarlar");
}

export default async function AdminSettingsPage() {
  await requireSuperAdmin();

  const dbSettings = await prisma.systemSetting.findMany({
    where: { group: "GENERAL" },
  });

  const settingsMap = new Map(dbSettings.map((s: { key: string; value: string }) => [s.key, s.value]));

  const settings = {
    siteName: (settingsMap.get("site_name") as string) ?? "T3 Vakfı Topluluk Yönetim Sistemi",
    maintenanceMode: settingsMap.get("maintenance_mode") === "true",
    emailNotifications: settingsMap.get("email_notifications") === "true",
    sessionTimeout: (settingsMap.get("session_timeout") as string) ?? "24",
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20 bg-white min-h-screen">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <Settings className="h-4 w-4 text-corporate-blue" /> SİSTEM YAPILANDIRMASI
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              YÖNETİM <br />
              <span className="text-corporate-blue italic">AYARLARI</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Platformun genel yapılandırma, güvenlik parametreleri ve dosya yönetim ayarlarını <span className="text-slate-950 font-bold decoration-corporate-blue decoration-4 underline underline-offset-4">merkezi denetim</span> masası üzerinden güncelleyin.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">SİSTEM DURUMU</p>
              <div className="flex items-center justify-center gap-3">
                 <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-4xl font-black text-slate-950 tracking-tighter leading-none italic uppercase">AKTİF</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <Server className="h-32 w-32" />
        </div>
      </div>

      <form action={updateSettingsAction as any} className="space-y-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* General Settings */}
          <div className="t3-panel p-10 md:p-12 space-y-10 group bg-slate-50/30">
            <div className="flex items-center gap-6 pb-8 border-b border-slate-200">
               <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-corporate-blue group-hover:bg-slate-950 transition-all shadow-sm">
                  <Globe className="h-7 w-7" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic">Genel Yapılandırma</h2>
                  <p className="t3-label">SİSTEM GENEL PARAMETRELERİ</p>
               </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                 <label className="flex items-center gap-2 text-[11px] font-black text-slate-950 uppercase tracking-widest px-1">
                    <Mail className="h-3.5 w-3.5 text-corporate-blue" /> SİSTEM ADI (TITLE)
                 </label>
                 <input 
                   name="siteName" 
                   defaultValue={settings.siteName}
                   className="w-full rounded-2xl border border-slate-200 bg-white px-8 py-5 text-sm font-bold text-slate-950 outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue/30 transition-all shadow-sm" 
                 />
              </div>
              <div className="space-y-3">
                 <label className="flex items-center gap-2 text-[11px] font-black text-slate-950 uppercase tracking-widest px-1">
                    <Clock className="h-3.5 w-3.5 text-corporate-orange" /> OTURUM SÜRESİ (SAAT)
                 </label>
                 <input 
                   name="sessionTimeout" 
                   defaultValue={settings.sessionTimeout}
                   type="number"
                   className="w-full rounded-2xl border border-slate-200 bg-white px-8 py-5 text-sm font-bold text-slate-950 outline-none focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange/30 transition-all shadow-sm"
                 />
              </div>
            </div>
          </div>

          {/* Security & Notifications */}
          <div className="t3-panel p-10 md:p-12 space-y-10 group bg-slate-50/30">
            <div className="flex items-center gap-6 pb-8 border-b border-slate-200">
               <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-rose-600 group-hover:bg-slate-950 transition-all shadow-sm">
                  <ShieldCheck className="h-7 w-7" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic">Güvenlik & Erişim</h2>
                  <p className="t3-label">DENETİM VE BİLDİRİM AYARLARI</p>
               </div>
            </div>

            <div className="space-y-6">
              <label className="flex items-center gap-6 p-7 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-corporate-orange transition-all shadow-sm group/opt">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    name="maintenanceMode" 
                    defaultChecked={settings.maintenanceMode}
                    className="peer h-7 w-7 border-2 border-slate-200 rounded-lg text-corporate-orange focus:ring-corporate-orange transition-all appearance-none checked:bg-corporate-orange checked:border-corporate-orange" 
                  />
                  <Save className="absolute left-1.5 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <div className="flex flex-col">
                   <span className="text-sm font-black text-slate-950 uppercase tracking-tighter italic">Bakım Modu</span>
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">SİSTEMİ GENEL ERİŞİME KAPATIR</span>
                </div>
              </label>
              
              <label className="flex items-center gap-6 p-7 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-corporate-blue transition-all shadow-sm group/opt">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    name="emailNotifications" 
                    defaultChecked={settings.emailNotifications}
                    className="peer h-7 w-7 border-2 border-slate-200 rounded-lg text-corporate-blue focus:ring-corporate-blue transition-all appearance-none checked:bg-corporate-blue checked:border-corporate-blue" 
                  />
                  <Bell className="absolute left-1.5 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <div className="flex flex-col">
                   <span className="text-sm font-black text-slate-950 uppercase tracking-tighter italic">E-posta Bildirimleri</span>
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">OTOMATİK BİLGİLENDİRME SİSTEMİ</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Technical Status & Save */}
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1 t3-panel p-10 bg-slate-50/80 relative overflow-hidden group/status border-slate-200">
             <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-5">
                   <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                      <Activity className="h-6 w-6" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black tracking-tighter uppercase italic leading-none text-slate-950">Canlı Durum</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">SİSTEM METRİKLERİ</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <p className="text-2xl font-black italic tracking-tighter text-corporate-blue">99.9%</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">UPTIME</p>
                   </div>
                   <div>
                      <p className="text-2xl font-black italic tracking-tighter text-corporate-orange">24ms</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">LATENCY</p>
                   </div>
                </div>
             </div>
             <div className="absolute -right-6 -bottom-6 h-32 w-32 opacity-10 rotate-12 transition-transform duration-1000 group-hover/status:rotate-0 text-slate-950/10">
                <Database className="h-full w-full" />
             </div>
          </div>

          <div className="lg:col-span-2 t3-panel p-10 bg-slate-50 flex items-center justify-between gap-12 group/save border-dashed">
            <div className="flex-1 space-y-4">
              <h3 className="text-xl font-black text-slate-950 italic uppercase tracking-tighter">Değişiklikleri Onayla</h3>
              <p className="text-sm text-slate-500 font-medium">Güncellediğiniz ayarlar anında tüm sistem ekosistemine uygulanacaktır. Kayıt öncesi değerleri kontrol edin.</p>
            </div>
            <SubmitButton 
              label="SİSTEM AYARLARINI GÜNCELLE" 
              className="t3-button t3-button-primary px-12 py-7 text-sm shadow-xl shadow-corporate-blue/10 shrink-0 scale-105" 
            />
          </div>
        </div>
      </form>
    </div>
  );
}
