import React from "react";
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
      {/* Soft Executive Hero Section */}
      <div className="relative overflow-hidden rounded-t3-xl bg-slate-100/50 p-12 md:p-16 border border-slate-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.25em] mb-10 shadow-sm">
              <Users className="h-4 w-4 text-corporate-blue" /> İNSAN KAYNAKLARI
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9] uppercase text-slate-950 italic">
              ÜYE <br />
              <span className="text-corporate-blue italic">EKOSİSTEMİ</span>
            </h1>
            <p className="mt-10 text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              {community?.name} ekosisteminin aktif üye tabanını <span className="text-slate-950 font-bold underline decoration-corporate-blue/30 decoration-4 underline-offset-4">kurumsal standartlarda</span> yönetin, yetki seviyelerini belirleyin ve operasyonel hiyerarşiyi kurgulayın.
            </p>
          </div>
          
          <div className="flex gap-8">
            <div className="group/stat rounded-2xl bg-white px-12 py-10 border border-slate-200 transition-all hover:-translate-y-2 text-center shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">AKTİF BİLEŞEN</p>
              <p className="text-5xl font-black text-slate-950 tracking-tighter leading-none italic">{members.length}</p>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-corporate-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-[0.03] scale-150 transform">
           <UserPlus className="h-32 w-32" />
        </div>
      </div>

      {/* Create Member Form */}
      {canManage && (
        <div className="t3-panel p-10 md:p-12 bg-slate-50/30 border-l-[16px] border-l-corporate-blue">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 relative z-10">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-corporate-blue shadow-sm">
                 <UserPlus className="h-7 w-7" />
              </div>
              <div>
                <h3 className="t3-heading text-2xl text-slate-950">Stratejik Kayıt Üssü</h3>
                <p className="t3-label">YENİ YETENEKLERİ EKOSİSTEME DAHİL EDİN</p>
              </div>
            </div>
            <div className="h-1.5 w-24 rounded-full bg-slate-200" />
          </div>

          <form action={createMemberAction as any} className="grid gap-8 md:grid-cols-6 relative z-10">
            <div className="md:col-span-3 space-y-3">
               <label className="flex items-center gap-2 t3-label ml-1">
                 <Fingerprint className="h-3.5 w-3.5 text-corporate-blue" /> AD SOYAD
               </label>
               <input name="name" placeholder="Örn: Ahmet Yılmaz" className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none shadow-sm placeholder:text-slate-300" required />
            </div>
            <div className="md:col-span-3 space-y-3">
               <label className="flex items-center gap-2 t3-label ml-1">
                 <MailCheck className="h-3.5 w-3.5 text-corporate-orange" /> KURUMSAL E-POSTA
               </label>
               <input name="email" type="email" placeholder="ahmet.yilmaz@edu.tr" className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all outline-none shadow-sm placeholder:text-slate-300" required />
            </div>
            <div className="md:col-span-2 space-y-3">
               <label className="flex items-center gap-2 t3-label ml-1">
                 <Lock className="h-3.5 w-3.5 text-corporate-blue" /> ERİŞİM ŞİFRESİ
               </label>
               <input name="password" type="password" placeholder="Min. 8 karakter" className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none shadow-sm placeholder:text-slate-300" minLength={8} required />
            </div>
            <div className="md:col-span-2 space-y-3">
               <label className="flex items-center gap-2 t3-label ml-1">
                 <Building className="h-3.5 w-3.5 text-corporate-orange" /> AKADEMİK BÖLÜM
               </label>
               <input name="department" placeholder="Bilgisayar Mühendisliği" className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all outline-none shadow-sm placeholder:text-slate-300" />
            </div>
            <div className="md:col-span-1 space-y-3">
               <label className="flex items-center gap-2 t3-label ml-1">
                 <GraduationCap className="h-3.5 w-3.5 text-corporate-blue" /> SINIF
               </label>
               <input name="grade" type="number" placeholder="2" className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all outline-none shadow-sm placeholder:text-slate-300" min={1} max={8} />
            </div>
            <div className="md:col-span-1 space-y-3">
               <label className="flex items-center gap-2 t3-label ml-1">
                 <IdCard className="h-3.5 w-3.5 text-corporate-orange" /> NO
               </label>
               <input name="studentNumber" placeholder="2024..." className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-950 focus:ring-8 focus:ring-corporate-orange/5 focus:border-corporate-orange transition-all outline-none shadow-sm placeholder:text-slate-300" />
            </div>
            <button className="md:col-span-6 h-16 rounded-2xl bg-slate-950 text-xs font-black text-white shadow-xl shadow-slate-900/10 active:scale-95 transition-all uppercase tracking-widest hover:bg-corporate-blue">SİSTEME KAYDET VE YETKİLENDİR</button>
          </form>
        </div>
      )}

      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6 px-10">
          <div>
            <h2 className="t3-heading text-3xl text-slate-950">Ekosistem Kaynakları</h2>
            <div className="flex items-center gap-3 mt-4">
               <div className="h-1.5 w-16 rounded-full bg-corporate-orange" />
               <p className="t3-label">{members.length} AKTİF BİLEŞEN LİSTELENİYOR</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <form className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-corporate-blue transition-colors" />
              <input 
                name="q"
                type="text" 
                defaultValue={search}
                placeholder="İsim veya E-posta ara..." 
                className="pl-14 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold outline-none focus:ring-8 focus:ring-corporate-blue/5 focus:border-corporate-blue transition-all w-72 shadow-sm text-slate-950" 
              />
            </form>
            {(search) && (
              <a href="/baskan/uyeler" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline px-2">
                Aramayı Temizle
              </a>
            )}
          </div>
        </div>

        <div className="t3-panel overflow-hidden bg-slate-50/30">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100/50">
                <tr>
                  <th className="px-12 py-8 text-left t3-label">KİMLİK BİLGİSİ</th>
                  <th className="px-12 py-8 text-center t3-label">HİYERARŞİ</th>
                  <th className="px-12 py-8 text-center t3-label">DURUM</th>
                  <th className="px-12 py-8 text-right t3-label">KONTROLAKSİYONU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => (
                  <React.Fragment key={member.id}>
                    <tr className="hover:bg-white transition-all group">
                      <td className="px-12 py-10">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-corporate-blue font-black text-xl border border-blue-100 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                            {member.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className="font-black text-slate-950 text-xl tracking-tight uppercase group-hover:text-corporate-blue transition-colors leading-none italic">{member.user.name}</span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{member.user.email}</span>
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
                           "inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all bg-white",
                           member.membershipType === "MANAGEMENT" 
                             ? "bg-orange-50 text-corporate-orange border-orange-100" 
                             : "bg-slate-50 text-slate-600 border-slate-200"
                         )}>
                           {member.membershipType === "MANAGEMENT" && <Star className="h-4 w-4 fill-corporate-orange" />}
                           {member.membershipType === "MANAGEMENT" ? "YÖNETİM KURULU" : "OPERASYONEL ÜYE"}
                         </span>
                      </td>
                      <td className="px-12 py-10 text-center">
                         <div className="flex justify-center">
                           <span className={cn(
                             "flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] border transition-all shadow-sm bg-white",
                             member.status === "ACTIVE" 
                               ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                               : "bg-slate-50 text-slate-400 border-slate-200"
                           )}>
                             <span className={cn("h-2 w-2 rounded-full", member.status === "ACTIVE" ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" : "bg-slate-300")} />
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
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <td colSpan={4} className="px-12 py-6">
                          <form action={updateMemberAction as any} className="flex flex-wrap items-end gap-6">
                            <input type="hidden" name="userId" value={member.userId} />
                            <div className="flex flex-col gap-2 min-w-[180px]">
                              <label className="t3-label text-slate-400">Ad Soyad</label>
                              <input name="name" defaultValue={member.user.name} className="t3-input px-5 py-3 text-[11px] bg-white" required />
                            </div>
                            <div className="flex flex-col gap-2 min-w-[160px]">
                              <label className="t3-label text-slate-400">Telefon</label>
                              <input name="phone" defaultValue={member.user.phone ?? ""} placeholder="+90..." className="t3-input px-5 py-3 text-[11px] bg-white" />
                            </div>
                            <div className="flex flex-col gap-2 min-w-[160px]">
                              <label className="t3-label text-slate-400">Bölüm</label>
                              <input name="department" defaultValue={member.user.department ?? ""} placeholder="Bilg. Müh." className="t3-input px-5 py-3 text-[11px] bg-white" />
                            </div>
                            <div className="flex flex-col gap-2 w-24">
                              <label className="t3-label text-slate-400">Sınıf</label>
                              <input name="grade" type="number" defaultValue={member.user.grade ?? ""} min={1} max={8} className="t3-input px-5 py-3 text-[11px] bg-white" />
                            </div>
                            <div className="flex flex-col gap-2 min-w-[130px]">
                              <label className="t3-label text-slate-400">Öğrenci No</label>
                              <input name="studentNumber" defaultValue={member.user.studentNumber ?? ""} placeholder="2024..." className="t3-input px-5 py-3 text-[11px] bg-white" />
                            </div>
                            <button className="t3-button t3-button-primary px-8 py-4 text-[10px] shadow-lg shadow-corporate-blue/20">
                              <UserCog className="h-4 w-4" /> GÜNCELLE
                            </button>
                          </form>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
