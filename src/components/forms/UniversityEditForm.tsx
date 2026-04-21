"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateUniversityAction } from "@/actions/university-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { School, MapPin, ShieldCheck, Save, RotateCcw, PenTool, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UniversityEditFormProps {
  university: {
    id: string;
    name: string;
    city: string;
    status: string;
  };
}

export function UniversityEditForm({ university }: UniversityEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function clientAction(formData: FormData) {
    const result = await updateUniversityAction(university.id, formData);
    
    if (result?.success) {
      toast.success(result.message);
      setIsEditing(false);
    } else if (result?.error) {
      toast.error(result.error);
    }
  }

  return (
    <div className={cn(
      "rounded-[3.5rem] border transition-all duration-700 overflow-hidden relative group",
      isEditing 
        ? "border-indigo-600 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/10 ring-8 ring-indigo-500/5" 
        : "border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-slate-800/20"
    )}>
      <div className="p-10 md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className={cn(
              "h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 shadow-lg",
              isEditing 
                ? "bg-indigo-600 text-white rotate-0 scale-110" 
                : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-600 -rotate-6"
            )}>
              {isEditing ? <PenTool className="h-8 w-8" /> : <School className="h-8 w-8" />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-indigo-950 dark:text-white tracking-tight font-montserrat uppercase leading-none">Kurumsal Kimlik</h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.25em] mt-3">Veri setini ve operasyonel statüyü düzenleyin.</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg",
              isEditing 
                ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200" 
                : "bg-indigo-950 dark:bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/20"
            )}
          >
            {isEditing ? "DÜZENLEMEYİ İPTAL ET" : "VERİLERİ GÜNCELLE"}
          </button>
        </div>

        <form action={clientAction} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-indigo-950 dark:text-slate-400 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                 Üniversite Resmi Adı
              </label>
              <div className="relative group/input">
                <School className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors" />
                <input
                  name="name"
                  defaultValue={university.name}
                  disabled={!isEditing}
                  placeholder="Üniversite adını girin..."
                  className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800 pl-16 pr-6 py-6 text-sm font-bold text-indigo-950 dark:text-white disabled:opacity-40 disabled:bg-slate-50/50 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-indigo-950 dark:text-slate-400 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                 Yerleşke Şehri
              </label>
              <div className="relative group/input">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within/input:text-amber-500 transition-colors" />
                <input
                  name="city"
                  defaultValue={university.city}
                  disabled={!isEditing}
                  placeholder="Şehir girin..."
                  className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800 pl-16 pr-6 py-6 text-sm font-bold text-indigo-950 dark:text-white disabled:opacity-40 disabled:bg-slate-50/50 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-indigo-950 dark:text-slate-400 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                 <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                 Kurumsal Operasyon Statüsü
              </label>
              <div className="relative group/input">
                <select
                  name="status"
                  defaultValue={university.status}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800 pl-8 pr-12 py-6 text-sm font-bold text-indigo-950 dark:text-white disabled:opacity-40 disabled:bg-slate-50/50 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none appearance-none cursor-pointer"
                  required
                >
                  <option value="ACTIVE text-emerald-500 font-black">Aktif (Operasyona Açık)</option>
                  <option value="PASSIVE text-slate-400 font-bold">Pasif (Kısıtlı Erişim)</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                   <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center gap-6 pt-6 animate-in fade-in slide-in-from-top-6 duration-700">
              <SubmitButton 
                label="VERİ KAYDINI ONAYLA VE KAYDET" 
                className="flex-1 h-20 rounded-[1.5rem] bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 active:scale-[0.98] transition-all"
              />
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-20 h-20 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-all active:scale-90 border border-slate-100 dark:border-white/5"
              >
                <RotateCcw className="h-7 w-7" />
              </button>
            </div>
          )}
        </form>
      </div>
      
      {/* Visual Accent */}
      <div className={cn(
        "h-2 w-full bg-indigo-600 transition-all duration-1000 origin-left",
        isEditing ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
      )} />
      
      {!isEditing && (
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
           <Save className="h-24 w-24" />
        </div>
      )}
    </div>
  );
}

