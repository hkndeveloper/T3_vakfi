import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Building, 
  GraduationCap, 
  IdCard,
  Target,
  Zap,
  Sparkles,
  ChevronRight,
  UserX,
  UserCog,
  Search,
  Filter,
  ArrowRight,
  Fingerprint,
  MailCheck,
  ShieldAlert,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MemberActionButtons } from "@/components/baskan/MemberActionButtons";

async function createMemberAction(formData: FormData) {
  "use server";
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const department = String(formData.get("department") ?? "").trim();
  const gradeRaw = String(formData.get("grade") ?? "").trim();
  const studentNumber = String(formData.get("studentNumber") ?? "").trim();

  if (!name || !email || password.length < 8) return;

  const passwordHash = await bcrypt.hash(password, 12);
  const grade = gradeRaw ? Number(gradeRaw) : null;

  const existing = await prisma.user.findUnique({ where: { email } });
  const user =
    existing ??
    (await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        department: department || null,
        grade,
        studentNumber: studentNumber || null,
      },
    }));

  await prisma.communityMember.upsert({
    where: {
      communityId_userId: {
        communityId,
        userId: user.id,
      },
    },
    update: {
      status: "ACTIVE",
      membershipType: "MEMBER",
    },
    create: {
      communityId,
      userId: user.id,
      status: "ACTIVE",
      membershipType: "MEMBER",
    },
  });

  const memberRole = await prisma.role.findUnique({ where: { code: "member" } });
  if (memberRole) {
    const roleExist = await prisma.userRole.findFirst({
      where: {
        userId: user.id,
        roleId: memberRole.id,
        communityId,
      },
    });
    if (!roleExist) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: memberRole.id,
          communityId,
        },
      });
    }
  }

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: "member.create",
      modelType: "CommunityMember",
      modelId: `${communityId}:${user.id}`,
    },
  });

  revalidatePath("/baskan/uyeler");
}

async function updateMemberAction(formData: FormData) {
  "use server";
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const userId = String(formData.get("userId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const gradeRaw = String(formData.get("grade") ?? "").trim();
  const studentNumber = String(formData.get("studentNumber") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!userId || !name) return;

  const member = await prisma.communityMember.findFirst({ where: { userId, communityId } });
  if (!member) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      department: department || null,
      grade: gradeRaw ? Number(gradeRaw) : null,
      studentNumber: studentNumber || null,
      phone: phone || null,
    },
  });

  await prisma.activityLog.create({
    data: { userId: session.user.id, action: "member.update", modelType: "User", modelId: userId },
  });

  revalidatePath("/baskan/uyeler");
}

async function updateMemberStatusAction(formData: FormData) {
  "use server";
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const memberId = String(formData.get("memberId") ?? "").trim();
  const nextStatus = String(formData.get("nextStatus") ?? "").trim();
  if (!memberId || !["ACTIVE", "PASSIVE"].includes(nextStatus)) return;

  await prisma.communityMember.updateMany({
    where: { id: memberId, communityId },
    data: { status: nextStatus as "ACTIVE" | "PASSIVE" },
  });

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: "member.status.update",
      modelType: "CommunityMember",
      modelId: memberId,
    },
  });

  revalidatePath("/baskan/uyeler");
}

async function promoteToManagementAction(formData: FormData) {
  "use server";
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const userId = String(formData.get("userId") ?? "").trim();
  if (!userId) return;

  const managementRole = await prisma.role.findUnique({
    where: { code: "management_team" },
  });
  if (!managementRole) return;

  const already = await prisma.userRole.findFirst({
    where: {
      userId,
      roleId: managementRole.id,
      communityId,
    },
  });

  if (!already) {
    await prisma.userRole.create({
      data: {
        userId,
        roleId: managementRole.id,
        communityId,
      },
    });
  }

  await prisma.communityMember.updateMany({
    where: {
      userId,
      communityId,
    },
    data: {
      membershipType: "MANAGEMENT",
      status: "ACTIVE",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: "member.promote.management",
      modelType: "UserRole",
      modelId: `${userId}:${managementRole.id}`,
    },
  });

  revalidatePath("/baskan/uyeler");
}

