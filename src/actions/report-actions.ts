"use server";

import { revalidatePath } from "next/cache";
import { ReportType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";

export async function createReportAction(formData: FormData) {
  try {
    const session = await requireCommunityManager();
    const communityId = session.user.communityIds[0];

    const title = String(formData.get("title") ?? "").trim();
    const reportType = String(formData.get("reportType") ?? "").trim();
    const eventIdRaw = String(formData.get("eventId") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const participantCountRaw = String(formData.get("participantCount") ?? "").trim();

    if (!title || !reportType || !summary || !content) {
      return { success: false, error: "Lütfen zorunlu alanları doldurun." };
    }

    if (eventIdRaw) {
      const linkedEvent = await prisma.event.findFirst({
        where: {
          id: eventIdRaw,
          OR: [
            { communityId },
            { scope: "GLOBAL", status: { in: ["APPROVED", "COMPLETED"] } },
          ],
        },
      });

      if (!linkedEvent) {
        return { success: false, error: "Seçilen etkinliğe bu topluluk adına rapor bağlayamazsınız." };
      }
    }

    await prisma.report.create({
      data: {
        communityId,
        eventId: eventIdRaw || null,
        title,
        reportType: reportType as ReportType,
        summary,
        content,
        participantCount: participantCountRaw ? Number(participantCountRaw) : null,
        status: "DRAFT",
        createdBy: session.user.id,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "report.create",
        modelType: "Report",
      },
    });

    revalidatePath("/baskan/raporlar");
    return { success: true, message: "Rapor taslağı başarıyla oluşturuldu." };
  } catch (error) {
    console.error("Report creation error:", error);
    return { success: false, error: "Rapor oluşturulurken bir hata oluştu." };
  }
}

export async function submitReportAction(formData: FormData) {
  try {
    const session = await requireCommunityManager();
    const communityId = session.user.communityIds[0];
    const reportId = String(formData.get("reportId") ?? "").trim();

    if (!reportId) return { success: false, error: "Rapor ID bulunamadı." };

    await prisma.report.updateMany({
      where: {
        id: reportId,
        communityId,
        createdBy: session.user.id,
      },
      data: {
        status: "SUBMITTED",
        adminNote: null,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "report.submit",
        modelType: "Report",
        modelId: reportId,
      },
    });

    revalidatePath("/baskan/raporlar");
    return { success: true, message: "Rapor onay için gönderildi." };
  } catch (error) {
    console.error("Report submission error:", error);
    return { success: false, error: "İşlem sırasında bir hata oluştu." };
  }
}

export async function addMediaAction(reportId: string, fileName: string, filePath: string, fileType: string) {
  try {
    const session = await requireCommunityManager();
    const communityId = session.user.communityIds[0];

    await prisma.mediaFile.create({
      data: {
        communityId,
        reportId,
        fileName,
        filePath,
        fileType,
        uploadedBy: session.user.id,
      },
    });

    revalidatePath("/baskan/raporlar");
    return { success: true, message: "Medya dosyası eklendi." };
  } catch (error) {
    console.error("Add media error:", error);
    return { success: false, error: "Dosya eklenirken bir hata oluştu." };
  }
}

export async function addDocumentAction(reportId: string, category: string, title: string, filePath: string, description?: string) {
  try {
    const session = await requireCommunityManager();
    const communityId = session.user.communityIds[0];

    await prisma.document.create({
      data: {
        communityId,
        reportId,
        category,
        title,
        description: description || null,
        filePath,
        uploadedBy: session.user.id,
      },
    });

    revalidatePath("/baskan/raporlar");
    return { success: true, message: "Belge başarıyla eklendi." };
  } catch (error) {
    console.error("Add document error:", error);
    return { success: false, error: "Belge eklenirken bir hata oluştu." };
  }
}
