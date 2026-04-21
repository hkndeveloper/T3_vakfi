"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { UserCircle2, Mail, ShieldCheck, Fingerprint, Save, RotateCcw, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserEditFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    department: string | null;
    grade: number | null;
    studentNumber: string | null;
    isActive: boolean;
  };
}

export function UserEditForm({ user }: UserEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function clientAction(formData: FormData) {
    // Profil güncelleme aksiyonu eklenecek
    toast.success("Profil güncelleme özelliği geliştirme aşamasındadır.");
    setIsEditing(false);
  }

  return (
    <div className={cn(
      "rounded-[2.5rem] border transition-all duration-500 overflow-hidden",
      isEditing 
        ? "border-t3-navy bg-white shadow-2xl shadow-t3-navy/10 ring-4 ring-t3-navy/5" 
        : "border-slate-100 bg-slate-50/30"
    )}>
      <div className="p-8 md:p-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg",
              isEditing ? "bg-t3-navy text-white rotate-0" : "bg-white text-slate-400 -rotate-3"
            )}>
              <UserCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-t3-navy tracking-tight font-montserrat uppercase">Profil Bilgileri</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Kişisel verileri ve akademik bilgileri güncelleyin.</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
              isEditing 
                ? "bg-slate-100 text-slate-500 hover:bg-slate-200" 
                : "bg-t3-navy text-white hover:shadow-xl hover:shadow-t3-navy/20"
            )}
          >
            {isEditing ? "VAZGEÇ" : "PROFİLİ DÜZENLE"}
          </button>
        </div>

        <form action={clientAction} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-t3-navy uppercase tracking-widest px-1 ml-1">Tam Ad Soyad</label>
              <div className="relative group">
                <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-t3-navy transition-colors" />
                <input
                  name="name"
                  defaultValue={user.name}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-slate-100 bg-white/50 pl-14 pr-6 py-5 text-sm font-bold text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white focus:ring-8 focus:ring-t3-navy/5 focus:border-t3-navy transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-t3-navy uppercase tracking-widest px-1 ml-1">E-Posta Adresi</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-t3-navy transition-colors" />
                <input
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-slate-100 bg-white/50 pl-14 pr-6 py-5 text-sm font-bold text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white focus:ring-8 focus:ring-t3-navy/5 focus:border-t3-navy transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-t3-navy uppercase tracking-widest px-1 ml-1">Akademik Bölüm</label>
              <div className="relative group">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-t3-navy transition-colors" />
                <input
                  name="department"
                  defaultValue={user.department || ""}
                  disabled={!isEditing}
                  placeholder="Örn: Bilgisayar Mühendisliği"
                  className="w-full rounded-2xl border border-slate-100 bg-white/50 pl-14 pr-6 py-5 text-sm font-bold text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white focus:ring-8 focus:ring-t3-navy/5 focus:border-t3-navy transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-t3-navy uppercase tracking-widest px-1 ml-1">Hesap Statüsü</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-t3-navy transition-colors" />
                <select
                  name="isActive"
                  defaultValue={user.isActive ? "true" : "false"}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-slate-100 bg-white/50 pl-14 pr-6 py-5 text-sm font-bold text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white focus:ring-8 focus:ring-t3-navy/5 focus:border-t3-navy transition-all outline-none appearance-none cursor-pointer"
                  required
                >
                  <option value="true">Aktif (Sisteme Erişebilir)</option>
                  <option value="false">Pasif (Erişim Engelli)</option>
                </select>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center gap-4 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <SubmitButton 
                label="PROFİLİ GÜNCELLE" 
                className="flex-1 h-16 rounded-2xl bg-t3-navy text-[11px] font-black uppercase tracking-widest shadow-xl shadow-t3-navy/20"
              />
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 hover:text-slate-600 transition-all active:scale-95"
              >
                <RotateCcw className="h-6 w-6" />
              </button>
            </div>
          )}
        </form>
      </div>
      
      <div className={cn(
        "h-1.5 w-full bg-gradient-to-r from-t3-navy to-t3-cyan transition-opacity duration-1000",
        isEditing ? "opacity-100" : "opacity-0"
      )} />
    </div>
  );
}
