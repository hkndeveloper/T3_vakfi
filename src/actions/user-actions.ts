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

    // In a real server action, we might return a JSON or a structured object 
    // that the frontend converts to CSV. 
    return { success: true, data: logs };
  } catch (error) {
    return { success: false, error: "Loglar alınırken hata oluştu." };
  }
}
