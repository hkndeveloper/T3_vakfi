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
    <div className="flex flex-wrap items-center gap-4">
      <form onSubmit={handleSearch} className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-corporate-orange transition-colors" />
        <input 
          name="q"
          type="text" 
          defaultValue={initialQuery}
          placeholder="Birim veya üniversite ara..." 
          className="pl-14 pr-8 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange/30 transition-all w-80 shadow-sm text-slate-950" 
        />
      </form>
      <div className="flex items-center gap-4">
        <select 
          name="universityId"
          defaultValue={initialUniversityId}
          onChange={(e) => handleUniversityChange(e.target.value)}
          className="h-14 pl-6 pr-12 rounded-2xl border border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-8 focus:ring-corporate-blue/5 transition-all appearance-none cursor-pointer shadow-sm text-slate-950"
        >
          <option value="">TÜM ÜNİVERSİTELER</option>
          {universities.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <div className="h-14 w-14 rounded-2xl border border-slate-200 bg-slate-50 text-slate-950 flex items-center justify-center shadow-sm">
          <Filter className="h-6 w-6" />
        </div>
      </div>
      {(initialQuery || initialUniversityId) && (
        <Link href="/admin/topluluklar" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2">
          Temizle
        </Link>
      )}
    </div>
  );
}
