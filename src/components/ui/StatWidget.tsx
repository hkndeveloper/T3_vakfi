"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatWidgetProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  bg?: string;
  alert?: boolean;
  className?: string;
}

export function StatWidget({ 
  label, 
  value, 
  icon: Icon, 
  color = "text-blue-600", 
  bg = "bg-blue-50", 
  alert = false,
  className
}: StatWidgetProps) {
  return (
    <div className={cn(
      "group rounded-3xl border transition-all duration-500 bg-white p-6 md:p-8 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1",
      alert ? "border-rose-200 animate-pulse" : "border-slate-100 hover:border-primary/20",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className={cn(
          "rounded-2xl p-3 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
          bg,
          color
        )}>
          <Icon className="h-6 w-6 md:h-7 md:w-7" />
        </div>
        {alert && (
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
        )}
      </div>
      <div className="mt-6 md:mt-8">
        <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <p className="mt-1 text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
