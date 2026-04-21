"use client";

import { toggleAttendanceAction } from "@/actions/attendance-actions";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Search,
  UserCheck,
  UserMinus,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
  email: string;
  studentNumber: string | null;
  attendanceStatus?: string;
}

interface AttendanceManagerProps {
  eventId: string;
  members: Member[];
}

export function AttendanceManager({ eventId, members }: AttendanceManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.studentNumber?.includes(searchTerm)
  );

  async function handleToggle(userId: string, status: string) {
    const result = await toggleAttendanceAction(eventId, userId, status);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-t3-navy transition-colors" />
        <input 
          type="text" 
          placeholder="Üye ara (İsim veya Öğrenci No)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-16 rounded-[2rem] border border-slate-100 bg-white/50 pl-14 pr-6 text-sm font-bold shadow-xl shadow-slate-200/20 focus:ring-8 focus:ring-t3-navy/5 focus:border-t3-navy outline-none transition-all font-outfit"
        />
      </div>

      {/* Members List */}
      <div className="space-y-4">
        {filteredMembers.map((member) => (
          <div 
            key={member.id} 
            className="group flex flex-wrap items-center justify-between gap-6 p-6 rounded-[2.5rem] bg-white border border-slate-50 hover:border-t3-cyan/20 hover:shadow-2xl transition-all relative overflow-hidden"
          >
            <div className="flex items-center gap-5">
               <div className="h-12 w-12 rounded-xl bg-t3-navy/5 flex items-center justify-center text-t3-navy font-black border border-slate-100">
                  {member.name.charAt(0)}
               </div>
               <div>
                  <h4 className="text-sm font-black text-t3-navy uppercase tracking-tight font-montserrat">{member.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest">{member.studentNumber || "MISAFIR"}</p>
               </div>
            </div>

            <div className="flex items-center gap-2">
               <AttendanceButton 
                 active={member.attendanceStatus === "ATTENDED"}
                 onClick={() => handleToggle(member.id, "ATTENDED")}
                 icon={CheckCircle2}
                 label="KATILDI"
                 color="emerald"
               />
               <AttendanceButton 
                 active={member.attendanceStatus === "ABSENT"}
                 onClick={() => handleToggle(member.id, "ABSENT")}
                 icon={XCircle}
                 label="GELMEDİ"
                 color="rose"
               />
               <AttendanceButton 
                 active={member.attendanceStatus === "EXCUSED"}
                 onClick={() => handleToggle(member.id, "EXCUSED")}
                 icon={MessageSquare}
                 label="MAZERET"
                 color="amber"
               />
            </div>
            
            <div className={cn(
              "absolute top-0 right-0 h-1 w-0 transition-all duration-500",
              member.attendanceStatus === "ATTENDED" ? "w-full bg-emerald-500" : 
              member.attendanceStatus === "ABSENT" ? "w-full bg-rose-500" : 
              member.attendanceStatus === "EXCUSED" ? "w-full bg-amber-500" : "w-0"
            )} />
          </div>
        ))}
        
        {filteredMembers.length === 0 && (
           <div className="p-20 text-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-slate-50/30">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Üye bulunamadı.</p>
           </div>
        )}
      </div>
    </div>
  );
}

function AttendanceButton({ active, onClick, icon: Icon, label, color }: any) {
  const colors: any = {
    emerald: active ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-emerald-50 text-emerald-500 border-emerald-100",
    rose: active ? "bg-rose-500 text-white shadow-rose-200" : "bg-rose-50 text-rose-500 border-rose-100",
    amber: active ? "bg-amber-500 text-white shadow-amber-200" : "bg-amber-50 text-amber-500 border-amber-100"
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95 shadow-sm",
        colors[color]
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}
