"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin, getCurrentSession } from "@/lib/permissions";
import bcrypt from "bcryptjs";

export async function resetUserPasswordAction(userId: string) {
  try {
    await requireSuperAdmin();

    // Default password for reset (in a real app, this would send an email with a token)
    const defaultPassword = "T3_" + Math.random().toString(36).substring(7).toUpperCase();
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await prisma.activityLog.create({
      data: {
        action: "user.password.reset",
        modelType: "User",
        modelId: userId,
      },
    });

    return { 
      success: true, 
      message: `Şifre başarıyla sıfırlandı. Yeni geçici şifre: ${defaultPassword}`,
      tempPassword: defaultPassword 
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "İşlem sırasında bir hata oluştu." };
  }
}

export async function updateUserProfileAction(formData: FormData) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Oturum bulunamadı." };

    const userId = session.user.id;
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const department = String(formData.get("department") ?? "").trim();
    const grade = Number(formData.get("grade") ?? 0);

    if (!name) return { success: false, error: "Ad Soyad zorunludur." };

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone: phone || null,
        department: department || null,
        grade: grade || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "user.profile.update",
        modelType: "User",
        modelId: userId,
        userId,
      },
    });

    revalidatePath("/profilim");
    return { success: true, message: "Profil başarıyla güncellendi." };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Güncelleme hatası oluştu." };
  }
}

export async function downloadUserAccessLogsAction(userId: string) {
  try {
    await requireSuperAdmin();

    const logs = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return { success: true, data: logs };
  } catch (error) {
    return { success: false, error: "Loglar alınırken hata oluştu." };
  }
}

export async function toggleUserStatusAction(userId: string) {
  try {
    await requireSuperAdmin();

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { isActive: true } });
    if (!user) return { success: false, error: "Kullanıcı bulunamadı." };

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    await prisma.activityLog.create({
      data: {
        action: updated.isActive ? "user.activate" : "user.deactivate",
        modelType: "User",
        modelId: userId,
      },
    });

    revalidatePath("/admin/kullanicilar");
    revalidatePath(`/admin/kullanicilar/${userId}`);
    return { success: true, isActive: updated.isActive };
  } catch (error) {
    console.error("Toggle user status error:", error);
    return { success: false, error: "İşlem sırasında hata oluştu." };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    await requireSuperAdmin();

    // Delete related records first to avoid FK constraint issues
    await prisma.userRole.deleteMany({ where: { userId } });
    await prisma.activityLog.deleteMany({ where: { userId } });
    await prisma.eventParticipant.deleteMany({ where: { userId } });
    await prisma.communityMember.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    revalidatePath("/admin/kullanicilar");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "Kullanıcı silinirken hata oluştu." };
  }
}
