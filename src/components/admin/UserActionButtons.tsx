"use client";

import { useState } from "react";
import { resetUserPasswordAction, downloadUserAccessLogsAction } from "@/actions/user-actions";
import { Lock, History, Download, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface UserActionButtonsProps {
  userId: string;
}

export function UserActionButtons({ userId }: UserActionButtonsProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const handleResetPassword = async () => {
    if (!confirm("Bu kullanıcının şifresini sıfırlamak istediğinize emin misiniz?")) return;
    
    setIsResetting(true);
    const result = await resetUserPasswordAction(userId);
    setIsResetting(false);

    if (result.success) {
      setTempPassword(result.tempPassword || null);
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
  };

  const handleDownloadLogs = async () => {
    setIsDownloading(true);
    const result = await downloadUserAccessLogsAction(userId);
    setIsDownloading(false);

    if (result.success && result.data) {
      // Simple CSV export simulation
      const headers = ["İşlem", "Model", "ID", "Tarih"];
      const rows = result.data.map(log => [
        log.action,
        log.modelType || "-",
        log.modelId || "-",
        new Date(log.createdAt).toLocaleString("tr-TR")
      ]);
      
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `user_${userId}_logs.csv`;
      link.click();
      
      toast.success("Erişim logları başarıyla indirildi.");
    } else {
      toast.error(result.error || "Loglar indirilemedi.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <button
          onClick={handleResetPassword}
          disabled={isResetting}
          className="t3-button t3-button-secondary py-3.5 w-full justify-start px-5"
        >
          {isResetting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Lock className="h-4 w-4 text-corporate-blue" />
          )}
          <span className="flex-1 text-left ml-1">Şifre Sıfırla</span>
          <RefreshCw className="h-3 w-3 text-slate-300" />
        </button>

        <button
          onClick={handleDownloadLogs}
          disabled={isDownloading}
          className="t3-button t3-button-secondary py-3.5 w-full justify-start px-5"
        >
          {isDownloading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <History className="h-4 w-4 text-corporate-orange" />
          )}
          <span className="flex-1 text-left ml-1">Erişim Loglarını İndir</span>
          <Download className="h-3 w-3 text-slate-300" />
        </button>
      </div>

      <AnimatePresence>
        {tempPassword && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 bg-corporate-cream border border-corporate-orange/20 shadow-sm"
          >
            <div className="flex gap-4">
              <AlertCircle className="h-5 w-5 text-corporate-orange mt-0.5" />
              <div>
                <p className="text-[9px] font-black text-corporate-orange uppercase tracking-widest mb-1">Yeni Geçici Şifre</p>
                <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter leading-none">{tempPassword}</p>
                <p className="text-[9px] text-slate-500 font-bold mt-3 uppercase tracking-tight leading-relaxed">KULLANICIYA BU ŞİFREYİ İLETİN VE İLK GİRİŞTE DEĞİŞTİRMESİNİ İSTEYİN.</p>
              </div>
              <button 
                onClick={() => setTempPassword(null)}
                className="ml-auto text-slate-400 hover:text-slate-900 p-1 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
