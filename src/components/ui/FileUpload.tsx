"use client";

import { useState, useRef } from "react";
import { Upload, X, FileIcon, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onUploadSuccess: (data: { url: string; name: string; type: string }) => void;
  accept?: string;
  label?: string;
}

export function FileUpload({ onUploadSuccess, accept = "image/*,.pdf,.doc,.docx", label = "Dosya Yükle" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadedFile({ name: result.name, url: result.url });
        onUploadSuccess(result);
        toast.success("Dosya başarıyla yüklendi.");
      } else {
        toast.error(result.error || "Yükleme başarısız oldu.");
      }
    } catch (error) {
      toast.error("Dosya yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="w-full">
      {!uploadedFile ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
            isUploading ? "bg-slate-50 border-slate-300" : "bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept={accept} 
            className="hidden" 
            disabled={isUploading}
          />
          
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-slate-400 animate-spin" />
          ) : (
            <Upload className="h-10 w-10 text-slate-400" />
          )}
          
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500 mt-1">Sürükle bırak veya tıklayarak seç</p>
          </div>
          
          {isUploading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl" />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{uploadedFile.name}</p>
              <p className="text-xs text-emerald-600">Yüklendi</p>
            </div>
          </div>
          <button 
            onClick={clearFile}
            className="p-1 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
