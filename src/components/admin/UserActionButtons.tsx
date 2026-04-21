"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  resetUserPasswordAction, 
  downloadUserAccessLogsAction,
  toggleUserStatusAction,
  deleteUserAction
} from "@/actions/user-actions";
import { Lock, History, Download, RefreshCw, CheckCircle2, AlertCircle, UserX, UserCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface UserActionButtonsProps {
  userId: string;
  isActive?: boolean;
}

export function UserActionButtons({ userId, isActive = true }: UserActionButtonsProps) {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentActive, setCurrentActive] = useState(isActive);
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
      const headers = ["İşlem", "Model", "ID", "Tarih"];
      const rows = result.data.map((log: any) => [
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
      toast.error("Loglar indirilemedi.");
    }
  };

  const handleToggleStatus = async () => {
    const action = currentActive ? "devre dışı bırakmak" : "aktive etmek";
    if (!confirm(`Bu kullanıcıyı ${action} istediğinize emin misiniz?`)) return;
    setIsToggling(true);
    const result = await toggleUserStatusAction(userId);
    setIsToggling(false);
    if (result.success) {
      setCurrentActive(result.isActive!);
      toast.success(result.isActive ? "Kullanıcı aktive edildi." : "Kullanıcı devre dışı bırakıldı.");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem GERİ ALINAMAZ.")) return;
    if (!confirm("Son uyarı: Kullanıcının tüm verileri (roller, üyelikler, loglar) silinecek. Devam edilsin mi?")) return;
    setIsDeleting(true);
    const result = await deleteUserAction(userId);
    setIsDeleting(false);
    if (result.success) {
      toast.success("Kullanıcı başarıyla silindi.");
      router.push("/admin/kullanicilar");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        {/* Şifre Sıfırla */}
        <button
          onClick={handleResetPassword}
          disabled={isResetting}
          className="flex items-center gap-3 w-full rounded-xl bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-5 py-3.5 hover:bg-white/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {isResetting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4 text-blue-300" />}
          <span className="flex-1 text-left">Şifre Sıfırla</span>
        </button>

        {/* Log İndir */}
        <button
          onClick={handleDownloadLogs}
          disabled={isDownloading}
          className="flex items-center gap-3 w-full rounded-xl bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-5 py-3.5 hover:bg-white/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {isDownloading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <History className="h-4 w-4 text-amber-300" />}
          <span className="flex-1 text-left">Erişim Loglarını İndir</span>
          <Download className="h-3 w-3 text-white/30" />
        </button>

        {/* Aktif/Deaktif Toggle */}
        <button
          onClick={handleToggleStatus}
          disabled={isToggling}
          className={`flex items-center gap-3 w-full rounded-xl border text-[10px] font-black uppercase tracking-widest px-5 py-3.5 active:scale-95 transition-all disabled:opacity-50 ${
            currentActive
              ? "bg-rose-500/20 border-rose-500/30 text-rose-300 hover:bg-rose-500/30"
              : "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30"
          }`}
        >
          {isToggling ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : currentActive ? (
            <UserX className="h-4 w-4" />
          ) : (
            <UserCheck className="h-4 w-4" />
          )}
          <span className="flex-1 text-left">{currentActive ? "Hesabı Devre Dışı Bırak" : "Hesabı Aktive Et"}</span>
        </button>

        {/* Kullanıcı Sil */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-3 w-full rounded-xl bg-rose-900/40 border border-rose-500/30 text-rose-300 text-[10px] font-black uppercase tracking-widest px-5 py-3.5 hover:bg-rose-500 hover:text-white active:scale-95 transition-all disabled:opacity-50"
        >
          {isDeleting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          <span className="flex-1 text-left">Kullanıcıyı Sil</span>
        </button>
      </div>

      <AnimatePresence>
        {tempPassword && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="p-5 bg-amber-900/30 border border-amber-500/30 rounded-2xl"
          >
            <div className="flex gap-3">
              <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2">Yeni Geçici Şifre</p>
                <p className="text-xl font-black text-white font-mono tracking-tighter">{tempPassword}</p>
                <p className="text-[9px] text-white/40 font-bold mt-2 uppercase leading-relaxed">Kullanıcıya bu şifreyi iletin.</p>
              </div>
              <button onClick={() => setTempPassword(null)} className="text-white/30 hover:text-white transition-colors">
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
