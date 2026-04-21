"use client";

import { useState } from "react";
import { assignMemberToEventAction } from "@/actions/event-actions";
import { Calendar, Search, Check, RefreshCw, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  eventDate: Date;
  type: string;
}

interface MemberEventAssignModalProps {
  memberId: string;
  memberName: string;
  events: Event[];
  onClose: () => void;
}

export function MemberEventAssignModal({ memberId, memberName, events, onClose }: MemberEventAssignModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selectedEventId) return;
    
    setIsSubmitting(true);
    const result = await assignMemberToEventAction(selectedEventId, memberId);
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5"
      >
        <div className="p-10 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-indigo-50/30 dark:bg-indigo-950/30">
          <div>
            <h3 className="text-2xl font-black text-indigo-950 dark:text-white font-montserrat uppercase tracking-tight italic">Operasyona Dahil Et</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">
              <span className="text-indigo-600">{memberName}</span> isimli üyeyi bir etkinliğe ata
            </p>
          </div>
          <button onClick={onClose} className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all shadow-sm flex items-center justify-center">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div className="relative group/search">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/search:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Etkinlik başlığı ile ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-indigo-950 dark:text-white focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300 shadow-inner"
            />
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                className={cn(
                  "w-full flex items-center gap-6 p-6 rounded-3xl border transition-all text-left group/item",
                  selectedEventId === event.id 
                    ? "bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-600/20" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <div className={cn(
                  "h-16 w-16 shrink-0 rounded-2xl flex flex-col items-center justify-center transition-all",
                  selectedEventId === event.id 
                    ? "bg-white/20 text-white" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover/item:bg-indigo-100 group-hover/item:text-indigo-600"
                )}>
                   <span className="text-[10px] font-black uppercase leading-none mb-1">
                      {new Date(event.eventDate).toLocaleString("tr-TR", { month: "short" })}
                   </span>
                   <span className="text-2xl font-black leading-none italic font-montserrat">
                      {new Date(event.eventDate).getDate()}
                   </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                     <span className={cn(
                       "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                       selectedEventId === event.id 
                        ? "bg-white/20 border-white/30 text-white" 
                        : "bg-indigo-50 text-indigo-600 border-indigo-100"
                     )}>
                        {event.type}
                     </span>
                  </div>
                  <h4 className={cn(
                    "text-lg font-black uppercase tracking-tight font-montserrat truncate",
                    selectedEventId === event.id ? "text-white" : "text-indigo-950 dark:text-white"
                  )}>
                    {event.title}
                  </h4>
                </div>
                
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center transition-all",
                  selectedEventId === event.id ? "bg-white text-indigo-600" : "bg-slate-50 dark:bg-slate-800 text-slate-200"
                )}>
                  <Check className="h-5 w-5" />
                </div>
              </button>
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="py-20 text-center space-y-4 rounded-[2.5rem] bg-slate-50/50 border-2 border-dashed border-slate-100">
                <Calendar className="h-12 w-12 text-slate-200 mx-auto" />
                <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest">Atanabilecek uygun etkinlik bulunamadı</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100 dark:border-white/5 shadow-sm"
            >
              İPTAL ET
            </button>
            <button 
              onClick={handleAssign}
              disabled={!selectedEventId || isSubmitting}
              className="flex-1 h-16 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-white/50" />
                  GÖREVLENDİRME YAP
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
