"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateCommunityAction } from "@/actions/community-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Building2, User, AlignLeft, ShieldCheck, RotateCcw, Type, Mail, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CommunityEditFormProps {
  community: {
    id: string;
    name: string;
    shortName: string;
    advisorName: string | null;
    description: string | null;
    contactEmail: string | null;
    instagram: string | null;
    twitter: string | null;
    website: string | null;
    status: string;
  };
}

export function CommunityEditForm({ community }: CommunityEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function clientAction(formData: FormData) {
    const result = await updateCommunityAction(community.id, formData);
    
    if (result?.success) {
      toast.success(result.message);
      setIsEditing(false);
    } else if (result?.error) {
      toast.error(result.error);
    }
  }

  return (
    <div className={cn(
      "rounded-[2.5rem] border transition-all duration-500 overflow-hidden",
      isEditing 
        ? "border-amber-500/50 bg-white dark:bg-slate-900 shadow-2xl shadow-amber-500/10 ring-8 ring-amber-500/5" 
        : "border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-slate-950/30"
    )}>
      <div className="grid gap-8 p-8 md:p-10 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] xl:items-start">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50/80 p-6 md:p-8 shadow-sm">
          <div className="flex items-start gap-5">
            <div className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg",
              isEditing ? "bg-amber-500 text-white rotate-0" : "bg-white dark:bg-slate-800 text-slate-400 -rotate-3"
            )}>
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-corporate-orange">
                Birim Kimliği
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tighter font-montserrat uppercase italic leading-none text-indigo-950 dark:text-white">
                Birim Künyesi
              </h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                Topluluk bilgilerini, iletişim kanallarını ve operasyonel statüyü daha rahat bir yatay akışta düzenleyin.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="t3-label text-[8px]">DURUM</p>
              <p className="mt-2 text-lg font-black uppercase tracking-tight text-slate-950">{community.status}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="t3-label text-[8px]">KISA KOD</p>
              <p className="mt-2 text-lg font-black uppercase tracking-tight text-corporate-blue">{community.shortName}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "mt-8 w-full rounded-2xl px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md",
              isEditing 
                ? "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700" 
                : "bg-indigo-700 text-white hover:bg-indigo-800 shadow-indigo-500/20"
            )}
          >
            {isEditing ? "VAZGEÇ" : "KÜNYEYİ DÜZENLE"}
          </button>
        </div>

        <form action={clientAction} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-indigo-950 dark:text-slate-200 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Topluluk Tam Adı
              </label>
              <div className="relative group">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                <input
                  name="name"
                  defaultValue={community.name}
                  disabled={!isEditing}
                  placeholder="Topluluk adını girin..."
                  className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-indigo-950 dark:text-slate-200 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Kısa Tanıtım Kodu
              </label>
              <div className="relative group">
                <Type className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  name="shortName"
                  defaultValue={community.shortName}
                  disabled={!isEditing}
                  placeholder="Kısa kod (Örn: T3AI)"
                  className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none uppercase"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-indigo-950 dark:text-slate-200 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Danışman Öğretim Üyesi
              </label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                <input
                  name="advisorName"
                  defaultValue={community.advisorName || ""}
                  disabled={!isEditing}
                  placeholder="Hoca adını girin..."
                  className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-indigo-950 dark:text-slate-200 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                İletişim E-Posta
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                <input
                  name="contactEmail"
                  defaultValue={community.contactEmail || ""}
                  disabled={!isEditing}
                  placeholder="kurumsal@uni.edu.tr"
                  className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-3">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-indigo-950 dark:text-slate-200 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
                    Instagram
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                       <Globe className="h-4 w-4" />
                    </div>
                    <input
                      name="instagram"
                      defaultValue={community.instagram || ""}
                      disabled={!isEditing}
                      placeholder="@username"
                      className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-indigo-950 dark:text-slate-200 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
                    X (Twitter)
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                       <Globe className="h-4 w-4" />
                    </div>
                    <input
                      name="twitter"
                      defaultValue={community.twitter || ""}
                      disabled={!isEditing}
                      placeholder="@username"
                      className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-indigo-950 dark:text-slate-200 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
                    Web Sitesi
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                       <Globe className="h-4 w-4" />
                    </div>
                    <input
                      name="website"
                      defaultValue={community.website || ""}
                      disabled={!isEditing}
                      placeholder="https://..."
                      className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-indigo-950 dark:text-slate-200 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Birim Durumu
              </label>
              <div className="relative group">
                <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <select
                  name="status"
                  defaultValue={community.status}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                  required
                >
                  <option value="ACTIVE">Aktif (Faal)</option>
                  <option value="PASSIVE">Pasif (Durağan)</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-indigo-950 dark:text-slate-200 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Kurumsal Açıklama
              </label>
              <div className="relative group">
                <AlignLeft className="absolute left-5 top-6 h-5 w-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                <textarea
                  name="description"
                  defaultValue={community.description || ""}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Topluluk hakkında detaylı bilgi..."
                  className="w-full rounded-3xl border border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-4 pt-4"
              >
                <SubmitButton 
                  label="GÜNCELLEMELERİ KAYDET" 
                  className="flex-1 h-16 rounded-2xl bg-amber-500 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:bg-amber-600 active:scale-95 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 transition-all active:scale-95"
                >
                  <RotateCcw className="h-6 w-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
