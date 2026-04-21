import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { User, Phone, GraduationCap, Calendar, Building2, ShieldCheck } from "lucide-react";
import { updateUserProfileAction } from "@/actions/user-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default async function MemberProfilePage() {
  const session = await requirePermission("member.view");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          community: {
            include: { university: true }
          }
        }
      }
    }
  });

  if (!user) {
    return <div>Kullanıcı bulunamadı</div>;
  }

  const membership = user.memberships[0];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-outfit pb-20">
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <User className="h-4 w-4 text-corporate-blue" /> KURUMSAL KİMLİK KARTI
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              PROFİLİM <br />
              <span className="text-corporate-blue">AYARLARl</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Sistem üzerindeki kurumsal kimlik bilgilerinizi güncelleyin ve <span className="text-slate-950 font-bold underline decoration-corporate-blue/30 underline-offset-4 decoration-4">faaliyet kayıtlarınızı</span> yönetin.
            </p>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Column: Update Form */}
        <div className="lg:col-span-7 space-y-8">
          <form action={updateUserProfileAction} className="t3-panel-elevated p-12 bg-white space-y-10 border-l-[16px] border-l-corporate-blue">
            <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
               <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-corporate-blue">
                  <User className="h-7 w-7" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic">Kişisel Bilgiler</h2>
                  <p className="t3-label">SİSTEM KAYITLARINI GÜNCEL TUTUN</p>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Ad Soyad</label>
                  <input
                    name="name"
                    defaultValue={user.name}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-950 focus:bg-white focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none"
                    required
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Telefon</label>
                  <input
                    name="phone"
                    defaultValue={user.phone || ""}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-950 focus:bg-white focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none"
                    placeholder="05xx xxx xx xx"
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Bölüm</label>
                  <input
                    name="department"
                    defaultValue={user.department || ""}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-950 focus:bg-white focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none"
                    placeholder="Örn: Bilgisayar Mühendisliği"
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Sınıf</label>
                  <select
                    name="grade"
                    defaultValue={user.grade || ""}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-950 focus:bg-white focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none"
                  >
                    <option value="">Seçiniz...</option>
                    {[1, 2, 3, 4].map(g => <option key={g} value={g}>{g}. Sınıf</option>)}
                    <option value="5">Mezun</option>
                  </select>
               </div>
            </div>

            <SubmitButton label="DEĞİŞİKLİKLERİ KAYDET" className="w-full py-6 t3-button-primary" />
          </form>
        </div>

        {/* Right Column: Status Cards */}
        <div className="lg:col-span-5 space-y-8">
           <div className="t3-panel p-10 bg-slate-950 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">SİSTEM DURUMU</p>
                 <div className="flex items-center gap-4">
                    <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xl font-black tracking-widest italic uppercase">HESAP AKTİF</span>
                 </div>
                 <p className="mt-8 text-xs text-slate-400 font-medium leading-relaxed">
                   Hesabınız T3 Vakfı yönetim hiyerarşisinde doğrulanmıştır. Tüm yetkileriniz aktif olarak tanımlanmıştır.
                 </p>
              </div>
              <ShieldCheck className="absolute -right-10 -bottom-10 h-48 w-48 opacity-[0.05] rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
           </div>

           {membership && (
              <div className="t3-panel p-10 border-l-[16px] border-l-corporate-orange bg-slate-50/50">
                 <div className="flex items-center gap-6 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-corporate-orange shadow-sm">
                       <Building2 className="h-7 w-7" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic">Bağlı Topluluk</h3>
                       <p className="t3-label">AKADEMİK BİRİM</p>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ÜNİVERSİTE</p>
                       <p className="text-md font-bold text-slate-950">{membership.community.university.name}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOPLULUK</p>
                       <p className="text-md font-bold text-slate-950">{membership.community.name}</p>
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
