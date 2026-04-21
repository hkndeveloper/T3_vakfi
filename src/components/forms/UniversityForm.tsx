"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { createUniversityAction } from "@/actions/university-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { School, MapPin, Globe, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function UniversityForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    const result = await createUniversityAction(formData);
    
    if (result?.success) {
      toast.success(result.message);
      formRef.current?.reset();
    } else if (result?.error) {
      toast.error(result.error);
    }
  }

  return (
    <div className="rounded-[2.5rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-10 shadow-2xl dark:shadow-black/20 transition-all hover:border-indigo-500/20 group relative overflow-hidden">
      <div className="flex items-center gap-6 mb-12 relative z-10">
        <div className="h-16 w-16 rounded-2xl bg-indigo-950 dark:bg-indigo-600 flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500">
          <School className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-indigo-950 dark:text-white font-montserrat uppercase leading-none tracking-tight">Kurum Ekle</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">Yeni bir üniversite kaydı oluşturun.</p>
        </div>
      </div>
      
      <form ref={formRef} action={clientAction} className="grid gap-8 md:grid-cols-2 relative z-10">
        <div className="md:col-span-2 space-y-3">
          <label className="text-[10px] font-black text-indigo-950 dark:text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Üniversite Resmi Adı
          </label>
          <div className="relative group/input">
            <School className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors" />
            <input
              name="name"
              placeholder="Örn: İstanbul Teknik Üniversitesi"
              required
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 pl-16 pr-10 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-200 dark:text-slate-800">
               <Globe className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          <label className="text-[10px] font-black text-indigo-950 dark:text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Yerleşik Şehir
          </label>
          <div className="relative group/input">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-amber-500 transition-colors" />
            <input
              name="city"
              placeholder="Örn: İstanbul"
              required
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 pl-16 pr-6 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-2 pt-6">
          <SubmitButton 
            label="KURUMU SİSTEME KAYDET" 
            className="w-full h-20 rounded-2xl bg-indigo-700 text-white text-[11px] font-black uppercase tracking-[0.25em] shadow-xl shadow-indigo-600/30 hover:bg-indigo-800 active:scale-95 transition-all" 
          />
        </div>
      </form>

      <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
         <Sparkles className="h-6 w-6 text-amber-500" />
      </div>
    </div>
  );
}

