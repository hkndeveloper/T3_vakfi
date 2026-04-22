"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { MediaUploadForm } from "./MediaUploadForm";

interface MediaUploadModalProps {
  communityId?: string;
  reportId?: string;
  eventId?: string;
  communities?: { id: string; name: string; shortName: string }[];
  trigger?: React.ReactNode;
}

export function MediaUploadModal({ communityId, reportId, eventId, communities, trigger }: MediaUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-t3-navy text-white rounded-xl text-xs font-bold hover:bg-t3-navy/90 transition-all shadow-lg"
        >
          <Upload className="h-4 w-4" /> DOSYA YÜKLE
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight italic">Sisteme Dosya Yükle</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Medya veya resmi belgelerinizi arşive ekleyin</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <MediaUploadForm 
                communityId={communityId}
                reportId={reportId}
                eventId={eventId}
                communities={communities}
                onSuccess={() => setIsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
