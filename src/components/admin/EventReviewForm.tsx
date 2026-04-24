"use client";

import { useActionState } from "react";
import { reviewEventAction } from "@/actions/admin-actions";
import { 
  CheckCircle2, 
  XSquare, 
  RefreshCcw,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

interface EventReviewFormProps {
  eventId: string;
}

type ReviewActionState = {
  success?: boolean;
  error?: string;
} | null;

export function EventReviewForm({ eventId }: EventReviewFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: ReviewActionState, formData: FormData) => {
      return await reviewEventAction(formData);
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("İşlem başarıyla gerçekleştirildi");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="lg:col-span-5 space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm relative overflow-hidden sm:p-8">
      <div className="absolute top-0 right-0 h-1 w-full bg-corporate-blue" />
      <input type="hidden" name="eventId" value={eventId} />
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.2em]">
          <MessageSquare className="h-4 w-4 text-corporate-blue" /> DENETÇİ NOTLARI
        </label>
        <textarea
          name="reviewNote"
          rows={3}
          placeholder="Birim başkanına iletilecek değerlendirme notu..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none resize-none"
        />
      </div>
      <div className="space-y-3">
        <button
          name="decision"
          value="APPROVED"
          disabled={isPending}
          className="t3-button t3-button-primary w-full py-5 text-sm disabled:opacity-50"
        >
          <CheckCircle2 className="h-5 w-5" /> PROJEYİ ONAYLA
        </button>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            name="decision"
            value="DRAFT"
            disabled={isPending}
            className="t3-button t3-button-accent w-full px-2 py-4 disabled:opacity-50"
          >
            <RefreshCcw className="h-4 w-4" /> REVİZYON İSTE
          </button>
          <button
            name="decision"
            value="REJECTED"
            disabled={isPending}
            className="t3-button bg-rose-600 text-white hover:bg-rose-700 w-full px-2 py-4 disabled:opacity-50"
          >
            <XSquare className="h-4 w-4" /> KESİN RED
          </button>
        </div>
      </div>
    </form>
  );
}
