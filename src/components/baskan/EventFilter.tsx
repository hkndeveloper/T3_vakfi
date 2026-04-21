"use client";

import { Search, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface EventFilterProps {
  initialSearch: string;
  initialStatus: string;
}

export function EventFilter({ initialSearch, initialStatus }: EventFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q); else params.delete("q");
    
    router.push(`/baskan/etkinlikler?${params.toString()}`);
  };

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) params.set("status", status); else params.delete("status");
    router.push(`/baskan/etkinlikler?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <form onSubmit={handleSearch} className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-corporate-blue transition-colors" />
        <input 
          name="q"
          type="text" 
          defaultValue={initialSearch}
          placeholder="Etkinlik ara..." 
          className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all w-64 shadow-sm text-slate-950" 
        />
      </form>
      <div className="relative group">
        <select 
          name="status"
          defaultValue={initialStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="h-14 pl-6 pr-10 rounded-2xl border border-slate-200 bg-white text-[11px] font-black uppercase tracking-widest outline-none focus:ring-8 focus:ring-corporate-blue/5 transition-all text-slate-950 appearance-none cursor-pointer shadow-sm"
        >
          <option value="">TÜM DURUMLAR</option>
          <option value="DRAFT">TASLAK</option>
          <option value="PENDING_APPROVAL">DENETİMDE</option>
          <option value="APPROVED">ONAYLANDI</option>
          <option value="REJECTED">REVİZYON</option>
          <option value="COMPLETED">TAMAMLANDI</option>
          <option value="CANCELED">İPTAL</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
           <Sparkles className="h-4 w-4" />
        </div>
      </div>
      {(initialSearch || initialStatus) && (
        <a href="/baskan/etkinlikler" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2">
          Temizle
        </a>
      )}
    </div>
  );
}
