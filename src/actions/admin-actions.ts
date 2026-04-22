"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission, requireSuperAdmin } from "@/lib/permissions";
import { createNotification } from "@/lib/notifications";
import bcrypt from "bcryptjs";

export async function reviewEventAction(formData: FormData) {
  const session = await requirePermission("event.approve");

  const eventId = String(formData.get("eventId") ?? "").trim();
  const decision = String(formData.get("decision") ?? "").trim();
  const reviewNote = String(formData.get("reviewNote") ?? "").trim();

  if (!eventId || !["APPROVED", "REJECTED", "DRAFT"].includes(decision)) {
    return { success: false, error: "Geçersiz işlem." };
  }

  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      status: decision as any,
      approvedBy: decision === "APPROVED" ? session.user.id : null,
      approvedAt: decision === "APPROVED" ? new Date() : null,
      reviewNote: reviewNote || null,
    },
  });

  // Create notification for the creator
  await createNotification({
    userId: event.createdBy,
    title: decision === "APPROVED" ? "Etkinlik Onaylandı" : "Etkinlik Revizyon/Red",
    content: `${event.title} isimli etkinliğiniz ${decision === "APPROVED" ? "onaylandı" : "için geri bildirim verildi"}.`,
    type: "EVENT",
  });

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: `event.review.${decision.toLowerCase()}`,
      modelType: "Event",
      modelId: eventId,
    },
  });

  revalidatePath("/admin/etkinlik-onaylari");
  revalidatePath("/baskan/etkinlikler");
  return { success: true };
}

export async function reviewReportAction(formData: FormData) {
  const session = await requirePermission("report.approve");

  const reportId = String(formData.get("reportId") ?? "").trim();
  const decision = String(formData.get("decision") ?? "").trim();
  const adminNote = String(formData.get("adminNote") ?? "").trim();

  if (!reportId || !["APPROVED", "REJECTED", "REVISION_REQUESTED"].includes(decision)) {
    return { success: false, error: "Geçersiz işlem." };
  }

  const report = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: decision as any,
      approvedBy: decision === "APPROVED" ? session.user.id : null,
      approvedAt: decision === "APPROVED" ? new Date() : null,
      adminNote: adminNote || null,
    },
  });

  // Create notification for the creator
  await createNotification({
    userId: report.createdBy,
    title: decision === "APPROVED" ? "Rapor Onaylandı" : "Rapor Revizyon/Red",
    content: `${report.title} isimli raporunuz ${decision === "APPROVED" ? "onaylandı" : "için geri bildirim verildi"}.`,
    type: "REPORT",
  });

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: `report.review.${decision.toLowerCase()}`,
      modelType: "Report",
      modelId: reportId,
    },
  });

  revalidatePath("/admin/rapor-onaylari");
  revalidatePath("/baskan/raporlar");
  return { success: true };
}

export async function adminCreateUserAction(formData: FormData) {
  try {
    await requirePermission("user.create");

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!name || !email || password.length < 8) {
      return { success: false, error: "Tüm alanları doğru doldurun. Şifre en az 8 karakter olmalıdır." };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "Bu e-posta adresi zaten kullanımda." };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        isActive: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "user.create",
        modelType: "User",
        modelId: user.id
      },
    });

    revalidatePath("/admin/kullanicilar");
    return { success: true, message: "Kullanıcı başarıyla oluşturuldu." };
  } catch (error) {
    console.error("User creation error:", error);
    return { success: false, error: "Kullanıcı oluşturulurken bir hata oluştu." };
  }
}

export async function adminAssignRoleAction(formData: FormData) {
  try {
    await requirePermission("role.assign");

    const userId = String(formData.get("userId") ?? "").trim();
    const roleId = String(formData.get("roleId") ?? "").trim();
    const communityIdValue = String(formData.get("communityId") ?? "").trim();
    const communityId = communityIdValue || null;

    if (!userId || !roleId) {
      return { success: false, error: "Kullanıcı ve rol seçimi zorunludur." };
    }

    const existing = await prisma.userRole.findFirst({
      where: {
        userId,
        roleId,
        communityId,
      },
    });

    if (existing) {
      return { success: false, error: "Bu kullanıcı zaten bu yetkiye sahip." };
    }

    await prisma.userRole.create({
      data: {
        userId,
        roleId,
        communityId,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: "role.assign",
        modelType: "UserRole",
        modelId: `${userId}:${roleId}`,
      },
    });

    revalidatePath("/admin/kullanicilar");
    return { success: true, message: "Yetki başarıyla atandı." };
  } catch (error) {
    console.error("Role assignment error:", error);
    return { success: false, error: "Yetki atanırken bir hata oluştu." };
  }
}
