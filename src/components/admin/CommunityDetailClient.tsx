"use client";

import { useState } from "react";
import { PresidentAssignmentModal } from "./PresidentAssignmentModal";
import { UserCheck, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  name: string;
  email: string;
}

interface CommunityDetailClientProps {
  communityId: string;
  users: User[];
  currentPresidentName?: string | null;
}

export function CommunityDetailClient({ communityId, users, currentPresidentName }: CommunityDetailClientProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-8 shadow-xl dark:shadow-black/20 group relative overflow-hidden">
        <h4 className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-widest mb-8 border-l-4 border-indigo-500 pl-4 font-montserrat tracking-tight leading-none">Yönetim Paneli</h4>
        
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Mevcut Başkan</p>
             <p className="text-sm font-black text-indigo-950 dark:text-white uppercase truncate">
                {currentPresidentName || "BAŞKAN ATANMAMIŞ"}
             </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full t3-button t3-button-secondary py-5 justify-between group/btn"
          >
            <div className="flex items-center gap-3">
               <UserCheck className="h-5 w-5 text-amber-500" />
               <span className="flex-1 text-left">Başkan Ata / Değiştir</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="absolute -right-6 -bottom-6 opacity-[0.02] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
           <UserCheck className="h-24 w-24 text-indigo-900 dark:text-white" />
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <PresidentAssignmentModal 
            communityId={communityId}
            users={users}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
