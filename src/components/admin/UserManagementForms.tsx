"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { adminCreateUserAction, adminAssignRoleAction } from "@/actions/admin-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { 
  UserPlus, 
  ShieldAlert, 
  Mail, 
  Lock, 
  UserCircle2, 
  Building2,
  ShieldCheck
} from "lucide-react";

interface UserManagementFormsProps {
  users: any[];
  roles: any[];
  communities: any[];
}

export function UserCreationForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    const result = await adminCreateUserAction(formData);
    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="t3-panel-elevated p-6 md:p-12 bg-slate-50/50 relative overflow-hidden group/card border-l-[8px] md:border-l-[12px] border-l-corporate-blue">
      <div className="flex items-center gap-5 md:gap-7 mb-8 md:mb-12">
        <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-corporate-blue flex items-center justify-center text-white shadow-lg shadow-corporate-blue/20 group-hover/card:scale-110 transition-all duration-500">
          <UserPlus className="h-6 w-6 md:h-8 md:w-8" />
        </div>
        <div>
          <h2 className="t3-heading text-xl md:text-2xl text-slate-950">Profil Oluştur</h2>
          <p className="t3-label mt-1 md:mt-3">Yeni bir kurumsal kullanıcı tanımlayın.</p>
        </div>
      </div>
      <form ref={formRef} action={clientAction} className="grid gap-6 md:gap-8">
        <div className="space-y-2 md:space-y-3">
           <label className="text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Tam İsim Soyisim</label>
           <div className="relative group/input">
             <UserCircle2 className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within/input:text-corporate-blue transition-colors" />
             <input
               name="name"
               placeholder="Örn: Mehmet Emin Özdemir"
               className="w-full rounded-xl md:rounded-2xl border border-slate-200 bg-white pl-12 md:pl-14 pr-6 py-4 md:py-5 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none"
               required
             />
           </div>
        </div>
        <div className="space-y-2 md:space-y-3">
           <label className="text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Kurumsal E-Posta</label>
           <div className="relative group/input">
             <Mail className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within/input:text-corporate-blue transition-colors" />
             <input
               name="email"
               type="email"
               placeholder="ad.soyad@t3vakfi.org"
               className="w-full rounded-xl md:rounded-2xl border border-slate-200 bg-white pl-12 md:pl-14 pr-6 py-4 md:py-5 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none"
               required
             />
           </div>
        </div>
        <div className="space-y-2 md:space-y-3">
           <label className="text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Geçici Erişim Anahtarı</label>
           <div className="relative group/input">
             <Lock className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within/input:text-corporate-blue transition-colors" />
             <input
               name="password"
               type="password"
               placeholder="••••••••"
               className="w-full rounded-xl md:rounded-2xl border border-slate-200 bg-white pl-12 md:pl-14 pr-6 py-4 md:py-5 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none"
               minLength={8}
               required
             />
           </div>
        </div>
        <SubmitButton label="HESABI SİSTEME TANIMLA" className="t3-button t3-button-primary w-full py-5 md:py-6" />
      </form>
    </div>
  );
}

export function RoleAssignmentForm({ users, roles, communities }: UserManagementFormsProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    const result = await adminAssignRoleAction(formData);
    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="t3-panel-elevated p-6 md:p-12 bg-orange-50/30 relative overflow-hidden group/card border-l-[8px] md:border-l-[12px] border-l-corporate-orange">
      <div className="flex items-center gap-5 md:gap-7 mb-8 md:mb-12">
        <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-corporate-orange flex items-center justify-center text-white shadow-lg shadow-corporate-orange/20 group-hover/card:scale-110 transition-all duration-500">
          <ShieldAlert className="h-6 w-6 md:h-8 md:w-8" />
        </div>
        <div>
          <h2 className="t3-heading text-xl md:text-2xl text-slate-950">Yetki Delegasyonu</h2>
          <p className="t3-label mt-1 md:mt-3">Hiyerarşik rol ve birim ataması yapın.</p>
        </div>
      </div>
      <form ref={formRef} action={clientAction} className="grid gap-6 md:gap-8">
        <div className="space-y-2 md:space-y-3">
           <label className="text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Hedef Kullanıcı</label>
           <div className="relative group/input">
             <UserCircle2 className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within/input:text-corporate-orange transition-colors" />
             <select
               name="userId"
               className="w-full rounded-xl md:rounded-2xl border border-slate-200 bg-white pl-12 md:pl-14 pr-10 py-4 md:py-5 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all outline-none appearance-none cursor-pointer"
               required
             >
               <option value="">Kullanıcı Listesi...</option>
               {users.map((user) => (
                 <option key={user.id} value={user.id}>
                   {user.name} ({user.email.split('@')[0]})
                 </option>
               ))}
             </select>
           </div>
        </div>
        <div className="space-y-2 md:space-y-3">
           <label className="text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Kurumsal Rol</label>
           <div className="relative group/input">
             <ShieldCheck className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within/input:text-corporate-orange transition-colors" />
             <select
               name="roleId"
               className="w-full rounded-xl md:rounded-2xl border border-slate-200 bg-white pl-12 md:pl-14 pr-10 py-4 md:py-5 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all outline-none appearance-none cursor-pointer"
               required
             >
               <option value="">Yetki Seviyesi...</option>
               {roles.map((role) => (
                 <option key={role.id} value={role.id}>
                   {role.name}
                 </option>
               ))}
             </select>
           </div>
        </div>
        <div className="space-y-2 md:space-y-3">
           <label className="text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Operasyonel Birim</label>
           <div className="relative group/input">
             <Building2 className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within/input:text-corporate-orange transition-colors" />
             <select name="communityId" className="w-full rounded-xl md:rounded-2xl border border-slate-200 bg-white pl-12 md:pl-14 pr-10 py-4 md:py-5 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all outline-none appearance-none cursor-pointer">
               <option value="">Global Yetki (Tüm Sistem)</option>
               {communities.map((community) => (
                 <option key={community.id} value={community.id}>
                   {community.name}
                 </option>
               ))}
             </select>
           </div>
        </div>
        <SubmitButton label="DELAGASYONU TAMAMLA" className="t3-button t3-button-accent w-full py-5 md:py-6" />
      </form>
    </div>
  );
}
