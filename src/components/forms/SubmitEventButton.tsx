"use client";

import { toast } from "sonner";
import { submitEventAction } from "@/actions/event-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { SendHorizontal } from "lucide-react";

interface SubmitEventButtonProps {
  eventId: string;
}

export function SubmitEventButton({ eventId }: SubmitEventButtonProps) {
  async function clientAction(formData: FormData) {
    const result = await submitEventAction(formData);
    
    if (result?.success) {
      toast.success(result.message);
    } else if (result?.error) {
      toast.error(result.error);
    }
  }

  return (
    <form action={clientAction}>
      <input type="hidden" name="eventId" value={eventId} />
      <SubmitButton 
        label={
          <span className="flex items-center gap-2">
            ONAYA GÖNDER <SendHorizontal className="h-3 w-3" />
          </span>
        }
        loadingLabel="GÖNDERİLİYOR..." 
        className="h-10 px-6 rounded-xl bg-t3-navy text-[10px] font-black text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-t3-navy/20 uppercase tracking-widest border border-t3-navy hover:border-t3-cyan/50" 
      />
    </form>
  );
}
