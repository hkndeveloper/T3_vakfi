"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { createReportAction } from "@/actions/report-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { 
  FileEdit, 
  Tag, 
  CalendarDays, 
  Users, 
  AlignLeft, 
  ClipboardList,
  Sparkles,
  Zap,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

interface ReportFormProps {
  events: { id: string; title: string }[];
}

export function ReportForm({ events }: ReportFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    const result = await createReportAction(formData);
    
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
            <FileEdit className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-indigo-950 dark:text-white tracking-tight font-montserrat uppercase leading-none">Kurumsal Rapor Girişi</h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.25em] mt-3">Faaliyetlerinizi belgelendirerek topluluk sicilinizi inşa edin.</p>
          </div>
        </div>
        <div className="h-1 w-24 rounded-full bg-indigo-100 dark:bg-indigo-950/40" />
      </div>

      <form ref={formRef} action={clientAction} className="grid gap-10 md:grid-cols-6 relative z-10">
        <div className="md:col-span-4 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <ClipboardList className="h-4 w-4 text-indigo-600" /> RAPOR BAŞLIĞI
          </label>
          <div className="relative group/field">
            <input 
              name="title" 
              placeholder="Örn: Teknofest Proje Geliştirme Raporu Q4" 
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm" 
              required 
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <Tag className="h-4 w-4 text-amber-500" /> RAPOR KATEGORİSİ
          </label>
          <div className="relative group/field">
            <select name="reportType" className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none appearance-none cursor-pointer shadow-sm" required>
              <option value="">SEÇİNİZ...</option>
              <option value="EVENT">ETKİNLİK RAPORU</option>
              <option value="MONTHLY">AYLIK FAALİYET</option>
              <option value="TERM">DÖNEM SONU</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-4 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <CalendarDays className="h-4 w-4 text-indigo-600" /> İLGİLİ OPERASYON <span className="text-slate-300 dark:text-slate-600 font-medium lowercase italic">(OPSİYONEL)</span>
          </label>
          <div className="relative group/field">
            <select name="eventId" className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none appearance-none cursor-pointer shadow-sm">
              <option value="">FAALİYETTEN BAĞIMSIZ RAPOR</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <Users className="h-4 w-4 text-amber-500" /> KATILIMCI MEVCUDU
          </label>
          <div className="relative group/field">
            <input
              name="participantCount"
              type="number"
              placeholder="0"
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="md:col-span-6 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <Target className="h-4 w-4 text-indigo-600" /> YÖNETİCİ ÖZETİ
          </label>
          <div className="relative group/field">
            <textarea name="summary" placeholder="Raporun kritik noktalarını içeren profesyonel özet..." rows={2} className="w-full rounded-[2rem] border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none resize-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600" required />
          </div>
        </div>

        <div className="md:col-span-6 space-y-4">
          <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
            <AlignLeft className="h-4 w-4 text-amber-500" /> DETAYLI VERİ SETİ VE ÇIKTILAR
          </label>
          <div className="relative group/field">
            <textarea name="content" placeholder="Elde edilen somut sonuçlar, hedeflenen kazanımlar ve detaylı süreç analizi hakkında teknik bilgi girişi yapın..." rows={5} className="w-full rounded-[2.5rem] border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-8 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none resize-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600" required />
          </div>
        </div>

        <div className="md:col-span-6 mt-6">
          <SubmitButton 
            label="RAPOR TASLAĞINI KAYDET" 
            loadingLabel="KAYDEDİLİYOR..." 
            className="w-full h-20 rounded-[2rem] bg-indigo-950 dark:bg-indigo-600 font-black text-base tracking-[0.2em] shadow-2xl dark:shadow-indigo-500/20 hover:scale-[1.02] transition-all text-white uppercase" 
          />
          <div className="mt-10 flex items-center justify-center gap-3 text-center text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.25em] bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-inner">
            <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
            BİLGİ: TASLAK OLARAK KAYDEDİLEN RAPORLARA MEDYA VE BELGE EKLEDİKTEN SONRA ONAYA SUNABİLİRSİNİZ.
          </div>
        </div>
      </form>
      
      {/* Background patterns */}
      <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-indigo-500/5 dark:bg-amber-500/5 opacity-40 blur-[100px] pointer-events-none group-hover/form:bg-indigo-500/10 transition-all duration-1000" />
      <Zap className="absolute top-10 right-10 h-32 w-32 opacity-[0.02] dark:opacity-[0.05] -rotate-12 pointer-events-none" />
    </motion.div>
  );
}
