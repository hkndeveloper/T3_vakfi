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
      className="rounded-[3.5rem] border border-slate-100 bg-white p-10 md:p-14 shadow-2xl font-outfit relative overflow-hidden group/form border-t-[12px] border-t-corporate-blue"
    >
      <div className="flex flex-wrap items-center justify-between gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <div className="rounded-3xl bg-corporate-blue p-5 text-white shadow-xl shadow-corporate-blue/20 group-hover/form:scale-110 transition-transform duration-500">
            <PlusCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight uppercase leading-none italic">Yeni Faaliyet Kurgusu</h2>
            <p className="t3-label mt-3">Topluluk vizyonunuza uygun yeni bir operasyon planlayın.</p>
          </div>
        </div>
        <div className="h-1 w-24 rounded-full bg-slate-100" />
      </div>

      <form ref={formRef} action={clientAction} className="grid gap-10 md:grid-cols-6 relative z-10">
        <div className="md:col-span-4 space-y-4">
          <label className="flex items-center gap-3 t3-label px-1">
            <Type className="h-4 w-4 text-corporate-blue" /> FAALİYET BAŞLIĞI
          </label>
          <div className="relative group/field">
            <input
              name="title"
              placeholder="Örn: Teknofest Hazırlık Kampı 2024"
              className="t3-input w-full px-8 py-6 text-base"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <label className="flex items-center gap-3 t3-label px-1">
            <Tag className="h-4 w-4 text-corporate-orange" /> KATEGORİ
          </label>
          <div className="relative group/field">
            <select 
              name="type" 
              className="t3-input w-full px-8 py-6 appearance-none cursor-pointer" 
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
          <label className="flex items-center gap-3 t3-label px-1">
            <CalendarDays className="h-4 w-4 text-corporate-blue" /> TARİHSEL VERİ
          </label>
          <div className="relative group/field">
            <input
              name="eventDate"
              type="date"
              className="t3-input w-full px-8 py-6"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <label className="flex items-center gap-3 t3-label px-1">
            <Clock className="h-4 w-4 text-corporate-orange" /> BAŞLANGIÇ
          </label>
          <div className="relative group/field">
            <input
              name="startTime"
              type="time"
              className="t3-input w-full px-8 py-6"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <label className="flex items-center gap-3 t3-label px-1">
            <Clock className="h-4 w-4 text-corporate-blue" /> TERMİNAL
          </label>
          <div className="relative group/field">
            <input
              name="endTime"
              type="time"
              className="t3-input w-full px-8 py-6"
            />
          </div>
        </div>

        <div className="md:col-span-6 space-y-4">
          <label className="flex items-center gap-3 t3-label px-1">
            <MapPin className="h-4 w-4 text-corporate-orange" /> KAMPÜS / KONUM ÖZELLEŞTİRME
          </label>
          <div className="relative group/field">
            <input
              name="location"
              placeholder="Örn: Mühendislik Fakültesi Konferans Salonu B-1"
              className="t3-input w-full px-8 py-6 placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="md:col-span-6 space-y-4">
          <label className="flex items-center gap-3 t3-label px-1">
            <AlignLeft className="h-4 w-4 text-corporate-blue" /> OPERASYONEL ÖZET
          </label>
          <div className="relative group/field">
            <textarea
              name="description"
              placeholder="Etkinlik hedefleri, beklenen çıktılar ve planlanan akış detayları hakkında kurumsal bilgi girişi yapın..."
              rows={4}
              className="t3-input w-full rounded-[2.5rem] px-8 py-8 resize-none placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="md:col-span-6 mt-6">
          <SubmitButton 
            label="FAALİYETİ TASLAK OLARAK KAYDET" 
            loadingLabel="KAYDEDİLİYOR..." 
            className="w-full h-20 rounded-[2rem] bg-slate-950 hover:bg-corporate-blue font-black text-base tracking-[0.2em] uppercase shadow-2xl hover:scale-[1.02] transition-all text-white" 
          />
          <div className="mt-10 flex items-center justify-center gap-3 text-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
            <Sparkles className="h-5 w-5 text-corporate-orange animate-pulse" />
            <p className="t3-label text-slate-400">BİLGİ: TASLAK OLARAK KAYDEDİLEN ETKİNLİKLER ÜZERİNDE REVİZYON YAPABİLİR VE İSTEDİĞİNİZ ZAMAN ONAYA SUNABİLİRSİNİZ.</p>
          </div>
        </div>
      </form>
      
      {/* Background patterns */}
      <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-corporate-blue/5 opacity-40 blur-[100px] pointer-events-none group-hover/form:bg-corporate-blue/10 transition-all duration-1000" />
      <Zap className="absolute top-10 right-10 h-32 w-32 opacity-[0.02] -rotate-12 pointer-events-none" />
    </motion.div>
  );
}
