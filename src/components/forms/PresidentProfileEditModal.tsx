"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateCommunityProfileAction } from "@/actions/community-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { 
  X, 
  Settings2, 
  User, 
  AlignLeft, 
  Mail, 
  Globe, 
  Instagram, 
  Twitter 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PresidentProfileEditModalProps {
  community: {
    advisorName: string | null;
    description: string | null;
    contactEmail: string | null;
    instagram: string | null;
    twitter: string | null;
    website: string | null;
  };
}

export function PresidentProfileEditModal({ community }: PresidentProfileEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  async function clientAction(formData: FormData) {
    const result = await updateCommunityProfileAction(formData);
    
    if (result?.success) {
      toast.success(result.message);
      setIsOpen(false);
    } else if (result?.error) {
      toast.error(result.error);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-8 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-3 backdrop-blur-md"
      >
        <Settings2 className="h-4 w-4" />
        PROFİLİ DÜZENLE
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-indigo-950/40 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5"
            >
              <div className="p-10 md:p-14">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                      <Settings2 className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-indigo-950 dark:text-white font-montserrat uppercase tracking-tight">Profil Editörü</h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Dış dünyaya açık kurumsal kimliğinizi yönetin.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="h-12 w-12 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-all"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form action={clientAction} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 ml-1">Akademik Danışman</label>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                          name="advisorName"
                          defaultValue={community.advisorName || ""}
                          placeholder="Hoca adı..."
                          className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 ml-1">İletişim E-Posta</label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                          name="contactEmail"
                          defaultValue={community.contactEmail || ""}
                          placeholder="kurumsal@uni.edu.tr"
                          className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 ml-1">Topluluk Tanımı</label>
                      <div className="relative group">
                        <AlignLeft className="absolute left-5 top-6 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <textarea
                          name="description"
                          defaultValue={community.description || ""}
                          rows={3}
                          placeholder="Kısa bir vizyon özeti..."
                          className="w-full rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 ml-1">Instagram</label>
                      <div className="relative group">
                        <Instagram className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                          name="instagram"
                          defaultValue={community.instagram || ""}
                          placeholder="@username"
                          className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 ml-1">Web Sitesi</label>
                      <div className="relative group">
                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                          name="website"
                          defaultValue={community.website || ""}
                          placeholder="https://..."
                          className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 pl-14 pr-6 py-5 text-sm font-bold focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <SubmitButton 
                      label="PROFİLİ GÜNCELLE" 
                      className="w-full h-16 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all"
                    />
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
