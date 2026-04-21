"use client";

import { useActionState } from "react";
import { reviewReportAction } from "@/actions/admin-actions";
import { 
  CheckCircle2, 
  XSquare, 
  RefreshCcw,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ReportReviewFormProps {
  reportId: string;
}

export function ReportReviewForm({ reportId }: ReportReviewFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await reviewReportAction(formData);
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Rapor işlemi başarıyla gerçekleştirildi");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-10 bg-white border border-slate-200 p-12 rounded-2xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 h-1.5 w-full bg-corporate-orange" />
      <input type="hidden" name="reportId" value={reportId} />
      <div className="space-y-5">
        <label className="flex items-center gap-3 text-[11px] font-black text-slate-950 uppercase tracking-[0.25em] px-1 font-montserrat">
          <MessageSquare className="h-5 w-5 text-corporate-blue" /> DENETİM GÖRÜŞÜ
        </label>
        <textarea
          name="adminNote"
          rows={3}
          placeholder="Raporun geçerliliği veya eksiklikleri hakkındaki notunuzu buraya ekleyin..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-8 py-7 text-sm font-bold text-slate-950 outline-none focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all resize-none shadow-sm"
        />
      </div>
      <div className="flex flex-col gap-5">
        <button
          name="decision"
          value="APPROVED"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-4 rounded-xl bg-emerald-600 px-10 py-6 text-sm font-black text-white hover:bg-emerald-700 transition-all active:scale-[0.98] uppercase tracking-widest shadow-xl shadow-emerald-500/10 disabled:opacity-50"
        >
          <CheckCircle2 className="h-5 w-5" /> RAPORU ONAYLA
        </button>
        <div className="grid grid-cols-2 gap-5">
          <button
            name="decision"
            value="REVISION_REQUESTED"
            disabled={isPending}
            className="t3-button t3-button-accent w-full px-8 py-5 disabled:opacity-50"
          >
            <RefreshCcw className="h-5 w-5" /> REVİZYON
          </button>
          <button
            name="decision"
            value="REJECTED"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-4 rounded-xl bg-rose-600 px-8 py-5 text-sm font-black text-white hover:bg-rose-700 transition-all active:scale-[0.98] uppercase tracking-widest shadow-xl shadow-rose-500/10 disabled:opacity-50"
          >
            <XSquare className="h-5 w-5" /> REDDET
          </button>
        </div>
      </div>
    </form>
  );
}
