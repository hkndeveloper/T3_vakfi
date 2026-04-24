"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { Globe2, CalendarDays, Clock, MapPin, Sparkles, ShieldCheck, Type, AlignLeft } from "lucide-react";
import { createGlobalEventAction } from "@/actions/admin-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function AdminGlobalEventForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    const result = await createGlobalEventAction(formData);

    if (result?.success) {
      toast.success(result.message);
      formRef.current?.reset();
    } else if (result?.error) {
      toast.error(result.error);
    }
  }

  return (
    <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.75rem] bg-slate-950 text-white shadow-xl shadow-slate-950/20">
            <Globe2 className="h-8 w-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.24em] text-corporate-blue">
              <ShieldCheck className="h-3.5 w-3.5" />
              Global Etkinlik
            </div>
            <h3 className="mt-4 text-2xl font-black uppercase tracking-tighter italic text-slate-950">
              Merkezden Etkinlik Yayınla
            </h3>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Başkanlar bu etkinliğe kendi topluluk üyelerini ekleyebilecek.
            </p>
          </div>
        </div>
      </div>

      <form ref={formRef} action={clientAction} className="mt-8 grid gap-6 md:grid-cols-6">
        <div className="md:col-span-4 space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
            <Type className="h-4 w-4 text-corporate-blue" />
            Etkinlik Başlığı
          </label>
          <input
            name="title"
            required
            placeholder="Örn: T3 Vakfı Bahar Zirvesi"
            className="t3-input w-full px-6 py-5"
          />
        </div>

        <div className="md:col-span-2 space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
            <Sparkles className="h-4 w-4 text-corporate-orange" />
            Kategori
          </label>
          <select name="type" required className="t3-input w-full appearance-none px-6 py-5">
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

        <div className="md:col-span-2 space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
            <CalendarDays className="h-4 w-4 text-corporate-blue" />
            Tarih
          </label>
          <input name="eventDate" type="date" required className="t3-input w-full px-6 py-5" />
        </div>

        <div className="md:col-span-2 space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
            <Clock className="h-4 w-4 text-corporate-orange" />
            Başlangıç
          </label>
          <input name="startTime" type="time" className="t3-input w-full px-6 py-5" />
        </div>

        <div className="md:col-span-2 space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
            <Clock className="h-4 w-4 text-corporate-blue" />
            Bitiş
          </label>
          <input name="endTime" type="time" className="t3-input w-full px-6 py-5" />
        </div>

        <div className="md:col-span-6 space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
            <MapPin className="h-4 w-4 text-corporate-orange" />
            Konum
          </label>
          <input
            name="location"
            placeholder="Örn: T3 Vakfı Genel Merkez / Hibrit"
            className="t3-input w-full px-6 py-5"
          />
        </div>

        <div className="md:col-span-6 space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
            <AlignLeft className="h-4 w-4 text-corporate-blue" />
            Açıklama
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Başkanların üye eklerken ve rapor üretirken kullanacağı merkezi etkinlik detayları..."
            className="t3-input w-full resize-none rounded-[2rem] px-6 py-5"
          />
        </div>

        <div className="md:col-span-6 pt-2">
          <SubmitButton
            label="GLOBAL ETKİNLİĞİ YAYINLA"
            className="h-16 w-full rounded-[1.5rem] bg-slate-950 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-xl shadow-slate-950/20 hover:bg-corporate-blue"
          />
        </div>
      </form>
    </div>
  );
}
