import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  Rocket, 
  ShieldCheck, 
  LayoutDashboard, 
  ArrowRight,
  School,
  Building2,
  Users
} from "lucide-react";

import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    const roles = session.user?.roles ?? [];
    if (roles.includes("super_admin")) {
      redirect("/admin");
    } else if (roles.includes("president") || roles.includes("management_team")) {
      redirect("/baskan");
    } else {
      redirect("/uye");
    }
  }

  // The code below only runs if session is null
  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden font-source-sans">
      {/* Background Ornaments - Minimalist approach */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-corporate-blue/5 skew-x-[-20deg] origin-top translate-x-1/2 pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-40">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-[10px] font-black text-slate-500 shadow-sm uppercase tracking-[0.2em]">
              <Rocket className="h-3 w-3 text-corporate-blue" />
              T3 VAKFI TEKNOLOJİ TOPLULUKLARI
            </div>

            <h1 className="mt-8 text-5xl font-black tracking-tighter text-slate-900 sm:text-7xl leading-[0.9] uppercase italic">
              ÜNİVERSİTE <br />
              <span className="text-corporate-blue not-italic">TOPLULUKLARI</span> <br />
              DİJİTAL YÖNETİM
            </h1>
            
            <p className="mt-10 text-xl text-slate-600 max-w-xl leading-relaxed font-medium">
              Türkiye Teknoloji Takımı Vakfı üniversite toplulukları için geliştirilen, merkezi yönetim, etkinlik planlama ve performans izleme platformu.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                href="/giris"
                className="t3-button t3-button-primary"
              >
                SİSTEME GİRİŞ YAP
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                href="/bildirimler"
                className="t3-button t3-button-secondary"
              >
                DUYURULAR
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-corporate-orange/10 blur-[100px] rounded-full" />
              <div className="relative t3-panel-elevated p-8 bg-white/40 backdrop-blur-sm border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm border border-slate-100">
                    <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-corporate-blue">
                      <School className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-none mb-1 uppercase text-xs tracking-wider">Topluluk Sayısı</h4>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">180+</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm border border-slate-100">
                    <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center text-corporate-orange">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-none mb-1 uppercase text-xs tracking-wider">Aktif Üyeler</h4>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">12,500+</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm border border-slate-100">
                    <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-none mb-1 uppercase text-xs tracking-wider">Denetlenen Etkinlik</h4>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">4,200+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-32 grid gap-6 md:gap-1 lg:grid-cols-3 border-none md:border md:border-slate-200 rounded-xl overflow-hidden shadow-none md:shadow-sm">
          <FeatureCard 
            icon={School} 
            title="Merkezi Yönetim" 
            desc="Tüm üniversite topluluklarını tek bir panelden izleyin ve yönetin." 
          />
          <FeatureCard 
            icon={Users} 
            title="Üye Takibi" 
            desc="Topluluk üyelerini yetkilendirin, faaliyetlerini takip edin." 
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Onaylı Akış" 
            desc="Etkinlik ve raporlarınızı admin onayıyla disipline edin." 
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5">
      <div className="rounded-2xl bg-slate-50 p-4 w-fit group-hover:bg-blue-50 transition-colors">
        <Icon className="h-8 w-8 text-slate-600 group-hover:text-blue-600" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-3 text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
