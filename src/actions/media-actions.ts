"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentSession, hasPermission } from "@/lib/permissions";

export async function uploadMediaAction(params: {
  communityId: string;
  reportId?: string;
  eventId?: string;
  fileName: string;
  filePath: string;
  fileType: string;
}) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Yetkisiz işlem." };

    const { communityId, reportId, eventId, fileName, filePath, fileType } = params;

    // Permission check: Either super_admin or a manager of this community
    const isSuperAdmin = session.user.roles.includes("super_admin");
    const isManagerOfCommunity = session.user.communityIds?.includes(communityId);

    if (!isSuperAdmin && !isManagerOfCommunity) {
      return { success: false, error: "Bu topluluk için dosya yükleme yetkiniz yok." };
    }

    const media = await prisma.mediaFile.create({
      data: {
        communityId,
        reportId: reportId || null,
        eventId: eventId || null,
        fileName,
        filePath,
        fileType,
        uploadedBy: session.user.id,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "media.upload",
        modelType: "MediaFile",
        modelId: media.id,
      },
    });

    revalidatePath("/admin/medya-belgeler");
    revalidatePath("/baskan/gorseller-belgeler");
    return { success: true, message: "Medya dosyası başarıyla yüklendi." };
  } catch (error) {
    console.error("Upload media action error:", error);
    return { success: false, error: "İşlem sırasında bir hata oluştu." };
  }
}

export async function uploadDocumentAction(params: {
  communityId: string;
  reportId?: string;
  eventId?: string;
  category: string;
  title: string;
  filePath: string;
  description?: string;
}) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Yetkisiz işlem." };

    const { communityId, reportId, eventId, category, title, filePath, description } = params;

    const isSuperAdmin = session.user.roles.includes("super_admin");
    const isManagerOfCommunity = session.user.communityIds?.includes(communityId);

    if (!isSuperAdmin && !isManagerOfCommunity) {
      return { success: false, error: "Bu topluluk için belge yükleme yetkiniz yok." };
    }

    const doc = await prisma.document.create({
      data: {
        communityId,
        reportId: reportId || null,
        eventId: eventId || null,
        category,
        title,
        filePath,
        description: description || null,
        uploadedBy: session.user.id,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "document.upload",
        modelType: "Document",
        modelId: doc.id,
      },
    });

    revalidatePath("/admin/medya-belgeler");
    revalidatePath("/baskan/gorseller-belgeler");
    return { success: true, message: "Belge başarıyla yüklendi." };
  } catch (error) {
    console.error("Upload document action error:", error);
    return { success: false, error: "İşlem sırasında bir hata oluştu." };
  }
}

export async function deleteMediaAction(id: string) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Yetkisiz işlem." };

    const media = await prisma.mediaFile.findUnique({ where: { id } });
    if (!media) return { success: false, error: "Dosya bulunamadı." };

    const isSuperAdmin = session.user.roles.includes("super_admin");
    const isManagerOfCommunity = session.user.communityIds?.includes(media.communityId);

    if (!isSuperAdmin && !isManagerOfCommunity) {
      return { success: false, error: "Bu dosyayı silme yetkiniz yok." };
    }

    await prisma.mediaFile.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "media.delete",
        modelType: "MediaFile",
        modelId: id,
      },
    });

    revalidatePath("/admin/medya-belgeler");
    revalidatePath("/baskan/gorseller-belgeler");
    return { success: true, message: "Dosya silindi." };
  } catch (error) {
    return { success: false, error: "Silme işlemi başarısız oldu." };
  }
}

export async function deleteDocumentAction(id: string) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Yetkisiz işlem." };

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) return { success: false, error: "Belge bulunamadı." };

    const isSuperAdmin = session.user.roles.includes("super_admin");
    const isManagerOfCommunity = session.user.communityIds?.includes(doc.communityId);

    if (!isSuperAdmin && !isManagerOfCommunity) {
      return { success: false, error: "Bu belgeyi silme yetkiniz yok." };
    }

    await prisma.document.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "document.delete",
        modelType: "Document",
        modelId: id,
      },
    });

    revalidatePath("/admin/medya-belgeler");
    revalidatePath("/baskan/gorseller-belgeler");
    return { success: true, message: "Belge silindi." };
  } catch (error) {
    return { success: false, error: "Silme işlemi başarısız oldu." };
  }
}
