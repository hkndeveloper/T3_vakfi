"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { createCommunityAction } from "@/actions/community-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Building2, School, User, Type, AlignLeft, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CommunityFormProps {
  universities: { id: string; name: string }[];
}

export function CommunityForm({ universities }: CommunityFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    const result = await createCommunityAction(formData);
    
    if (result?.success) {
      toast.success(result.message);
      formRef.current?.reset();
    } else if (result?.error) {
      toast.error(result.error);
    }
  }

  return (
    <div className="rounded-[2.5rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-8 shadow-2xl dark:shadow-black/20 transition-all hover:border-amber-500/20 group relative overflow-hidden">
      <div className="flex items-center gap-5 mb-10 relative z-10">
        <div className="h-14 w-14 rounded-2xl bg-indigo-950 dark:bg-amber-500 flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500">
          <Building2 className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-indigo-950 dark:text-white font-montserrat uppercase leading-none tracking-tight">Topluluk Ekle</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Yeni bir kurumsal birim tanımlayın.</p>
        </div>
      </div>
      
      <form ref={formRef} action={clientAction} className="grid gap-6 md:grid-cols-2 relative z-10">
        <div className="md:col-span-2 space-y-2.5">
          <label className="text-[10px] font-black text-indigo-950 dark:text-slate-400 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Bağlı Üniversite
          </label>
          <div className="relative group/input">
            <School className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-amber-500 transition-colors" />
            <select
              name="universityId"
              required
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 pl-14 pr-10 py-5 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="">Üniversite seçiniz...</option>
              {universities.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
               <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="text-[10px] font-black text-indigo-950 dark:text-slate-400 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Topluluk Adı
          </label>
          <div className="relative group/input">
            <Type className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-indigo-500 transition-colors" />
            <input
              name="name"
              placeholder="Örn: Yapay Zeka"
              required
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="text-[10px] font-black text-indigo-950 dark:text-slate-400 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Kısa Kod
          </label>
          <div className="relative group/input">
            <Zap className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-amber-500 transition-colors" />
            <input
              name="shortName"
              placeholder="Örn: T3AI"
              required
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none uppercase"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2.5">
          <label className="text-[10px] font-black text-indigo-950 dark:text-slate-400 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Danışman (Akademik)
          </label>
          <div className="relative group/input">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-indigo-500 transition-colors" />
            <input
              name="advisorName"
              placeholder="Örn: Prof. Dr. Ahmet Yılmaz"
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2.5">
          <label className="text-[10px] font-black text-indigo-950 dark:text-slate-400 uppercase tracking-[0.2em] px-1 ml-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Kurumsal Açıklama
          </label>
          <div className="relative group/input">
            <AlignLeft className="absolute left-5 top-5 h-5 w-5 text-slate-300 group-focus-within/input:text-amber-500 transition-colors" />
            <textarea
              name="description"
              placeholder="Topluluk yetkinlik alanı ve hedefleri..."
              className="w-full rounded-[2rem] border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none resize-none"
              rows={4}
            />
          </div>
        </div>

        <div className="md:col-span-2 pt-4">
          <SubmitButton 
            label="BİRİMİ SİSTEME KAYDET" 
            className="w-full h-16 rounded-2xl bg-indigo-700 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-800 active:scale-95 transition-all" 
          />
        </div>
      </form>

      <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
    </div>
  );
}

