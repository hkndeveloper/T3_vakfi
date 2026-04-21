"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/permissions";

export async function createUniversityAction(formData: FormData) {
  try {
    const session = await requireSuperAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();

    if (!name || !city) {
      return { success: false, error: "Lütfen tüm alanları doldurun." };
    }

    const university = await prisma.university.create({
      data: {
        name,
        city,
        status: "ACTIVE",
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "university.create",
        modelType: "University",
        modelId: university.id,
      },
    });

    revalidatePath("/admin/universiteler");
    return { success: true, message: "Üniversite başarıyla eklendi." };
  } catch (error) {
    console.error("University creation error:", error);
    return { success: false, error: "İşlem sırasında bir hata oluştu." };
  }
}

export async function toggleUniversityStatusAction(id: string, currentStatus: string) {
  try {
    const session = await requireSuperAdmin();

    const newStatus = currentStatus === "ACTIVE" ? "PASSIVE" : "ACTIVE";

    await prisma.university.update({
      where: { id },
      data: { status: newStatus as any },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "university.status.toggle",
        modelType: "University",
        modelId: id,
      },
    });

    revalidatePath("/admin/universiteler");
    return { success: true, message: "Üniversite durumu güncellendi." };
  } catch (error) {
    return { success: false, error: "Durum güncellenirken bir hata oluştu." };
  }
}

export async function updateUniversityAction(id: string, formData: FormData) {
  try {
    const session = await requireSuperAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const status = String(formData.get("status") ?? "") as any;

    if (!name || !city || !status) {
      return { success: false, error: "Lütfen tüm zorunlu alanları doldurun." };
    }

    await prisma.university.update({
      where: { id },
      data: { name, city, status },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "university.update",
        modelType: "University",
        modelId: id,
      },
    });

    revalidatePath("/admin/universiteler");
    revalidatePath(`/admin/universiteler/${id}`);
    return { success: true, message: "Üniversite bilgileri güncellendi." };
  } catch (error) {
    return { success: false, error: "Güncelleme sırasında bir hata oluştu." };
  }
}
