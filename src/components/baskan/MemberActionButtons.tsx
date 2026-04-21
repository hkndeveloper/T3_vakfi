"use client";

import { useState } from "react";
import { UserX, UserPlus, UserCog, CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MemberEventAssignModal } from "../forms/MemberEventAssignModal";

interface MemberActionButtonsProps {
  memberId: string;
  userId: string;
  memberName: string;
  status: string;
  membershipType: string;
  updateMemberStatusAction: (formData: FormData) => Promise<void>;
  promoteToManagementAction: (formData: FormData) => Promise<void>;
  events: any[];
}

export function MemberActionButtons({ 
  memberId, 
  userId, 
  memberName, 
  status, 
  membershipType,
  updateMemberStatusAction,
  promoteToManagementAction,
  events
}: MemberActionButtonsProps) {
  const [showAssignModal, setShowAssignModal] = useState(false);

  return (
    <div className="flex items-center justify-end gap-6">
      {/* Etkinliğe Ata Butonu */}
      <button 
        onClick={() => setShowAssignModal(true)}
        className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.15em] hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/20 active:scale-95 transition-all duration-300"
      >
        <CalendarPlus className="h-4 w-4" /> ETKİNLİĞE EKLE
      </button>

      {/* Pasifleştir/Aktif Et */}
      <form action={updateMemberStatusAction}>
        <input type="hidden" name="memberId" value={memberId} />
        <input type="hidden" name="nextStatus" value={status === "ACTIVE" ? "PASSIVE" : "ACTIVE"} />
        <button className={cn(
          "flex items-center gap-3 px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 hover:shadow-xl active:scale-95",
          status === "ACTIVE" 
            ? "bg-white dark:bg-slate-800 text-red-600 border-red-100 dark:border-red-900/40 hover:bg-red-600 hover:text-white" 
            : "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700"
        )}>
           {status === "ACTIVE" ? <><UserX className="h-4 w-4" /> PASİFLEŞTİR</> : <><UserPlus className="h-4 w-4" /> AKTİVASYON</>}
        </button>
      </form>

      {/* Yönetime Ata */}
      {membershipType !== "MANAGEMENT" && (
        <form action={promoteToManagementAction}>
          <input type="hidden" name="userId" value={userId} />
          <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-950 dark:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-800 dark:hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/20 border border-white/5 whitespace-nowrap">
             <UserCog className="h-4 w-4" /> YÖNETİME ATA
          </button>
        </form>
      )}

      {/* Modal Selection */}
      {showAssignModal && (
        <MemberEventAssignModal
          memberId={userId}
          memberName={memberName}
          events={events}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </div>
  );
}
