"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { createEventAction } from "@/actions/event-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { 
  CalendarDays, 
  MapPin, 
  Type, 
  AlignLeft, 
  Clock, 
  Tag,
  PlusCircle,
  Sparkles,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export function EventForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    const result = await createEventAction(formData);
    
    if (result?.success) {
      toast.success(result.message);
      formRef.current?.reset();
    } else if (result?.error) {
      toast.error(result.error);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[3.5rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-10 md:p-14 shadow-2xl dark:shadow-black/40 font-outfit relative overflow-hidden group/form border-t-[12px] border-t-indigo-600"
    >
      <div className="flex flex-wrap items-center justify-between gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <div className="rounded-3xl bg-indigo-600 p-5 text-white shadow-xl shadow-indigo-600/20 group-hover/form:scale-110 transition-transform duration-500">
            <PlusCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-indigo-950 dark:text-white tracking-tight font-montserrat uppercase leading-none">Yeni Faaliyet Kurgusu</h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.25em] mt-3">Topluluk vizyonunuza uygun yeni bir operasyon planlayın.</p>
          </div>
        </div>
        <div className="h-1 w-24 rounded-full bg-indigo-100 dark:bg-indigo-950/40" />
      </div>

      <form ref={formRef} action={clientAction} className="grid gap-10 md:grid-cols-6 relative z-10">
        <div className="md:col-span-4 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <Type className="h-4 w-4 text-indigo-600" /> FAALİYET BAŞLIĞI
          </label>
          <div className="relative group/field">
            <input
              name="title"
              placeholder="Örn: Teknofest Hazırlık Kampı 2024"
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <Tag className="h-4 w-4 text-amber-500" /> KATEGORİ
          </label>
          <div className="relative group/field">
            <select 
              name="type" 
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none appearance-none cursor-pointer shadow-sm" 
              required
            >
              <option value="">SEÇİNİZ...</option>
              <option value="EDUCATION">EĞİTİM</option>
              <option value="SEMINAR">SEMİNER</option>
              <option value="WORKSHOP">ATÖLYE</option>
              <option value="MEETING">TOPLANTI</option>
              <option value="COMPETITION">YARIŞMA</option>
              <option value="SOCIAL">SOSYAL ETKİNLİK</option>
              <option value="BOOTH">TANITIM STANDI</option>
              <option value="TECHNICAL_TRIP">TEKNİK GEZİ</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <CalendarDays className="h-4 w-4 text-indigo-600" /> TARİHSEL VERİ
          </label>
          <div className="relative group/field">
            <input
              name="eventDate"
              type="date"
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none shadow-sm"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <Clock className="h-4 w-4 text-amber-500" /> BAŞLANGIÇ
          </label>
          <div className="relative group/field">
            <input
              name="startTime"
              type="time"
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <Clock className="h-4 w-4 text-indigo-600" /> TERMİNAL
          </label>
          <div className="relative group/field">
            <input
              name="endTime"
              type="time"
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="md:col-span-6 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <MapPin className="h-4 w-4 text-amber-500" /> KAMPÜS / KONUM ÖZELLEŞTİRME
          </label>
          <div className="relative group/field">
            <input
              name="location"
              placeholder="Örn: Mühendislik Fakültesi Konferans Salonu B-1"
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="md:col-span-6 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <AlignLeft className="h-4 w-4 text-indigo-600" /> OPERASYONEL ÖZET
          </label>
          <div className="relative group/field">
            <textarea
              name="description"
              placeholder="Etkinlik hedefleri, beklenen çıktılar ve planlanan akış detayları hakkında kurumsal bilgi girişi yapın..."
              rows={4}
              className="w-full rounded-[2.5rem] border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-8 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none resize-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="md:col-span-6 mt-6">
          <SubmitButton 
            label="FAALİYETİ TASLAK OLARAK KAYDET" 
            loadingLabel="KAYDEDİLİYOR..." 
            className="w-full h-20 rounded-[2rem] bg-indigo-950 dark:bg-indigo-600 font-black text-base tracking-[0.2em] uppercase shadow-2xl dark:shadow-indigo-500/20 hover:scale-[1.02] transition-all text-white" 
          />
          <div className="mt-10 flex items-center justify-center gap-3 text-center text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.25em] bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-inner">
            <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
            BİLGİ: TASLAK OLARAK KAYDEDİLEN ETKİNLİKLER ÜZERİNDE REVİZYON YAPABİLİR VE İSTEDİĞİNİZ ZAMAN ONAYA SUNABİLİRSİNİZ.
          </div>
        </div>
      </form>
      
      {/* Background patterns */}
      <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-indigo-500/5 dark:bg-amber-500/5 opacity-40 blur-[100px] pointer-events-none group-hover/form:bg-indigo-500/10 transition-all duration-1000" />
      <Zap className="absolute top-10 right-10 h-32 w-32 opacity-[0.02] dark:opacity-[0.05] -rotate-12 pointer-events-none" />
    </motion.div>
  );
}
