"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    setLoading(false);

    if (result?.error) {
      setError("Giriş başarısız. Email veya şifreyi kontrol edin.");
      return;
    }

    // Full refresh to ensure session is picked up correctly
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6 font-outfit overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-slate-50/50 pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-corporate-blue/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-corporate-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1200px] grid lg:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-200 relative z-10 transition-all animate-in fade-in zoom-in-95 duration-1000">
        {/* Visual Brand Side */}
        <div className="relative hidden lg:flex flex-col justify-between p-20 bg-slate-950 text-white overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] mb-12">
               <div className="h-2 w-2 rounded-full bg-corporate-orange animate-pulse" /> SİSTEM ERİŞİM PANELİ
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
              T3 <br />
              <span className="text-corporate-blue">TOPLULUK</span> <br />
              YÖNETİMİ
            </h1>
            <p className="mt-12 text-lg text-slate-400 font-medium leading-relaxed max-w-sm">
              Milli Teknoloji Hamlesi ekosistemindeki tüm toplulukları, üyeleri ve etkinlikleri <span className="text-white font-bold">merkezi strateji</span> ile yönetin.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
             <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all">
                <div className="h-12 w-12 rounded-xl bg-corporate-blue/20 flex items-center justify-center text-corporate-blue group-hover:scale-110 transition-transform">
                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest text-slate-500">GÜVENLİK</p>
                   <p className="text-sm font-bold text-white uppercase italic">Uçtan Uca Şifreli İletişim</p>
                </div>
             </div>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] px-4">T3 VAKFI © 2024</p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-corporate-blue/20 blur-[100px] rounded-full" />
          <svg className="absolute -right-20 bottom-0 w-96 h-96 opacity-10 text-white fill-current rotate-12" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
        </div>

        {/* Login Form Side */}
        <div className="p-10 md:p-20 flex flex-col justify-center bg-white relative overflow-hidden">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-14">
              <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Hoş Geldiniz</h2>
              <p className="t3-label mt-4">LÜTFEN KURUMSAL KİMLİK BİLGİLERİNİZLE GİRİŞ YAPIN</p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-3 group">
                  <label className="text-[11px] font-black text-slate-950 uppercase tracking-widest px-1 group-focus-within:text-corporate-blue transition-colors" htmlFor="email">
                    E-POSTA ADRESİ
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-8 py-5 text-sm font-bold text-slate-950 outline-none focus:bg-white focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all shadow-sm"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      placeholder="ad.soyad@t3.org.tr"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 group">
                  <label className="text-[11px] font-black text-slate-950 uppercase tracking-widest px-1 group-focus-within:text-corporate-orange transition-colors" htmlFor="password">
                    ERİŞİM ŞİFRESİ
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-8 py-5 text-sm font-bold text-slate-950 outline-none focus:bg-white focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all shadow-sm"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      placeholder="••••••••"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-4 animate-shake">
                   <div className="h-10 w-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                   </div>
                   <p className="text-xs font-black text-rose-600 uppercase tracking-tight leading-relaxed">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-4 rounded-2xl bg-slate-950 px-10 py-6 text-sm font-black text-white hover:bg-corporate-blue transition-all active:scale-[0.98] uppercase tracking-[0.25em] shadow-2xl shadow-slate-950/20 disabled:bg-slate-400 group/btn"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>SİSTEME GİRİŞ YAP</span>
                    <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </>
                )}
              </button>

              <div className="pt-10 flex flex-col items-center gap-4">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">GÜVENLİ ERİŞİM KATMANI v4.0</p>
                 <div className="flex items-center gap-3">
                    <div className="h-1 w-12 rounded-full bg-slate-100" />
                    <div className="h-2 w-2 rounded-full bg-corporate-blue" />
                    <div className="h-1 w-12 rounded-full bg-slate-100" />
                 </div>
              </div>
            </form>
          </div>

          <div className="absolute -left-20 -bottom-20 h-64 w-64 bg-corporate-orange/5 blur-[80px] rounded-full pointer-events-none" />
        </div>
      </div>
    </main>
  );
}