export default async function PresidentMembersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];
  const { q: search } = await searchParams;

  const [community, members, events] = await Promise.all([
    prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, name: true, shortName: true },
    }),
    prisma.communityMember.findMany({
      where: { 
        communityId,
        ...(search ? {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ]
          }
        } : {})
      },
      orderBy: { joinedAt: "desc" },
      include: {
        user: true,
      },
    }),
    prisma.event.findMany({
      where: { 
        communityId,
        status: { in: ["DRAFT", "APPROVED", "PENDING_APPROVAL"] },
        eventDate: { gte: new Date() }
      },
      orderBy: { eventDate: "asc" },
      select: { id: true, title: true, eventDate: true, type: true }
    }),
  ]);
  const canManage = session.user.permissions.includes("member.manage");

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-outfit pb-20">
      {/* T3 Premium Hero Section */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-indigo-950 p-12 md:p-16 text-white shadow-2xl group border border-white/5">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/30 px-5 py-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-10 animate-pulse-subtle">
            <Users className="h-4 w-4 fill-amber-500" /> İNSAN KAYNAKLARI
          </div>
          <h1 className="text-6xl font-black tracking-tighter sm:text-7xl font-montserrat leading-[0.9] uppercase">
            ÜYE <br />
            <span className="text-indigo-400 italic border-b-8 border-amber-500/30">EKOSİSTEMİ</span>
          </h1>
          <p className="mt-10 text-xl text-slate-300/80 font-medium max-w-2xl leading-relaxed">
            {community?.name} ekosisteminin aktif üye tabanını kurumsal standartlarda yönetin, yetki seviyelerini belirleyin ve operasyonel hiyerarşiyi kurgulayın.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-indigo-500/10 opacity-30 blur-[130px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-5 scale-150 transform group-hover:rotate-12 transition-transform duration-1000">
           <UserPlus className="h-40 w-40" />
        </div>
      </div>

      {/* Create Member Form */}
      {canManage && (
        <div className="rounded-[4rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-12 md:p-16 shadow-2xl dark:shadow-black/40 relative overflow-hidden group/form border-t-[12px] border-t-indigo-600">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 relative z-10">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-3xl bg-indigo-600 p-5 text-white shadow-xl shadow-indigo-600/20 group-hover/form:scale-110 transition-all duration-500">
                 <UserPlus className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-indigo-950 dark:text-white font-montserrat uppercase tracking-tight leading-none">STRATEJİK KAYIT ÜSSÜ</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.25em] mt-3">Yeni yetenekleri ekosisteme dahil edin.</p>
              </div>
            </div>
            <div className="h-1 w-24 rounded-full bg-indigo-100 dark:bg-indigo-950/40" />
          </div>

          <form action={createMemberAction} className="grid gap-10 md:grid-cols-6 relative z-10">
            <div className="md:col-span-3 space-y-4">
               <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
                 <Fingerprint className="h-4 w-4 text-indigo-600" /> AD SOYAD
               </label>
               <input name="name" placeholder="Örn: Ahmet Yılmaz" className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600" required />
            </div>
            <div className="md:col-span-3 space-y-4">
               <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
                 <MailCheck className="h-4 w-4 text-amber-500" /> KURUMSAL E-POSTA
               </label>
               <input name="email" type="email" placeholder="ahmet.yilmaz@edu.tr" className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600" required />
            </div>
            <div className="md:col-span-2 space-y-4">
               <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
                 <Lock className="h-4 w-4 text-indigo-600" /> ERİŞİM ŞİFRESİ
               </label>
               <input name="password" type="password" placeholder="Min. 8 karakter" className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600" minLength={8} required />
            </div>
            <div className="md:col-span-2 space-y-4">
               <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
                 <Building className="h-4 w-4 text-amber-500" /> AKADEMİK BÖLÜM
               </label>
               <input name="department" placeholder="Bilgisayar Mühendisliği" className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600" />
            </div>
            <div className="md:col-span-1 space-y-4">
               <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
                 <GraduationCap className="h-4 w-4 text-indigo-600" /> SINIF
               </label>
               <input name="grade" type="number" placeholder="2" className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600" min={1} max={8} />
            </div>
            <div className="md:col-span-1 space-y-4">
               <label className="flex items-center gap-3 text-[11px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-[0.3em] px-1 font-montserrat">
                 <IdCard className="h-4 w-4 text-amber-500" /> NO
               </label>
               <input name="studentNumber" placeholder="2024..." className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 px-6 py-6 text-sm font-bold text-indigo-950 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600" />
            </div>
            <button className="md:col-span-6 h-20 rounded-[2rem] bg-indigo-950 dark:bg-indigo-600 text-base font-black text-white shadow-2xl dark:shadow-indigo-500/20 active:scale-95 transition-all uppercase tracking-[0.25em] hover:bg-indigo-900 border border-white/10">SİSTEME KAYDET VE YETKİLENDİR</button>
          </form>
        </div>
      )}

      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-10">
          <div>
            <h2 className="text-3xl font-black text-indigo-950 dark:text-white tracking-tight font-montserrat uppercase leading-none">Ekosistem Kaynakları</h2>
            <div className="flex items-center gap-3 mt-4">
               <div className="h-1.5 w-16 rounded-full bg-amber-500" />
               <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.25em]">{members.length} AKTİF BİLEŞEN LİSTELENİYOR</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <form className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400 dark:text-indigo-600 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                name="q"
                type="text" 
                defaultValue={search}
                placeholder="İsim veya E-posta ara..." 
                className="pl-14 pr-8 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl text-sm font-bold outline-none focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all w-72 shadow-xl shadow-slate-200/50 dark:shadow-black/20 text-indigo-950 dark:text-white" 
              />
            </form>
            {(search) && (
              <a href="/baskan/uyeler" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2">
                Aramayı Temizle
              </a>
            )}
          </div>
        </div>

        <div className="rounded-[4rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] dark:shadow-black/40 overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-50 dark:divide-white/5">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                <tr>
                  <th className="px-12 py-8 text-left text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] font-montserrat">KİMLİK BİLGİSİ</th>
                  <th className="px-12 py-8 text-center text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] font-montserrat">HİYERARŞİ</th>
                  <th className="px-12 py-8 text-center text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] font-montserrat">DURUM</th>
                  <th className="px-12 py-8 text-right text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-[0.3em] font-montserrat">KONTROLAKSİYONU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5 bg-white dark:bg-slate-900">
                {members.map((member) => (
                  <>
                    <tr key={member.id} className="hover:bg-indigo-500/[0.02] dark:hover:bg-white/[0.02] transition-all group">
                      <td className="px-12 py-10">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 font-black text-xl border border-indigo-100 dark:border-indigo-900/40 group-hover:scale-110 transition-transform">
                            {member.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className="font-black text-indigo-950 dark:text-white text-xl tracking-tight font-montserrat uppercase group-hover:text-indigo-600 transition-colors leading-none">{member.user.name}</span>
                            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{member.user.email}</span>
                            {(member.user.department || member.user.grade) && (
                              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                {member.user.department}{member.user.department && member.user.grade ? " · " : ""}{member.user.grade ? `${member.user.grade}. Sınıf` : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-10 text-center">
                         <span className={cn(
                           "inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all",
                           member.membershipType === "MANAGEMENT" 
                             ? "bg-amber-500/10 text-amber-600 border-amber-500/20" 
                             : "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200 border-indigo-100 dark:border-indigo-900/40"
                         )}>
                           {member.membershipType === "MANAGEMENT" && <Star className="h-4 w-4 fill-amber-500" />}
                           {member.membershipType === "MANAGEMENT" ? "YÖNETİM KURULU" : "OPERASYONEL ÜYE"}
                         </span>
                      </td>
                      <td className="px-12 py-10 text-center">
                         <div className="flex justify-center">
                           <span className={cn(
                             "flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] border transition-all shadow-sm",
                             member.status === "ACTIVE" 
                               ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                               : "bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-white/5"
                           )}>
                             <span className={cn("h-2 w-2 rounded-full", member.status === "ACTIVE" ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" : "bg-slate-300 dark:bg-slate-700")} />
                             {member.status === "ACTIVE" ? "AKTİF" : "PASİF"}
                           </span>
                         </div>
                      </td>
                      <td className="px-12 py-10">
                        {canManage && (
                          <MemberActionButtons 
                            memberId={member.id}
                            userId={member.userId}
                            memberName={member.user.name}
                            status={member.status}
                            membershipType={member.membershipType}
                            updateMemberStatusAction={updateMemberStatusAction}
                            promoteToManagementAction={promoteToManagementAction}
                            events={events}
                          />
                        )}
                      </td>
                    </tr>
                    {/* Satır İçi Düzenleme Formu */}
                    {canManage && (
                      <tr key={`edit-${member.id}`} className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100">
                        <td colSpan={4} className="px-12 py-6">
                          <form action={updateMemberAction} className="flex flex-wrap items-end gap-6">
                            <input type="hidden" name="userId" value={member.userId} />
                            <div className="flex flex-col gap-2 min-w-[180px]">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ad Soyad</label>
                              <input name="name" defaultValue={member.user.name} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-[11px] font-bold text-slate-950 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm" required />
                            </div>
                            <div className="flex flex-col gap-2 min-w-[160px]">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Telefon</label>
                              <input name="phone" defaultValue={member.user.phone ?? ""} placeholder="+90..." className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-[11px] font-bold text-slate-950 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm" />
                            </div>
                            <div className="flex flex-col gap-2 min-w-[160px]">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bölüm</label>
                              <input name="department" defaultValue={member.user.department ?? ""} placeholder="Bilg. Müh." className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-[11px] font-bold text-slate-950 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm" />
                            </div>
                            <div className="flex flex-col gap-2 w-24">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sınıf</label>
                              <input name="grade" type="number" defaultValue={member.user.grade ?? ""} min={1} max={8} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-[11px] font-bold text-slate-950 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm" />
                            </div>
                            <div className="flex flex-col gap-2 min-w-[130px]">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Öğrenci No</label>
                              <input name="studentNumber" defaultValue={member.user.studentNumber ?? ""} placeholder="2024..." className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-[11px] font-bold text-slate-950 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm" />
                            </div>
                            <button className="flex items-center gap-3 px-8 py-4 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap">
                              <UserCog className="h-4 w-4" /> Güncelle
                            </button>
                          </form>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
