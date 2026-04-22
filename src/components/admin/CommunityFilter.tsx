"use client";

import { Search, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface CommunityFilterProps {
  universities: { id: string; name: string }[];
  initialQuery: string;
  initialUniversityId: string;
}

export function CommunityFilter({ universities, initialQuery, initialUniversityId }: CommunityFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    const universityId = formData.get("universityId") as string;
    
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q); else params.delete("q");
    if (universityId) params.set("universityId", universityId); else params.delete("universityId");
    
    router.push(`/admin/topluluklar?${params.toString()}`);
  };

  const handleUniversityChange = (universityId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (universityId) params.set("universityId", universityId); else params.delete("universityId");
    router.push(`/admin/topluluklar?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
      <form onSubmit={handleSearch} className="relative group w-full md:w-80">
        <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within:text-corporate-orange transition-colors" />
        <input 
          name="q"
          type="text" 
          defaultValue={initialQuery}
          placeholder="Birim veya üniversite ara..." 
          className="pl-11 md:pl-14 pr-4 md:pr-8 py-3.5 md:py-4.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange/30 transition-all w-full shadow-sm text-slate-950" 
        />
      </form>
      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative flex-1 md:flex-none">
          <select 
            name="universityId"
            defaultValue={initialUniversityId}
            onChange={(e) => handleUniversityChange(e.target.value)}
            className="h-12 md:h-14 w-full md:w-auto pl-4 md:pl-6 pr-10 md:pr-12 rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50 text-[10px] md:text-[11px] font-black uppercase tracking-widest outline-none focus:ring-8 focus:ring-corporate-blue/5 transition-all appearance-none cursor-pointer shadow-sm text-slate-950"
          >
            <option value="">TÜM ÜNİVERSİTELER</option>
            {universities.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Filter className="h-4 w-4 text-slate-400" />
          </div>
        </div>
        {(initialQuery || initialUniversityId) && (
          <Link href="/admin/topluluklar" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2 shrink-0">
            Temizle
          </Link>
        )}
      </div>
    </div>
  );
}
