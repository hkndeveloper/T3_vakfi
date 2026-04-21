"use client";

import { useState, useEffect } from "react";
import { assignCommunityPresidentAction } from "@/actions/community-actions";
import { UserCircle2, Search, Check, RefreshCw, X, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
}

interface PresidentAssignmentModalProps {
  communityId: string;
  onClose: () => void;
  users: User[];
}

export function PresidentAssignmentModal({ communityId, onClose, users }: PresidentAssignmentModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const handleAssign = async () => {
    if (!selectedUserId) return;
    
    setIsSubmitting(true);
    const result = await assignCommunityPresidentAction(communityId, selectedUserId);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      onClose();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-chic-xl overflow-hidden border border-slate-100 dark:border-white/5"
      >
        <div className="p-8 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-indigo-50/30 dark:bg-indigo-950/30">
          <div>
            <h3 className="text-xl font-black text-indigo-950 dark:text-white font-montserrat uppercase tracking-tight">Başkan Ata</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Topluluk için yeni başkan seçin</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="İsim veya e-posta ile ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-3 min-h-[200px]">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                  selectedUserId === user.id 
                    ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-500/30 shadow-md shadow-indigo-500/5" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center text-lg font-black transition-colors",
                  selectedUserId === user.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}>
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.email}</p>
                </div>
                {selectedUserId === user.id && (
                  <Check className="h-5 w-5 text-indigo-600" />
                )}
              </button>
            ))}
            {filteredUsers.length === 0 && searchTerm && (
              <div className="py-10 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">
                KULLANICI BULUNAMADI
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 t3-button t3-button-secondary py-4"
            >
              İPTAL
            </button>
            <button 
              onClick={handleAssign}
              disabled={!selectedUserId || isSubmitting}
              className="flex-1 t3-button t3-button-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5 text-white/50" />
                  ATAMAYI TAMAMLA
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
