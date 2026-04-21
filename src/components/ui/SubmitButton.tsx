"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
  loadingLabel?: string;
  icon?: React.ReactNode;
}

export function SubmitButton({ 
  label, 
  loadingLabel = "İşleniyor...", 
  icon,
  className,
  ...props 
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "relative inline-flex items-center justify-center gap-3 rounded-full bg-t3-orange px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-t3-orange/20 transition-all hover:bg-t3-orange/90 hover:-translate-y-1 hover:shadow-t3-orange/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group font-montserrat",
        className
      )}
      {...props}
    >
      <div className={cn(
        "flex items-center gap-2 transition-all duration-300",
        pending ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      )}>
        {icon}
        <span className="relative z-10">{label}</span>
      </div>

      {pending && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Loader2 className="h-4 w-4 animate-spin text-white" />
          <span className="font-black">{loadingLabel}</span>
        </div>
      )}

      {/* Premium Shine Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      
      {/* Background Pulse on Hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
    </button>
  );
}
