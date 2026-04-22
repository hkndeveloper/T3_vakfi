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
      className="rounded-[3.5rem] border border-slate-100 bg-white p-10 md:p-14 shadow-2xl font-outfit relative overflow-hidden group/form border-t-[12px] border-t-corporate-blue"
    >
      <div className="flex flex-wrap items-center justify-between gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <div className="rounded-3xl bg-corporate-blue p-5 text-white shadow-xl shadow-corporate-blue/20 group-hover/form:scale-110 transition-transform duration-500">
            <FileEdit className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight uppercase leading-none italic">Kurumsal Rapor Girişi</h2>
            <p className="t3-label mt-3">Faaliyetlerinizi belgelendirerek topluluk sicilinizi inşa edin.</p>
          </div>
        </div>
        <div className="h-1 w-24 rounded-full bg-slate-100" />
      </div>

      <form ref={formRef} action={clientAction} className="grid gap-10 md:grid-cols-6 relative z-10">
        <div className="md:col-span-4 space-y-4">
          <label className="flex items-center gap-3 t3-label px-1">
            <ClipboardList className="h-4 w-4 text-corporate-blue" /> RAPOR BAŞLIĞI
          </label>
          <div className="relative group/field">
            <input 
              name="title" 
              placeholder="Örn: Teknofest Proje Geliştirme Raporu Q4" 
              className="t3-input w-full px-8 py-6 text-base" 
              required 
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <label className="flex items-center gap-3 t3-label px-1">
            <Tag className="h-4 w-4 text-corporate-orange" /> RAPOR KATEGORİSİ
          </label>
          <div className="relative group/field">
            <select name="reportType" className="t3-input w-full px-8 py-6 appearance-none cursor-pointer" required>
              <option value="">SEÇİNİZ...</option>
              <option value="EVENT">ETKİNLİK RAPORU</option>
              <option value="MONTHLY">AYLIK FAALİYET</option>
              <option value="TERM">DÖNEM SONU</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-4 space-y-4">
          <label className="flex items-center gap-3 t3-label px-1">
            <CalendarDays className="h-4 w-4 text-corporate-blue" /> İLGİLİ OPERASYON <span className="text-slate-300 font-medium lowercase italic">(OPSİYONEL)</span>
          </label>
          <div className="relative group/field">
            <select name="eventId" className="t3-input w-full px-8 py-6 appearance-none cursor-pointer">
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
          <label className="flex items-center gap-3 t3-label px-1">
            <Users className="h-4 w-4 text-corporate-orange" /> KATILIMCI MEVCUDU
          </label>
          <div className="relative group/field">
            <input
              name="participantCount"
              type="number"
              placeholder="0"
              className="t3-input w-full px-8 py-6 placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="md:col-span-6 space-y-4">
          <label className="flex items-center gap-3 t3-label px-1">
            <Target className="h-4 w-4 text-corporate-blue" /> YÖNETİCİ ÖZETİ
          </label>
          <div className="relative group/field">
            <textarea name="summary" placeholder="Raporun kritik noktalarını içeren profesyonel özet..." rows={2} className="t3-input w-full rounded-[2rem] px-8 py-6 resize-none placeholder:text-slate-300" required />
          </div>
        </div>

        <div className="md:col-span-6 space-y-4">
          <label className="flex items-center gap-3 t3-label px-1">
            <AlignLeft className="h-4 w-4 text-corporate-orange" /> DETAYLI VERİ SETİ VE ÇIKTILAR
          </label>
          <div className="relative group/field">
            <textarea name="content" placeholder="Elde edilen somut sonuçlar, hedeflenen kazanımlar ve detaylı süreç analizi hakkında teknik bilgi girişi yapın..." rows={5} className="t3-input w-full rounded-[2.5rem] px-8 py-8 resize-none placeholder:text-slate-300" required />
          </div>
        </div>

        <div className="md:col-span-6 mt-6">
          <SubmitButton 
            label="RAPOR TASLAĞINI KAYDET" 
            loadingLabel="KAYDEDİLİYOR..." 
            className="w-full h-20 rounded-[2rem] bg-slate-950 hover:bg-corporate-blue font-black text-base tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all text-white uppercase" 
          />
          <div className="mt-10 flex items-center justify-center gap-3 text-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
            <Sparkles className="h-5 w-5 text-corporate-blue animate-pulse" />
            <p className="t3-label text-slate-400">BİLGİ: TASLAK OLARAK KAYDEDİLEN RAPORLARA MEDYA VE BELGE EKLEDİKTEN SONRA ONAYA SUNABİLİRSİNİZ.</p>
          </div>
        </div>
      </form>
      
      {/* Background patterns */}
      <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-corporate-blue/5 opacity-40 blur-[100px] pointer-events-none group-hover/form:bg-corporate-blue/10 transition-all duration-1000" />
      <Zap className="absolute top-10 right-10 h-32 w-32 opacity-[0.02] -rotate-12 pointer-events-none" />
    </motion.div>
  );
}
