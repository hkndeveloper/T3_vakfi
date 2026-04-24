"use client";

import { useState } from "react";
import { toast } from "sonner";
import { uploadMediaAction, uploadDocumentAction } from "@/actions/media-actions";
import { FileUpload } from "@/components/ui/FileUpload";
import { useRouter } from "next/navigation";
import { ImageIcon, FileText, Sparkles, FolderPlus, Building2, CalendarDays, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaUploadFormProps {
  communityId?: string;
  reportId?: string;
  eventId?: string;
  communities?: { id: string; name: string; shortName: string }[]; // For admins
  events?: { id: string; title: string; scope?: string }[];
  onSuccess?: () => void;
}

export function MediaUploadForm({ communityId, reportId, eventId, communities, events, onSuccess }: MediaUploadFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"media" | "document">("media");
  const [selectedCommunityId, setSelectedCommunityId] = useState(communityId || "");
  const [selectedEventId, setSelectedEventId] = useState(eventId || "");
  const [docCategory, setDocCategory] = useState("Genel");

  const handleMediaSuccess = async (data: { url: string; name: string; type: string }) => {
    if (!selectedCommunityId) {
      toast.error("Lütfen bir topluluk seçin.");
      return;
    }

    const result = await uploadMediaAction({
      communityId: selectedCommunityId,
      reportId,
      eventId: selectedEventId || undefined,
      fileName: data.name,
      filePath: data.url,
      fileType: data.type
    });

    if (result.success) {
      toast.success(result.message);
      router.refresh();
      onSuccess?.();
    } else {
      toast.error(result.error);
    }
  };

  const handleDocumentSuccess = async (data: { url: string; name: string; type: string }) => {
    if (!selectedCommunityId) {
      toast.error("Lütfen bir topluluk seçin.");
      return;
    }

    const result = await uploadDocumentAction({
      communityId: selectedCommunityId,
      reportId,
      eventId: selectedEventId || undefined,
      category: docCategory,
      title: data.name,
      filePath: data.url
    });

    if (result.success) {
      toast.success(result.message);
      router.refresh();
      onSuccess?.();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50/30 p-8 shadow-inner animate-in fade-in duration-700 font-outfit">
      <div className="space-y-6">
        {/* Community Selection (if not fixed) */}
        {!communityId && communities && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 t3-label ml-4">
              <Building2 className="h-3 w-3" /> İLGİLİ TOPLULUK
            </label>
            <select 
              value={selectedCommunityId}
              onChange={(e) => setSelectedCommunityId(e.target.value)}
              className="t3-input w-full h-14 pl-6 pr-10 appearance-none cursor-pointer"
            >
              <option value="">Topluluk Seçin...</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.shortName})</option>
              ))}
            </select>
          </div>
        )}

        {events && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 t3-label ml-4">
              <CalendarDays className="h-3 w-3" /> İLGİLİ ETKİNLİK
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              disabled={events.length === 0}
              className="t3-input w-full h-14 pl-6 pr-10 appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {events.length === 0 ? "Henüz seçilebilir etkinlik bulunmuyor" : "Etkinlik seçmeden devam et..."}
              </option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.scope === "GLOBAL" ? `[GLOBAL] ${event.title}` : event.title}
                </option>
              ))}
            </select>
            <p className="px-4 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              {events.length === 0
                ? "Etkinlik oluşturulduğunda veya merkezden global etkinlik açıldığında burada listelenecek."
                : "Kendi etkinliğinizi veya merkezden yayınlanan global etkinliği ilişkilendirebilirsiniz."}
            </p>
          </div>
        )}

        {/* Document Category (if document tab active) */}
        {activeTab === "document" && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 t3-label ml-4">
              <FileText className="h-3 w-3" /> BELGE KATEGORİSİ
            </label>
            <select 
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              className="t3-input w-full h-14 pl-6 pr-10 appearance-none cursor-pointer"
            >
              <option value="Genel">Genel</option>
              <option value="Dilekçe">Dilekçe</option>
              <option value="Tutanak">Tutanak</option>
              <option value="Protokol">Protokol</option>
              <option value="Rapor Eki">Rapor Eki</option>
            </select>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-6 px-2">
           <div className="flex items-center gap-3">
              <FolderPlus className="h-5 w-5 text-corporate-blue" />
              <h4 className="t3-label text-corporate-blue">Dosya Yükleme</h4>
           </div>
           {selectedEventId && (
             <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-corporate-blue">
               <Globe2 className="h-3.5 w-3.5" />
               Etkinlik Bağlı
             </div>
           )}
           <div className="flex bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-100 shadow-sm">
              <button 
                type="button"
                onClick={() => setActiveTab("media")}
                className={cn(
                   "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                   activeTab === "media" 
                     ? "bg-slate-950 text-white shadow-xl shadow-slate-950/20" 
                     : "text-slate-400 hover:text-corporate-blue hover:bg-slate-50"
                )}
              >
                <ImageIcon className={cn("h-4 w-4", activeTab === "media" ? "text-corporate-blue" : "text-slate-300")} /> 
                MEDYA
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("document")}
                className={cn(
                   "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ml-1",
                   activeTab === "document" 
                     ? "bg-slate-950 text-white shadow-xl shadow-slate-950/20" 
                     : "text-slate-400 hover:text-corporate-blue hover:bg-slate-50"
                )}
              >
                <FileText className={cn("h-4 w-4", activeTab === "document" ? "text-corporate-orange" : "text-slate-300")} /> 
                BELGE
              </button>
           </div>
        </div>

        <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm relative overflow-hidden group/upload">
          {activeTab === "media" ? (
            <FileUpload 
              onUploadSuccess={handleMediaSuccess} 
              accept="image/*,video/*" 
              label="Görsel veya Video Kanıtlarını Buraya Sürükleyin" 
            />
          ) : (
            <FileUpload 
              onUploadSuccess={handleDocumentSuccess} 
              accept=".pdf,.doc,.docx,.xls,.xlsx" 
              label="Resmi Belgeleri (PDF, Office) Buraya Sürükleyin" 
            />
          )}
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/upload:opacity-30 transition-opacity">
             <Sparkles className="h-8 w-8 text-corporate-blue" />
          </div>
        </div>
      </div>
      
      <p className="mt-6 text-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
        Yüklenen dosyalar T3 Vakfı güvenlik ve depolama standartlarına göre şifrelenir. <br />
        Maksimum dosya boyutu: 50MB
      </p>
    </div>
  );
}
