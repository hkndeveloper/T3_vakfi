import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PasswordResetPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link 
          href="/giris" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-t3-navy mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Girişe Dön
        </Link>

        <div className="t3-panel-elevated p-8">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-t3 bg-t3-navy/5 flex items-center justify-center text-t3-navy mx-auto mb-4">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-semibold text-t3-navy font-montserrat">Şifre Sıfırla</h1>
            <p className="text-sm text-slate-500 mt-2">E-posta adresinizi girin, şifre sıfırlama linki gönderelim</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-t3-navy uppercase tracking-wider">E-posta Adresi</label>
              <input
                type="email"
                name="email"
                required
                placeholder="ornek@universite.edu.tr"
                className="t3-input w-full"
              />
            </div>

            <button
              type="submit"
              className="t3-button t3-button-primary w-full"
            >
              Şifre Sıfırlama Linki Gönder
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            Şifre sıfırlama linki e-posta adresinize gönderilecektir. Link 24 saat geçerlidir.
          </p>
        </div>
      </div>
    </div>
  );
}
