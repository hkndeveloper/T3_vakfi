"use client";

import { useActionState, useEffect } from "react";
import { updateUserProfileAction } from "@/actions/user-actions";
import { User, Phone, GraduationCap } from "lucide-react";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { toast } from "sonner";

interface ProfileUpdateFormProps {
  user: {
    name: string;
    phone?: string | null;
    department?: string | null;
    grade?: number | string | null;
  };
}

export function ProfileUpdateForm({ user }: ProfileUpdateFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await updateUserProfileAction(formData);
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Profil güncellendi");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="t3-panel-elevated p-12 bg-white space-y-10 border-l-[16px] border-l-corporate-blue">
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
              defaultValue={user.grade ? String(user.grade) : ""}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-4 text-sm font-bold text-slate-950 focus:bg-white focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none"
            >
              <option value="">Seçiniz...</option>
              {[1, 2, 3, 4].map(g => <option key={g} value={String(g)}>{g}. Sınıf</option>)}
              <option value="5">Mezun</option>
            </select>
         </div>
      </div>

      <SubmitButton label="DEĞİŞİKLİKLERİ KAYDET" className="w-full py-6 t3-button-primary" />
    </form>
  );
}
